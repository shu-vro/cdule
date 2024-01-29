"use client";

import React, { useEffect, useState } from "react";
import { groupBy } from "lodash";
import { entries } from "idb-keyval";
import DisplayCause from "./DisplayCause";

export default function Causes({
    searchParams,
}: {
    searchParams: {
        date?: string;
    };
}) {
    const [data, setData] = useState<{
        [x: string]: [IDBValidKey, ISchedule][];
    }>({});
    const [selectedDate, setSelectedDate] = useState(
        new Date(searchParams.date || Date.now()).toLocaleDateString("en-CA")
    );

    const handleDateChange = async (date: string | number) => {
        let ent: [IDBValidKey, ISchedule][] = await entries();
        let today_s_data = ent.filter(el => {
            return el[0]
                .toString()
                .startsWith(new Date(date).toLocaleDateString("en-US"));
        });
        let group = groupBy(today_s_data, e => e[1].cause.trim());
        setData(group);
        return group;
    };

    useEffect(() => {
        (async () => {
            await handleDateChange(searchParams.date || Date.now());
        })();
    }, []);

    useEffect(() => {
        (async () => {
            await handleDateChange(selectedDate);
        })();
    }, [selectedDate]);

    return (
        <div>
            <h1 className="text-3xl font-bold">
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
                <DisplayCause cause={cause} schedules={schedule} key={cause} />
            ))}
        </div>
    );
}
