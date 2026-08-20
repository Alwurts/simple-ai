import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";

const announcementVariants = cva(
  "inline-flex items-center rounded-full border bg-background px-3 py-1 font-medium backdrop-blur-sm",
  {
    variants: {
      size: {
        sm: "text-xs gap-1.5",
        lg: "text-sm gap-2",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

export function Announcement({
  size,
}: VariantProps<typeof announcementVariants> = {}) {
  return (
    <a className={announcementVariants({ size })} href="/blocks">
      <span className="mr-1 flex size-2 animate-pulse rounded-full bg-brand" />
      New full chat page
      <ArrowRightIcon className="size-3" />
    </a>
  );
}
