"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function TopNav({
    links,
}: {
    links: { title: string; href: string }[];
}) {
    const pathname = usePathname();
    return (
        <nav>
            <ul className="w-full list-none m-0 text-2xl flex flex-row my-2">
                {links.map(e => {
                    return (
                        <li
                            key={e.title}
                            className={cn(
                                "px-3 py-2 bg-neutral-600 my-1 mx-2 rounded capitalize w-full",
                                pathname === e.href && "bg-neutral-500"
                            )}>
                            <Link className={"w-full block"} href={e.href}>
                                {e.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
