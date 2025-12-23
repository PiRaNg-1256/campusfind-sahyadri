
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import UserMenu from './UserMenu'
import { Search } from 'lucide-react'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    {/* Using text for logo as requested, or SVGs if available. */}
                    <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full">
                        <span className="text-primary font-bold text-xl">S</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">CampusFind</span>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/browse" className="hover:text-secondary transition-colors font-medium">Browse Listings</Link>
                    <Link href="/items/create?type=lost" className="hover:text-secondary transition-colors font-medium">Report Lost</Link>
                    <Link href="/items/create?type=found" className="hover:text-secondary transition-colors font-medium">Report Found</Link>
                </div>

                {/* SEARCH & USER */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="h-9 w-64 rounded-md border-0 bg-white/10 pl-9 pr-4 text-sm text-white placeholder:text-gray-300 focus:bg-white/20 focus:outline-none focus:ring-1 focus:ring-secondary"
                        />
                    </div>
                    <UserMenu user={user} />
                </div>
            </div>
        </nav>
    )
}
