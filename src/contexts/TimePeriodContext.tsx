import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TimePeriod } from '@/components/ui/time-period-dropdown';

interface TimePeriodContextType {
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
}

const TimePeriodContext = createContext<TimePeriodContextType | undefined>(undefined);

export function TimePeriodProvider({ children }: { children: ReactNode }) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1month');

  return (
    <TimePeriodContext.Provider value={{ timePeriod, setTimePeriod }}>
      {children}
    </TimePeriodContext.Provider>
  );
}

export function useTimePeriod() {
  const context = useContext(TimePeriodContext);
  if (context === undefined) {
    throw new Error('useTimePeriod must be used within a TimePeriodProvider');
  }
  return context;
}

// Utility function to get date range based on time period
export function getDateRange(period: TimePeriod): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case '1day':
      startDate.setDate(endDate.getDate() - 1);
      break;
    case '1week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '1month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case '1year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    case 'ytd':
      startDate.setMonth(0, 1); // January 1st of current year
      break;
    default:
      startDate.setMonth(endDate.getMonth() - 1);
  }

  return { startDate, endDate };
}

// Portion of a year the period spans, for prorating recurring monthly
// figures (e.g. a monthly rent rate shown over "1 week" vs "1 year").
export function getPeriodYearFraction(period: TimePeriod): number {
  const { startDate, endDate } = getDateRange(period);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.max(endDate.getTime() - startDate.getTime(), msPerDay) / (365 * msPerDay);
}

// Utility function to format period for display
export function formatTimePeriodForDisplay(period: TimePeriod): string {
  const { startDate, endDate } = getDateRange(period);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (period === 'ytd') {
    return `Jan 1 - ${formatDate(endDate)}`;
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}