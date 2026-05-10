ALTER TABLE diagnostics
  ADD COLUMN IF NOT EXISTS additional_need text;
