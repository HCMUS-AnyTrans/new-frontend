import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Button asChild size="lg" className="rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm">
            <Link href="/">Go back home</Link>
          </Button>
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            Contact support
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  )
}
