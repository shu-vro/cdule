"use client";

import { MdPlaylistAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { set, entries, del } from "idb-keyval";
import { RiDeleteBin6Fill } from "react-icons/ri";
import CustomSelect from "./CustomSelect";
import Total from "./Total";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "@/firebase";
import md5 from "md5";
import { useRefreshControl } from "@/contexts/RefreshControlContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { IScheduleSchemaType } from "@/lib/utils";

export default function Home() {
    const { user } = useAuthContext();
    const [newField, setNewField] = useState(false);
    const [time, setTime] = useState<string>(
        new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    );

    const [selectedDate, setSelectedDate] = useState(
        new Date().toLocaleDateString("en-CA")
    );
    const [cause, setCause] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [schedules, setSchedules] = useState<[IDBValidKey, ISchedule][]>([]);
    const { refreshControl, setRefreshControl } = useRefreshControl();
    const [allCauses, setAllCauses] = useState<ISchedule["cause"][]>([]);

    useEffect(() => {
        (async () => {
            let ent = await entries();

            let allCauses = ent.map(
                ([_, schedule]: [IDBValidKey, ISchedule]) => {
                    return schedule.cause;
                }
            );
            setAllCauses(Array.from(new Set(allCauses)));
            ent = ent.filter(el => {
                return el[0]
                    .toString()
                    .startsWith(
                        new Date(selectedDate).toLocaleDateString("en-US")
                    );
            });
            setSchedules(ent);
        })();
    }, [refreshControl, selectedDate]);

    return (
        <div className="p-3 bg-inherit">
            <div className="font-bold text-3xl flex justify-between items-center flex-row">
                <input
                    type="date"
                    className="bg-inherit"
                    value={selectedDate}
                    onChange={e => {
                        console.log(e.target.value);
                        setSelectedDate(e.target.value);
                    }}
                />
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
                            <CustomSelect
                                value={cause}
                                setValue={setCause}
                                allOptions={allCauses}
                                type="text"
                                id="new_cause"
                                placeholder="Create new cause"
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
                                        let today = new Date(
                                            selectedDate
                                        ).toLocaleDateString("en-US");

                                        await set(`${today} ${time}`, {
                                            time: `${today} ${time}`,
                                            cause,
                                            amount,
                                        } as ISchedule);
                                        setRefreshControl(prev => prev + 1);

                                        try {
                                            const data =
                                                IScheduleSchemaType.parse({
                                                    time: `${today} ${time}`,
                                                    cause,
                                                    amount,
                                                });
                                            if (user) {
                                                const id = md5(
                                                    `${today} ${time}`
                                                );
                                                await setDoc(
                                                    doc(
                                                        firestoreDb,
                                                        "users",
                                                        user.uid,
                                                        `schedules`,
                                                        id
                                                    ),
                                                    data,
                                                    { merge: true }
                                                );
                                            }
                                        } catch (error) {
                                            console.warn(error);
                                        }
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
                                    <div className="flex justify-between items-center">
                                        <span>
                                            {value.amount}
                                            <span className="ml-2">৳</span>
                                        </span>

                                        <button
                                            type="button"
                                            className="p-2 bg-neutral-700"
                                            onClick={async () => {
                                                try {
                                                    await del(key);
                                                    if (user) {
                                                        await deleteDoc(
                                                            doc(
                                                                firestoreDb,
                                                                "users",
                                                                user.uid,
                                                                `schedules`,
                                                                md5(
                                                                    key as string
                                                                )
                                                            )
                                                        );
                                                    }
                                                    setRefreshControl(
                                                        prev => prev + 1
                                                    );
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}>
                                            <RiDeleteBin6Fill />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Total>
                {schedules.reduce((prev, curr) => {
                    return prev + curr[1].amount;
                }, 0)}
            </Total>
        </div>
    );
}
