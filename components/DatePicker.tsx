"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Date of Birth",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || new Date(2004, 3) // April 2004 (month is 0-indexed)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return placeholder;
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onChange(formatDate(newDate));
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const previousMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1
    );
    // Don't allow going before January 1950
    if (newMonth.getFullYear() >= 1950) {
      setCurrentMonth(newMonth);
    }
  };

  const nextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13);
    maxDate.setHours(23, 59, 59, 999); // End of that day
    // Don't allow going to months that would let user select dates making them younger than 13
    const lastDayOfNewMonth = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);
    if (lastDayOfNewMonth <= maxDate) {
      setCurrentMonth(newMonth);
    }
  };

  const isNextMonthDisabled = () => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1
    );
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13);
    maxDate.setHours(23, 59, 59, 999);
    // Disable if the last day of next month is after the max allowed date
    const lastDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
    return lastDayOfNextMonth > maxDate;
  };

  const isPrevMonthDisabled = () => {
    return currentMonth.getFullYear() <= 1950 && currentMonth.getMonth() === 0;
  };

  const getAvailableYears = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13);
    const maxYear = maxDate.getFullYear();
    const minYear = 1950;
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleYearSelect = (year: number) => {
    const newMonth = new Date(year, currentMonth.getMonth());
    setCurrentMonth(newMonth);
    
    // If there's a selected date, update it to the new year while keeping the same month and day
    if (selectedDate) {
      const newDate = new Date(
        year,
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      
      // Validate the new date is within allowed range
      const maxAllowedDate = new Date();
      maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() - 13);
      maxAllowedDate.setHours(23, 59, 59, 999);
      
      if (newDate <= maxAllowedDate && year >= 1950) {
        setSelectedDate(newDate);
        onChange(formatDate(newDate));
      }
    }
    
    setIsYearDropdownOpen(false);
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    const prevMonthDays = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    ).getDate();

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          type="button"
          className="p-1.5 text-[#B0B0B0] dark:text-[#5A5A5A] text-xs hover:bg-gray-50 dark:hover:bg-[#1C1C1C] rounded-md"
          onClick={() => {
            previousMonth();
            handleDateClick(prevMonthDays - i);
          }}
        >
          {prevMonthDays - i}
        </button>
      );
    }

    // Current month days
    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(maxAllowedDate.getFullYear() - 13);
    maxAllowedDate.setHours(23, 59, 59, 999);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      dayDate.setHours(0, 0, 0, 0);
      
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      const isTooRecent = dayDate > maxAllowedDate; // Person would be younger than 13
      const isPastLimit = currentMonth.getFullYear() < 1950;
      const isDisabled = isTooRecent || isPastLimit;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateClick(day)}
          disabled={isDisabled}
          className={`p-1.5 text-xs rounded-md transition-colors border border-transparent cursor-pointer ${
            isDisabled
              ? "text-[#D9D9D9] dark:text-[#333333] cursor-not-allowed"
              : isSelected
              ? "bg-[#E8D5FF] dark:bg-[#1C1C1C] dark:border-gray-500 text-[#39089D] dark:text-white font-medium"
              : "text-[#1A1A1A] dark:text-white hover:bg-gray-50 dark:hover:bg-[#1C1C1C]"
          }`}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <button
          key={`next-${i}`}
          type="button"
          className="p-1.5 text-[#B0B0B0] dark:text-[#5A5A5A] text-xs hover:bg-gray-50 dark:hover:bg-[#1C1C1C] rounded-md"
          onClick={() => {
            nextMonth();
            handleDateClick(i);
          }}
        >
          {i}
        </button>
      );
    }

    return days;
  };

  const monthYearDisplay = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-4 pr-12 text-xs outline-0 backdrop-blur-sm border border-[#D9D9D9] dark:border-[#333333] rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between ${
          !selectedDate ? "text-[#5A5A5A]" : "text-[#1A1A1A] dark:text-white"
        } ${className}`}
      >
        <span>{formatDisplayDate(selectedDate)}</span>
        <Calendar className="absolute right-4 size-5 text-[#B0B0B0] dark:text-[#5A5A5A]" />
        {/* <Image
        src="/icons/calendar.svg"
        alt="Calendar Icon"
        width={20}
        height={20}
        className="absolute right-4 size-5 text-[#B0B0B0] dark:text-[#5A5A5A]"
        /> */}
      </div>

      {isOpen && (
        <div className="absolute top-0 sm:top-8 z-50 mt-2 bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-2xl dark:shadow-gray-900 border border-[#E5E5E5] dark:border-[#333333] p-4 w-[280px] -right-7.5 sm:-right-2 scale-75 md:scale-90">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={previousMonth}
              disabled={isPrevMonthDisabled()}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ChevronLeft className="size-4 text-[#5A5A5A] dark:text-[#B0B0B0]" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className={`${inter.variable} text-sm font-semibold text-[#1A1A1A] dark:text-white hover:bg-gray-100 dark:hover:bg-[#2C2C2C] px-3 py-1 rounded-lg transition-colors`}
              >
                {monthYearDisplay}
              </button>
              
              {isYearDropdownOpen && (
                <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#333333] rounded-lg shadow-xl max-h-[200px] overflow-y-auto w-[100px] z-50">
                  {getAvailableYears().map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`w-full text-center py-2 text-xs hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors ${
                        year === currentMonth.getFullYear()
                          ? "bg-[#E8D5FF] dark:bg-[#4309B6] text-[#39089D] dark:text-white font-medium"
                          : "text-[#1A1A1A] dark:text-white"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              disabled={isNextMonthDisabled()}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2C2C2C] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ChevronRight className="size-4 text-[#5A5A5A] dark:text-[#B0B0B0]" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
              <div
                key={idx}
                className="text-center text-[10px] font-medium text-[#B0B0B0] dark:text-[#5A5A5A] py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">{renderCalendar()}</div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className={`${inter.variable} flex-1 py-2 px-4 text-xs font-medium text-[#5A5A5A] dark:text-[#B0B0B0] bg-transparent border border-[#D9D9D9] dark:border-[#333333] rounded-full hover:bg-gray-50 dark:hover:bg-[#2C2C2C] transition-colors`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className={`${inter.variable} flex-1 py-2 px-4 text-xs font-medium text-white bg-[#39089D] hover:bg-[#39089DD9] active:bg-[#2D067E] dark:bg-[#4309B6] dark:hover:bg-[#4d0ad1] dark:active:bg-[#33078c] rounded-full transition-colors`}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
