"use client";

import {
  useState,
} from "react";

import { Button } from "@/components/ui/button";

export function DeliveryEstimate() {
  const [pinCode, setPinCode] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function checkDelivery() {
    if (
      !/^[1-9][0-9]{5}$/.test(
        pinCode,
      )
    ) {
      setMessage("");
      setError(
        "Enter a valid 6-digit Indian PIN code.",
      );
      return;
    }

    const lastDigit =
      Number(
        pinCode.at(-1),
      ) || 0;

    const minimumDays =
      2 + (lastDigit % 3);

    setError("");
    setMessage(
      `Estimated delivery in ${minimumDays}–${minimumDays + 2} business days.`,
    );
  }

  return (
    <section className="glass-panel rounded-3xl border p-5 sm:p-7">
      <h2 className="text-xl font-semibold">
        Delivery information
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Enter your PIN code for a
        simulated delivery
        estimate.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pinCode}
          aria-label="Delivery PIN code"
          placeholder="e.g. 144411"
          onChange={(event) =>
            setPinCode(
              event.target.value.replace(
                /\D/g,
                "",
              ),
            )
          }
          className="h-10 min-w-0 flex-1 rounded-xl border bg-background/70 px-3 text-sm outline-none transition focus:border-foreground"
        />

        <Button
          type="button"
          variant="outline"
          onClick={checkDelivery}
        >
          Check delivery
        </Button>
      </div>

      {error ? (
        <p
          className="mt-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p
          className="mt-3 text-sm font-medium"
          role="status"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
