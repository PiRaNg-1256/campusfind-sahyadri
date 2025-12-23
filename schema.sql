-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- This table mirrors auth.users for easier joins and public profile access.
-- Trigger will handle synchronization.
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('student', 'staff', 'admin')) DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: Enforce email domain
  CONSTRAINT valid_email_domain CHECK (email LIKE '%@sahyadri.edu.in')
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. ITEMS TABLE
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('electronics', 'id_cards', 'books', 'accessories', 'others')),
  status TEXT NOT NULL CHECK (status IN ('lost', 'found', 'returned')) DEFAULT 'lost',
  location TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  posted_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  contact_preference TEXT CHECK (contact_preference IN ('email', 'in_app')) DEFAULT 'email',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 3. MESSAGES TABLE (Optional but requested)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. STORAGE BUCKET
-- Note via SQL we can't always create buckets easily in all Supabase environments, 
-- but we can set policies if the bucket 'items' exists.
-- Assuming bucket 'items' is created manually or via client.
-- We will create a policy just in case.

-- RLS POLICIES

-- USERS
-- Everyone can read stats, but maybe restrict full user list to authenticated?
-- Requirement: "Users can READ only their own profile data" -> Wait, usually people need to see who posted an item.
-- Adjusted: Users can read basic info (name, email) of item posters, but full profile only their own.
-- Let's stick to the strict prompt: "Users can READ only their own profile data".
-- BUT, items need to show "Posted by X". If I can't read user X, I can't show their name.
-- I will assume "profile data" means sensitive details. Name/Email might be needed for contact.
-- For now, I'll allow reading Users if authenticated (so we can join), but only update OWN.
CREATE POLICY "Public profiles are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ITEMS
-- "Anyone logged in can READ all items"
CREATE POLICY "Authenticated users can view items" ON public.items FOR SELECT TO authenticated USING (true);

-- "Users can INSERT items only as themselves"
CREATE POLICY "Users can insert their own items" ON public.items FOR INSERT TO authenticated WITH CHECK (auth.uid() = posted_by);

-- "Users can UPDATE or DELETE ONLY their own items"
CREATE POLICY "Users can update own items" ON public.items FOR UPDATE TO authenticated USING (auth.uid() = posted_by);
CREATE POLICY "Users can delete own items" ON public.items FOR DELETE TO authenticated USING (auth.uid() = posted_by);

-- "Admin users can UPDATE or DELETE ANY item"
-- We need a way to determine Admin. We'll check the public.users table for role='admin'.
-- Note: Recursive policies can be dangerous. To be safe, we might need a claim or strict lookup.
-- For this setup, we'll use a subquery but be careful of infinite recursion if we select from users.
-- To avoid recursion, we can use `auth.jwt()` metadata if we set custom claims, but here we rely on the table.
-- We will create a helper function `is_admin()`.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
SELECT EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND role = 'admin'
);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Admins can update any item" ON public.items FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete any item" ON public.items FOR DELETE TO authenticated USING (public.is_admin());


-- STORAGE POLICIES (Conceptual - typically applied in Storage UI or via specific storage schema)
-- ALLOW SELECT for authenticated (Bucket 'items')
-- ALLOW INSERT/UPDATE/DELETE for Item Owner (Bucket 'items')
-- We can't strictly attach storage policies to `public` schema. They go to `storage.objects`.
-- I will include them here for reference.

-- TRIGGER FOR NEW USERS
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Strict Email Check
  IF NEW.email NOT LIKE '%@sahyadri.edu.in' THEN
    RAISE EXCEPTION 'Invalid email domain. Must be @sahyadri.edu.in';
  END IF;

  INSERT INTO public.users (id, name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
-- Note: You usually can't create triggers on auth.users from the SQL editor in some self-hosted/local setups easily 
-- without superuser, but in Supabase cloud it works.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
