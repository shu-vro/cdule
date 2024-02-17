"use client";

import { useNavbar } from "@/contexts/NavbarContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa6";
import favicon from "./favicon.ico";
import { GoDesktopDownload } from "react-icons/go";
import { LuPrinter } from "react-icons/lu";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestoreDb } from "@/firebase";
import {
    Unsubscribe,
    collection,
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { setMany, values } from "idb-keyval";
import { useRefreshControl } from "@/contexts/RefreshControlContext";
import { xorWith, isEqual } from "lodash";
import md5 from "md5";

export default function TopBar() {
    const { setValue } = useNavbar();
    const { setRefreshControl } = useRefreshControl();
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent>();

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", e => {
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        });
        let unsubscribe: Unsubscribe | undefined;

        onAuthStateChanged(auth, async user => {
            if (user) {
                console.log("user signed in");
                const q = collection(
                    firestoreDb,
                    "users",
                    user.uid,
                    "schedules"
                );

                unsubscribe = onSnapshot(q, async snapshot => {
                    let all_data_from_server: ISchedule[] = [];
                    snapshot.forEach(async doc => {
                        const data = doc.data() as ISchedule;
                        all_data_from_server.push(data);
                    });

                    await setMany(
                        all_data_from_server.map(data => {
                            return [data.time, data];
                        })
                    );

                    const all_data_from_idb = await values();
                    const intersection: ISchedule[] = xorWith(
                        all_data_from_idb,
                        all_data_from_server,
                        isEqual
                    );

                    intersection.forEach(async data => {
                        try {
                            await setDoc(
                                doc(
                                    firestoreDb,
                                    "users",
                                    user.uid,
                                    `schedules`,
                                    md5(data.time.toString())
                                ),
                                data,
                                { merge: true }
                            );
                        } catch (error) {
                            console.warn(error);
                        }
                    });
                    setRefreshControl(prev => prev + 1);
                });
            } else {
                if (typeof unsubscribe === "function") {
                    unsubscribe();
                }
            }
        });
        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, []);

    return (
        <div className="sticky top-0 bg-[#333] w-full h-16 flex justify-center items-center text-3xl px-4">
            <div className="grow flex flex-row">
                <FaBars
                    className="cursor-pointer"
                    onClick={() => {
                        setValue(true);
                    }}
                />
                {deferredPrompt && (
                    <GoDesktopDownload
                        className="cursor-pointer ml-4"
                        onClick={async () => {
                            deferredPrompt.prompt();
                            const { outcome } = await deferredPrompt.userChoice;
                            if (outcome === "accepted") {
                                setDeferredPrompt(undefined);
                            }
                        }}
                    />
                )}
                <LuPrinter
                    className="cursor-pointer ml-4"
                    onClick={() => {
                        window.print();
                    }}
                />
            </div>
            <h1 className="font-bold flex flex-row justify-center items-center">
                C<span className="text-[#b16ced]">DULE</span>
                <Image
                    src={favicon}
                    width={40}
                    height={40}
                    alt="SCHEDULE"
                    className="ml-2"
                />
            </h1>
        </div>
    );
}
