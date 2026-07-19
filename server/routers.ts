import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { generateImage } from "./_core/imageGeneration";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  CHAT_HISTORY_CAPACITY,
  MOHAMED_PERSONA,
  createAvatarPrompt,
  normalizeChatHistory,
  toModelContext,
} from "./mohamedPersona";

const REFERENCE_PORTRAIT_PATH = "/manus-storage/mohamed-reference-portrait_140af569.jpg";
const visitorWindows = new Map<string, { count: number; resetAt: number }>();

function getAbsoluteReferencePortraitUrl(request: {
  protocol?: string;
  get?: (name: string) => string | undefined;
  headers: Record<string, string | string[] | undefined>;
}) {
  const forwardedProtocol = request.headers["x-forwarded-proto"];
  const rawProtocol = Array.isArray(forwardedProtocol) ? forwardedProtocol[0] : forwardedProtocol;
  const protocol = rawProtocol?.split(",")[0]?.trim() || request.protocol || "https";
  const rawHost = request.get?.("host") || request.headers.host;
  const host = Array.isArray(rawHost) ? rawHost[0] : rawHost;

  if (!host) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "The portrait reference is temporarily unavailable.",
    });
  }

  return `${protocol}://${host}${REFERENCE_PORTRAIT_PATH}`;
}

function getVisitorKey(request: {
  headers: Record<string, string | string[] | undefined>;
  ip?: string;
}) {
  const forwarded = request.headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return forwardedValue?.split(",")[0]?.trim() || request.ip || "anonymous";
}

function assertRateLimit(
  request: { headers: Record<string, string | string[] | undefined>; ip?: string },
  scope: string,
  maximum: number,
  windowMs: number,
) {
  const now = Date.now();
  const key = `${scope}:${getVisitorKey(request)}`;
  const current = visitorWindows.get(key);

  if (!current || current.resetAt <= now) {
    visitorWindows.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= maximum) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please pause for a moment before creating another AI response.",
    });
  }

  current.count += 1;
}

const chatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(CHAT_HISTORY_CAPACITY),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  chat: router({
    ask: publicProcedure.input(chatInput).mutation(async ({ ctx, input }) => {
      assertRateLimit(ctx.req, "chat", 18, 15 * 60 * 1000);
      const history = normalizeChatHistory(input.messages);

      try {
        const completion = await invokeLLM({
          model: "gpt-5-mini",
          maxTokens: 700,
          messages: [
            { role: "system", content: MOHAMED_PERSONA },
            ...toModelContext(history),
          ],
        });
        const rawMessage = completion.choices[0]?.message?.content;
        const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

        if (!message) {
          throw new Error("The LLM returned an empty response.");
        }

        return {
          message,
          retainedHistoryCapacity: CHAT_HISTORY_CAPACITY,
        };
      } catch (error) {
        console.error("[Mohamed Chat] generation failed", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "The portfolio guide is temporarily unavailable. Please try again shortly.",
        });
      }
    }),
  }),

  avatar: router({
    generate: publicProcedure
      .input(z.object({ style: z.enum(["healthcare", "formal", "casual"]) }))
      .mutation(async ({ ctx, input }) => {
        assertRateLimit(ctx.req, "avatar", 3, 60 * 60 * 1000);

        try {
          const image = await generateImage({
            prompt: createAvatarPrompt(input.style),
            originalImages: [
              {
                url: getAbsoluteReferencePortraitUrl(ctx.req),
                mimeType: "image/jpeg",
              },
            ],
          });
          return { url: image.url };
        } catch (error) {
          console.error("[Mohamed Avatar] generation failed", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "The portrait studio is temporarily unavailable. Please try again shortly.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
