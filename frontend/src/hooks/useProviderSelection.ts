import { useCallback, useEffect, useRef, useState } from "react";

import type { AIModel, ProviderType } from "../types/ai";
import { AIChatService } from "../services/ai/AIChatService";

export interface ProviderInfo {
  type: ProviderType;
  name: string;
  supportsStreaming: boolean;
  healthStatus: "healthy" | "unavailable";
}

export interface ModelInfo {
  id: string;
  name: string;
}

export function useProviderSelection() {
  const [currentProvider, setCurrentProvider] = useState<ProviderType>("openai");
  const [currentModel, setCurrentModel] = useState<string>("gpt-4.1-mini");
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const serviceRef = useRef<AIChatService | null>(null);
  const loadingRef = useRef(0);

  const getService = useCallback((): AIChatService => {
    if (!serviceRef.current) {
      serviceRef.current = new AIChatService();
    }
    return serviceRef.current;
  }, []);

  useEffect(() => {
    const service = getService();

    service.listProviders().then((types) =>
      Promise.all(
        types.map(async (type) => {
          const [name, isHealthy, aimodels] = await Promise.all([
            service.getProviderName(type),
            service.checkProviderHealth(type).catch(() => false),
            service.getProviderModels(type).catch(() => [] as AIModel[]),
          ]);
          const supportsStreaming = aimodels.some((m) => m.supportsStreaming);
          return {
            type,
            name,
            supportsStreaming,
            healthStatus: (isHealthy ? "healthy" : "unavailable") as "healthy" | "unavailable",
          };
        }),
      ).then((providerInfos) => {
        setProviders(providerInfos);
        if (providerInfos.length > 0) {
          setCurrentProvider(providerInfos[0].type);
        }
      }),
    );
  }, [getService]);

  useEffect(() => {
    const id = ++loadingRef.current;

    getService()
      .getProviderModels(currentProvider)
      .then((aimodels) => {
        if (loadingRef.current !== id) return;
        const modelInfos = aimodels.map((m) => ({ id: m.id, name: m.name }));
        setModels(modelInfos);
        if (modelInfos.length > 0) {
          setCurrentModel(modelInfos[0].id);
        }
      })
      .catch(() => {
        if (loadingRef.current === id) setModels([]);
      });
  }, [currentProvider, getService]);

  const setProvider = useCallback((type: ProviderType) => {
    setCurrentProvider(type);
  }, []);

  const setModel = useCallback((modelId: string) => {
    setCurrentModel(modelId);
  }, []);

  const refreshHealth = useCallback(async () => {
    const service = getService();
    const updated = await Promise.all(
      providers.map(async (p) => {
        const isHealthy = await service.checkProviderHealth(p.type).catch(() => false);
        return { ...p, healthStatus: (isHealthy ? "healthy" : "unavailable") as "healthy" | "unavailable" };
      }),
    );
    setProviders(updated);
  }, [getService, providers]);

  return {
    currentProvider,
    currentModel,
    providers,
    models,
    setProvider,
    setModel,
    refreshHealth,
  };
}
