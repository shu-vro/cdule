import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDatesInMonth(month: number) {
    const currentYear = new Date().getFullYear(); // Get current year

    // Get the number of days in the specified month
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

    // Create an array to store the dates
    const datesInMonth = [];

    // Iterate through each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, month, i);
        const formattedDate = date.toLocaleDateString("en-US");
        datesInMonth.push(formattedDate);
    }

    return datesInMonth;
}

export const MONTHS = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
];

export function convertTimeToAM_PM(timeString: string) {
    const timeParts = timeString.split(":");
    let hours = parseInt(timeParts[0]);
    const minutes = timeParts[1];

    let amPm = "AM";
    if (hours >= 12) {
        amPm = "PM";
        hours = hours % 12 || 12; // Handle 12 PM case
    }

    return `${hours.toString().padStart(2, "0")}:${minutes} ${amPm}`;
}
