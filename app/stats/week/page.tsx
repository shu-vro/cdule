"use client";

import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { entries } from "idb-keyval";
import { DaysOfWeek, chartJs } from "@/lib/utils";
Chart.register(...registerables);

export default function Week_Stats() {
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
    useEffect(() => {
        if (!schedules.length) {
            return;
        }

        const data = {
            labels: schedules.map(e =>
                new Date(e[0]).toLocaleDateString("en-GB", {
                    weekday: "long",
                })
            ),
            datasets: [chartJs.generateDataSet(schedules.map(e => e[1]))],
        };

        const chart = new Chart("chart", {
            type: "bar",
            options: chartJs.options,
            data,
        });

        return () => {
            chart.destroy();
        };
    }, [schedules]);

    return (
        <>
            <h1 className="text-3xl font-bold">Stats: This week</h1>
            <div
                className="relative m-auto bg-inherit"
                style={{
                    height: `calc(100vh - 13rem)`,
                    width: `calc(100vw - 15px)`,
                }}>
                <canvas id="chart"></canvas>
            </div>
        </>
    );
}
