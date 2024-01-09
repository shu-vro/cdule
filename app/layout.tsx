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

const APP_NAME = "CDULE";
const APP_DEFAULT_TITLE = "CDule";
const APP_TITLE_TEMPLATE = "%s - for future";
const APP_DESCRIPTION = "Schedule your daily life's spending";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    themeColor: "#333333",
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    icons: [
        {
            url: favicon.src,
            sizes: "32x32",
            type: "image/x-icon",
        },
    ],
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
            </head>
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
