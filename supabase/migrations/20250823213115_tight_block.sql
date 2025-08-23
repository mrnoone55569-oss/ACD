/*
  # Create reset_kit function for kit-level tier resets

  1. New Function
    - `reset_kit(k text)` - Removes a specific kit key from all players' kitTiers
    - Returns the number of affected rows
    - Updates the updated_at timestamp

  2. Security
    - Function is accessible to authenticated users
    - Uses JSONB operator to remove specific keys
*/

create or replace function reset_kit(k text)
returns integer
language plpgsql
as $$
declare v_affected integer;
begin
  update players
  set "kitTiers" = "kitTiers" - k,
      updated_at = now()
  where "kitTiers" ? k;
  get diagnostics v_affected = row_count;
  return v_affected;
end;
$$;