"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ItemFormProps {
    action: (formData: FormData) => Promise<any>;
    initialData?: any;
    type?: "lost" | "found";
}

export default function ItemForm({ action, initialData, type }: ItemFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        formData.set("image_url", imageUrl);
        formData.set("type", type || "lost");

        try {
            const result = await action(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Item posted successfully");
                router.push("/dashboard");
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Item Name
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            defaultValue={initialData?.title}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="e.g. Blue Water Bottle"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            name="category"
                            id="category"
                            required
                            defaultValue={initialData?.category || "others"}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        >
                            <option value="electronics">Electronics (Phones, Laptops)</option>
                            <option value="id_cards">ID Cards / Wallets</option>
                            <option value="books">Books / Stationery</option>
                            <option value="accessories">Accessories (Keys, Bags)</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date {type === 'found' ? 'Found' : 'Lost'}
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required
                            defaultValue={initialData?.date || new Date().toISOString().split('T')[0]}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            defaultValue={initialData?.location}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder={type === 'found' ? "Where did you find it?" : "Where did you lose it?"}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <ImageUpload onUpload={setImageUrl} defaultValue={imageUrl} />

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            rows={4}
                            defaultValue={initialData?.description}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            placeholder="Provide details..."
                        />
                    </div>

                    <div>
                        <label htmlFor="contact_preference" className="block text-sm font-medium text-gray-700">
                            Contact Preference
                        </label>
                        <select
                            name="contact_preference"
                            id="contact_preference"
                            defaultValue={initialData?.contact_preference || "email"}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        >
                            <option value="email">Email</option>
                            <option value="in_app">In-App Chat (Coming Soon)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto px-8 py-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Item" : "Post Report"}
                </button>
            </div>
        </form>
    );
}
