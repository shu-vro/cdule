import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import NavbarContext from "@/contexts/NavbarContext";
import TopBar from "./TopBar";
import favicon from "./favicon.ico";

const font = Montserrat({
    subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
    title: "SCHEDULE",
    description: "Schedule your daily life's spending",
    icons: [
        {
            url: favicon.src,
            sizes: "32x32",
            type: "image/x-icon",
        },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={font.className}>
                <NavbarContext>
                    <TopBar />
                    <Sidebar />
                    {children}
                </NavbarContext>
            </body>
        </html>
    );
}
