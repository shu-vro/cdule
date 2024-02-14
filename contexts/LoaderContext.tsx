"use client";

import { createContext, useContext, useState } from "react";

type LoaderContextType = {
    loading: boolean;
    setLoading: React.Dispatch<
        React.SetStateAction<LoaderContextType["loading"]>
    >;
};

const Context = createContext({} as LoaderContextType);

export function useLoader() {
    return useContext(Context);
}

export default function LoaderContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(false);
    return (
        <Context.Provider value={{ loading, setLoading }}>
            {children}
        </Context.Provider>
    );
}
