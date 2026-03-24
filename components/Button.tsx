"use client";
import { twMerge as tm } from "tailwind-merge";

import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps } from "react";

const buttonStyles = cva(["transition-colors"], {

  variants: {
    variant: {
      default: ["bg-secondary", "text-white", "hover:bg-primary", "hover:text-white"],
      ghost: ["btn-ghost", "hover:bg-base-300", "hover:text-secondary"],
      active: ["border", "border-primary", "text-primary", "hover:bg-primary/10"],
    },
    size: {
      default: ["rounded", "p-2",],
      icon: [
      "rounded-full",
      "w-10",
      "h-10",
      "flex",
      "items-center",
      "justify-center",
      "p-2",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button"> & {
  onClick?: () => void;
  children: React.ReactNode;
};

export default function Button({
  variant, 
  size,
  className,
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      // Here i use tailwind-merge to merge the tailwind classes
      className={tm(buttonStyles({ variant, size }), className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}


