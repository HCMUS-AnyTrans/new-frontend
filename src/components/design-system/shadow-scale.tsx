export function ShadowScale() {
  const shadows = [
    { name: "sm", className: "shadow-sm", description: "Subtle shadow for small elements" },
    { name: "default", className: "shadow", description: "Default shadow for cards" },
    { name: "md", className: "shadow-md", description: "Medium shadow for elevated elements" },
    { name: "lg", className: "shadow-lg", description: "Large shadow for modals" },
    { name: "xl", className: "shadow-xl", description: "Extra large shadow for popovers" },
    { name: "2xl", className: "shadow-2xl", description: "Maximum shadow for dialogs" },
    { name: "inner", className: "shadow-inner", description: "Inset shadow for inputs" },
    { name: "none", className: "shadow-none", description: "No shadow" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Shadows</h2>
        <p className="text-muted-foreground mb-8">
          Box shadow scale for creating depth and elevation in the UI.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {shadows.map((shadow) => (
          <div key={shadow.name} className="text-center">
            <div
              className={`w-full h-24 bg-card rounded-lg ${shadow.className} mb-3 border`}
            />
            <p className="font-medium">{shadow.name}</p>
            <code className="text-xs text-muted-foreground">{shadow.className}</code>
          </div>
        ))}
      </div>

      {/* Shadow Examples */}
      <div className="space-y-4 mt-8">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Use Cases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium">Cards & Containers</h4>
            <div className="p-4 bg-card rounded-lg shadow-sm border">
              <p className="text-sm">shadow-sm - Subtle cards</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-md">
              <p className="text-sm">shadow-md - Elevated cards</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Buttons & Interactive</h4>
            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-sm hover:shadow-md transition-shadow">
              Hover for shadow-md
            </button>
            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg shadow-md hover:shadow-lg transition-shadow">
              Hover for shadow-lg
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Modals & Overlays</h4>
            <div className="p-4 bg-card rounded-xl shadow-xl">
              <p className="text-sm font-medium mb-1">Modal Preview</p>
              <p className="text-xs text-muted-foreground">shadow-xl for modals</p>
            </div>
            <div className="p-4 bg-card rounded-xl shadow-2xl">
              <p className="text-sm font-medium mb-1">Dialog Preview</p>
              <p className="text-xs text-muted-foreground">shadow-2xl for dialogs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark mode note */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Shadows are more subtle in dark mode. Consider using borders 
          or slightly elevated backgrounds for better visibility in dark themes.
        </p>
      </div>
    </div>
  );
}
