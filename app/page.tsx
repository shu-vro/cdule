"use client";

import { MdPlaylistAdd } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { set, entries } from "idb-keyval";

export default function Home() {
    const parent = useRef<HTMLDivElement>(null);
    const [newField, setNewField] = useState(false);
    const [time, setTime] = useState<string>("");
    const [cause, setCause] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [schedules, setSchedules] = useState<[IDBValidKey, ISchedule][]>([]);
    const [refreshControl, setRefreshControl] = useState(0);

    useEffect(() => {
        (async () => {
            let ent = await entries();
            ent = ent.filter(el => {
                return el[0]
                    .toString()
                    .startsWith(new Date().toLocaleDateString());
            });
            setSchedules(ent);
        })();
    }, [refreshControl]);

    return (
        <div className="p-3" ref={parent}>
            <div className="font-bold text-4xl flex justify-between items-center flex-row">
                TODAY
                <button
                    onClick={() => {
                        document.body.scrollTo({
                            left: 0,
                            top: -100,
                            behavior: "smooth",
                        });
                        setNewField(true);
                    }}
                    type="button"
                    className="inline-block bg-neutral-600 rounded-lg p-2">
                    <MdPlaylistAdd />
                </button>
            </div>

            <table className="w-full border-collapse border border-[#444] text-[1.3rem] max-[700px]:text-base max-[500px]:text-xs my-4">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Cause</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr hidden={!newField} className="add-schedule">
                        <td>
                            <input
                                type="time"
                                id="new_time"
                                className="bg-inherit w-full"
                                value={time}
                                onChange={e => {
                                    setTime(e.target.value);
                                }}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                id="new_cause"
                                className="bg-inherit w-full"
                                placeholder="Create new cause"
                                value={cause}
                                onChange={e => {
                                    setCause(e.target.value);
                                }}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                id="new_amount"
                                className="bg-inherit w-[calc(100%-30px)] inline-block"
                                placeholder="Create new amount"
                                value={amount}
                                onChange={e => {
                                    setAmount(Math.abs(+e.target.value));
                                }}
                            />
                            <span className="ml-2">৳</span>
                        </td>
                    </tr>
                    <tr hidden={!newField}>
                        <td colSpan={3}>
                            <div className="flex flex-row">
                                <div className="grow"></div>
                                <button
                                    onClick={() => {
                                        setNewField(false);
                                    }}
                                    className="inline-block bg-neutral-700 rounded-lg p-2 mr-3">
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        setNewField(false);
                                        let today =
                                            new Date().toLocaleDateString();
                                        await set(`${today} ${time}`, {
                                            time: `${today} ${time}`,
                                            cause,
                                            amount,
                                        } as ISchedule);
                                        setRefreshControl(prev => prev + 1);
                                    }}
                                    className="inline-block bg-green-700 rounded-lg p-2">
                                    Save
                                </button>
                            </div>
                        </td>
                    </tr>
                    {schedules.map(([key, value]) => {
                        return (
                            <tr key={key as string}>
                                <td className="w-1/3">
                                    {new Date(value.time).toLocaleTimeString(
                                        "en",
                                        {
                                            hour12: true,
                                            timeStyle: "short",
                                        }
                                    )}
                                </td>
                                <td className="w-1/3">{value.cause}</td>
                                <td className="w-1/3">
                                    {value.amount}
                                    <span className="ml-2">৳</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-center items-center text-4xl">
                <div className="grow"></div>
                <span>
                    Total:{" "}
                    {schedules.reduce((prev, curr) => {
                        return prev + curr[1].amount;
                    }, 0)}
                </span>
            </div>
        </div>
    );
}
