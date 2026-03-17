-- Phase 1: Extensions + FTS config (run BEFORE db:push — no table dependency)

-- 1. Unaccent extension (for accent-insensitive matching)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Unaccent dictionary wrapper
CREATE TEXT SEARCH DICTIONARY catalan_unaccent (
  TEMPLATE = unaccent,
  RULES    = 'unaccent'
);

-- 3. Custom 'public.catalan' config
--    PostgreSQL ships with 'catalan_stem' Snowball dict AND a built-in 'catalan' config
--    (generated at initdb from Snowball). The built-in config has NO stopwords file —
--    we intentionally skip stopwords (negligible overhead, easy to add later).
--    We copy from pg_catalog.catalan (not spanish) for proper Catalan morphology,
--    then add unaccent as a pre-filter for accent-insensitive matching.
CREATE TEXT SEARCH CONFIGURATION public.catalan ( COPY = pg_catalog.catalan );

ALTER TEXT SEARCH CONFIGURATION public.catalan
  ALTER MAPPING FOR hword, hword_part, word
  WITH catalan_unaccent, catalan_stem;
