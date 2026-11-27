"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { AssistantProductCard } from "@/features/ai-assistant/assistant-product-card";
import {
  runAssistantTurn,
  STARTER_PROMPTS,
} from "@/features/ai-assistant/assistant-service";
import { useAssistantStore } from "@/store/assistant-store";

function createMessageId() {
  return crypto.randomUUID();
}

export function AiAssistant() {
  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const dialogRef =
    useRef<HTMLElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [open, setOpen] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const messages =
    useAssistantStore(
      (state) =>
        state.messages,
    );

  const context =
    useAssistantStore(
      (state) =>
        state.context,
    );

  const addMessage =
    useAssistantStore(
      (state) =>
        state.addMessage,
    );

  const setContext =
    useAssistantStore(
      (state) =>
        state.setContext,
    );

  const clearConversation =
    useAssistantStore(
      (state) =>
        state.clearConversation,
    );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function closeAssistant() {
    setOpen(false);

    requestAnimationFrame(
      () =>
        triggerRef.current?.focus(),
    );
  }

  function handleDialogKeyDown(
    event:
      KeyboardEvent<HTMLElement>,
  ) {
    if (
      event.key ===
      "Escape"
    ) {
      event.preventDefault();
      closeAssistant();
      return;
    }

    if (
      event.key !== "Tab"
    ) {
      return;
    }

    const focusable =
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]',
      );

    if (
      !focusable ||
      focusable.length === 0
    ) {
      return;
    }

    const first =
      focusable[0];

    const last =
      focusable[
        focusable.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement ===
        first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement ===
        last
    ) {
      event.preventDefault();
      first.focus();
    }
  }

  async function send(
    value: string,
  ) {
    const message =
      value.trim();

    if (
      !message ||
      loading
    ) {
      return;
    }

    addMessage({
      id:
        createMessageId(),
      role: "user",
      text: message,
    });

    setInput("");
    setLoading(true);

    try {
      const result =
        await runAssistantTurn(
          message,
          context,
        );

      addMessage({
        id:
          createMessageId(),
        role:
          "assistant",
        text: result.text,
        products:
          result.products,
        suggestions:
          result.suggestions,
      });

      setContext(
        result.context,
      );
    } catch {
      addMessage({
        id:
          createMessageId(),
        role:
          "assistant",
        text:
          "I could not load product results right now. Please try that request again.",
        suggestions:
          STARTER_PROMPTS,
      });
    } finally {
      setLoading(false);
    }
  }

  function submit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void send(input);
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        size="lg"
        className="fixed bottom-5 right-5 z-40 rounded-full shadow-lg"
        aria-expanded={open}
        aria-controls="shopsphere-ai-assistant"
        onClick={() =>
          open
            ? closeAssistant()
            : setOpen(true)
        }
      >
        {open
          ? "Close Assistant"
          : "AI Shopping Assistant"}
      </Button>

      {open ? (
        <section
          ref={dialogRef}
          id="shopsphere-ai-assistant"
          role="dialog"
          aria-modal="true"
          aria-label="AI Shopping Assistant"
          onKeyDown={
            handleDialogKeyDown
          }
          className="fixed inset-x-3 bottom-20 z-50 flex max-h-[78vh] flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl sm:left-auto sm:right-5 sm:w-[30rem]"
        >
          <header className="border-b p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">
                  AI Shopping
                  Assistant
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Rule-Based /
                  Mock AI · No LLM
                  or paid AI API
                </p>
              </div>

              <div className="flex gap-1">
                {messages.length >
                0 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={
                      clearConversation
                    }
                  >
                    Clear
                  </Button>
                ) : null}

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={
                    closeAssistant
                  }
                >
                  Close
                </Button>
              </div>
            </div>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto p-4"
          >
            {messages.length ===
            0 ? (
              <div className="rounded-2xl bg-muted/60 p-4 text-sm leading-6">
                <p className="font-medium">
                  Tell me what you
                  want to shop for.
                </p>

                <p className="mt-1 text-muted-foreground">
                  I parse category,
                  price and rating
                  preferences into
                  structured filters.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {STARTER_PROMPTS.map(
                    (
                      prompt,
                    ) => (
                      <Button
                        key={
                          prompt
                        }
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          void send(
                            prompt,
                          )
                        }
                      >
                        {prompt}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {messages.map(
              (message) => (
                <article
                  key={
                    message.id
                  }
                  data-role={
                    message.role
                  }
                  className={`rounded-2xl p-3 text-sm leading-6 ${
                    message.role ===
                    "user"
                      ? "ml-10 bg-foreground text-background"
                      : "mr-6 bg-muted/70"
                  }`}
                >
                  <p>
                    {
                      message.text
                    }
                  </p>

                  {message.products &&
                  message.products
                    .length > 0 ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.products.map(
                        (
                          product,
                        ) => (
                          <AssistantProductCard
                            key={
                              product.id
                            }
                            product={
                              product
                            }
                          />
                        ),
                      )}
                    </div>
                  ) : null}

                  {message.suggestions &&
                  message.suggestions
                    .length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map(
                        (
                          suggestion,
                        ) => (
                          <Button
                            key={
                              suggestion
                            }
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              void send(
                                suggestion,
                              )
                            }
                          >
                            {
                              suggestion
                            }
                          </Button>
                        ),
                      )}
                    </div>
                  ) : null}
                </article>
              ),
            )}

            {loading ? (
              <div
                role="status"
                className="mr-16 rounded-2xl bg-muted/70 p-3 text-sm text-muted-foreground"
              >
                Understanding your
                shopping request…
              </div>
            ) : null}
          </div>

          <form
            onSubmit={submit}
            className="border-t p-3"
          >
            <label
              htmlFor="assistant-input"
              className="sr-only"
            >
              Shopping request
            </label>

            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="assistant-input"
                value={input}
                onChange={(
                  event,
                ) =>
                  setInput(
                    event.target
                      .value,
                  )
                }
                placeholder="e.g. headphones under 5000"
                className="h-10 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm"
              />

              <Button
                type="submit"
                disabled={
                  loading ||
                  !input.trim()
                }
              >
                Send
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  );
}
