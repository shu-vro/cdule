"use client";

import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { entries } from "idb-keyval";
import { chartJs, convertTimeToAM_PM } from "@/lib/utils";
Chart.register(...registerables);

export default function Stats() {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );

    const changeDate = async (date: string) => {
        let ent: [IDBValidKey, ISchedule][] = await entries();
        let n = ent
            .filter(el => {
                return el[0]
                    .toString()
                    .startsWith(new Date(date).toLocaleDateString(`en-US`));
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
        setSchedules(final);
    };
    useEffect(() => {
        (async () => {
            await changeDate(new Date().toLocaleDateString(`en-US`));
        })();
    }, []);
    useEffect(() => {
        (async () => {
            await changeDate(selectedDate);
        })();
    }, [selectedDate]);

    useEffect(() => {
        if (!schedules.length) {
            return;
        }

        const data = {
            labels: schedules.map(e => convertTimeToAM_PM(e[0])),
            datasets: [chartJs.generateDataSet(schedules.map(e => e[1]))],
        };

        const chart = new Chart("chart", {
            type: "bar",
            options: chartJs.options,
            data,
        });

        function beforePrint() {
            chart.resize(600, 600);
        }

        function afterPrint() {
            chart.resize();
        }

        window.addEventListener("beforeprint", beforePrint);
        window.addEventListener("afterprint", afterPrint);

        return () => {
            chart.destroy();
            window.removeEventListener("beforeprint", beforePrint);
            window.removeEventListener("afterprint", afterPrint);
        };
    }, [schedules]);

    return (
        <>
            <h1 className="text-3xl font-bold">
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

            <div
                className="m-auto bg-inherit"
                style={{
                    height: `calc(100vh - 13rem)`,
                    width: `calc(100vw - 15px)`,
                }}>
                <canvas id="chart"></canvas>
            </div>
        </>
    );
}
