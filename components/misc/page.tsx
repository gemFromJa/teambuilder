import React, { ReactNode } from "react";
import Header from "@/components/misc/header";

export default function Page({
    children,
}: {
    children: ReactNode | ReactNode[];
}) {
    return (
        <div className=" pb-4">
            <Header />
            <div>{children}</div>
        </div>
    );
}
