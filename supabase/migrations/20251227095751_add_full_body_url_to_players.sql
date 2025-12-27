/*
  # Add full_body_url column to players table

  1. Changes
    - Add `full_body_url` column to `players` table
    - Set column type to `text` with null as default
    - Allows storing custom full body avatar URLs

  2. Notes
    - Column is nullable for backward compatibility
    - Stores full-body Minecraft avatar URLs for display
    - Used on home page for larger player images
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'full_body_url'
  ) THEN
    ALTER TABLE players ADD COLUMN full_body_url text DEFAULT NULL;
  END IF;
END $$;