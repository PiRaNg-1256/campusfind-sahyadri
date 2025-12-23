
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Tag } from "lucide-react";

interface Item {
    id: string;
    title: string;
    category: string;
    status: string;
    location: string;
    date: string;
    image_url?: string;
}

export default function ItemCard({ item }: { item: Item }) {
    const statusColors = {
        lost: "bg-red-100 text-red-800",
        found: "bg-green-100 text-green-800",
        returned: "bg-blue-100 text-blue-800",
    };

    return (
        <Link href={`/items/${item.id}`} className="group block h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="relative h-48 w-full bg-gray-200">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    <div className="absolute right-2 top-2">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[item.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                                }`}
                        >
                            {item.status}
                        </span>
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>

                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span className="capitalize">{item.category.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{item.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
