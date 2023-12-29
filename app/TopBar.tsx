"use client";

import { useNavbar } from "@/contexts/NavbarContext";
import Image from "next/image";
import React from "react";
import { FaBars } from "react-icons/fa6";
import favicon from "./favicon.ico";

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
            <h1 className="font-bold flex flex-row justify-center items-center">
                SCHE<span className="text-[#b16ced]">DULE</span>
                <Image
                    src={favicon}
                    width={40}
                    height={40}
                    alt="SCHEDULE"
                    className="ml-2"
                />
            </h1>
        </div>
    );
}
