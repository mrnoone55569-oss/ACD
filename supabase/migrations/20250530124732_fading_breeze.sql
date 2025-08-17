/*
  # Add avatar column to players table

  1. Changes
    - Add new 'avatar' column to players table
      - Type: text
      - Nullable: true (some players might not have avatars)

  2. Security
    - Inherits existing RLS policies from players table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'players' 
    AND column_name = 'avatar'
  ) THEN
    ALTER TABLE players ADD COLUMN avatar text;
  END IF;
END $$;