"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorSwatchProps {
  name: string;
  variable: string;
  className: string;
}

function ColorSwatch({ name, variable, className }: ColorSwatchProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-lg border border-border shadow-sm ${className}`}
            />
            <span className="text-xs font-medium">{name}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <code className="text-xs">{variable}</code>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ColorScaleProps {
  title: string;
  colors: { name: string; variable: string; className: string }[];
}

function ColorScale({ title, colors }: ColorScaleProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <ColorSwatch key={color.variable} {...color} />
        ))}
      </div>
    </div>
  );
}

export function ColorPalette() {
  const primaryColors = [
    { name: "50", variable: "--primary-50", className: "bg-primary-50" },
    { name: "100", variable: "--primary-100", className: "bg-primary-100" },
    { name: "200", variable: "--primary-200", className: "bg-primary-200" },
    { name: "300", variable: "--primary-300", className: "bg-primary-300" },
    { name: "400", variable: "--primary-400", className: "bg-primary-400" },
    { name: "500", variable: "--primary-500", className: "bg-primary-500" },
    { name: "600", variable: "--primary-600", className: "bg-primary-600" },
    { name: "700", variable: "--primary-700", className: "bg-primary-700" },
    { name: "800", variable: "--primary-800", className: "bg-primary-800" },
    { name: "900", variable: "--primary-900", className: "bg-primary-900" },
  ];

  const secondaryColors = [
    { name: "50", variable: "--secondary-50", className: "bg-secondary-50" },
    { name: "100", variable: "--secondary-100", className: "bg-secondary-100" },
    { name: "200", variable: "--secondary-200", className: "bg-secondary-200" },
    { name: "300", variable: "--secondary-300", className: "bg-secondary-300" },
    { name: "400", variable: "--secondary-400", className: "bg-secondary-400" },
    { name: "500", variable: "--secondary-500", className: "bg-secondary-500" },
    { name: "600", variable: "--secondary-600", className: "bg-secondary-600" },
    { name: "700", variable: "--secondary-700", className: "bg-secondary-700" },
    { name: "800", variable: "--secondary-800", className: "bg-secondary-800" },
    { name: "900", variable: "--secondary-900", className: "bg-secondary-900" },
  ];

  const accentColors = [
    { name: "50", variable: "--accent-50", className: "bg-accent-50" },
    { name: "100", variable: "--accent-100", className: "bg-accent-100" },
    { name: "200", variable: "--accent-200", className: "bg-accent-200" },
    { name: "300", variable: "--accent-300", className: "bg-accent-300" },
    { name: "400", variable: "--accent-400", className: "bg-accent-400" },
    { name: "500", variable: "--accent-500", className: "bg-accent-500" },
    { name: "600", variable: "--accent-600", className: "bg-accent-600" },
    { name: "700", variable: "--accent-700", className: "bg-accent-700" },
    { name: "800", variable: "--accent-800", className: "bg-accent-800" },
    { name: "900", variable: "--accent-900", className: "bg-accent-900" },
  ];

  const semanticColors = [
    { name: "Success", variable: "--success", className: "bg-success" },
    { name: "Warning", variable: "--warning", className: "bg-warning" },
    { name: "Info", variable: "--info", className: "bg-info" },
    { name: "Destructive", variable: "--destructive", className: "bg-destructive" },
  ];

  const neutralColors = [
    { name: "Background", variable: "--background", className: "bg-background" },
    { name: "Foreground", variable: "--foreground", className: "bg-foreground" },
    { name: "Card", variable: "--card", className: "bg-card" },
    { name: "Muted", variable: "--muted", className: "bg-muted" },
    { name: "Border", variable: "--border", className: "bg-border" },
    { name: "Input", variable: "--input", className: "bg-input" },
    { name: "Ring", variable: "--ring", className: "bg-ring" },
    { name: "Overlay", variable: "--overlay", className: "bg-overlay" },
    { name: "Disabled", variable: "--disabled", className: "bg-disabled" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Colors</h2>
        <p className="text-muted-foreground mb-8">
          Brand color palette with full scale from 50 to 900. Hover over each swatch to see the CSS variable.
        </p>
      </div>

      <ColorScale title="Primary (Navy Blue)" colors={primaryColors} />
      <ColorScale title="Secondary (Amber/Gold)" colors={secondaryColors} />
      <ColorScale title="Accent (Sky Blue)" colors={accentColors} />
      <ColorScale title="Semantic" colors={semanticColors} />
      <ColorScale title="Neutrals" colors={neutralColors} />
    </div>
  );
}
