import React from "react";
import TopNav from "./TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    const links = [
        {
            title: "today",
            href: "/stats",
        },
        {
            title: "week",
            href: "/stats/week",
        },
        {
            title: "month",
            href: "/stats/month",
        },
    ];
    return (
        <>
            <TopNav links={links} />
            <div className="p-3 bg-inherit">{children}</div>
        </>
    );
}
