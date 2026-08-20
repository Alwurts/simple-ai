"use client";

import { InputGroupButton } from "@workspace/ui/components/shadcn/input-group";
import { toast } from "@workspace/ui/components/shadcn/sonner";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, MicIcon, Square } from "lucide-react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";

export interface ChatVoiceButtonLabels {
  start?: string;
  stop?: string;
  stopAria?: string;
  processing?: string;
  error?: string;
  /** Toast when MediaRecorder / getUserMedia is unavailable. */
  unsupported?: string;
  /** Toast when Escape cancels an in-progress recording. */
  cancelled?: string;
  transcriptionFailed?: string;
  recordingFailed?: string;
  recordingTooShort?: string;
  noTranscription?: string;
  micFailed?: string;
  micDenied?: string;
  micNotFound?: string;
  micBusy?: string;
}

export interface ChatVoiceButtonProps {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
  transcribe?: (audio: Blob) => Promise<string>;
  transcribeEndpoint?: string;
  controller: {
    textInput: {
      value: string;
      setInput: (value: string) => void;
      clear: () => void;
    };
  };
  className?: string;
  labels?: ChatVoiceButtonLabels;
}

type RecordingState = "idle" | "recording" | "processing" | "error";

interface AudioRecordingState {
  isRecording: boolean;
  error: string | null;
  duration: number;
}

function subscribeMediaSupport(_onStoreChange: () => void) {
  // Capability does not change after load; no subscription needed.
  return () => {
    // no-op unsubscribe
  };
}

function getMediaSupportSnapshot() {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

function getMediaSupportServerSnapshot() {
  return false;
}

function useAudioRecording(options: {
  sampleRate?: number;
  channelCount?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  maxDuration?: number;
  onDataAvailable?: (blob: Blob) => void;
  onError?: (error: Error) => void;
  messages?: Pick<
    ChatVoiceButtonLabels,
    "unsupported" | "micFailed" | "micDenied" | "micNotFound" | "micBusy"
  >;
}) {
  const isSupported = useSyncExternalStore(
    subscribeMediaSupport,
    getMediaSupportSnapshot,
    getMediaSupportServerSnapshot
  );

  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    error: null,
    duration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    sampleRate = 16_000,
    channelCount = 1,
    echoCancellation = true,
    noiseSuppression = true,
    autoGainControl = true,
    maxDuration = 300_000, // 5 minutes
    messages,
    onDataAvailable,
    onError,
  } = options;

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const getOptimalAudioFormat = useCallback((): string => {
    // Prioritize formats that work best with OpenAI Whisper
    const preferredFormats = [
      "audio/wav", // Uncompressed, most reliable
      "audio/mp4;codecs=aac", // Good compression and compatibility
      "audio/mp4", // Fallback MP4
      "audio/webm;codecs=opus", // Good quality but sometimes problematic
      "audio/webm;codecs=pcm", // Uncompressed WebM
      "audio/webm", // Fallback WebM
      "audio/ogg;codecs=opus", // Alternative
      "audio/ogg", // Fallback OGG
    ];

    for (const format of preferredFormats) {
      if (MediaRecorder.isTypeSupported(format)) {
        return format;
      }
    }

    return "audio/webm"; // fallback
  }, []);

  const cleanup = useCallback(() => {
    // Stop duration tracking
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop media stream
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    setState((prev) => ({ ...prev, isRecording: false }));
  }, []);

  const stopRecording = useCallback(
    (): Promise<Blob | null> =>
      new Promise((resolve) => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          mediaRecorderRef.current.onstop = () => {
            const audioBlob =
              audioChunksRef.current.length > 0
                ? new Blob(audioChunksRef.current, {
                    type: getOptimalAudioFormat(),
                  })
                : null;
            cleanup();
            resolve(audioBlob);
          };
          mediaRecorderRef.current.stop();
        } else {
          cleanup();
          resolve(null);
        }
      }),
    [cleanup, getOptimalAudioFormat]
  );

  const startRecording = useCallback(async () => {
    const msg = messagesRef.current;
    if (!isSupported) {
      const error = new Error(
        msg?.unsupported ?? "Audio recording is not supported in this browser"
      );
      onError?.(error);
      setState((prev) => ({ ...prev, error: error.message }));
      return;
    }

    try {
      setState((prev) => ({
        ...prev,
        isRecording: true,
        error: null,
        duration: 0,
      }));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: { ideal: sampleRate, min: 8000, max: 48_000 },
          channelCount: { exact: channelCount },
          echoCancellation: { ideal: echoCancellation },
          noiseSuppression: { ideal: noiseSuppression },
          autoGainControl: { ideal: autoGainControl },
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      // Setup duration tracking
      durationIntervalRef.current = setInterval(() => {
        const duration = Date.now() - startTimeRef.current;
        setState((prev) => ({ ...prev, duration }));

        // Auto-stop at max duration
        if (duration >= maxDuration) {
          stopRecording();
        }
      }, 100);

      const mimeType = getOptimalAudioFormat();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128_000,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          onDataAvailable?.(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        const error = new Error(`MediaRecorder error: ${event}`);
        onError?.(error);
        setState((prev) => ({
          ...prev,
          error: error.message,
          isRecording: false,
        }));
        cleanup();
      };

      mediaRecorder.onstop = () => {
        cleanup();
      };

      mediaRecorder.start(250); // Collect data every 250ms
    } catch (error) {
      const err = error as Error;
      const msg = messagesRef.current;

      let errorMessage = msg?.micFailed ?? "Failed to access microphone.";
      if (err.name === "NotAllowedError") {
        errorMessage =
          msg?.micDenied ??
          "Microphone access denied. Please allow microphone permissions.";
      } else if (err.name === "NotFoundError") {
        errorMessage =
          msg?.micNotFound ??
          "No microphone found. Please connect a microphone.";
      } else if (err.name === "NotReadableError") {
        errorMessage =
          msg?.micBusy ??
          "Microphone is busy. Please close other applications using microphone.";
      }

      const localized = new Error(errorMessage);
      localized.name = err.name;
      onError?.(localized);

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isRecording: false,
      }));
      cleanup();
    }
  }, [
    isSupported,
    sampleRate,
    channelCount,
    echoCancellation,
    noiseSuppression,
    autoGainControl,
    maxDuration,
    onDataAvailable,
    onError,
    getOptimalAudioFormat,
    stopRecording,
    cleanup,
  ]);

  return {
    ...state,
    isSupported,
    startRecording,
    stopRecording,
    cleanup,
    getOptimalAudioFormat,
  };
}

