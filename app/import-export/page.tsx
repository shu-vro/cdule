"use client";

import { auth, firestoreDb } from "@/firebase";
import {
    doc,
    setDoc,
    getDocs,
    query,
    collection,
    deleteDoc,
} from "firebase/firestore";
import { entries, setMany, clear } from "idb-keyval";
import md5 from "md5";
import { z } from "zod";
import React from "react";
import { useLoader } from "@/contexts/LoaderContext";

const schemaType = z.tuple([
    z.string(),
    z.object({
        time: z.string(),
        cause: z.string(),
        amount: z.number(),
    }),
]);

export default function Import_Export() {
    const { setLoading } = useLoader();
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
                                    let json: any[] = JSON.parse(
                                        result as string
                                    );
                                    const confirmation = confirm(
                                        `**PLEASE MAINTAIN PRECAUTION**
${json.length} schedules are going to be added.
and all previous schedules will be deleted. If
you are logged in, then it will also change from the 
database.
Once previous data are deleted and new data entries,
THERE IS NO GOING BACK.
If you think the backup file has got everything you need,
proceed with "Ok" button`
                                    );
                                    if (!confirmation)
                                        return alert(`Cancelled!`);
                                    await clear();
                                    await setMany(json);

                                    if (auth.currentUser) {
                                        setLoading(true);
                                        const docs = await getDocs(
                                            query(
                                                collection(
                                                    firestoreDb,
                                                    "users",
                                                    auth.currentUser.uid,
                                                    "schedules"
                                                )
                                            )
                                        );
                                        docs.forEach(async doc => {
                                            await deleteDoc(doc.ref);
                                        });
                                        for (let schedule of json) {
                                            try {
                                                schedule =
                                                    schemaType.parse(schedule);
                                                const id = md5(
                                                    schedule[1].time
                                                );
                                                console.log(id);
                                                await setDoc(
                                                    doc(
                                                        firestoreDb,
                                                        "users",
                                                        auth.currentUser.uid,
                                                        `schedules`,
                                                        id
                                                    ),
                                                    schedule[1],
                                                    { merge: true }
                                                );
                                            } catch (error: any) {
                                                setLoading(false);
                                                alert(
                                                    "A certain schedule have problem or the file is corrupted.\nMESSAGE: " +
                                                        JSON.parse(
                                                            error.message
                                                        )[0].message
                                                );
                                                console.warn(error.message);
                                            }
                                        }
                                        setLoading(false);
                                    }
                                    alert(`Added ${json.length} schedules`);
                                } catch (error: any) {
                                    console.warn(`FAILED: \n` + error);
                                    alert(
                                        `THIS FILE IS CORRUPTED. FAILED:\n` +
                                            error.message
                                    );
                                } finally {
                                    setLoading(false);
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
