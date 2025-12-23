
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { deleteItem, updateItemStatus } from "@/app/actions/items";
import Link from "next/link";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";

export const revalidate = 0;

export default async function AdminPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if admin
    // In a real app, we check the public.users table role.
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();

    if (profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-600">You do not have administrative privileges.</p>
                <Link href="/" className="mt-6 btn btn-primary">Go Home</Link>
            </div>
        )
    }

    const { data: items } = await supabase
        .from("items")
        .select("*, users:posted_by(email)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Admin Console</h1>
                <div className="text-sm text-gray-500">
                    Logged in as {user.email} (Admin)
                </div>
            </div>

            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Posted By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {items?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/items/${item.id}`} className="font-medium text-gray-900 hover:text-primary">
                                            {item.title}
                                        </Link>
                                        <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.users?.email || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${item.status === "lost" ? "bg-red-100 text-red-800" :
                                                item.status === "found" ? "bg-green-100 text-green-800" :
                                                    "bg-blue-100 text-blue-800"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <form action={updateItemStatus.bind(null, item.id, 'returned')}>
                                                <button className="text-blue-600 hover:text-blue-900 p-1" title="Force Mark Returned">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            </form>
                                            <form action={deleteItem.bind(null, item.id)}>
                                                <button className="text-red-600 hover:text-red-900 p-1" title="Force Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
