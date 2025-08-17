/*
  # Update players table RLS policies

  1. Changes
    - Remove existing INSERT policy that only allows authenticated users
    - Add new INSERT policy that allows service role to insert data
    - Keep existing SELECT and UPDATE policies unchanged

  2. Security
    - Maintains public read access
    - Restricts INSERT operations to service role only
    - Maintains UPDATE access for authenticated users
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.players;

-- Create new INSERT policy for service role
CREATE POLICY "Enable insert for service role only"
ON public.players
FOR INSERT
TO service_role
WITH CHECK (true);