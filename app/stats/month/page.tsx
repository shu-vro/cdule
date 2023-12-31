"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { entries } from "idb-keyval";
import { MONTHS, getDatesInMonth } from "@/lib/utils";
Chart.register(...registerables);

export default function Stats_Months() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const changeMonth = async (month: number, year: number) => {
        let ent = await entries();

        let storage = [];
        const datesInMonth = getDatesInMonth(month);

        for (const day in datesInMonth) {
            let temp = ent.filter(el => {
                return (
                    el[0].toString().startsWith(datesInMonth[day] as string) &&
                    el[0].toString().split(" ")[0].endsWith(year.toString())
                );
            });
            storage.push([
                datesInMonth[day],
                temp.reduce((prev, curr) => {
                    return prev + curr[1].amount;
                }, 0),
            ]);
        }
        setSchedules(storage);
    };
    useEffect(() => {
        (async () => {
            await changeMonth(selectedMonth, selectedYear);
        })();
    }, [selectedMonth]);
    useEffect(() => {
        (async () => {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            await changeMonth(currentMonth, currentYear);
        })();
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold">
                Stats:{" "}
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
            <div className="h-[60vh] w-[90vw] mx-auto">
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
                            new Date(e[0]).toLocaleDateString("en-GB")
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
