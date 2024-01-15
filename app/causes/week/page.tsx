"use client";

import { entries } from "idb-keyval";
import { groupBy } from "lodash";
import React, { useEffect, useState } from "react";
import DisplayCause from "../DisplayCause";

export default function Causes_Week() {
    const [data, setData] = useState<{
        [x: string]: [IDBValidKey, ISchedule][];
    }>({});
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfWeek = today.getDay();
        const weekStartOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

        const startOfWeek = new Date(
            today.getTime() - weekStartOffset * 24 * 60 * 60 * 1000
        );

        (async () => {
            let ent = await entries();
            ent = ent.filter(([key, value]) => {
                let key_date = new Date(key.toString().split(" ")[0]);

                return key_date.getTime() - startOfWeek.getTime() > 0;
            });
            let group = groupBy(ent, e => e[1].cause.trim());
            setData(group);
        })();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">Causes - This week</h1>
            {Object.entries(data).map(([cause, schedule]) => (
                <DisplayCause cause={cause} schedules={schedule} />
            ))}
        </div>
    );
}
