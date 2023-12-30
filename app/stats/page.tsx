"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { entries } from "idb-keyval";
import { convertTimeToAM_PM } from "@/lib/utils";
Chart.register(...registerables);

export default function Stats() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const changeDate = async (date: string) => {
        let ent: [IDBValidKey, ISchedule][] = await entries();
        let n = ent
            .filter(el => {
                return el[0]
                    .toString()
                    .startsWith(new Date(date).toLocaleDateString());
            })
            .map(e => [e[0], e[1].amount]);

        let final: any[] = [];

        for (let i = 0; i < 24; i++) {
            const key = i.toString().padStart(2, "0");
            const found = n.find(
                e => (e[0] as string).split(" ")[1].split(":")[0] === key
            );
            final.push([key + ":00", found?.[1] ?? 0]);
        }
        console.log(final);
        setSchedules(final);
    };
    useEffect(() => {
        (async () => {
            await changeDate(new Date().toLocaleDateString());
        })();
    }, []);
    useEffect(() => {
        (async () => {
            await changeDate(selectedDate);
        })();
    }, [selectedDate]);
    return (
        <>
            <h1 className="text-4xl font-bold">
                Stats:{" "}
                <input
                    type="date"
                    className="bg-inherit"
                    value={selectedDate}
                    onChange={e => {
                        setSelectedDate(e.target.value);
                    }}
                />
            </h1>

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
                        labels: schedules.map(e => convertTimeToAM_PM(e[0])),
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
