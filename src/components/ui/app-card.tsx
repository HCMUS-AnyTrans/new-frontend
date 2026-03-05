import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const appCardVariants = cva(
  "rounded-md border border-[#E5E5E5] bg-white text-[#1A202C] shadow-none gap-0 py-0",
  {
    variants: {
      interactive: {
        true: "cursor-pointer transition-colors duration-200 hover:bg-[#FAFAFA]",
        false: "",
      },
    },
    defaultVariants: {
      interactive: false,
    },
  }
);

const appCardContentVariants = cva("", {
  variants: {
    padding: {
      default: "px-6 pb-6 pt-0",
      all: "p-6",
      none: "p-0",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

type AppCardProps = React.ComponentProps<typeof Card> &
  VariantProps<typeof appCardVariants>;

type AppCardContentProps = React.ComponentProps<typeof CardContent> &
  VariantProps<typeof appCardContentVariants>;

export function AppCard({ className, interactive, ...props }: AppCardProps) {
  return (
    <Card className={cn(appCardVariants({ interactive }), className)} {...props} />
  );
}

export function AppCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("px-6 pt-6 pb-2", className)} {...props} />;
}

export function AppCardContent({
  className,
  padding,
  ...props
}: AppCardContentProps) {
  return (
    <CardContent
      className={cn(appCardContentVariants({ padding }), className)}
      {...props}
    />
  );
}
