# Future PostgreSQL Schema Hypothesis

Status: hypothesis, not an accepted technology choice or migration plan.

This document shows how the accepted application model could map to PostgreSQL if the project later needs persistent, filterable storage. It intentionally adds no database or ORM dependency today.

## Storage Strategy

Use a hybrid relational layout:

- keep singular, frequently filtered characteristics as columns on `digital_personas`;
- keep repeating media, connections, languages, and tags in child tables;
- keep listings separate and reference personas by foreign key;
- preserve `unknown`, `none`, and `known` explicitly;
- use `NUMERIC`, never floating-point types, for money.

One-to-one characteristic tables are unnecessary initially. They can be split later if permissions, ownership, or update cadence diverge.

## Illustrative DDL

```sql
CREATE TABLE digital_personas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,

  age_mode TEXT NOT NULL CHECK (age_mode IN ('fixed', 'birth_date')),
  fixed_age SMALLINT CHECK (fixed_age >= 0),
  birth_date DATE,
  CHECK (
    (age_mode = 'fixed' AND fixed_age IS NOT NULL AND birth_date IS NULL)
    OR
    (age_mode = 'birth_date' AND fixed_age IS NULL AND birth_date IS NOT NULL)
  ),

  height_cm NUMERIC(5, 2) NOT NULL CHECK (height_cm > 0),
  weight_kg NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 0),
  chest_circumference_cm NUMERIC(5, 2) NOT NULL
    CHECK (chest_circumference_cm > 0),
  body_type TEXT NOT NULL,
  eye_color TEXT NOT NULL,
  hair_color TEXT NOT NULL,

  gender TEXT NOT NULL,
  sexual_orientation TEXT NOT NULL,
  religion_status TEXT NOT NULL
    CHECK (religion_status IN ('unknown', 'none', 'known')),
  religion TEXT,
  CHECK (
    (religion_status = 'known' AND religion IS NOT NULL)
    OR
    (religion_status <> 'known' AND religion IS NULL)
  ),

  country TEXT NOT NULL,
  city TEXT NOT NULL,
  relationship_status TEXT NOT NULL,
  family_status TEXT NOT NULL
    CHECK (family_status IN ('unknown', 'none', 'known')),
  friends_status TEXT NOT NULL
    CHECK (friends_status IN ('unknown', 'none', 'known')),

  occupation TEXT NOT NULL,
  education_level TEXT NOT NULL,
  employment_status TEXT NOT NULL,

  annual_income_status TEXT NOT NULL
    CHECK (annual_income_status IN ('unknown', 'none', 'known')),
  annual_income_amount NUMERIC(20, 2),
  annual_income_currency CHAR(3),
  debt_status TEXT NOT NULL
    CHECK (debt_status IN ('unknown', 'none', 'known')),
  debt_amount NUMERIC(20, 2),
  debt_currency CHAR(3),
  assets_status TEXT NOT NULL
    CHECK (assets_status IN ('unknown', 'none', 'known')),
  assets_amount NUMERIC(20, 2),
  assets_currency CHAR(3),

  CHECK (
    (annual_income_status = 'known'
      AND annual_income_amount IS NOT NULL
      AND annual_income_currency = 'USD')
    OR
    (annual_income_status <> 'known'
      AND annual_income_amount IS NULL
      AND annual_income_currency IS NULL)
  ),
  CHECK (
    (debt_status = 'known'
      AND debt_amount IS NOT NULL
      AND debt_currency = 'USD')
    OR
    (debt_status <> 'known'
      AND debt_amount IS NULL
      AND debt_currency IS NULL)
  ),
  CHECK (
    (assets_status = 'known'
      AND assets_amount IS NOT NULL
      AND assets_currency = 'USD')
    OR
    (assets_status <> 'known'
      AND assets_amount IS NULL
      AND assets_currency IS NULL)
  )
);

CREATE TABLE market_listings (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  persona_id BIGINT NOT NULL REFERENCES digital_personas(id),
  owner_handle TEXT NOT NULL,
  price_amount NUMERIC(20, 6) NOT NULL CHECK (price_amount >= 0),
  price_currency CHAR(4) NOT NULL CHECK (price_currency = 'USDC')
);

CREATE TABLE persona_media (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  persona_id BIGINT NOT NULL REFERENCES digital_personas(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  src TEXT NOT NULL,
  poster TEXT,
  position INTEGER NOT NULL CHECK (position >= 0),
  CHECK (
    (media_type = 'image' AND poster IS NULL)
    OR
    (media_type = 'video' AND poster IS NOT NULL)
  ),
  UNIQUE (persona_id, position)
);

CREATE TABLE persona_connections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  persona_id BIGINT NOT NULL REFERENCES digital_personas(id) ON DELETE CASCADE,
  connection_kind TEXT NOT NULL
    CHECK (connection_kind IN ('family', 'friend')),
  relationship TEXT,
  name TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  CHECK (
    (connection_kind = 'family' AND relationship IS NOT NULL)
    OR
    (connection_kind = 'friend' AND relationship IS NULL)
  ),
  UNIQUE (persona_id, connection_kind, position)
);

CREATE TABLE persona_languages (
  persona_id BIGINT NOT NULL REFERENCES digital_personas(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  proficiency TEXT NOT NULL
    CHECK (proficiency IN ('native', 'fluent', 'intermediate', 'basic')),
  PRIMARY KEY (persona_id, language_code)
);

CREATE TABLE tags (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category TEXT NOT NULL
    CHECK (category IN ('ethnicity', 'politics', 'personality', 'interest')),
  value TEXT NOT NULL,
  UNIQUE (category, value)
);

CREATE TABLE persona_tags (
  persona_id BIGINT NOT NULL REFERENCES digital_personas(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE RESTRICT,
  PRIMARY KEY (persona_id, tag_id)
);
```

## Filtering Indexes

Add indexes only when corresponding filters exist and query plans justify them. Likely starting points:

```sql
CREATE INDEX digital_personas_physical_filter_idx
  ON digital_personas (height_cm, weight_kg, chest_circumference_cm);

CREATE INDEX digital_personas_identity_filter_idx
  ON digital_personas (gender, sexual_orientation, body_type);

CREATE INDEX digital_personas_location_filter_idx
  ON digital_personas (country, city);

CREATE INDEX digital_personas_economic_filter_idx
  ON digital_personas (annual_income_amount, debt_amount, assets_amount);

CREATE INDEX persona_tags_tag_filter_idx
  ON persona_tags (tag_id, persona_id);

CREATE INDEX persona_connections_filter_idx
  ON persona_connections (connection_kind, relationship, persona_id);
```

## Deliberate Gaps

- `owner_handle` remains text because account ownership is not modeled yet; replace it with `owner_id` when an account context exists.
- Country and language names in the in-memory fixtures may later map to ISO or BCP 47 codes at the persistence boundary.
- Public persona codes remain application-derived. If they become immutable external API identifiers, add a dedicated unique `public_code` rather than exposing database identity semantics.
- PostgreSQL enums are avoided in this hypothesis because characteristic catalogs are expected to evolve. Lookup tables or text plus checks are easier to change.
- Tag knowledge state is omitted because current tags are authored as complete test data. Add per-category state only if filters must distinguish unknown from an empty tag set.

