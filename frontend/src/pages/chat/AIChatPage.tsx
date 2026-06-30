import { useCallback } from "react";

import { ChatEmptyState } from "../../components/chat/ChatEmptyState";
import { ChatInput } from "../../components/chat/ChatInput";
import { ChatLayout } from "../../components/chat/ChatLayout";
import { ChatMessages } from "../../components/chat/ChatMessages";
import { ProviderSelector } from "../../components/chat/ProviderSelector";
import { useAIChat } from "../../hooks/useAIChat";
import { useProviderSelection } from "../../hooks/useProviderSelection";

export function AIChatPage() {
  const { messages, isLoading, error, sendMessage, cancelGeneration, clearMessages } =
    useAIChat();

  const {
    currentProvider,
    currentModel,
    providers,
    models,
    setProvider,
    setModel,
  } = useProviderSelection();

  const hasMessages = messages.length > 0;

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content, currentProvider, currentModel);
    },
    [sendMessage, currentProvider, currentModel],
  );

  return (
    <ChatLayout
      header={
        <ProviderSelector
          currentProvider={currentProvider}
          currentModel={currentModel}
          providers={providers}
          models={models}
          onProviderChange={setProvider}
          onModelChange={setModel}
          disabled={isLoading}
        />
      }
      error={error}
      onDismissError={clearMessages}
    >
      {hasMessages ? (
        <ChatMessages messages={messages} isLoading={isLoading} />
      ) : (
        <ChatEmptyState />
      )}

      <ChatInput onSend={handleSend} onCancel={cancelGeneration} disabled={isLoading} />
    </ChatLayout>
  );
}
