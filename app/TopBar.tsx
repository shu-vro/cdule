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
import { collection, onSnapshot } from "firebase/firestore";
import { set } from "idb-keyval";

export default function TopBar() {
    const { setValue } = useNavbar();
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent>();

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", e => {
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        });

        onAuthStateChanged(auth, user => {
            if (user) {
                console.log("user signed in");
                onSnapshot(
                    collection(firestoreDb, "users", user.uid, "schedules"),
                    snapshot => {
                        snapshot.forEach(async doc => {
                            const data = doc.data() as ISchedule;
                            await set(data.time, data);
                        });
                    }
                );
            }
        });
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
