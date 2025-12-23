
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateItemStatus, deleteItem } from "@/app/actions/items";
import { Trash2, CheckCircle, RotateCcw } from "lucide-react";
import Image from "next/image";

export const revalidate = 0;

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: items } = await supabase
        .from("items")
        .select("*")
        .eq("posted_by", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                <Link href="/items/create" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Post New Item
                </Link>
            </div>

            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Item
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 relative overflow-hidden rounded-md bg-gray-100">
                                                {item.image_url ? (
                                                    <Image src={item.image_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-200" />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</div>
                                                <div className="text-sm text-gray-500 capitalize">{item.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.status === "lost" ? "bg-red-100 text-red-800" :
                                                item.status === "found" ? "bg-green-100 text-green-800" :
                                                    "bg-blue-100 text-blue-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Status Actions */}
                                            {item.status === 'lost' && (
                                                <form action={updateItemStatus.bind(null, item.id, 'found')}>
                                                    <button className="text-green-600 hover:text-green-900 p-1" title="Mark as Found">
                                                        <CheckCircle className="h-5 w-5" />
                                                    </button>
                                                </form>
                                            )}
                                            {item.status === 'found' && (
                                                <form action={updateItemStatus.bind(null, item.id, 'returned')}>
                                                    <button className="text-blue-600 hover:text-blue-900 p-1" title="Mark as Returned">
                                                        <CheckCircle className="h-5 w-5" />
                                                    </button>
                                                </form>
                                            )}
                                            {item.status === 'returned' && (
                                                // Maybe allow reopen?
                                                <form action={updateItemStatus.bind(null, item.id, 'found')}>
                                                    <button className="text-gray-400 hover:text-gray-600 p-1" title="Reopen">
                                                        <RotateCcw className="h-5 w-5" />
                                                    </button>
                                                </form>
                                            )}

                                            {/* Delete Action */}
                                            <form action={deleteItem.bind(null, item.id)}>
                                                <button className="text-red-600 hover:text-red-900 p-1 ml-2" title="Delete">
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!items || items.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        You haven't posted any items yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
