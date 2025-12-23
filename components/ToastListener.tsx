"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ToastListener() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const message = searchParams.get("message");
        const error = searchParams.get("error");
        const success = searchParams.get("success");

        if (message) {
            toast.message(message);
            // Clean up params
            const params = new URLSearchParams(searchParams.toString());
            params.delete("message");
            router.replace(`${pathname}?${params.toString()}`);
        }

        if (error) {
            toast.error(error);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("error");
            router.replace(`${pathname}?${params.toString()}`);
        }

        if (success) {
            toast.success(success);
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, pathname, router]);

    return null;
}
