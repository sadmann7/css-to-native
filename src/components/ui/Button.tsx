import LoadingDots from "@/components/ui/LoadingDots";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  variant?: "primary" | "white" | "gray" | "ghost";
  isLoading?: boolean;
  loadingVariant?: "spinner" | "dots";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      isLoading = false,
      loadingVariant = "spinner",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          "flex h-10 w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70",
          variant === "primary" && "bg-blue-600 text-gray-50 hover:bg-blue-700",
          variant === "white" && "bg-gray-50 text-gray-900 hover:bg-gray-200",
          variant === "gray" && "bg-gray-700 text-gray-50 hover:bg-gray-700/70",
          variant === "ghost" &&
            "bg-transparent hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100",
          className
        )}
        {...props}
      >
        {isLoading ? (
          loadingVariant === "spinner" ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <LoadingDots
              color={variant === "primary" ? "#f9fafb" : "#111827"}
              size="large"
            />
          )
        ) : (
          props.children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
