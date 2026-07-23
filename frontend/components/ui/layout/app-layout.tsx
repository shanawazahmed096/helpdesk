"use client";

import { AppSidebar } from "./app-sidebar";

export function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}