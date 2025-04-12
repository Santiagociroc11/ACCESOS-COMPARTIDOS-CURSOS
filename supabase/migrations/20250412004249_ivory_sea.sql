/*
  # Create accounts table

  1. New Tables
    - `accounts`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `url` (text, not null)
      - `username` (text, not null)
      - `password` (text, not null)
      - `requires_dynamic_pin` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `accounts` table
    - Add policy for public access (since we're not using Supabase auth)
*/

CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  requires_dynamic_pin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access policy"
  ON accounts
  FOR ALL
  USING (true)
  WITH CHECK (true);