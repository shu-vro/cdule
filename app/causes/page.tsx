"use client";

import React, { useEffect, useState } from "react";
import { groupBy } from "lodash";
import { entries } from "idb-keyval";

export default function Causes() {
    const [data, setData] = useState<{
        [x: string]: [IDBValidKey, ISchedule][];
    }>({});
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const handleDateChange = async (date: string | number) => {
        let ent: [IDBValidKey, ISchedule][] = await entries();
        let today_s_data = ent.filter(el => {
            return el[0]
                .toString()
                .startsWith(new Date(date).toLocaleDateString());
        });
        let group = groupBy(today_s_data, e => e[1].cause.trim());
        setData(group);
    };

    useEffect(() => {
        (async () => {
            await handleDateChange(Date.now());
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await handleDateChange(selectedDate);
        })();
    }, [selectedDate]);

    return (
        <div>
            <h1 className="text-4xl font-bold">
                Causes{" "}
                <input
                    type="date"
                    className="bg-inherit"
                    value={selectedDate}
                    onChange={e => {
                        setSelectedDate(e.target.value);
                    }}
                />
            </h1>
            {Object.entries(data).map(([cause, schedule]) => (
                <DisplayCause cause={cause} schedules={schedule} />
            ))}
        </div>
    );
}

export function DisplayCause({
    cause,
    schedules,
}: {
    cause: string;
    schedules: [IDBValidKey, ISchedule][];
}) {
    return (
        <div className="ml-8 my-6">
            <h2 className="text-3xl font-bold capitalize">{cause}</h2>
            <table className="w-full border-collapse border border-[#444] text-[1.3rem] max-[700px]:text-base max-[500px]:text-xs my-4">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Cause</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(([key, value]) => {
                        return (
                            <tr key={key as string}>
                                <td className="w-1/2">
                                    {/* {new Date(value.time).toLocaleTimeString(
                                        "en",
                                        {
                                            hour12: true,
                                            timeStyle: "short",
                                        }
                                    )} */}
                                    {value.time}
                                </td>
                                <td className="w-1/2">
                                    {value.amount}
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
                        return prev + curr[1].amount;
                    }, 0)}
                </span>
            </div>
        </div>
    );
}
