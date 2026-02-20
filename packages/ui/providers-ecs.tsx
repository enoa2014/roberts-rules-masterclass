"use client";

import { SessionProvider } from "next-auth/react";

export function ProvidersEcs({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
