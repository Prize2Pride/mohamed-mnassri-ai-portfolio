import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  ChevronRight,
  HeartHandshake,
  Languages,
  Menu,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";

const AvatarStudio = lazy(() => import("@/components/AvatarStudio").then(module => ({ default: module.AvatarStudio })));
const LongformChat = lazy(() => import("@/components/LongformChat").then(module => ({ default: module.LongformChat })));

type Locale = "de" | "en" | "ar";

const localeLabels: Record<Locale, string> = { de: "DE", en: "EN", ar: "AR" };

const gallery = [
  {
    src: "/manus-storage/avatar-healthcare_8da5b00e.jpg",
    alt: "Mohamed Mnassri in a healthcare training portrait",
    tag: "Healthcare",
  },
  {
    src: "/manus-storage/avatar-language-learner-v2_56109ed3.jpg",
    alt: "Mohamed Mnassri in a language-learning portrait",
    tag: "Language learner",
  },
  {
    src: "/manus-storage/avatar-formal-applicant-v2_e40161a2.jpg",
    alt: "Mohamed Mnassri in a formal professional applicant portrait",
    tag: "Applicant",
  },
];

const content: Record<Locale, {
  nav: { story: string; timeline: string; portraits: string; chat: string; contact: string };
  hero: { eyebrow: string; title: string; description: string; primary: string; secondary: string; capsule: string; statement: string };
  signal: Array<{ value: string; label: string }>;
  story: { eyebrow: string; title: string; lead: string; cards: Array<{ title: string; text: string }> };
  timeline: { eyebrow: string; title: string; entries: Array<{ year: string; title: string; text: string }> };
  profile: { eyebrow: string; title: string; text: string; skills: string[]; languages: Array<{ language: string; level: string; width: string }> };
  portraits: { eyebrow: string; title: string; text: string; labels: string[] };
  contact: { eyebrow: string; title: string; text: string; action: string; note: string };
  footer: string;
}> = {
  en: {
    nav: { story: "Story", timeline: "Timeline", portraits: "Portraits", chat: "AI guide", contact: "Connect" },
    hero: {
      eyebrow: "Nursing trainee candidate · Multilingual professional",
      title: "Care begins with listening.",
      description: "Mohamed Mnassri is building a path toward Pflegefachmann training through empathy, reliable preparation, and a deep respect for every patient’s progress.",
      primary: "Talk with the AI guide",
      secondary: "Explore his story",
      capsule: "German B2 · Arabic native",
      statement: "A future in patient-centred care, shaped by practical insight and human connection.",
    },
    signal: [
      { value: "2013–2019", label: "Practical healthcare exposure" },
      { value: "B2", label: "German language level" },
      { value: "Pflegefachmann", label: "Training aspiration" },
    ],
    story: {
      eyebrow: "The motivation",
      title: "A direction confirmed in real places, with real people.",
      lead: "Mohamed’s interest in healthcare did not begin as an abstract idea. It grew through observing the everyday trust, structure, movement, and attention that help patients move forward.",
      cards: [
        { title: "Medical practice", text: "Patient contact, practice organisation, and observed examinations made the human dimension of healthcare tangible." },
        { title: "Physiotherapy practice", text: "Small improvements after injury, operations, and illness revealed how essential mobility, encouragement, and careful support can be." },
        { title: "A clear next step", text: "Those experiences crystallised a goal: prepare diligently for Pflegefachmann training and contribute with responsibility and respect." },
      ],
    },
    timeline: {
      eyebrow: "Career narrative",
      title: "A deliberate journey toward Pflegefachmann training.",
      entries: [
        { year: "2013–2019", title: "Medical & physiotherapy internships", text: "First-hand exposure to patient interactions, practice organisation, ECG observation, movement, rehabilitation, and attentive care." },
        { year: "Language path", title: "German at B2", text: "Intensive German learning built a strong basis for communication, professional development, and long-term integration in Germany." },
        { year: "Now", title: "Preparing for Pflegefachmann", text: "Motivated to learn the profession that brings together medical understanding, responsibility, and human closeness." },
      ],
    },
    profile: {
      eyebrow: "Skills & language",
      title: "Quiet confidence, built for people-facing work.",
      text: "Mohamed approaches his next professional chapter with a considered mix of care, curiosity, and follow-through.",
      skills: ["Empathy", "Patient care", "Reliability", "Adaptability", "Respectful communication", "Motivation"],
      languages: [
        { language: "German", level: "B2", width: "76%" },
        { language: "Arabic", level: "Native", width: "100%" },
        { language: "English", level: "Conversational", width: "58%" },
      ],
    },
    portraits: { eyebrow: "Portrait collection", title: "One identity. Several professional contexts.", text: "A visual study of the roles and environments that inform Mohamed’s next chapter.", labels: ["Healthcare", "Language learner", "Professional applicant"] },
    contact: { eyebrow: "Begin a conversation", title: "Interested in Mohamed’s potential for your training environment?", text: "Use the AI guide to explore his motivation, practical exposure, language progress, and commitment to patient-centred care.", action: "Start with the AI guide", note: "Mohamed Mnassri · Candidate for Pflegefachmann training" },
    footer: "A focused personal portfolio for Mohamed Mnassri.",
  },
  de: {
    nav: { story: "Motivation", timeline: "Werdegang", portraits: "Porträts", chat: "KI-Guide", contact: "Kontakt" },
    hero: {
      eyebrow: "Bewerber für die Pflegeausbildung · Mehrsprachig",
      title: "Pflege beginnt mit Zuhören.",
      description: "Mohamed Mnassri bereitet sich mit Empathie, Verlässlichkeit und großem Respekt für den Fortschritt jedes Menschen auf die Ausbildung zum Pflegefachmann vor.",
      primary: "Mit dem KI-Guide sprechen",
      secondary: "Seine Geschichte entdecken",
      capsule: "Deutsch B2 · Arabisch Muttersprache",
      statement: "Eine Zukunft in patientenzentrierter Pflege, geprägt durch praktische Einblicke und menschliche Nähe.",
    },
    signal: [
      { value: "2013–2019", label: "Praktische Einblicke im Gesundheitswesen" },
      { value: "B2", label: "Deutschkenntnisse" },
      { value: "Pflegefachmann", label: "Ausbildungsziel" },
    ],
    story: {
      eyebrow: "Die Motivation",
      title: "Ein Weg, der sich in echten Begegnungen bestätigt hat.",
      lead: "Mohameds Interesse am Gesundheitswesen begann nicht als abstrakte Idee. Es wuchs durch Einblicke in Vertrauen, Struktur, Bewegung und Aufmerksamkeit, die Patienten unterstützen.",
      cards: [
        { title: "Arztpraxis", text: "Patientenkontakt, Praxisorganisation und beobachtete Untersuchungen machten die menschliche Seite der Medizin greifbar." },
        { title: "Physiotherapiepraxis", text: "Kleine Fortschritte nach Verletzungen, Operationen und Krankheiten zeigten, wie wichtig Mobilität, Ermutigung und gute Betreuung sind." },
        { title: "Ein klares Ziel", text: "Diese Erfahrungen führten zu einem entschlossenen nächsten Schritt: die Ausbildung zum Pflegefachmann verantwortungsvoll vorzubereiten." },
      ],
    },
    timeline: {
      eyebrow: "Berufliche Erzählung",
      title: "Ein bewusster Weg zur Ausbildung zum Pflegefachmann.",
      entries: [
        { year: "2013–2019", title: "Praktika in Arztpraxis & Physiotherapie", text: "Einblicke in Patientengespräche, Praxisorganisation, EKG-Beobachtung, Mobilisation, Rehabilitation und aufmerksame Betreuung." },
        { year: "Sprachweg", title: "Deutsch auf B2", text: "Intensives Deutschlernen schuf eine solide Grundlage für Kommunikation, berufliche Entwicklung und langfristige Integration in Deutschland." },
        { year: "Heute", title: "Vorbereitung auf Pflegefachmann", text: "Motiviert, einen Beruf zu erlernen, der medizinisches Verständnis, Verantwortung und menschliche Nähe verbindet." },
      ],
    },
    profile: {
      eyebrow: "Stärken & Sprache",
      title: "Ruhige Sicherheit für Arbeit mit Menschen.",
      text: "Mohamed gestaltet seinen nächsten beruflichen Schritt mit Fürsorge, Lernbereitschaft und Verbindlichkeit.",
      skills: ["Empathie", "Patientenbetreuung", "Zuverlässigkeit", "Anpassungsfähigkeit", "Respektvolle Kommunikation", "Motivation"],
      languages: [
        { language: "Deutsch", level: "B2", width: "76%" },
        { language: "Arabisch", level: "Muttersprache", width: "100%" },
        { language: "Englisch", level: "Konversation", width: "58%" },
      ],
    },
    portraits: { eyebrow: "Porträtkollektion", title: "Eine Identität. Mehrere berufliche Kontexte.", text: "Eine visuelle Studie der Rollen und Umfelder, die Mohameds nächsten Schritt prägen.", labels: ["Gesundheit", "Sprachenlernen", "Bewerber"] },
    contact: { eyebrow: "Gespräch beginnen", title: "Interessiert an Mohameds Potenzial für Ihre Ausbildungseinrichtung?", text: "Nutze den KI-Guide, um seine Motivation, praktischen Einblicke, Sprachentwicklung und seinen Einsatz für patientenzentrierte Pflege kennenzulernen.", action: "Mit dem KI-Guide beginnen", note: "Mohamed Mnassri · Bewerber für die Ausbildung zum Pflegefachmann" },
    footer: "Ein fokussiertes persönliches Portfolio für Mohamed Mnassri.",
  },
  ar: {
    nav: { story: "القصة", timeline: "المسار", portraits: "الصور", chat: "الدليل الذكي", contact: "تواصل" },
    hero: {
      eyebrow: "مرشح لتدريب التمريض · محترف متعدد اللغات",
      title: "تبدأ الرعاية بالإصغاء.",
      description: "يبني Mohamed Mnassri طريقه نحو تدريب Pflegefachmann من خلال التعاطف والاستعداد الموثوق والاحترام العميق لتقدم كل مريض.",
      primary: "تحدث مع الدليل الذكي",
      secondary: "اكتشف قصته",
      capsule: "الألمانية B2 · العربية لغة أم",
      statement: "مستقبل في رعاية تركز على المريض، تصنعه الخبرة العملية والتواصل الإنساني.",
    },
    signal: [
      { value: "2013–2019", label: "خبرة عملية في مجال الرعاية" },
      { value: "B2", label: "مستوى اللغة الألمانية" },
      { value: "Pflegefachmann", label: "طموح التدريب" },
    ],
    story: {
      eyebrow: "الدافع",
      title: "اتجاه تأكد في أماكن حقيقية ومع أشخاص حقيقيين.",
      lead: "لم يبدأ اهتمام محمد بالرعاية الصحية كفكرة مجردة، بل نما من خلال ملاحظة الثقة والتنظيم والحركة والاهتمام التي تساعد المرضى على التقدم.",
      cards: [
        { title: "عيادة طبية", text: "جعل التواصل مع المرضى وتنظيم العيادة ومشاهدة الفحوصات البعد الإنساني للرعاية الصحية ملموساً." },
        { title: "ممارسة العلاج الطبيعي", text: "أظهرت التحسينات الصغيرة بعد الإصابات والعمليات والأمراض مدى أهمية الحركة والتشجيع والدعم الجيد." },
        { title: "خطوة تالية واضحة", text: "بلورت تلك التجارب هدفاً واضحاً: الاستعداد الجاد لتدريب Pflegefachmann والمساهمة بمسؤولية واحترام." },
      ],
    },
    timeline: {
      eyebrow: "السرد المهني",
      title: "رحلة مقصودة نحو تدريب Pflegefachmann.",
      entries: [
        { year: "2013–2019", title: "تدريب طبي وعلاج طبيعي", text: "تعرّض مباشر لتواصل المرضى وتنظيم العيادة ومراقبة ECG والحركة والتأهيل والرعاية اليقظة." },
        { year: "مسار اللغة", title: "الألمانية في مستوى B2", text: "بنى تعلّم الألمانية المكثف أساساً قوياً للتواصل والتطور المهني والاندماج طويل الأمد في ألمانيا." },
        { year: "الآن", title: "الاستعداد لـ Pflegefachmann", text: "متحمس لتعلم مهنة تجمع بين الفهم الطبي والمسؤولية والقرب الإنساني." },
      ],
    },
    profile: {
      eyebrow: "المهارات واللغة",
      title: "ثقة هادئة للعمل مع الناس.",
      text: "يتعامل محمد مع فصله المهني القادم بمزيج مدروس من الرعاية والفضول والالتزام.",
      skills: ["التعاطف", "رعاية المرضى", "الموثوقية", "القدرة على التكيف", "تواصل محترم", "الدافعية"],
      languages: [
        { language: "الألمانية", level: "B2", width: "76%" },
        { language: "العربية", level: "لغة أم", width: "100%" },
        { language: "الإنجليزية", level: "محادثة", width: "58%" },
      ],
    },
    portraits: { eyebrow: "مجموعة الصور", title: "هوية واحدة. سياقات مهنية متعددة.", text: "دراسة بصرية للأدوار والبيئات التي تشكل فصل محمد القادم.", labels: ["الرعاية الصحية", "متعلم لغة", "متقدم مهني"] },
    contact: { eyebrow: "ابدأ محادثة", title: "هل يهمك إمكانات محمد في بيئة التدريب لديك؟", text: "استخدم الدليل الذكي لاستكشاف دافعه وخبراته العملية وتقدم اللغة والتزامه برعاية تركز على المريض.", action: "ابدأ مع الدليل الذكي", note: "Mohamed Mnassri · مرشح لتدريب Pflegefachmann" },
    footer: "ملف شخصي مركز لـ Mohamed Mnassri.",
  },
};

