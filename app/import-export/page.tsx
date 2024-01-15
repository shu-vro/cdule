"use client";

import { entries, setMany, clear } from "idb-keyval";
import React from "react";

export default function Import_Export() {
    return (
        <div className="p-3">
            <h1 className="text-3xl font-bold mb-3">Import/Export</h1>
            <div className="p-3">
                <h2 className="text-3xl font-bold mb-4">Import</h2>

                <label htmlFor="choose-file" className="mr-5">
                    Select file:
                </label>
                <input
                    type="file"
                    id="choose-file"
                    onChange={e => {
                        const file = e.target.files?.[0];

                        if (file) {
                            const reader = new FileReader();
                            reader.addEventListener("load", async event => {
                                let result = event.target?.result;
                                try {
                                    let json = JSON.parse(result as string);
                                    await clear();
                                    await setMany(json);
                                    alert(`Added ${json.length} schedules`);
                                } catch (error: any) {
                                    alert(error.message);
                                }
                            });
                            reader.readAsText(file);
                        }
                    }}
                />
                <h2 className="text-3xl font-bold my-4">Export</h2>

                <button
                    type="button"
                    onClick={async () => {
                        let ent = await entries();
                        ent = ent.filter(el => {
                            return el[0]
                                .toString()
                                .startsWith(
                                    new Date().toLocaleDateString("en-US")
                                );
                        });

                        const link = document.createElement("a");
                        const content = JSON.stringify(ent, null, 2);
                        const file = new Blob([content], {
                            type: "application/json",
                        });
                        link.href = URL.createObjectURL(file);
                        link.download = `cdule-${new Date()
                            .toLocaleString()
                            .replaceAll(/[\s\\\/&,]/g, "-")}.json`;
                        link.click();
                        URL.revokeObjectURL(link.href);
                    }}
                    className="capitalize py-2 px-4 bg-[#b16ced]">
                    export stats
                </button>
            </div>
        </div>
    );
}
