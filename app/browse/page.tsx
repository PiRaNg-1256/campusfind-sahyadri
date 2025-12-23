
import ItemCard from "@/components/ItemCard";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Search } from "lucide-react";

export const revalidate = 0;

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
    const supabase = await createClient();
    const { q, status, category } = await searchParams;

    let query = supabase.from("items").select("*").order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    if (category) {
        query = query.eq("category", category);
    }

    if (q) {
        query = query.ilike("title", `%${q}%`);
    }

    const { data: items } = await query;

    return (
        <div className="flex flex-col gap-8 md:flex-row">
            {/* SIDEBAR FILTERS */}
            <aside className="w-full shrink-0 space-y-8 md:w-64">
                <div>
                    <h3 className="mb-4 font-semibold text-gray-900">Search</h3>
                    <form className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Keywords..."
                            className="input-field pl-9"
                        />
                    </form>
                </div>

                <div>
                    <h3 className="mb-4 font-semibold text-gray-900">Status</h3>
                    <div className="space-y-2">
                        {[
                            { label: "All Items", value: "" },
                            { label: "Lost", value: "lost" },
                            { label: "Found", value: "found" },
                            { label: "Returned", value: "returned" },
                        ].map((option) => (
                            <Link
                                key={option.value}
                                href={`/browse?${new URLSearchParams({
                                    ...(q ? { q } : {}),
                                    ...(category ? { category } : {}),
                                    ...(option.value ? { status: option.value } : {}),
                                })}`}
                                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${status === option.value || (!status && !option.value)
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 font-semibold text-gray-900">Category</h3>
                    <div className="space-y-2">
                        {[
                            { label: "All Categories", value: "" },
                            { label: "Electronics", value: "electronics" },
                            { label: "ID Cards", value: "id_cards" },
                            { label: "Books", value: "books" },
                            { label: "Accessories", value: "accessories" },
                            { label: "Others", value: "others" },
                        ].map((option) => (
                            <Link
                                key={option.value}
                                href={`/browse?${new URLSearchParams({
                                    ...(q ? { q } : {}),
                                    ...(status ? { status } : {}),
                                    ...(option.value ? { category: option.value } : {}),
                                })}`}
                                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${category === option.value || (!category && !option.value)
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {option.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* GRID */}
            <div className="flex-1">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Scanning Listings
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Found {items?.length || 0} items matching your criteria
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items?.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                    {(!items || items.length === 0) && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
                            <p className="text-gray-500">No items found matching your filters.</p>
                            <Link href="/items/create" className="mt-4 text-primary hover:underline">
                                Report an Item
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
