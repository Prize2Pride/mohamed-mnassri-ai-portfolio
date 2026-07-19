# Verification Notes

## Visual checks

- Desktop full-page review confirms the dark emerald, warm ivory, and restrained gold design system is coherent across the hero, timeline, skills, avatar gallery, chat, and call-to-action sections.
- Mobile full-page review at 390 × 844 confirms the navigation, language controls, timeline, cards, avatar studio, long-form chat, and call-to-action stack without horizontal overflow.
- The gallery now uses three completed Mohamed-specific portrait assets for healthcare, language-learning, and formal-applicant contexts.

## Functional checks

- `pnpm check` completed successfully.
- `pnpm test` completed successfully with 4 passing tests, including the 600-message retained-history capacity and persona grounding tests.
- `pnpm build` completed successfully.
- The live server-side chat endpoint returned a grounded response and reported a retained-history capacity of 600.
- The public-preview avatar endpoint returned a generated portrait URL after the reference image was passed as an absolute HTTPS URL.

## Implementation notes

- The portfolio UI persists up to 600 messages locally in the current browser and sends only the latest 18 messages to the server-side model for efficient context handling.
- Public avatar generation is rate-limited to reduce misuse while preserving visitor access.
- Motion responds to `prefers-reduced-motion`, with nonessential entrance animations disabled when requested.
