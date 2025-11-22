import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function DialogContent({
  className,
  children,
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div
      className={cn(
        "relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg sm:rounded-lg max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogTrigger({
  children,
  asChild,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<React.ButtonHTMLAttributes<HTMLElement>>;
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
        child.props.onClick?.(e);
      },
    } as React.HTMLAttributes<HTMLElement>);
  }
  
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
}
