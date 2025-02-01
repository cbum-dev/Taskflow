"use client"

import React from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  selected: Date | null
  onChange: (date: Date) => void
  className?: string
}

function Calendar({ selected, onChange, className }: CalendarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        calendarClassName="bg-white shadow-lg rounded-md p-2"
        dateFormat="MMMM d, yyyy"
        popperPlacement="bottom-start"
      />
      <Button
        variant="ghost"
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-2"
      >
        <CalendarIcon className="w-5 h-5 text-gray-500" />
      </Button>
    </div>
  )
}

export { Calendar }