function scrollToId(id: string, shouldReduceMotion: boolean) {
  document.getElementById(id)?.scrollIntoView({
    behavior: shouldReduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const copy = content[locale];
  const isArabic = locale === "ar";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [isArabic, locale]);

  const jump = (id: string) => {
    setMenuOpen(false);
    scrollToId(id, Boolean(shouldReduceMotion));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#071211] text-[#f6f0df]" dir={isArabic ? "rtl" : "ltr"}>
      <div className="pointer-events-none fixed inset-0 luxury-grid opacity-35" aria-hidden="true" />
      <div className="pointer-events-none fixed -left-40 top-0 size-[34rem] rounded-full bg-[#0d6c62]/20 blur-[130px]" aria-hidden="true" />
      <div className="pointer-events-none fixed -right-40 top-40 size-[33rem] rounded-full bg-[#b99347]/15 blur-[140px]" aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#071211]/78 backdrop-blur-xl">
        <div className="container flex h-[4.6rem] items-center justify-between gap-3">
          <button type="button" className="group flex items-center gap-3 text-left" onClick={() => jump("top")}>
            <span className="grid size-9 place-items-center rounded-full border border-[#d8bb72]/45 bg-[#d8bb72]/10 font-display text-lg text-[#f1cf7d]">M</span>
            <span className="hidden text-sm font-semibold tracking-[0.13em] text-[#e8ede7] sm:block">MOHAMED MNASSRI</span>
          </button>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {([
              ["story", copy.nav.story],
              ["timeline", copy.nav.timeline],
              ["portraits", copy.nav.portraits],
              ["chat", copy.nav.chat],
              ["contact", copy.nav.contact],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" onClick={() => jump(id)} className="text-xs font-medium text-[#bec9bf] transition hover:text-[#f1cf7d]">{label}</button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1" aria-label="Language selector">
              {(Object.keys(localeLabels) as Locale[]).map(language => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setLocale(language)}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] transition ${locale === language ? "bg-[#d8bb72] text-[#15201c]" : "text-[#aebcb0] hover:text-[#f5f0df]"}`}
                  aria-pressed={locale === language}
                >
                  {localeLabels[language]}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setMenuOpen(open => !open)} className="grid size-9 place-items-center rounded-full border border-white/10 text-[#e6ede5] lg:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="mobile-navigation">
              <Menu className="size-4" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="container grid gap-3 border-t border-white/[0.07] py-4 lg:hidden" aria-label="Mobile navigation">
            {([
              ["story", copy.nav.story],
              ["timeline", copy.nav.timeline],
              ["portraits", copy.nav.portraits],
              ["chat", copy.nav.chat],
              ["contact", copy.nav.contact],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" onClick={() => jump(id)} className="text-left text-sm text-[#c8d1c8]">{label}</button>
            ))}
          </nav>
        )}
      </header>

      <main id="top" className="relative">
        <section className="container grid min-h-[calc(100svh-4.6rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
            <p className="section-eyebrow"><Sparkles className="size-3.5" />{copy.hero.eyebrow}</p>
            <h1 className="mt-6 max-w-3xl font-display text-[3.2rem] leading-[0.96] tracking-[-0.045em] text-[#fbf5e5] sm:text-7xl lg:text-8xl">{copy.hero.title}</h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#bdc9be] sm:text-lg">{copy.hero.description}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => jump("chat")} className="h-12 rounded-full bg-[#d8bb72] px-5 text-[#17201d] hover:bg-[#eed38f]">
                <BrainCircuit className="size-4" />{copy.hero.primary}<ArrowDownRight className="size-4" />
              </Button>
              <Button type="button" variant="outline" onClick={() => jump("story")} className="h-12 rounded-full border-white/15 bg-white/[0.02] px-5 text-[#e5ede4] hover:bg-white/[0.07] hover:text-white">
                {copy.hero.secondary}<ChevronRight className="size-4" />
              </Button>
            </div>
            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#72d5c8]/25 bg-[#72d5c8]/10 px-4 py-2 text-xs font-semibold tracking-[0.08em] text-[#91e2d8]">
              <Languages className="size-3.5" />{copy.hero.capsule}
            </div>
          </motion.div>

          <motion.div initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.12, ease: [0.23, 1, 0.32, 1] }} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-5 rounded-[2.4rem] border border-[#d8bb72]/20" />
            <div className="absolute -inset-11 rounded-[3.2rem] border border-[#72d5c8]/10" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1e1c] p-3 shadow-[0_34px_100px_rgba(0,0,0,0.45)]">
              <img src={gallery[0].src} alt={gallery[0].alt} className="aspect-[3/4] w-full rounded-[1.45rem] object-cover object-top" />
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/10 bg-[#071211]/80 p-4 backdrop-blur-md">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8bb72]">Mohamed Mnassri</p>
                <p className="mt-2 font-display text-lg leading-6 text-[#f8f2e3]">{copy.hero.statement}</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-white/[0.07] bg-white/[0.02]">
          <div className="container grid divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {copy.signal.map(item => (
              <div key={item.value} className="px-2 py-8 text-center sm:px-8">
                <p className="font-display text-3xl text-[#f1cf7d]">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-[#aebbb0]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="story" className="container py-24 sm:py-32">
          <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.22 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55 }} className="max-w-3xl">
            <p className="section-eyebrow">{copy.story.eyebrow}</p>
            <h2 className="mt-5 font-display text-4xl leading-tight text-[#f7f2e5] sm:text-6xl">{copy.story.title}</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#b7c3b8]">{copy.story.lead}</p>
          </motion.div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {copy.story.cards.map((card, index) => {
              const icons = [Stethoscope, HeartHandshake, ShieldCheck];
              const Icon = icons[index];
              return (
                <motion.article key={card.title} initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.45, delay: index * 0.08 }} className="rounded-[1.7rem] border border-white/[0.09] bg-[#0d1b19]/75 p-6 transition hover:-translate-y-1 hover:border-[#d8bb72]/35">
                  <Icon className="size-5 text-[#72d5c8]" />
                  <h3 className="mt-8 font-display text-2xl text-[#f7f2e5]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#aebbb0]">{card.text}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="timeline" className="border-y border-white/[0.07] bg-[#0a1817]/60 py-24 sm:py-32">
          <div className="container grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="section-eyebrow">{copy.timeline.eyebrow}</p>
              <h2 className="mt-5 max-w-md font-display text-4xl leading-tight text-[#f7f2e5] sm:text-5xl">{copy.timeline.title}</h2>
            </div>
            <ol className="relative space-y-0 border-l border-[#d8bb72]/30 pl-7 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-7">
              {copy.timeline.entries.map((item, index) => (
                <motion.li key={item.title} initial={shouldReduceMotion ? false : { opacity: 0, x: isArabic ? 18 : -18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.45 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.48, delay: index * 0.1 }} className="relative pb-12 last:pb-0">
                  <span className="absolute -left-[2.1rem] top-1 grid size-4 place-items-center rounded-full border border-[#d8bb72] bg-[#071211] rtl:-left-auto rtl:-right-[2.1rem]" aria-hidden="true"><span className="size-1.5 rounded-full bg-[#d8bb72]" /></span>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d8bb72]">{item.year}</p>
                  <h3 className="mt-3 font-display text-2xl text-[#f7f2e5]">{item.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#b4c1b6]">{item.text}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="container grid gap-14 py-24 sm:py-32 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <p className="section-eyebrow">{copy.profile.eyebrow}</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-tight text-[#f7f2e5] sm:text-5xl">{copy.profile.title}</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#b7c3b8]">{copy.profile.text}</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {copy.profile.skills.map(skill => <span key={skill} className="rounded-full border border-[#72d5c8]/25 bg-[#72d5c8]/[0.06] px-3.5 py-2 text-xs text-[#bde9e2]">{skill}</span>)}
            </div>
          </div>
          <div className="rounded-[1.8rem] border border-white/[0.09] bg-[#0d1b19]/80 p-6 sm:p-8">
            {copy.profile.languages.map((language, index) => (
              <div key={language.language} className={index > 0 ? "mt-7" : ""}>
                <div className="flex items-baseline justify-between gap-4"><span className="font-display text-xl text-[#f2f0e7]">{language.language}</span><span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8bb72]">{language.level}</span></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-[#72d5c8] to-[#d8bb72]" style={{ width: language.width }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section id="portraits" className="border-y border-white/[0.07] bg-[#0a1817]/55 py-24 sm:py-32">
          <div className="container">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl"><p className="section-eyebrow">{copy.portraits.eyebrow}</p><h2 className="mt-5 font-display text-4xl leading-tight text-[#f7f2e5] sm:text-5xl">{copy.portraits.title}</h2></div>
              <p className="max-w-sm text-sm leading-7 text-[#b4c1b6]">{copy.portraits.text}</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {gallery.map((image, index) => (
                <motion.figure key={image.src} initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: index * 0.08 }} className={`group overflow-hidden rounded-[1.7rem] border border-white/[0.09] bg-[#0d1b19] ${index === 1 ? "md:mt-10" : ""}`}>
                  <img src={image.src} alt={image.alt} className="aspect-[3/4] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
                  <figcaption className="flex items-center justify-between px-5 py-4"><span className="text-sm text-[#e7ecdf]">{copy.portraits.labels[index]}</span><ArrowUpRight className="size-4 text-[#d8bb72]" /></figcaption>
                </motion.figure>
              ))}
            </div>
            <div className="mt-8">
              <Suspense fallback={<div className="rounded-[1.9rem] border border-[#d8bb72]/20 bg-[#101b1b] p-8 text-sm text-[#bfc8bf]" role="status">Loading portrait studio…</div>}>
                <AvatarStudio locale={locale} />
              </Suspense>
            </div>
          </div>
        </section>

        <section id="chat" className="container py-24 sm:py-32">
          <Suspense fallback={<div className="rounded-[2rem] border border-white/10 bg-[#0d1918] p-10 text-sm text-[#bfc8bf]" role="status">Loading Mohamed’s portfolio guide…</div>}>
            <LongformChat locale={locale} />
          </Suspense>
        </section>

        <section id="contact" className="container pb-24 sm:pb-32">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#d8bb72]/30 bg-gradient-to-br from-[#162725] via-[#0f201e] to-[#0b1514] px-6 py-12 sm:px-12 sm:py-16">
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[#d8bb72]/15 blur-[100px]" aria-hidden="true" />
            <div className="relative max-w-3xl"><p className="section-eyebrow">{copy.contact.eyebrow}</p><h2 className="mt-5 font-display text-4xl leading-tight text-[#fff8e9] sm:text-6xl">{copy.contact.title}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-[#c8d2c7]">{copy.contact.text}</p><Button type="button" onClick={() => jump("chat")} className="mt-9 h-12 rounded-full bg-[#d8bb72] px-5 text-[#17201d] hover:bg-[#eed38f]"><BrainCircuit className="size-4" />{copy.contact.action}<ArrowDownRight className="size-4" /></Button><p className="mt-7 text-xs tracking-[0.08em] text-[#9eafa3]">{copy.contact.note}</p></div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] py-8"><div className="container flex flex-col justify-between gap-3 text-xs text-[#93a297] sm:flex-row"><p>{copy.footer}</p><p>© {new Date().getFullYear()} Mohamed Mnassri</p></div></footer>
    </div>
  );
}
