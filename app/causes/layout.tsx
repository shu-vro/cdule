import React from "react";
import TopNav from "../stats/TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    const links = [
        {
            title: "today",
            href: "/causes",
        },
        {
            title: "week",
            href: "/causes/week",
        },
        {
            title: "month",
            href: "/causes/month",
        },
    ];
    return (
        <div>
            <TopNav links={links} />
            <div className="p-3">{children}</div>
        </div>
    );
}
