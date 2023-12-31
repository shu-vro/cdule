import React from "react";
import Layout_Wrapper from "@/app/stats/layout";

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
    return <Layout_Wrapper children={children} nav_links={links} />;
}
