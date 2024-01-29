import React from "react";

export default function Total({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center items-center text-2xl">
            <div className="grow"></div>
            <span>Total: {children} </span>
        </div>
    );
}
