import {QueryParams} from "@/helpers/types";
import {CalendarDate} from "@nextui-org/react";

export function capitalizeFirstLetter(string: string | null | undefined) {
    if (!string) return ""; // Handle empty strings
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const buildQueryString = (params: QueryParams): string => {
    const sanitizedParams = Object.entries(params)
      .filter(([_, value]) => value != null) // Filter out null and undefined
      .reduce((acc, [key, value]) => {
          acc[key] = String(value); // Convert all values to strings
          return acc;
      }, {} as Record<string, string>);

    return new URLSearchParams(sanitizedParams).toString();
};

export const formatDate = (date: any): string => {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};
