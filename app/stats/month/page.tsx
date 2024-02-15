"use client";

import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { entries } from "idb-keyval";
import { chartJs, getDatesInMonth } from "@/lib/utils";
import { useRefreshControl } from "@/contexts/RefreshControlContext";
Chart.register(...registerables);

export default function Stats_Months() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { refreshControl } = useRefreshControl();

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
    }, [refreshControl]);
    useEffect(() => {
        if (!schedules.length) {
            return;
        }

        const data = {
            labels: schedules.map(e =>
                new Date(e[0]).toLocaleDateString("en-GB")
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
            <h1 className="text-3xl font-bold">
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
