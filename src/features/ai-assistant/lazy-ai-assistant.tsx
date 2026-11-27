"use client";

import dynamic from "next/dynamic";

const AiAssistant = dynamic(
  () =>
    import(
      "@/features/ai-assistant/ai-assistant"
    ).then(
      (module) =>
        module.AiAssistant,
    ),
  {
    ssr: false,
  },
);

export function LazyAiAssistant() {
  return <AiAssistant />;
}
