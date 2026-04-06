import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  rightIconLabel?: string;
};

export default function Input({
  rightIcon,
  onRightIconClick,
  rightIconLabel = "Toggle field visibility",
  ...props
}: InputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        className="h-14 w-full rounded-full border border-zinc-200 bg-white px-6 text-sm text-zinc-900 outline-none transition focus:border-[#F4C9A6] focus:ring-4 focus:ring-[#F4C9A6]/20"
      />

      {rightIcon && (
        onRightIconClick ? (
          <button
            type="button"
            onClick={onRightIconClick}
            aria-label={rightIconLabel}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-600"
          >
            {rightIcon}
          </button>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
            {rightIcon}
          </div>
        )
      )}
    </div>
  );
}
