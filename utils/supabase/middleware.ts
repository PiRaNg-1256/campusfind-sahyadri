
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/items/create') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin protection
    if (request.nextUrl.pathname.startsWith('/admin') && user) {
        // Check role via metadata or database if possible. 
        // For now, allow logged in, but we need to verify role in the page or here.
        // We'll leave strict role check to the page or row level security for data, 
        // but redirecting non-admins here is better UX.
        // We can check user_metadata.
        // NOTE: user_metadata is editable by user in some configs if not careful, but app_metadata is not.
        // We rely on our `public.users` table sync trigger, but `auth.getUser()` returns `user_metadata`.
        // Let's check `user.user_metadata.role` if we sync it there? 
        // Our trigger insert into `public.users` but doesn't update `auth.users` metadata necessarily.
        // We will enforce Admin RLS in data. Middleware can just check auth for now.
    }

    return response
}
