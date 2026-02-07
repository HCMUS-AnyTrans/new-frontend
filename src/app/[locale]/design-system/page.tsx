import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ColorPalette,
  TypographyScale,
  SpacingScale,
  RadiusScale,
  ShadowScale,
  ComponentShowcase,
} from "@/components/design-system";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function DesignSystemPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-semibold text-primary hover:text-primary-600"
            >
              Home
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold">Design System</h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex gap-6 overflow-x-auto py-3">
            <a
              href="#colors"
              className="text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
            >
              Colors
            </a>
            <a
              href="#typography"
              className="text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
            >
              Typography
            </a>
            <a
              href="#spacing"
              className="text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
            >
              Spacing
            </a>
            <a
              href="#radius"
              className="text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
            >
              Border Radius
            </a>
            <a
              href="#shadows"
              className="text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
            >
              Shadows
            </a>
            <a
              href="#components"
              className="text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap"
            >
              Components
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-16">
          {/* Intro */}
          <section>
            <h1 className="text-4xl font-bold mb-4">Design Tokens</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              This page documents all design tokens used in the application.
              These tokens serve as the single source of truth for colors,
              typography, spacing, and other visual properties. All components
              are built using these tokens to ensure consistency across the
              entire application.
            </p>
          </section>

          <Separator />

          {/* Colors Section */}
          <section id="colors" className="scroll-mt-32">
            <ColorPalette />
          </section>

          <Separator />

          {/* Typography Section */}
          <section id="typography" className="scroll-mt-32">
            <TypographyScale />
          </section>

          <Separator />

          {/* Spacing Section */}
          <section id="spacing" className="scroll-mt-32">
            <SpacingScale />
          </section>

          <Separator />

          {/* Border Radius Section */}
          <section id="radius" className="scroll-mt-32">
            <RadiusScale />
          </section>

          <Separator />

          {/* Shadows Section */}
          <section id="shadows" className="scroll-mt-32">
            <ShadowScale />
          </section>

          <Separator />

          {/* Components Section */}
          <section id="components" className="scroll-mt-32">
            <ComponentShowcase />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          <p>Design System Documentation</p>
          <p className="mt-1">
            Built with{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              shadcn/ui
            </a>{" "}
            and{" "}
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Tailwind CSS
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
