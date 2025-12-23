'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createItem(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const date = formData.get('date') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const contact_preference = formData.get('contact_preference') as string
    const type = formData.get('type') as string // 'lost' or 'found'

    // Map type to status. 'lost' report means status is 'lost'. 
    // 'found' report means status is 'found'.
    const status = type === 'found' ? 'found' : 'lost'

    const { error } = await supabase.from('items').insert({
        title,
        category,
        date,
        location,
        description,
        image_url,
        contact_preference,
        status,
        posted_by: user.id,
    })

    if (error) {
        console.error('Error creating item:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/browse')
    revalidatePath('/dashboard')

    return { success: true }
}

export async function updateItemStatus(itemId: string, newStatus: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('items')
        .update({ status: newStatus })
        .eq('id', itemId)

    if (error) {
        console.error('Error updating status:', error)
        throw new Error('Failed to update status')
    }

    revalidatePath('/dashboard')
    revalidatePath(`/items/${itemId}`)
}

export async function deleteItem(itemId: string) {
    const supabase = await createClient()

    // 1. Fetch item to get image_url
    const { data: item, error: fetchError } = await supabase
        .from('items')
        .select('image_url')
        .eq('id', itemId)
        .single()

    if (fetchError) {
        console.error('Error fetching item for deletion:', fetchError)
        throw new Error('Failed to delete item')
    }

    // 2. Delete image from storage if it exists
    if (item?.image_url) {
        try {
            console.log("Attempting to delete image:", item.image_url);
            // URL format: .../storage/v1/object/public/items/filename.jpg
            const url = new URL(item.image_url);
            const pathParts = url.pathname.split('/items/');

            if (pathParts.length > 1) {
                // pathParts[1] will be the file path relative to the bucket
                // decodeURIComponent handles spaces/special chars if any
                const filePath = decodeURIComponent(pathParts.slice(1).join('/items/'));
                console.log("Extracted filePath:", filePath);

                const { error: storageError } = await supabase.storage
                    .from('items')
                    .remove([filePath]);

                if (storageError) {
                    console.error('FAILED to delete image from storage:', storageError);
                } else {
                    console.log("Successfully deleted image from storage");
                }
            } else {
                console.warn("Could not extract file path from URL:", item.image_url);
            }
        } catch (e) {
            console.error('Error processing image deletion:', e);
        }
    }

    // 3. Delete database record
    const { error } = await supabase.from('items').delete().eq('id', itemId)

    if (error) {
        console.error('Error deleting item:', error)
        throw new Error('Failed to delete item')
    }

    revalidatePath('/dashboard')
}
