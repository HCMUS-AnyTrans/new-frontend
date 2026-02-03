export function TypographyScale() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Typography</h2>
        <p className="text-muted-foreground mb-8">
          Font families, sizes, and weights used throughout the design system.
        </p>
      </div>

      {/* Font Families */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Font Families
        </h3>
        <div className="grid gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <p className="font-sans text-lg">
              Geist Sans - The quick brown fox jumps over the lazy dog
            </p>
            <code className="text-xs text-muted-foreground">font-sans / --font-geist-sans</code>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <p className="font-mono text-lg">
              Geist Mono - The quick brown fox jumps over the lazy dog
            </p>
            <code className="text-xs text-muted-foreground">font-mono / --font-geist-mono</code>
          </div>
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Headings
        </h3>
        <div className="space-y-4 p-6 rounded-lg border bg-card">
          <div className="flex items-baseline justify-between border-b pb-3">
            <h1 className="text-5xl font-bold">Heading 1</h1>
            <code className="text-xs text-muted-foreground">text-5xl font-bold</code>
          </div>
          <div className="flex items-baseline justify-between border-b pb-3">
            <h2 className="text-4xl font-bold">Heading 2</h2>
            <code className="text-xs text-muted-foreground">text-4xl font-bold</code>
          </div>
          <div className="flex items-baseline justify-between border-b pb-3">
            <h3 className="text-3xl font-semibold">Heading 3</h3>
            <code className="text-xs text-muted-foreground">text-3xl font-semibold</code>
          </div>
          <div className="flex items-baseline justify-between border-b pb-3">
            <h4 className="text-2xl font-semibold">Heading 4</h4>
            <code className="text-xs text-muted-foreground">text-2xl font-semibold</code>
          </div>
          <div className="flex items-baseline justify-between border-b pb-3">
            <h5 className="text-xl font-medium">Heading 5</h5>
            <code className="text-xs text-muted-foreground">text-xl font-medium</code>
          </div>
          <div className="flex items-baseline justify-between">
            <h6 className="text-lg font-medium">Heading 6</h6>
            <code className="text-xs text-muted-foreground">text-lg font-medium</code>
          </div>
        </div>
      </div>

      {/* Body Text */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Body Text
        </h3>
        <div className="space-y-4 p-6 rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b pb-3">
            <p className="text-lg">Large body text</p>
            <code className="text-xs text-muted-foreground">text-lg</code>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <p className="text-base">Base body text (default)</p>
            <code className="text-xs text-muted-foreground">text-base</code>
          </div>
          <div className="flex items-center justify-between border-b pb-3">
            <p className="text-sm">Small body text</p>
            <code className="text-xs text-muted-foreground">text-sm</code>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs">Extra small text</p>
            <code className="text-xs text-muted-foreground">text-xs</code>
          </div>
        </div>
      </div>

      {/* Font Weights */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Font Weights
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="font-light text-2xl mb-2">Aa</p>
            <code className="text-xs text-muted-foreground">font-light (300)</code>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="font-normal text-2xl mb-2">Aa</p>
            <code className="text-xs text-muted-foreground">font-normal (400)</code>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="font-medium text-2xl mb-2">Aa</p>
            <code className="text-xs text-muted-foreground">font-medium (500)</code>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="font-semibold text-2xl mb-2">Aa</p>
            <code className="text-xs text-muted-foreground">font-semibold (600)</code>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="font-bold text-2xl mb-2">Aa</p>
            <code className="text-xs text-muted-foreground">font-bold (700)</code>
          </div>
          <div className="p-4 rounded-lg border bg-card text-center">
            <p className="font-extrabold text-2xl mb-2">Aa</p>
            <code className="text-xs text-muted-foreground">font-extrabold (800)</code>
          </div>
        </div>
      </div>
    </div>
  );
}
