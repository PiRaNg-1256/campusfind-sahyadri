
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import ItemCard from "@/components/ItemCard";

export const revalidate = 0; // Dynamic

export default async function Home() {
  const supabase = await createClient();

  const { data: lostItems } = await supabase
    .from("items")
    .select("*")
    .eq("status", "lost")
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: foundItems } = await supabase
    .from("items")
    .select("*")
    .eq("status", "found")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="space-y-12">
      {/* HERO SECTION */}
      <section className="rounded-2xl bg-primary px-6 py-16 text-center text-white shadow-xl md:px-12">
        <h1 className="text-4xl font-bold md:text-5xl">
          Lost something?  <span className="text-secondary">Found something?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          The official digital lost and found board for Sahyadri College.
          Report items, find owners, and help our community.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/items/create?type=lost" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg border-none">
            I Lost Something
          </Link>
          <Link href="/items/create?type=found" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 text-lg border-none">
            I Found Something
          </Link>
        </div>
      </section>

      {/* RECENT LOST */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Lost Items</h2>
          <Link href="/browse?status=lost" className="text-primary hover:underline font-medium">View All</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lostItems?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {(!lostItems || lostItems.length === 0) && (
            <p className="col-span-full text-center text-gray-500 py-8 italic">No reported lost items recently.</p>
          )}
        </div>
      </section>

      {/* RECENT FOUND */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Found Items</h2>
          <Link href="/browse?status=found" className="text-primary hover:underline font-medium">View All</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {foundItems?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {(!foundItems || foundItems.length === 0) && (
            <p className="col-span-full text-center text-gray-500 py-8 italic">No reported found items recently.</p>
          )}
        </div>
      </section>
    </div>
  );
}
