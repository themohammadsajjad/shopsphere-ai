"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type {
  AssistantContext,
  AssistantMessage,
} from "@/types/assistant";

type AssistantState = {
  messages:
    AssistantMessage[];
  context:
    AssistantContext;

  addMessage: (
    message:
      AssistantMessage,
  ) => void;

  setContext: (
    context:
      AssistantContext,
  ) => void;

  clearConversation:
    () => void;
};

const emptyContext:
  AssistantContext = {
    lastProducts: [],
  };

export const useAssistantStore =
  create<AssistantState>()(
    persist(
      (set) => ({
        messages: [],
        context:
          emptyContext,

        addMessage:
          (message) =>
            set((state) => ({
              messages: [
                ...state.messages,
                message,
              ],
            })),

        setContext:
          (context) =>
            set({ context }),

        clearConversation:
          () =>
            set({
              messages: [],
              context:
                emptyContext,
            }),
      }),
      {
        name:
          "shopsphere-ai-assistant",
        storage:
          createJSONStorage(
            () =>
              sessionStorage,
          ),
      },
    ),
  );
