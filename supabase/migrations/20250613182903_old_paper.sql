/*
  # Add Specta player to database

  1. New Player
    - Add 'Specta' player with realistic tier assignments
    - Includes avatar URL and kit tier rankings
    - Assigns various tier levels across different kits

  2. Data
    - Player ID: player-33
    - Name: Specta
    - Kit tiers: Mixed rankings from HT1 to LT4
    - Avatar: Minecraft head avatar
*/

INSERT INTO public.players (id, name, "kitTiers", avatar) VALUES
  ('player-33', 'Specta', '{
    "sword": "HT2",
    "axe": "LT1", 
    "crystal": "HT3",
    "uhc": "LT2",
    "smp": "HT1",
    "diasmp": "LT3",
    "diapot": "HT4",
    "npot": "LT4",
    "mace": "HT5",
    "shieldless": "LT2"
  }'::jsonb, 'https://mc-heads.net/avatar/Specta')
ON CONFLICT (id) DO NOTHING;