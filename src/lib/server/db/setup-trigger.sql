-- Phase 2: Trigger + backfill (run AFTER db:push — requires phrases table)

-- 1. Trigger function: auto-update search_vector on phrase insert/update
CREATE OR REPLACE FUNCTION phrases_fts_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('public.catalan', coalesce(NEW.phrase_text, '')), 'A');
  RETURN NEW;
END;
$$;

-- 2. Trigger (safe to re-run)
DROP TRIGGER IF EXISTS phrases_fts_trigger ON phrases;
CREATE TRIGGER phrases_fts_trigger
  BEFORE INSERT OR UPDATE OF phrase_text ON phrases
  FOR EACH ROW EXECUTE FUNCTION phrases_fts_update();

-- 3. Back-fill any existing rows
UPDATE phrases SET phrase_text = phrase_text;

-- === Words FTS ===

-- 4. Trigger function: auto-update search_vector on word insert/update
CREATE OR REPLACE FUNCTION words_fts_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('public.catalan', coalesce(NEW.word, '')), 'A');
  RETURN NEW;
END;
$$;

-- 5. Trigger (safe to re-run)
DROP TRIGGER IF EXISTS words_fts_trigger ON words;
CREATE TRIGGER words_fts_trigger
  BEFORE INSERT OR UPDATE OF word ON words
  FOR EACH ROW EXECUTE FUNCTION words_fts_update();

-- 6. Back-fill any existing rows
UPDATE words SET word = word;
