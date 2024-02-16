"use client";

import { entries } from "idb-keyval";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import DisplayCause from "../DisplayCause";
import Total from "@/app/Total";
import { useRefreshControl } from "@/contexts/RefreshControlContext";

export default function Causes_Week() {
    const [data, setData] = useState<{
        [x: string]: [IDBValidKey, ISchedule][];
    }>({});
    const [total, setTotal] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { refreshControl } = useRefreshControl();

    const handleChangeMonth = async (month: number, year: number) => {
        let ent = await entries();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        ent = ent.filter(([key, value]) => {
            return (
                key.toString().startsWith((month + 1).toString()) &&
                key.toString().split(" ")[0].endsWith(year.toString())
            );
        });
        let group = groupBy(ent, e => e[1].cause.trim());

        setTotal(
            Object.values(ent).reduce((prev, curr) => {
                return prev + curr[1].amount;
            }, 0)
        );
        setData(group);
    };

    useEffect(() => {
        (async () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            await handleChangeMonth(currentMonth, currentYear);
        })();
    }, [refreshControl]);
    useEffect(() => {
        (async () => {
            await handleChangeMonth(selectedMonth, selectedYear);
        })();
    }, [selectedMonth]);

    return (
        <div>
            <h1 className="text-3xl font-bold">
                Causes -
                <input
                    type="month"
                    className="bg-inherit"
                    value={`${selectedYear}-${(selectedMonth + 1)
                        .toString()
                        .padStart(2, "0")}`}
                    onChange={e => {
                        let [year, month] = e.target.value.split("-");
                        setSelectedMonth(+month - 1);
                        setSelectedYear(+year);
                    }}
                />
            </h1>
            {Object.entries(data).map(([cause, schedule]) => (
                <DisplayCause cause={cause} schedules={schedule} key={cause} />
            ))}
            <Total>{total}</Total>
        </div>
    );
}
