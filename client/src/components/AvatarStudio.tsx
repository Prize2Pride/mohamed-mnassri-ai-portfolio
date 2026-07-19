import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { BriefcaseBusiness, GraduationCap, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Locale = "de" | "en" | "ar";
type AvatarStyle = "healthcare" | "formal" | "casual";

const labels: Record<Locale, {
  eyebrow: string;
  title: string;
  body: string;
  generate: string;
  created: string;
  generating: string;
  empty: string;
  failed: string;
  styles: Record<AvatarStyle, { title: string; detail: string }>;
}> = {
  en: {
    eyebrow: "Portrait studio",
    title: "Create a fresh professional variation",
    body: "Choose a setting, then create an identity-consistent portfolio portrait.",
    generate: "Create portrait",
    created: "A new portrait variation is ready.",
    generating: "Creating your portrait variation…",
    empty: "Choose a setting to add a new portrait to this session.",
    failed: "The portrait could not be created. Please try again.",
    styles: {
      healthcare: { title: "Healthcare", detail: "Care-focused clinical setting" },
      formal: { title: "Formal", detail: "Refined applicant portrait" },
      casual: { title: "Casual", detail: "Study and language-learning mood" },
    },
  },
  de: {
    eyebrow: "Porträtstudio",
    title: "Eine neue professionelle Variante erstellen",
    body: "Wähle ein Umfeld und erstelle ein identitätsnahes Portfolio-Porträt.",
    generate: "Porträt erstellen",
    created: "Eine neue Porträtvariante ist bereit.",
    generating: "Porträtvariante wird erstellt…",
    empty: "Wähle ein Umfeld, um dieser Sitzung ein neues Porträt hinzuzufügen.",
    failed: "Das Porträt konnte nicht erstellt werden. Bitte erneut versuchen.",
    styles: {
      healthcare: { title: "Gesundheit", detail: "Pflegeorientiertes Umfeld" },
      formal: { title: "Formal", detail: "Souveränes Bewerbungsbild" },
      casual: { title: "Alltag", detail: "Lern- und Sprachumfeld" },
    },
  },
  ar: {
    eyebrow: "استوديو الصور",
    title: "أنشئ نسخة مهنية جديدة",
    body: "اختر بيئة ثم أنشئ صورة متسقة للملف الشخصي.",
    generate: "إنشاء صورة",
    created: "أصبحت نسخة جديدة من الصورة جاهزة.",
    generating: "يتم إنشاء نسخة الصورة…",
    empty: "اختر بيئة لإضافة صورة جديدة إلى هذه الجلسة.",
    failed: "تعذر إنشاء الصورة. يرجى المحاولة مرة أخرى.",
    styles: {
      healthcare: { title: "الرعاية الصحية", detail: "بيئة مهنية تركز على الرعاية" },
      formal: { title: "رسمي", detail: "صورة طلب أنيقة" },
      casual: { title: "عملي", detail: "أجواء تعلّم اللغة" },
    },
  },
};

const styleIcons = {
  healthcare: GraduationCap,
  formal: BriefcaseBusiness,
  casual: Sparkles,
};

export function AvatarStudio({ locale }: { locale: Locale }) {
  const text = labels[locale];
  const [style, setStyle] = useState<AvatarStyle>("healthcare");
  const [generated, setGenerated] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const portraitMutation = trpc.avatar.generate.useMutation({
    onMutate: () => setStatus(text.generating),
    onSuccess: ({ url }) => {
      if (!url) {
        setStatus(text.failed);
        toast.error(text.failed);
        return;
      }
      setGenerated(current => [url, ...current]);
      setStatus(text.created);
      toast.success(text.created);
    },
    onError: error => {
      setStatus(text.failed);
      toast.error(error.message);
    },
  });

  return (
    <div className="rounded-[1.9rem] border border-[#d8bb72]/25 bg-[#101b1b] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.24)] sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="section-eyebrow">{text.eyebrow}</p>
          <h3 className="mt-3 font-display text-2xl text-[#f6f0df]">{text.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#bfc8bf]">{text.body}</p>
        </div>
        <div className="hidden size-12 shrink-0 place-items-center rounded-2xl border border-[#d8bb72]/30 bg-[#d8bb72]/10 text-[#f1cf7d] sm:grid">
          <Sparkles className="size-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {(Object.keys(text.styles) as AvatarStyle[]).map(option => {
          const Icon = styleIcons[option];
          const selected = option === style;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setStyle(option)}
              className={cn(
                "rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1cf7d]",
                selected
                  ? "border-[#d8bb72] bg-[#d8bb72]/10 text-[#f8f2df]"
                  : "border-white/10 bg-white/[0.025] text-[#c7d0c8] hover:border-[#d8bb72]/45 hover:bg-white/[0.05]",
              )}
              aria-pressed={selected}
            >
              <Icon className="size-4 text-[#f1cf7d]" />
              <span className="mt-4 block text-sm font-semibold">{text.styles[option].title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#9aa79e]">{text.styles[option].detail}</span>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={() => portraitMutation.mutate({ style })}
        disabled={portraitMutation.isPending}
        aria-busy={portraitMutation.isPending}
        className="mt-6 h-11 rounded-full bg-[#d8bb72] px-5 text-[#17201d] hover:bg-[#edd28f]"
      >
        {portraitMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {text.generate}
      </Button>
      <p className="mt-3 min-h-5 text-xs text-[#aebbb0]" role="status" aria-live="polite">
        {portraitMutation.isPending ? text.generating : status || (generated.length === 0 ? text.empty : "")}
      </p>

      {generated.length > 0 && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {generated.map((url, index) => (
            <img
              key={`${url}-${index}`}
              src={url}
              alt="Generated professional portrait variation of Mohamed Mnassri"
              className="aspect-[3/4] w-full rounded-2xl object-cover ring-1 ring-white/10"
            />
          ))}
        </div>
      )}
    </div>
  );
}
