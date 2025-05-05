
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile";

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isMobile = useIsMobile();
  
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0 pointer-events-auto w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
        month: "space-y-0 w-full",
        caption: "flex justify-center pt-2 pb-2 relative items-center bg-transparent",
        caption_label: cn("text-sm font-medium", isMobile && "text-xs"),
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          isMobile && "h-6 w-6"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-0",
        head_row: "flex w-full",
        head_cell: cn(
          "text-muted-foreground rounded-none w-full font-medium text-[0.8rem] py-2",
          isMobile && "text-[0.7rem]"
        ),
        row: "flex w-full",
        cell: cn(
          "relative p-0 aspect-square text-center text-sm focus-within:relative focus-within:z-20",
          isMobile && "text-xs"
        ),
        day: cn(
          "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-muted",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary/10 text-primary font-bold hover:bg-primary/20 hover:text-primary focus:bg-primary/20 focus:text-primary",
        day_today: "bg-none text-foreground font-bold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className={isMobile ? "h-4 w-4" : "h-5 w-5"} />,
        IconRight: ({ ...props }) => <ChevronRight className={isMobile ? "h-4 w-4" : "h-5 w-5"} />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
