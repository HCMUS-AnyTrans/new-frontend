export function SpacingScale() {
  const spacings = [
    { name: "0", value: "0px", className: "w-0" },
    { name: "0.5", value: "2px", className: "w-0.5" },
    { name: "1", value: "4px", className: "w-1" },
    { name: "1.5", value: "6px", className: "w-1.5" },
    { name: "2", value: "8px", className: "w-2" },
    { name: "2.5", value: "10px", className: "w-2.5" },
    { name: "3", value: "12px", className: "w-3" },
    { name: "4", value: "16px", className: "w-4" },
    { name: "5", value: "20px", className: "w-5" },
    { name: "6", value: "24px", className: "w-6" },
    { name: "8", value: "32px", className: "w-8" },
    { name: "10", value: "40px", className: "w-10" },
    { name: "12", value: "48px", className: "w-12" },
    { name: "16", value: "64px", className: "w-16" },
    { name: "20", value: "80px", className: "w-20" },
    { name: "24", value: "96px", className: "w-24" },
    { name: "32", value: "128px", className: "w-32" },
    { name: "40", value: "160px", className: "w-40" },
    { name: "48", value: "192px", className: "w-48" },
    { name: "64", value: "256px", className: "w-64" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Spacing</h2>
        <p className="text-muted-foreground mb-8">
          Consistent spacing scale based on 4px grid. Used for padding, margin, and gap.
        </p>
      </div>

      <div className="space-y-2">
        {spacings.map((spacing) => (
          <div
            key={spacing.name}
            className="flex items-center gap-4 p-2 rounded hover:bg-muted/50 transition-colors"
          >
            <code className="w-12 text-sm text-muted-foreground">{spacing.name}</code>
            <code className="w-16 text-sm text-muted-foreground">{spacing.value}</code>
            <div className="flex-1 flex items-center">
              <div
                className={`h-4 bg-primary rounded ${spacing.className}`}
                style={{ minWidth: spacing.value === "0px" ? "2px" : undefined }}
              />
            </div>
            <code className="text-xs text-muted-foreground">
              p-{spacing.name}, m-{spacing.name}, gap-{spacing.name}
            </code>
          </div>
        ))}
      </div>

      {/* Spacing Examples */}
      <div className="space-y-4 mt-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Usage Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-3">Padding</h4>
            <div className="space-y-2">
              <div className="bg-primary-100 dark:bg-primary-800 rounded">
                <div className="p-2 bg-primary-200 dark:bg-primary-700 rounded text-xs">p-2</div>
              </div>
              <div className="bg-primary-100 dark:bg-primary-800 rounded">
                <div className="p-4 bg-primary-200 dark:bg-primary-700 rounded text-xs">p-4</div>
              </div>
              <div className="bg-primary-100 dark:bg-primary-800 rounded">
                <div className="p-6 bg-primary-200 dark:bg-primary-700 rounded text-xs">p-6</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-3">Gap</h4>
            <div className="space-y-3">
              <div className="flex gap-1">
                <div className="w-8 h-8 bg-secondary rounded" />
                <div className="w-8 h-8 bg-secondary rounded" />
                <div className="w-8 h-8 bg-secondary rounded" />
              </div>
              <code className="text-xs text-muted-foreground">gap-1</code>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-secondary rounded" />
                <div className="w-8 h-8 bg-secondary rounded" />
                <div className="w-8 h-8 bg-secondary rounded" />
              </div>
              <code className="text-xs text-muted-foreground">gap-4</code>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-3">Margin</h4>
            <div className="bg-accent-100 dark:bg-accent-800 p-4 rounded">
              <div className="mb-2 bg-accent-300 dark:bg-accent-600 p-2 rounded text-xs">mb-2</div>
              <div className="mb-4 bg-accent-300 dark:bg-accent-600 p-2 rounded text-xs">mb-4</div>
              <div className="bg-accent-300 dark:bg-accent-600 p-2 rounded text-xs">no margin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
