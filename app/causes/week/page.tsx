"use client";

import { entries } from "idb-keyval";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import DisplayCause from "../DisplayCause";
import { DaysOfWeek } from "@/lib/utils";
import Total from "@/app/Total";

export default function Causes_Week() {
    const [data, setData] = useState<{
        [x: string]: [IDBValidKey, ISchedule][];
    }>({});
    const [total, setTotal] = useState(0);
    useEffect(() => {
        const daysOfWeek = DaysOfWeek();
        (async () => {
            let ent = await entries();
            ent = ent.filter(([key, value]) => {
                return daysOfWeek.includes(key.toString().split(" ")[0]);
            });
            let group = groupBy(ent, e => e[1].cause.trim());
            setData(group);
            setTotal(
                Object.values(ent).reduce((prev, curr) => {
                    return prev + curr[1].amount;
                }, 0)
            );
        })();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">Causes - This week</h1>
            {Object.entries(data).map(([cause, schedule]) => (
                <DisplayCause cause={cause} schedules={schedule} />
            ))}

            <Total>{total}</Total>
        </div>
    );
}
