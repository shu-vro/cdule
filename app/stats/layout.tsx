import Link from "next/link";
import React from "react";

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
            <nav>
                <ul className="w-full list-none m-0 text-2xl flex flex-row my-2">
                    {links.map(e => {
                        return (
                            <li
                                key={e.title}
                                className="px-3 py-2 bg-neutral-600 my-1 mx-2 rounded capitalize w-full">
                                <Link className="w-full block" href={e.href}>
                                    {e.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="p-3">{children}</div>
        </>
    );
}
