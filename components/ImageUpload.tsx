"use client";

import { createClient } from "@/utils/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
    onUpload: (url: string) => void;
    defaultValue?: string;
}

export default function ImageUpload({ onUpload, defaultValue = "" }: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState(defaultValue);
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("items")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("items").getPublicUrl(filePath);

            setImageUrl(data.publicUrl);
            onUpload(data.publicUrl);
        } catch (error) {
            alert("Error uploading image (ensure 'items' bucket exists with public access): " + (error as Error).message);
        } finally {
            setUploading(false);
        }
    }

    function handleRemove() {
        setImageUrl("");
        onUpload("");
    }

    return (
        <div className="flex flex-col gap-4">
            <label className="block text-sm font-medium text-gray-700">Item Image</label>

            {imageUrl ? (
                <div className="relative h-48 w-full max-w-sm overflow-hidden rounded-lg border">
                    <Image
                        src={imageUrl}
                        alt="Item image"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute right-2 top-2 rounded-full bg-white p-1 text-red-600 shadow-sm hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <label className="flex h-32 w-full max-w-sm cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}
            {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
        </div>
    );
}
