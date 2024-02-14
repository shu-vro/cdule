"use client";

import { useLoader } from "@/contexts/LoaderContext";
import React from "react";
import { IoReloadOutline } from "react-icons/io5";

export default function Loader() {
    const { loading } = useLoader();
    return loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-800 bg-opacity-35 grid place-items-center backdrop-blur-sm">
            <IoReloadOutline className="animate-spin text-4xl" />
        </div>
    ) : null;
}
