export function RadiusScale() {
  const radiuses = [
    { name: "none", value: "0px", className: "rounded-none" },
    { name: "sm", value: "calc(0.75rem - 4px)", className: "rounded-sm" },
    { name: "md", value: "calc(0.75rem - 2px)", className: "rounded-md" },
    { name: "lg", value: "0.75rem", className: "rounded-lg" },
    { name: "xl", value: "calc(0.75rem + 4px)", className: "rounded-xl" },
    { name: "2xl", value: "calc(0.75rem + 8px)", className: "rounded-2xl" },
    { name: "3xl", value: "calc(0.75rem + 12px)", className: "rounded-3xl" },
    { name: "full", value: "9999px", className: "rounded-full" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Border Radius</h2>
        <p className="text-muted-foreground mb-8">
          Consistent border radius scale. Base radius is 0.75rem (12px).
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {radiuses.map((radius) => (
          <div key={radius.name} className="text-center">
            <div
              className={`w-24 h-24 mx-auto bg-primary ${radius.className} mb-3`}
            />
            <p className="font-medium">{radius.name}</p>
            <code className="text-xs text-muted-foreground">{radius.className}</code>
          </div>
        ))}
      </div>

      {/* Applied Examples */}
      <div className="space-y-4 mt-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Applied Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-3">Buttons</h4>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-sm text-sm">
                rounded-sm
              </button>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                rounded-md
              </button>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                rounded-lg
              </button>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm">
                rounded-full
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-3">Cards</h4>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg text-sm">
                Card with rounded-lg
              </div>
              <div className="p-3 bg-muted rounded-xl text-sm">
                Card with rounded-xl
              </div>
              <div className="p-3 bg-muted rounded-2xl text-sm">
                Card with rounded-2xl
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <h4 className="font-medium mb-3">Avatars</h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-md" />
              <div className="w-12 h-12 bg-secondary rounded-lg" />
              <div className="w-12 h-12 bg-secondary rounded-xl" />
              <div className="w-12 h-12 bg-secondary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
