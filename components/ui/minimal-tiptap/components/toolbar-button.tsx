import * as React from "react"
import type { TooltipContentProps } from "@radix-ui/react-tooltip"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"

interface ToolbarButtonProps extends React.ComponentProps<typeof Toggle> {
  isActive?: boolean
  tooltip?: string
  tooltipOptions?: TooltipContentProps
}

export const ToolbarButton = ({
  isActive,
  children,
  tooltip,
  className,
  tooltipOptions,
  ...props
}: ToolbarButtonProps) => {
  const toggleButton = (
    <Toggle className={cn("h-8 min-w-8 px-1.5 sm:px-2.5", { "bg-accent": isActive }, className)} {...props}>
      {children}
    </Toggle>
  )

  if (!tooltip) {
    return toggleButton
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
      <TooltipContent {...tooltipOptions}>
        <div className="flex flex-col items-center text-center">{tooltip}</div>
      </TooltipContent>
    </Tooltip>
  )
}

ToolbarButton.displayName = "ToolbarButton"

export default ToolbarButton
