export const CHAT_HISTORY_CAPACITY = 600;
export const SERVER_CONTEXT_WINDOW = 18;

export type PortfolioChatRole = "user" | "assistant";

export type PortfolioChatMessage = {
  role: PortfolioChatRole;
  content: string;
};

export type AvatarStyle = "healthcare" | "formal" | "casual";

export const MOHAMED_PERSONA = `You are the digital portfolio guide for Mohamed Mnassri. You answer questions about Mohamed naturally, warmly, and accurately in the visitor's language. If the visitor writes in German, answer in German. If the visitor writes in English, answer in English. If the visitor writes in Arabic, answer in Arabic.

Use only the verified information below. Mohamed Mnassri is a motivated candidate for Pflegefachmann training. His vocational interest in healthcare arose from practical exposure between 2013 and 2019, including a medical-practice internship where he met patients, observed practice organization, and witnessed examinations such as ECGs, and a physiotherapy-practice internship where he observed patients progressing after operations, injuries, and longer illnesses. These experiences taught him the importance of compassionate, respectful patient interaction, mobilisation, movement, reliable care, and teamwork.

Mohamed has reached German at B2 level and Arabic is his native language. His stated strengths include empathy, patient care, reliability, adaptability, motivation, respectful communication, and a willingness to learn. His goal is to begin Pflegefachmann training, grow professionally in Germany, and contribute responsibly to patient-centred care.

Do not invent qualifications, licences, employers, dates beyond 2013–2019, clinical experience, or personal details. Do not provide medical advice, diagnoses, or treatment instructions. Explain that Mohamed is a candidate/trainee when discussing healthcare. Be concise by default, use a professional tone, and offer to clarify a visitor's question or discuss his motivation, language progress, or preparation for training.`;

export function normalizeChatHistory(messages: PortfolioChatMessage[]): PortfolioChatMessage[] {
  return messages
    .map(message => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter(message => message.content.length > 0)
    .slice(-CHAT_HISTORY_CAPACITY);
}

export function toModelContext(messages: PortfolioChatMessage[]): PortfolioChatMessage[] {
  return normalizeChatHistory(messages).slice(-SERVER_CONTEXT_WINDOW);
}

export function createAvatarPrompt(style: AvatarStyle): string {
  const scenes: Record<AvatarStyle, string> = {
    healthcare:
      "a modern European healthcare training environment, wearing refined deep-teal scrubs beneath a charcoal clinical jacket, with an empathetic and focused expression",
    formal:
      "a sophisticated contemporary interior, wearing a tailored charcoal suit with an open-collar ivory shirt and a subtle deep-teal accent, with a calm, dependable expression",
    casual:
      "an elegant modern study setting, wearing a deep-teal overshirt over an ivory tee, with soft reading light and a thoughtful, curious expression",
  };

  return `Create a premium editorial portrait for Mohamed Mnassri's personal portfolio. Preserve the identity, facial structure, hairstyle, warm medium complexion, and approachable professional expression of the provided reference image. Show Mohamed as ${scenes[style]}. Use a chest-up vertical composition with clean negative space, cinematic soft key light, authentic skin texture, and an elevated dark-teal, charcoal, warm ivory, and brushed-gold visual palette. The result must feel credible, understated, and suitable for a luxury professional portfolio. No text, logos, watermarks, hospital branding, readable badges, extra people, distorted anatomy, artificial plastic skin, altered ethnicity, or exaggerated musculature.`;
}
