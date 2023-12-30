"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { entries } from "idb-keyval";
Chart.register(...registerables);

export default function Week_Stats() {
    const [schedules, setSchedules] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            let ent = await entries();

            let storage = [];

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const firstDayOfWeek = today.getDay();
            const weekStartOffset =
                firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

            const startOfWeek = new Date(
                today.getTime() - weekStartOffset * 24 * 60 * 60 * 1000
            );

            let daysOfWeek: (DateConstructor | string | Date)[] = [];

            for (let i = 0; i < 7; i++) {
                const day = new Date(
                    startOfWeek.getTime() + i * 24 * 60 * 60 * 1000
                );
                daysOfWeek.push(day);
            }
            daysOfWeek = daysOfWeek.map(day =>
                (day as Date).toLocaleDateString().slice(0, 10)
            );

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
        <>
            <h1 className="text-4xl font-bold">Stats: This week</h1>
            <div className="h-[60vh] w-[90vw] m-auto">
                <Bar
                    className="h-[60vh] w-[90vw] mx-auto"
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                    data={{
                        labels: schedules.map(e =>
                            new Date(e[0]).toLocaleDateString("en", {
                                weekday: "long",
                            })
                        ),
                        datasets: [
                            {
                                label: "Spending in taka",
                                data: schedules.map(e => e[1]),
                                borderWidth: 1,
                                backgroundColor: [
                                    "rgba(255, 99, 132, 0.2)",
                                    "rgba(255, 159, 64, 0.2)",
                                    "rgba(255, 205, 86, 0.2)",
                                    "rgba(75, 192, 192, 0.2)",
                                    "rgba(54, 162, 235, 0.2)",
                                    "rgba(153, 102, 255, 0.2)",
                                    "rgba(201, 203, 207, 0.2)",
                                ],
                                borderColor: [
                                    "rgb(255, 99, 132)",
                                    "rgb(255, 159, 64)",
                                    "rgb(255, 205, 86)",
                                    "rgb(75, 192, 192)",
                                    "rgb(54, 162, 235)",
                                    "rgb(153, 102, 255)",
                                    "rgb(201, 203, 207)",
                                ],
                            },
                        ],
                    }}
                />
            </div>
        </>
    );
}
