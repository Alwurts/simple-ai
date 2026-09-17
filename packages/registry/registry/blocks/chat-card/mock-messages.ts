export type CardPart = {
  type: string;
  text?: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
};

export type CardMessage = {
  id: string;
  role: "user" | "assistant";
  parts: CardPart[];
};

export const INITIAL_MESSAGES: CardMessage[] = [
  {
    id: "u1",
    role: "user",
    parts: [{ type: "text", text: "What am I looking at?" }],
  },
  {
    id: "a1",
    role: "assistant",
    parts: [
      {
        type: "reasoning",
        text: "The wearer is in a WebXR session. I will describe the in-world card, not a 2D page.",
      },
      {
        type: "text",
        text: "You are looking at an in-world chat card. Drag the handle to move it. Pinch a corner to resize. Enter VR or AR to place it at your gaze.",
      },
    ],
  },
  {
    id: "u2",
    role: "user",
    parts: [{ type: "text", text: "Make the hole 8mm." }],
  },
  {
    id: "a2",
    role: "assistant",
    parts: [
      {
        type: "tool-cad_edit",
        toolName: "cad_edit",
        input: { feature: "hole", diameter_mm: 8 },
        output: { ok: true, diameter_mm: 8 },
      },
      {
        type: "text",
        text: "Updated the hole to 8 mm. The card stays in world space while the model rebuilds.",
      },
    ],
  },
];
