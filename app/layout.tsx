import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./Sidebar";
import NavbarContext from "@/contexts/NavbarContext";
import TopBar from "./TopBar";

const font = Montserrat({
    subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
    title: "SCHEDULE",
    description: "Schedule your daily life's spending",
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
