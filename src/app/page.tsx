import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold text-primary">AnyTrans</h1>
          <div className="flex items-center gap-4">
            <Link href="/design-system">
              <Button variant="outline" size="sm">
                Design System
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

     
    </div>
  );
}
