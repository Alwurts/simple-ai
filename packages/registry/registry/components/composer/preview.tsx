"use client";

import {
  Composer,
  ComposerEditor,
  ComposerMentionButton,
  ComposerSubmitButton,
} from "@/components/ui/composer";
import { InputGroupAddon } from "@/components/ui/input-group";

const MEMBERS = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function ComposerPreview() {
  return (
    <div className="w-full max-w-md">
      <Composer
        className="rounded-2xl"
        mentions={{
          member: {
            trigger: "@",
            items: MEMBERS,
          },
        }}
        onSubmit={(parsed, { clear, focus }) => {
          console.log(parsed);
          clear();
          focus();
        }}
        status="ready"
      >
        <ComposerEditor placeholder="Type @ to mention..." />
        <InputGroupAddon align="block-end" className="pt-1">
          <ComposerMentionButton />
          <div className="ml-auto">
            <ComposerSubmitButton />
          </div>
        </InputGroupAddon>
      </Composer>
    </div>
  );
}