function useTranscription(
  options: {
    endpoint?: string;
    messages?: Pick<
      ChatVoiceButtonLabels,
      "recordingTooShort" | "noTranscription" | "transcriptionFailed"
    >;
  } = {}
) {
  const { endpoint = "/api/transcribe", messages } = options;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async ({ audioBlob }: { audioBlob: Blob }): Promise<string> => {
      const msg = messagesRef.current;
      setIsPending(true);
      setError(null);

      try {
        // Check if audio file is too small (less than 1KB might indicate empty recording)
        if (audioBlob.size < 1024) {
          throw new Error(
            msg?.recordingTooShort ??
              "Audio recording too short. Please try again."
          );
        }

        // Generate appropriate filename based on actual MIME type
        const getFileExtension = (mimeType: string): string => {
          // Extract base MIME type (remove codec specifications)
          const baseMimeType = mimeType.split(";")[0];

          switch (baseMimeType) {
            case "audio/webm":
              return "webm";
            case "audio/wav":
              return "wav";
            case "audio/mp4":
              return "mp4";
            case "audio/ogg":
              return "ogg";
            case "audio/mp3":
            case "audio/mpeg":
              return "mp3";
            case "audio/flac":
              return "flac";
            case "audio/m4a":
              return "m4a";
            case "audio/mpga":
              return "mp3";
            case "audio/oga":
              return "oga";
            default:
              return "webm"; // fallback
          }
        };

        const extension = getFileExtension(audioBlob.type);
        const filename = `audio.${extension}`;

        // Clean MIME type (remove codec specifications) for better compatibility
        const cleanMimeType = audioBlob.type.split(";")[0];

        const formData = new FormData();
        formData.append(
          "audio",
          new File([audioBlob], filename, { type: cleanMimeType })
        );

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          const errorMessage =
            errorData.error ||
            (msg?.transcriptionFailed
              ? `${msg.transcriptionFailed}: ${response.status}`
              : `Transcription failed: ${response.status}`);
          console.error("Transcription failed:", response.status, errorData);
          throw new Error(errorMessage);
        }

        const result = (await response.json()) as { text?: string };

        if (!result.text || typeof result.text !== "string") {
          throw new Error(
            msg?.noTranscription ?? "No transcription text received"
          );
        }

        return result.text;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error(
                messagesRef.current?.transcriptionFailed ??
                  "Transcription failed"
              );
        setError(error);
        console.error("Transcription error:", error);
        throw error;
      } finally {
        setIsPending(false);
      }
    },
    [endpoint]
  );

  return {
    mutate,
    mutateAsync: mutate,
    isPending,
    error,
  };
}

