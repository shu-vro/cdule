"use client";

import React, { Suspense } from "react";
import LoaderContext from "@/contexts/LoaderContext";
import RefreshContext from "@/contexts/RefreshControlContext";
import AuthContext from "@/contexts/AuthContext";
import NavbarContext from "@/contexts/NavbarContext";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RefreshContext>
                <AuthContext>
                    <LoaderContext>
                        <NavbarContext>{children}</NavbarContext>
                    </LoaderContext>
                </AuthContext>
            </RefreshContext>
        </Suspense>
    );
}
