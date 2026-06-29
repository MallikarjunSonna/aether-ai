import { useState, useRef, useCallback } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  return (
    <div className="border-t border-line/60 px-6 py-4">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={disabled}
          aria-label="Chat input"
          className="max-h-[200px] min-h-[44px] flex-1 resize-none rounded-xl border border-line/60 bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted transition-colors duration-fast focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-colors duration-fast hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:hover:bg-primary"
        >
          <SendHorizonal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
