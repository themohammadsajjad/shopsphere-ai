export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
      <div
        className="shopsphere-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div
        className="glow-orb pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/30"
        aria-hidden="true"
      />
      <div
        className="glow-orb pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-400/25"
        aria-hidden="true"
      />

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            Frontend foundation ready
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Personalized shopping, powered by intelligence
          </p>

          <h1 className="text-balance text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            ShopSphere
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              {" "}
              AI
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            A modern commerce experience built around transparent
            recommendations, smarter discovery, and a shopping journey that
            adapts to real customer signals.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border bg-card/70 px-3 py-1.5">
              Next.js + TypeScript
            </span>
            <span className="rounded-full border bg-card/70 px-3 py-1.5">
              Recommendation-ready
            </span>
            <span className="rounded-full border bg-card/70 px-3 py-1.5">
              Frontend-only architecture
            </span>
          </div>
        </div>

        <div className="depth-scene relative mx-auto w-full max-w-md">
          <div
            className="depth-card glass-panel relative overflow-hidden rounded-[2rem] p-7"
            aria-hidden="true"
          >
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-cyan-400/20 blur-2xl" />

            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
                <div className="mt-3 h-2 w-16 rounded-full bg-foreground/5" />
              </div>
              <div className="h-10 w-10 rounded-2xl bg-primary/15" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border bg-background/60 p-4 shadow-sm">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-cyan-200/80 to-blue-300/40" />
                <div className="mt-4 h-2.5 w-3/4 rounded-full bg-foreground/10" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-foreground/5" />
              </div>

              <div className="mt-7 rounded-3xl border bg-background/60 p-4 shadow-sm">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-200/80 to-fuchsia-300/40" />
                <div className="mt-4 h-2.5 w-2/3 rounded-full bg-foreground/10" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-foreground/5" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border bg-primary/8 p-4">
              <div className="h-2.5 w-32 rounded-full bg-primary/25" />
              <div className="mt-3 h-2 w-full rounded-full bg-foreground/5" />
              <div className="mt-2 h-2 w-4/5 rounded-full bg-foreground/5" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
