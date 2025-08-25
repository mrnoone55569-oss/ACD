/*
  # Add peakTiers column to players table

  1. Changes
    - Add `peakTiers` column to `players` table
    - Set column type to `jsonb` with default empty object
    - Column will store the highest tier achieved for each kit

  2. Notes
    - This column tracks peak performance for each player per kit
    - Default value is empty JSON object `{}`
    - Allows null values for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'peakTiers'
  ) THEN
    ALTER TABLE players ADD COLUMN peakTiers jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;