export function ChatVoiceButton({
  onTranscriptionComplete,
  onError,
  disabled = false,
  transcribe,
  transcribeEndpoint = "/api/transcribe",
  controller,
  className,
  labels,
  ...props
}: ChatVoiceButtonProps) {
  const recording = useAudioRecording({
    maxDuration: 300_000,
    messages: {
      unsupported: labels?.unsupported,
      micFailed: labels?.micFailed,
      micDenied: labels?.micDenied,
      micNotFound: labels?.micNotFound,
      micBusy: labels?.micBusy,
    },
    onError: (error) => {
      console.error("Recording error:", error);
      toast.error(error.message);
      onError?.(error);
    },
  });

  const transcription = useTranscription({
    endpoint: transcribeEndpoint,
    messages: {
      recordingTooShort: labels?.recordingTooShort,
      noTranscription: labels?.noTranscription,
      transcriptionFailed: labels?.transcriptionFailed,
    },
  });

  const [uiState, setUiState] = useState<RecordingState>("idle");

  const handleTranscriptionComplete = useCallback(
    (text: string) => {
      const currentText = controller.textInput.value.trim();

      if (currentText.length === 0) {
        controller.textInput.setInput(text);
      } else {
        // Append with space
        controller.textInput.setInput(`${currentText} ${text}`);
      }

      onTranscriptionComplete?.(text);
    },
    [controller.textInput, onTranscriptionComplete]
  );

  const handleStopRecording = useCallback(async () => {
    try {
      setUiState("processing");
      const audioBlob = await recording.stopRecording();

      if (!audioBlob) {
        setUiState("idle");
        return;
      }

      const transcribedText = transcribe
        ? await transcribe(audioBlob)
        : await transcription.mutate({ audioBlob });

      handleTranscriptionComplete(transcribedText);
      setUiState("idle");
    } catch (error) {
      console.error("Transcription error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (labels?.transcriptionFailed ?? "Transcription failed");
      toast.error(errorMessage);
      setUiState("error");
      setTimeout(() => setUiState("idle"), 3000);
    }
  }, [
    recording,
    transcribe,
    transcription,
    handleTranscriptionComplete,
    labels?.transcriptionFailed,
  ]);

  const handleStartRecording = useCallback(async () => {
    try {
      if (recording.isSupported) {
        await recording.startRecording();
        setUiState("recording");
      } else {
        toast.error(
          labels?.unsupported ??
            "Audio recording is not supported in this browser"
        );
      }
    } catch (error) {
      console.error("Recording error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (labels?.recordingFailed ?? "Recording failed");
      toast.error(errorMessage);
      setUiState("error");
      setTimeout(() => setUiState("idle"), 3000);
    }
  }, [recording, labels?.unsupported, labels?.recordingFailed]);

  const handleClick = useCallback(async () => {
    if (recording.isRecording) {
      await handleStopRecording();
    } else {
      await handleStartRecording();
    }
  }, [recording.isRecording, handleStopRecording, handleStartRecording]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && recording.isRecording) {
        recording.cleanup();
        setUiState("idle");
        toast.info(labels?.cancelled ?? "Recording cancelled");
      }
    },
    [recording, labels?.cancelled]
  );

  const getButtonContent = () => {
    switch (uiState) {
      case "recording":
        return (
          <>
            <Square className="h-4 w-4" />
            <span className="sr-only">{labels?.stop ?? "Stop recording"}</span>
          </>
        );
      case "processing":
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="sr-only">
              {labels?.processing ?? "Processing audio"}
            </span>
          </>
        );
      case "error":
        return (
          <>
            <MicIcon className="h-4 w-4 text-destructive" />
            <span className="sr-only">
              {labels?.error ?? "Voice input error"}
            </span>
          </>
        );
      default:
        return (
          <>
            <MicIcon className="h-4 w-4" />
            <span className="sr-only">
              {labels?.start ?? "Start voice input"}
            </span>
          </>
        );
    }
  };

  const getAriaLabel = () => {
    switch (uiState) {
      case "recording":
        return (
          labels?.stopAria ?? "Stop voice recording (press Escape to cancel)"
        );
      case "processing":
        return labels?.processing ?? "Processing voice input";
      case "error":
        return labels?.error ?? "Voice input error - try again";
      default:
        return labels?.start ?? "Start voice input";
    }
  };

  return (
    <InputGroupButton
      aria-label={getAriaLabel()}
      aria-pressed={uiState === "recording"}
      className={cn(
        "shrink-0 transition-colors",
        {
          "bg-muted text-muted-foreground": uiState === "processing",
          "bg-destructive/10 text-destructive hover:bg-destructive/20":
            uiState === "error",
        },
        className
      )}
      disabled={disabled || uiState === "processing"}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      size="icon-sm"
      variant="outline"
      {...props}
    >
      {getButtonContent()}
    </InputGroupButton>
  );
}
