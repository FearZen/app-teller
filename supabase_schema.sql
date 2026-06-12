-- SQL Schema for Supabase Setup
-- Copy and paste this script into the Supabase SQL Editor to initialize all necessary tables

-- 1. Create Transaction Codes Table
CREATE TABLE IF NOT EXISTS public.transaction_codes (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    documents TEXT[] NOT NULL,
    warning TEXT,
    notes TEXT[] NOT NULL,
    "isFavorite" BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security) - Allow public read and write access
ALTER TABLE public.transaction_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.transaction_codes FOR ALL USING (true) WITH CHECK (true);

-- 2. Create Knowledge Base Table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.knowledge_base FOR ALL USING (true) WITH CHECK (true);

-- 3. Create Daily Notes Table
CREATE TABLE IF NOT EXISTS public.daily_notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.daily_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.daily_notes FOR ALL USING (true) WITH CHECK (true);

-- 4. Create Opening Checklists Table
CREATE TABLE IF NOT EXISTS public.opening_checklists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT false,
    note TEXT,
    warning TEXT,
    type TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.opening_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.opening_checklists FOR ALL USING (true) WITH CHECK (true);

-- 5. Create Closing Checklists Table
CREATE TABLE IF NOT EXISTS public.closing_checklists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT false,
    note TEXT,
    warning TEXT,
    type TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.closing_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.closing_checklists FOR ALL USING (true) WITH CHECK (true);

-- 6. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY,
    "darkMode" BOOLEAN DEFAULT false NOT NULL,
    username TEXT DEFAULT 'Yang Mulia Ferza'::text NOT NULL,
    "drawerReserve" NUMERIC DEFAULT 1000000 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- 7. Create Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    checked BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow full access to all" ON public.reminders FOR ALL USING (true) WITH CHECK (true);
