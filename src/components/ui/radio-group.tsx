"use client"

import * as React from "react"
import { cn } from "cn"

interface RadioGroupProps extends React.ComponentProps<"div"> {
  value?: string;
  onValueChange?: (value: string) => void;
}

function RadioGroup({
  className,
  value,
  onValueChange,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <div
      data-slot="radio-group"
      role="radiogroup"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<RadioGroupItemProps>(child) || typeof child.props.value !== 'string') return child;
        const itemProps = child.props;
        return React.cloneElement(child, {
          checked: value === itemProps.value,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            itemProps.onChange?.(event);
            onValueChange?.(itemProps.value);
          },
        });
      })}
    </div>
  )
}

interface RadioGroupItemProps extends Omit<React.ComponentProps<"input">, "type"> {
  value: string;
  onCheckedChange?: (checked: boolean) => void;
}

function RadioGroupItem({
  className,
  value: itemValue,
  id,
  ...props
}: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      data-slot="radio-group-item"
      id={id}
      value={itemValue}
      className={cn(
        "aspect-square h-4 w-4 shrink-0 rounded-full border border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-blue-600",
        className
      )}
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
