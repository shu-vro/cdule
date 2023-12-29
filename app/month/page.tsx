"use client";

import { useEffect, useState } from "react";
import { entries } from "idb-keyval";

export default function Week() {
    const [schedules, setSchedules] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            let ent = await entries();

            let storage = [];

            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            // Get the number of days in the current month
            const daysInMonth = new Date(
                currentYear,
                currentMonth + 1,
                0
            ).getDate();

            // Create an array to store the dates
            const datesInMonth: (string | Date)[] = [];

            // Iterate through each day of the month
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(currentYear, currentMonth, i);
                const formattedDate = date.toLocaleDateString("en-US");
                datesInMonth.push(formattedDate);
            }

            console.log(datesInMonth);

            for (const day in datesInMonth) {
                let temp = ent.filter(el => {
                    return el[0]
                        .toString()
                        .startsWith(datesInMonth[day] as string);
                });
                storage.push([
                    datesInMonth[day],
                    temp.reduce((prev, curr) => {
                        return prev + curr[1].amount;
                    }, 0),
                ]);
            }
            setSchedules(storage);
        })();
    }, []);

    return (
        <div className="p-3">
            <div className="font-bold text-4xl flex justify-between items-center flex-row">
                THIS WEEK
            </div>

            <table className="w-full border-collapse border border-[#444] text-[1.3rem] max-[700px]:text-base max-[500px]:text-xs my-4">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(([key, value]) => {
                        return (
                            <tr key={key as string}>
                                <td className="w-1/2">
                                    <span>
                                        {new Date(key).toLocaleDateString(
                                            "en-GB"
                                        )}
                                    </span>
                                </td>
                                <td className="w-1/2">
                                    {value}
                                    <span className="ml-2">৳</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-center items-center text-4xl">
                <div className="grow"></div>
                <span>
                    Total:{" "}
                    {schedules.reduce((prev, curr) => {
                        return prev + curr[1];
                    }, 0)}
                </span>
            </div>
        </div>
    );
}
