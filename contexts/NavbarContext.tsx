"use client";

import { createContext, useContext, useState } from "react";

type NavbarContextType = {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<NavbarContextType["value"]>>;
};

const Context = createContext({} as NavbarContextType);

export function useNavbar() {
    return useContext(Context);
}

export default function NavbarContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const [value, setValue] = useState(false);
    return (
        <Context.Provider value={{ value, setValue }}>
            {children}
        </Context.Provider>
    );
}
