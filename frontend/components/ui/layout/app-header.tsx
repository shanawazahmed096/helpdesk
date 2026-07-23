"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";

export function AppHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <Input
            placeholder="Search..."
            className="w-72 pl-10"
          />
        </div>

        {/* Notification */}
        <button className="rounded-lg p-2 transition hover:bg-slate-100">
          <Bell size={20} />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {user?.firstName?.charAt(0)}
          </div>

          <div className="hidden md:block">
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>

            <p className="text-sm text-gray-500">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}