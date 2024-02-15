"use client";

import { createContext, useContext, useState } from "react";

type RefreshControlType = {
    refreshControl: number;
    setRefreshControl: React.Dispatch<
        React.SetStateAction<RefreshControlType["refreshControl"]>
    >;
};

const Context = createContext({} as RefreshControlType);

export function useRefreshControl() {
    return useContext(Context);
}

export default function RefreshControl({
    children,
}: {
    children: React.ReactNode;
}) {
    const [refreshControl, setRefreshControl] = useState(0);
    return (
        <Context.Provider value={{ refreshControl, setRefreshControl }}>
            {children}
        </Context.Provider>
    );
}
