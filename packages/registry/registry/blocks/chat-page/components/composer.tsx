"use client";

import type { ChatStatus, FileUIPart } from "ai";
import { FileIcon, PaperclipIcon, XIcon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  Composer,
  ComposerEditor,
  type ComposerHandle,
  ComposerMentionButton,
  ComposerSubmitButton,
} from "@/components/ui/composer";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { MOCK_MEMBERS, type MockMember } from "../lib/mock-members";

export interface GalleryPromptMessage {
  text: string;
  files: FileUIPart[];
  members?: MockMember[];
}

type ComposerFile = FileUIPart & { id: string };

function filePartsFromList(fileList: FileList | File[]): ComposerFile[] {
  return Array.from(fileList).map((file) => ({
    id: crypto.randomUUID(),
    type: "file" as const,
    filename: file.name,
    mediaType: file.type,
    url: URL.createObjectURL(file),
  }));
}

function ChatInputInner({
  disabled,
  onStop,
  onSubmit,
  placeholder,
  status,
}: {
  disabled: boolean;
  onStop?: () => void;
  onSubmit: (message: GalleryPromptMessage) => void | Promise<void>;
  placeholder: string;
  status: ChatStatus;
}) {
  const [files, setFiles] = useState<ComposerFile[]>([]);
  const inputRef = useRef<ComposerHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      for (const file of prev) {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      }
      return [];
    });
  }, []);

  const addFiles = useCallback((list: FileList | File[]) => {
    setFiles((prev) => [...prev, ...filePartsFromList(list)]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const found = prev.find((file) => file.id === id);
      if (found?.url) {
        URL.revokeObjectURL(found.url);
      }
      return prev.filter((file) => file.id !== id);
    });
  }, []);

  return (
    <div className="w-full">
      <input
        className="hidden"
        multiple
        onChange={(event) => {
          if (event.currentTarget.files?.length) {
            addFiles(event.currentTarget.files);
          }
          event.currentTarget.value = "";
        }}
        ref={fileInputRef}
        type="file"
      />
      <Composer
        className="rounded-2xl"
        disabled={disabled}
        onStop={onStop}
        mentions={{
          member: {
            trigger: "@",
            items: MOCK_MEMBERS,
          },
        }}
        onSubmit={(parsed, { clear, focus }) => {
          const trimmed = parsed.text.trim();
          if (!(trimmed || files.length > 0)) {
            return;
          }
          const payload: GalleryPromptMessage = {
            text: trimmed,
            files: files.map(({ id: _id, ...file }) => file),
            members: parsed.member,
          };
          clearFiles();
          clear();
          focus();
          Promise.resolve(onSubmit(payload)).catch(() => undefined);
        }}
        ref={inputRef}
        status={status}
      >
        {files.length > 0 ? (
          <InputGroupAddon align="block-start" className="pb-0">
            <AttachmentGroup>
              {files.map((file) => {
                const isImage = Boolean(
                  file.mediaType?.startsWith("image/") && file.url
                );
                return (
                  <Attachment key={file.id} size="xs" state="done">
                    <AttachmentMedia variant={isImage ? "image" : "icon"}>
                      {isImage ? (
                        <img alt={file.filename ?? ""} src={file.url} />
                      ) : (
                        <FileIcon />
                      )}
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>
                        {file.filename ?? "Attachment"}
                      </AttachmentTitle>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction
                        aria-label={`Remove ${file.filename ?? "attachment"}`}
                        onClick={() => removeFile(file.id)}
                      >
                        <XIcon />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                );
              })}
            </AttachmentGroup>
          </InputGroupAddon>
        ) : null}
        <ComposerEditor placeholder={placeholder} />
        <InputGroupAddon align="block-end" className="pt-1">
          <ComposerMentionButton />
          <InputGroupButton
            aria-label="Add files"
            onClick={() => fileInputRef.current?.click()}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <PaperclipIcon />
          </InputGroupButton>
          <div className="ml-auto flex items-center gap-2">
            <ComposerSubmitButton />
          </div>
        </InputGroupAddon>
      </Composer>
    </div>
  );
}

export function GalleryChatInput({
  disabled = false,
  onStop,
  onSubmit,
  placeholder = "Ask anything...",
  status,
}: {
  disabled?: boolean;
  onStop?: () => void;
  onSubmit: (message: GalleryPromptMessage) => void | Promise<void>;
  placeholder?: string;
  status: ChatStatus;
}) {
  return (
    <div className="relative bottom-0 z-10 w-full bg-background pt-2">
      <div className="mx-auto w-full p-2 @[500px]:px-4 @[500px]:pb-4 md:max-w-3xl @[500px]:md:pb-6">
        <ChatInputInner
          disabled={disabled}
          onStop={onStop}
          onSubmit={onSubmit}
          placeholder={placeholder}
          status={status}
        />
      </div>
    </div>
  );
}
