import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { ChatInput } from "../../components/chat/ChatInput";
import { ChatLayout } from "../../components/chat/ChatLayout";
import { ChatMessages } from "../../components/chat/ChatMessages";
import { useAIChat } from "../../hooks/useAIChat";

export function AIChatPage() {
  const { messages, isLoading, error, sendMessage, cancelGeneration, clearMessages } =
    useAIChat();

  const hasMessages = messages.length > 0;

  return (
    <ChatLayout error={error} onDismissError={clearMessages}>
      {hasMessages ? (
        <ChatMessages messages={messages} isLoading={isLoading} />
      ) : (
        <ChatEmptyState />
      )}

      <ChatInput onSend={sendMessage} onCancel={cancelGeneration} disabled={isLoading} />
    </ChatLayout>
  );
}
