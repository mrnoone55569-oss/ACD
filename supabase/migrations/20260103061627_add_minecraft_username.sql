/*
  # Add minecraft_username column to players table

  1. Changes
    - Add `minecraft_username` column (text, nullable) to `players` table
    - This field stores the Minecraft username for skin rendering
    - Separate from the display name stored in `name`

  2. Notes
    - Uses IF NOT EXISTS to safely add column
    - Nullable to maintain backward compatibility
*/

-- Add minecraft_username column
ALTER TABLE public.players
ADD COLUMN IF NOT EXISTS minecraft_username text;
