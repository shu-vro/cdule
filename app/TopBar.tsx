"use client";

import { useNavbar } from "@/contexts/NavbarContext";
import React from "react";
import { FaBars } from "react-icons/fa6";

export default function TopBar() {
    const { setValue } = useNavbar();
    return (
        <div className="sticky top-0 bg-[#333] w-full h-16 flex justify-between items-center text-3xl px-4">
            <FaBars
                className="cursor-pointer"
                onClick={() => {
                    setValue(prev => !prev);
                }}
            />
            <h1 className="font-bold">
                SCHE<span className="text-[crimson]">DULE</span>
            </h1>
        </div>
    );
}
