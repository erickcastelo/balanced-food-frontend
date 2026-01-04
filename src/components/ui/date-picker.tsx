import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  disabled,
  className,
}: DatePickerProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
        </Button>
      </Popover.Trigger>

      <Popover.Content
        align="start"
        className="z-50 mt-2 rounded-md border bg-background p-2 shadow-md"
      >
        <DayPicker
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={ptBR}
          initialFocus
          classNames={{
            months: "flex flex-col space-y-2",
            month: "space-y-2",
            caption: "flex justify-between items-center px-2",
            nav: "flex items-center gap-1",
            nav_button:
              "h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell:
              "w-9 text-xs font-normal text-muted-foreground text-center",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative",
            day: cn(
              "h-9 w-9 rounded-md p-0 font-normal",
              "hover:bg-accent hover:text-accent-foreground"
            ),
            day_selected: "bg-primary text-primary-foreground hover:bg-primary",
            day_today: "border border-primary",
            day_outside: "text-muted-foreground opacity-50",
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
