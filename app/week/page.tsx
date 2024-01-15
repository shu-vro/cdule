"use client";

import { useEffect, useState } from "react";
import { entries } from "idb-keyval";
import { DaysOfWeek } from "@/lib/utils";

export default function Week() {
    const [schedules, setSchedules] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            let ent = await entries();

            let storage = [];

            const daysOfWeek = DaysOfWeek();

            for (const day in daysOfWeek) {
                let temp = ent.filter(el => {
                    return el[0]
                        .toString()
                        .startsWith(daysOfWeek[day] as string);
                });
                storage.push([
                    daysOfWeek[day],
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
            <div className="font-bold text-3xl flex justify-between items-center flex-row">
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
                                    {new Date(key).toLocaleDateString("en", {
                                        weekday: "long",
                                    })}{" "}
                                    <span className="opacity-50">
                                        {new Date(key).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }
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
            <div className="flex justify-center items-center text-2xl">
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
