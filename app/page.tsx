"use client";

import { MdPlaylistAdd } from "react-icons/md";
import { useRef, useState } from "react";

export default function Home() {
    const parent = useRef<HTMLDivElement>(null);
    const [newField, setNewField] = useState(false);
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
                    <tr hidden={!newField}>
                        <td>
                            <input
                                type="time"
                                id="new_time"
                                className="bg-inherit w-full"
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                id="new_cause"
                                className="bg-inherit w-full"
                                placeholder="Create new cause"
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                id="new_amount"
                                className="bg-inherit w-[calc(100%-30px)] inline-block"
                                placeholder="Create new amount"
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
                                    onClick={() => {
                                        setNewField(false);
                                    }}
                                    className="inline-block bg-green-700 rounded-lg p-2">
                                    Save
                                </button>
                            </div>
                        </td>
                    </tr>
                    {Array(30)
                        .fill(true)
                        .map((_, i) => {
                            return (
                                <tr key={i}>
                                    <td>Time</td>
                                    <td>Cause</td>
                                    <td>Amount</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
