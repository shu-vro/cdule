"use client";

import { auth, firestoreDb } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    Unsubscribe,
} from "firebase/firestore";
import { setMany, values } from "idb-keyval";
import { isEqual, xorWith } from "lodash";
import md5 from "md5";
import { createContext, useContext, useEffect, useState } from "react";
import { useRefreshControl } from "./RefreshControlContext";

type AuthContextType = {
    user: User | null;
};

const Context = createContext({} as AuthContextType);

export function useAuthContext() {
    return useContext(Context);
}

export default function AuthContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setRefreshControl } = useRefreshControl();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;
        onAuthStateChanged(auth, async u => {
            if (u) {
                setUser(u);
                console.log("user signed in");
                const q = collection(firestoreDb, "users", u.uid, "schedules");

                unsubscribe = onSnapshot(q, async snapshot => {
                    let all_data_from_server: ISchedule[] = [];
                    snapshot.forEach(async doc => {
                        const data = doc.data() as ISchedule;
                        all_data_from_server.push(data);
                    });

                    console.log(all_data_from_server.length);

                    const all_data_from_idb = await values();
                    const intersection: ISchedule[] = xorWith(
                        all_data_from_idb,
                        all_data_from_server,
                        isEqual
                    );

                    await setMany(
                        intersection.map(data => {
                            return [data.time, data];
                        })
                    );

                    intersection.forEach(async data => {
                        try {
                            await setDoc(
                                doc(
                                    firestoreDb,
                                    "users",
                                    u.uid,
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
            if (typeof unsubscribe === "function") unsubscribe();
        };
    }, []);

    return <Context.Provider value={{ user }}>{children}</Context.Provider>;
}
