"use client"

import * as React from "react"
import * as Select1Primitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select1 = Select1Primitive.Root

const Select1Group = Select1Primitive.Group

const Select1Value = Select1Primitive.Value

const Select1Trigger = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <Select1Primitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-xl  border-input bg-zinc-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <Select1Primitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Select1Primitive.Icon>
  </Select1Primitive.Trigger>
))
Select1Trigger.displayName = Select1Primitive.Trigger.displayName

const Select1ScrollUpButton = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <Select1Primitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </Select1Primitive.ScrollUpButton>
))
Select1ScrollUpButton.displayName = Select1Primitive.ScrollUpButton.displayName

const Select1ScrollDownButton = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <Select1Primitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </Select1Primitive.ScrollDownButton>
))
Select1ScrollDownButton.displayName =
  Select1Primitive.ScrollDownButton.displayName

const Select1Content = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <Select1Primitive.Portal>
    <Select1Primitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <Select1ScrollUpButton />
      <Select1Primitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select1-trigger-height)] w-full min-w-[var(--radix-select1-trigger-width)]"
        )}
      >
        {children}
      </Select1Primitive.Viewport>
      <Select1ScrollDownButton />
    </Select1Primitive.Content>
  </Select1Primitive.Portal>
))
Select1Content.displayName = Select1Primitive.Content.displayName

const Select1Label = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.Label>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.Label>
>(({ className, ...props }, ref) => (
  <Select1Primitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
Select1Label.displayName = Select1Primitive.Label.displayName

const Select1Item = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.Item>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.Item>
>(({ className, children, ...props }, ref) => (
  <Select1Primitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select1-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Select1Primitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </Select1Primitive.ItemIndicator>
    </span>

    <Select1Primitive.ItemText>{children}</Select1Primitive.ItemText>
  </Select1Primitive.Item>
))
Select1Item.displayName = Select1Primitive.Item.displayName

const Select1Separator = React.forwardRef<
  React.ElementRef<typeof Select1Primitive.Separator>,
  React.ComponentPropsWithoutRef<typeof Select1Primitive.Separator>
>(({ className, ...props }, ref) => (
  <Select1Primitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
Select1Separator.displayName = Select1Primitive.Separator.displayName

export {
  Select1,
  Select1Group,
  Select1Value,
  Select1Trigger,
  Select1Content,
  Select1Label,
  Select1Item,
  Select1Separator,
  Select1ScrollUpButton,
  Select1ScrollDownButton,
}
