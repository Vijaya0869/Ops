import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Calendar } from "lucide-react";

export type TimePeriod = "1day" | "1week" | "1month" | "1year" | "ytd";

interface TimePeriodDropdownProps {
  value: TimePeriod;
  onValueChange: (value: TimePeriod) => void;
  className?: string;
}

const timePeriodLabels: Record<TimePeriod, string> = {
  "1day": "1 Day",
  "1week": "1 Week", 
  "1month": "1 Month",
  "1year": "1 Year",
  "ytd": "YTD"
};

export function TimePeriodDropdown({ 
  value, 
  onValueChange, 
  className = "" 
}: TimePeriodDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 ${className}`}
        >
          <Calendar className="h-4 w-4" />
          {timePeriodLabels[value]}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-32 bg-background border shadow-lg z-50"
      >
        {Object.entries(timePeriodLabels).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onValueChange(key as TimePeriod)}
            className="cursor-pointer hover:bg-accent"
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}