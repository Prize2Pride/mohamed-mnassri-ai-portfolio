import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Eraser, MessageCircleHeart, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Locale = "de" | "en" | "ar";

const STORAGE_KEY = "mohamed-mnassri-portfolio-chat-v1";
const LOCAL_HISTORY_CAPACITY = 600;

const labels: Record<Locale, {
  eyebrow: string;
  title: string;
  body: string;
  capacity: string;
  privacy: string;
  clear: string;
  placeholder: string;
  empty: string;
  prompts: string[];
  greeting: string;
}> = {
  en: {
    eyebrow: "Meet the portfolio guide",
    title: "Ask Mohamed’s AI anything about his path",
    body: "Explore his motivation, practical exposure, language learning, and goals for Pflegefachmann training.",
    capacity: "This device can retain up to 600 conversation messages.",
    privacy: "Only the latest context is used to compose a response.",
    clear: "Clear chat",
    placeholder: "Ask about Mohamed’s background…",
    empty: "Begin a conversation with Mohamed’s portfolio guide",
    prompts: ["What motivated Mohamed to pursue nursing?", "Tell me about his German B2 progress.", "What did he learn through physiotherapy practice?"],
    greeting: "Hello — I’m Mohamed’s portfolio guide. Ask me about his motivation for Pflegefachmann training, his practical experiences, or his language progress.",
  },
  de: {
    eyebrow: "Portfolio-Guide kennenlernen",
    title: "Frage Mohameds KI nach seinem Weg",
    body: "Erfahre mehr über seine Motivation, praktische Einblicke, Sprachlernen und Ziele für die Pflegefachmann-Ausbildung.",
    capacity: "Dieses Gerät kann bis zu 600 Gesprächsnachrichten speichern.",
    privacy: "Für eine Antwort wird nur der aktuelle Gesprächskontext verwendet.",
    clear: "Chat leeren",
    placeholder: "Frage nach Mohameds Hintergrund…",
    empty: "Starte ein Gespräch mit Mohameds Portfolio-Guide",
    prompts: ["Warum möchte Mohamed in die Pflege?", "Wie hat er Deutsch auf B2 gelernt?", "Was hat er in der Physiotherapie-Praxis gelernt?"],
    greeting: "Hallo — ich bin Mohameds Portfolio-Guide. Frage mich nach seiner Motivation für die Pflegefachmann-Ausbildung, seinen praktischen Erfahrungen oder seinem Sprachweg.",
  },
  ar: {
    eyebrow: "تعرّف إلى دليل الملف الشخصي",
    title: "اسأل مساعد محمد الذكي عن مسيرته",
    body: "اكتشف دوافعه وخبراته العملية وتعلّم اللغة وأهدافه في تدريب Pflegefachmann.",
    capacity: "يمكن لهذا الجهاز الاحتفاظ بما يصل إلى 600 رسالة في المحادثة.",
    privacy: "يُستخدم سياق المحادثة الأحدث فقط لتكوين الإجابة.",
    clear: "مسح المحادثة",
    placeholder: "اسأل عن خلفية محمد…",
    empty: "ابدأ محادثة مع دليل ملف محمد الشخصي",
    prompts: ["ما الذي حفّز محمد على اختيار التمريض؟", "أخبرني عن تقدمه في الألمانية B2.", "ماذا تعلّم من تجربة العلاج الطبيعي؟"],
    greeting: "مرحباً — أنا دليل ملف محمد الشخصي. يمكنك أن تسألني عن دافعه لتدريب Pflegefachmann أو خبراته العملية أو تقدمه اللغوي.",
  },
};

function initialMessages(locale: Locale): Message[] {
  return [{ role: "assistant", content: labels[locale].greeting }];
}

function readSavedMessages(locale: Locale): Message[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialMessages(locale);
    const parsed = JSON.parse(saved) as Message[];
    const usable = parsed
      .filter(message => (message.role === "user" || message.role === "assistant") && Boolean(message.content?.trim()))
      .slice(-LOCAL_HISTORY_CAPACITY);
    return usable.length > 0 ? usable : initialMessages(locale);
  } catch {
    return initialMessages(locale);
  }
}

export function LongformChat({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const [messages, setMessages] = useState<Message[]>(() =>
    typeof window === "undefined" ? initialMessages(locale) : readSavedMessages(locale),
  );
  const chatMutation = trpc.chat.ask.useMutation();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-LOCAL_HISTORY_CAPACITY)));
  }, [messages]);

  const sendMessage = (content: string) => {
    const nextMessages = [...messages, { role: "user" as const, content }].slice(-LOCAL_HISTORY_CAPACITY);
    setMessages(nextMessages);

    chatMutation.mutate(
      {
        messages: nextMessages.map(message => ({
          role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: message.content,
        })),
      },
      {
        onSuccess: response => {
          const assistantMessage: Message = {
            role: "assistant",
            content: response.message,
          };
          setMessages(current => [
            ...current,
            assistantMessage,
          ].slice(-LOCAL_HISTORY_CAPACITY));
        },
        onError: error => toast.error(error.message),
      },
    );
  };

  const clearChat = () => {
    const reset = initialMessages(locale);
    setMessages(reset);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
  };

  return (
    <div className="chat-shell overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1918] shadow-[0_28px_80px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div className="max-w-2xl">
          <p className="section-eyebrow">{text.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-[#f6f0df] sm:text-4xl">{text.title}</h2>
          <p className="mt-3 text-sm leading-6 text-[#bfc8bf]">{text.body}</p>
        </div>
        <Button
          type="button"
          onClick={clearChat}
          variant="outline"
          className="h-10 shrink-0 rounded-full border-white/15 bg-white/[0.02] text-[#d9e0d8] hover:bg-white/[0.08] hover:text-white"
        >
          <Eraser className="size-4" />
          {text.clear}
        </Button>
      </div>

      <div className="grid gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4 text-xs text-[#aab6ad] sm:grid-cols-2 sm:px-8">
        <p className="flex items-center gap-2"><MessageCircleHeart className="size-4 text-[#72d5c8]" />{text.capacity}</p>
        <p className="flex items-center gap-2"><ShieldCheck className="size-4 text-[#d8bb72]" />{text.privacy}</p>
      </div>

      <AIChatBox
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={chatMutation.isPending}
        placeholder={text.placeholder}
        emptyStateMessage={text.empty}
        suggestedPrompts={text.prompts}
        height="660px"
        className="rounded-none border-0 bg-transparent shadow-none"
      />
    </div>
  );
}
