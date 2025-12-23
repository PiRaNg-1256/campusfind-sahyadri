"use client";

import { signout } from "@/app/actions/auth";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";
import { UserCircle, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";

export default function UserMenu({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) {
        return (
            <div className="flex gap-4">
                <Link href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white text-white hover:bg-white hover:text-primary h-10 px-4 py-2">
                    Login
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                    Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-white hover:text-secondary focus:outline-none"
            >
                <UserCircle className="h-8 w-8" />
                <span className="hidden md:block font-medium">{user.user_metadata?.name || user.email}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Dashboard
                    </Link>
                    <Link
                        href="/items/create"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Report Item
                    </Link>
                    <form action={signout}>
                        <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
