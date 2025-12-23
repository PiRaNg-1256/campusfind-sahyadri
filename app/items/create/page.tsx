
import ItemForm from "@/components/ItemForm";
import { createItem } from "@/app/actions/items";

export default async function CreateItemPage({ searchParams }: { searchParams: Promise<{ type?: string, error?: string }> }) {
    const params = await searchParams;
    const type = params.type === "found" ? "found" : "lost";

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Report {type === "found" ? "Found" : "Lost"} Item
                </h1>
                <p className="mt-2 text-gray-600">
                    Please provide as many details as possible to help {type === "found" ? "the owner identify their item" : "find your item"}.
                </p>
            </div>

            {params.error && (
                <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {params.error}
                </div>
            )}

            <ItemForm action={createItem} type={type} />
        </div>
    );
}
