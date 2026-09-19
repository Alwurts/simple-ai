import { createChat } from "@shadcn/helpers/ai-sdk";
import type { UIMessage } from "ai";
import type { AIMetadata } from "./ai-types";

export type CardChatMessage = UIMessage<AIMetadata>;

const galleryChat = createChat<CardChatMessage>()
  .user("What am I looking at?")
  .assistant(({ writer }) => {
    writer.stepStart();
    writer.reasoning(
      "The wearer is in a VR session. I will describe the card in the scene, not a 2D page."
    );
    writer.sleep(900);
    writer.stepStart();
    writer.text(
      `You are looking at a **VR** chat card.

- Drag the handle to move it
- Pinch a corner to resize
- Enter VR or AR to place it at your gaze`
    );
  })
  .user("Make the hole 8mm.")
  .assistant(({ writer }) => {
    writer.stepStart();
    writer.reasoning(
      "They want the hole at 8 mm. I will call cad_edit, then keep the answer visible on the card."
    );
    writer
      .tool("cad_edit", {
        dynamic: true,
        input: { feature: "hole", diameter_mm: 8 },
      })
      .sleep(1400)
      .output({ ok: true, diameter_mm: 8 });
    writer.stepStart();
    writer.text(
      `Updated the hole to **8 mm**. The card stays in the scene while the model rebuilds.

| Feature | Size |
| --- | --- |
| hole | 8 mm |`
    );
  });

const ASSISTANT_RESPONSE_MS = [4200, 6800];

let assistantIndex = -1;

export const initialGalleryMessages = galleryChat.get().map((message) => {
  if (message.role !== "assistant") {
    return message;
  }
  assistantIndex += 1;
  return {
    ...message,
    metadata: {
      createdAt: message.metadata?.createdAt ?? "2026-06-24T12:00:00.000Z",
      status: message.metadata?.status ?? "success",
      ...message.metadata,
      responseTime:
        message.metadata?.responseTime ?? ASSISTANT_RESPONSE_MS[assistantIndex],
    },
  };
});

export const galleryChatTransport = galleryChat.transport({
  delayMs: 80,
  fallback: ({ writer, messages }) => {
    const assistantTurns = messages.filter(
      (message) => message.role === "assistant"
    ).length;
    const variants = [
      () => {
        writer.stepStart();
        writer.reasoning(
          "They asked from the card. I will describe grab and resize, then mention Enter VR."
        );
        writer.sleep(800);
        writer.stepStart();
        writer.text(
          "Drag the **handle** under the card to move it. Pinch a **corner** to resize. On a Quest, Enter VR or AR and the card sits at your gaze."
        );
      },
      () => {
        writer.stepStart();
        writer.reasoning(
          "Follow-up looks like another model edit. I will run cad_edit again so the card still shows a tool fold."
        );
        writer
          .tool("cad_edit", {
            dynamic: true,
            input: { feature: "fillet", radius_mm: 1 },
          })
          .sleep(1200)
          .output({ ok: true, radius_mm: 1 });
        writer.stepStart();
        writer.text(
          "Added a **1 mm** fillet. Say if you want the hole changed too."
        );
      },
      () => {
        writer.stepStart();
        writer.reasoning(
          "This is a restock-style aside. There is no inventory in this scene. I will say so and stay on the card."
        );
        writer.sleep(700);
        writer.stepStart();
        writer.text(
          "This example is a VR chat card, not an inventory app. Ask about the card, or point `chat-transport.ts` at your own API."
        );
      },
    ] as const;
    const writeFallback =
      variants[assistantTurns % variants.length] ?? variants[0];
    writeFallback();
  },
});
