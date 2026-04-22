import React, { ReactNode } from "react";
import Header from "@/components/misc/header";
import { clsx } from "clsx";

export default function Page({
  children,
  className,
}: {
  children: ReactNode | ReactNode[];
  className?: string;
}) {
  return (
    <div className={clsx("pb-4", className)}>
      <Header />
      <div>{children}</div>
    </div>
  );
}
