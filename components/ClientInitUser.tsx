"use client";

import dynamic from "next/dynamic";

// Use dynamic import with no SSR for client component
const InitUser = dynamic(() => import("./InitUser").then(mod => mod.InitUser), { ssr: false });

export default function ClientInitUser() {
  return <InitUser />;
} 