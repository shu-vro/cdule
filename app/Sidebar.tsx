"use client";

import { useNavbar } from "@/contexts/NavbarContext";
import { auth, signInWithGoogle } from "@/firebase";
import { cn } from "@/lib/utils";
import { User, signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Sidebar() {
    const { value, setValue } = useNavbar();
    const { user } = useAuthContext();
    const list = [
        {
            name: "today",
            to: "/",
        },
        {
            name: "this week",
            to: "/week",
        },
        {
            name: "this month",
            to: "/month",
        },
        {
            name: "stats",
            to: "/stats",
        },
        {
            name: "causes",
            to: "/causes",
        },
        {
            name: "import/export",
            to: "/import-export",
        },
    ];
    return (
        <>
            <div
                className={cn(
                    "nav fixed top-0 h-full w-80 bg-[#333] transition-[left] z-10",
                    value ? "left-0" : "-left-80"
                )}>
                <button
                    type="button"
                    onClick={() => {
                        setValue(false);
                    }}
                    className="capitalize text-xl rounded-full bg-neutral-600 px-4 py-2 my-3 font-bold flex justify-center items-center pl-2">
                    <FaAngleLeft className="mr-2" />
                    close
                </button>
                <ul className="w-full list-none m-0 text-2xl">
                    {list.map(obj => (
                        <li
                            key={obj.name}
                            className="px-3 py-2 bg-neutral-600 my-1 mx-2 rounded capitalize">
                            <Link
                                className="w-full block"
                                href={obj.to}
                                onClick={() => {
                                    setValue(false);
                                }}>
                                {obj.name}
                            </Link>
                        </li>
                    ))}
                    <li className="px-3 py-2 bg-neutral-600 hover:bg-sky-500 transition-all my-1 mx-2 rounded capitalize">
                        {user ? (
                            <div className="w-full text-start">
                                <div className="flex justify-start items-center gap-2 mb-2">
                                    <Image
                                        src={
                                            (user?.photoURL as string) ||
                                            "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
                                        }
                                        alt={user?.displayName as string}
                                        width={20}
                                        height={20}
                                    />
                                    <span className="text-sm truncate">
                                        {user?.displayName}
                                    </span>
                                </div>
                                <button
                                    onClick={async () => {
                                        setValue(false);
                                        await signOut(auth);
                                    }}
                                    type="button"
                                    className="hover:bg-red-500 transition-all rounded text-lg px-2 py-1">
                                    Log out
                                </button>
                                {/* <button
                                    onClick={async () => {
                                        setValue(false);
                                        await signOut(auth);
                                    }}
                                    type="button"
                                    className="hover:bg-orange-300 transition-all rounded text-lg px-2 py-1">
                                    Sync
                                </button> */}
                            </div>
                        ) : (
                            <button
                                className="w-full text-start flex justify-start items-center gap-2"
                                type="button"
                                onClick={async () => {
                                    setValue(false);
                                    let user = await signInWithGoogle();
                                }}>
                                <FcGoogle /> Sign In/Up
                            </button>
                        )}
                    </li>
                </ul>
            </div>
            <div
                onClick={e => {
                    e.stopPropagation();
                    setValue(prev => !prev);
                }}
                className={cn(
                    "overlay fixed top-0 left-0 w-full h-full bg-[#000000] z-[9]",
                    value ? "opacity-40" : "hidden"
                )}></div>
        </>
    );
}
