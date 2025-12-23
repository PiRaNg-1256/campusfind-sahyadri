
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Tag, User, Mail } from "lucide-react";

export const revalidate = 0;

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Join with users table to get poster name/email if RLS allows (public profile policy)
    const { data: item } = await supabase
        .from("items")
        .select("*, users:posted_by (name, email)")
        .eq("id", id)
        .single();

    if (!item) {
        notFound();
    }

    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user?.id === item.posted_by;

    const statusColors = {
        lost: "bg-red-100 text-red-800",
        found: "bg-green-100 text-green-800",
        returned: "bg-blue-100 text-blue-800",
    };

    return (
        <div className="mx-auto max-w-4xl bg-white rounded-xl shadow-sm overflow-hidden border">
            <div className="grid md:grid-cols-2">
                {/* IMAGE */}
                <div className="relative h-96 w-full bg-gray-100 md:h-full">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            No Image Provided
                        </div>
                    )}
                </div>

                {/* DETAILS */}
                <div className="p-8 space-y-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${statusColors[item.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {item.status}
                            </span>
                            <span className="text-sm text-gray-500">Posted {new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-bold text-gray-900">{item.title}</h1>
                    </div>

                    <div className="space-y-3 text-gray-600">
                        <div className="flex items-center gap-3">
                            <Tag className="h-5 w-5 text-gray-400" />
                            <span className="capitalize">{item.category.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span>{item.date}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900">Description</h3>
                        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{item.description}</p>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>

                        {user ? (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                    <span className="font-medium text-gray-900">{item.users?.name || "Unknown User"}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <a href={`mailto:${item.users?.email}`} className="text-primary hover:underline font-medium">
                                            {item.users?.email || "Hidden"}
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Click to send an email to the owner.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
                                Please <Link href="/login" className="underline font-bold">sign in</Link> with your Sahyadri email to view contact details.
                            </div>
                        )}
                    </div>

                    {isOwner && (
                        <div className="pt-4">
                            <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">Manage Item (Edit/Status)</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
