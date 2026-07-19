import { describe, expect, it } from "vitest";
import {
  CHAT_HISTORY_CAPACITY,
  MOHAMED_PERSONA,
  normalizeChatHistory,
  toModelContext,
} from "./mohamedPersona";

describe("Mohamed portfolio AI persona", () => {
  it("preserves a local transcript capacity of at least 500 messages", () => {
    const messages = Array.from({ length: 605 }, (_, index) => ({
      role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `message ${index}`,
    }));

    const normalized = normalizeChatHistory(messages);

    expect(CHAT_HISTORY_CAPACITY).toBeGreaterThanOrEqual(500);
    expect(normalized).toHaveLength(CHAT_HISTORY_CAPACITY);
    expect(normalized[0]?.content).toBe("message 5");
    expect(normalized.at(-1)?.content).toBe("message 604");
  });

  it("limits model context without discarding the visible chat transcript", () => {
    const messages = Array.from({ length: 30 }, (_, index) => ({
      role: "user" as const,
      content: `question ${index}`,
    }));

    const context = toModelContext(messages);

    expect(context).toHaveLength(18);
    expect(context[0]?.content).toBe("question 12");
  });

  it("grounds answers in the required nursing, language, and aspiration facts", () => {
    expect(MOHAMED_PERSONA).toContain("2013 and 2019");
    expect(MOHAMED_PERSONA).toContain("German at B2");
    expect(MOHAMED_PERSONA).toContain("Arabic is his native language");
    expect(MOHAMED_PERSONA).toContain("Pflegefachmann");
  });
});
