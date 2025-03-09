"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  ComponentType,
} from "react";
import { api, type RouterOutputs } from "~/trpc/react";

export interface Nugget {
  id: string;
  content: string;
}

interface NuggetContextType {
  createNugget: ({
    content,
  }: {
    content: string;
  }) => Promise<RouterOutputs["nugget"]["create"]>;
  updateNugget: (
    id: string,
    content: string,
  ) => Promise<RouterOutputs["nugget"]["update"]>;
  selectedNugget: Nugget | "create" | null;
  setSelectedNugget: (nugget: Nugget | "create" | null) => void;
}

const NuggetContext = createContext<NuggetContextType | undefined>(undefined);

export function NuggetProvider({ children }: { children: ReactNode }) {
  const [selectedNugget, setSelectedNugget] = useState<
    Nugget | "create" | null
  >(null);

  const createMutation = api.nugget.create.useMutation();
  const updateMutation = api.nugget.update.useMutation();

  const createNugget = async ({ content }: { content: string }) => {
    const result = await createMutation.mutateAsync({ content });
    return result;
  };

  const updateNugget = async (id: string, content: string) => {
    return updateMutation.mutateAsync({ id, content });
  };

  return (
    <NuggetContext.Provider
      value={{
        createNugget,
        updateNugget,
        selectedNugget,
        setSelectedNugget,
      }}
    >
      {children}
    </NuggetContext.Provider>
  );
}

export function useNugget() {
  const context = useContext(NuggetContext);
  if (context === undefined) {
    throw new Error("useNugget must be used within a NuggetProvider");
  }
  return context;
}

export function withNuggetContext<T extends object>(
  Component: ComponentType<T>,
) {
  return function WithNuggetContext(props: T) {
    return (
      <NuggetProvider>
        <Component {...props} />
      </NuggetProvider>
    );
  };
}
