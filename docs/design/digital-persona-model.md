# Digital Persona Model

Status: accepted for the in-memory implementation.

This document records the application model for fictional Digital Personas and their marketplace offers. The model is intentionally independent of a database or service implementation while keeping filter values machine-readable.

## Scope

Current scope:

- explicit TypeScript domain types;
- three representative in-memory personas and listings;
- separate persona and listing stores;
- filter-ready scalar values, controlled vocabularies, and tags;
- explicit unknown, absent, and known states where absence matters.

Not in scope:

- filter UI or query parsing;
- a database, ORM, API, or separate service;
- graph relationships between personas;
- inferring sensitive characteristics from names or media.

## Entities and Ownership

### Digital Persona

A Digital Persona owns:

- numeric ID;
- name and description;
- either a fixed age or birth date;
- Persona Gallery;
- physical, social, professional, economic, and personality characteristics.

Its public decorative code is derived from the numeric ID. For example, persona ID `4821` becomes `SKN-04821`. The code is not stored in seed data.

### Market Listing

A Market Listing owns:

- numeric ID;
- numeric `personaId` reference;
- current owner display handle;
- asking price.

A listing does not duplicate persona fields or gallery media.

## Application Shape

```ts
type PersonaAge =
  | { age: number; birthDate?: never }
  | { birthDate: `${number}-${number}-${number}`; age?: never }

type Fact<T> =
  | { status: "unknown" }
  | { status: "none" }
  | { status: "known"; value: T }

type DigitalPersona = PersonaAge & {
  id: number
  name: string
  description: string
  gallery: readonly PersonaMedia[]
  characteristics: {
    physical: PhysicalCharacteristics
    social: SocialCharacteristics
    professional: ProfessionalCharacteristics
    economic: EconomicCharacteristics
    personality: PersonalityCharacteristics
  }
}

type MarketListing = {
  id: number
  personaId: number
  owner: string
  price: Money<"USDC">
}
```

## Age

A persona stores exactly one age source:

- `age` for a character whose age is permanently fixed;
- `birthDate` for a character who ages with the calendar.

Birth dates use an ISO calendar date (`YYYY-MM-DD`) without a time zone. Display and filter code derives the current age from that date.

## Fact States

Optional omission is not used for facts where users must distinguish missing data from confirmed absence.

- `unknown`: no information is available;
- `none`: the fact is confirmed absent;
- `known`: `value` contains the fact.

The model uses `Fact<T>` for religion, family, friends, annual income, debt, and assets. Examples:

```ts
const unknownReligion = { status: "unknown" }
const noDebt = { status: "none" }
const knownIncome = {
  status: "known",
  value: { amount: 92_000, currency: "USD" },
}
```

## Characteristics

### Physical

- height in centimeters;
- weight in kilograms;
- chest circumference in centimeters;
- body type from a controlled vocabulary;
- eye color;
- hair color.

Initial body-type vocabulary: `slim`, `average`, `athletic`, `curvy`, `muscular`, `plusSize`.

### Social

- gender;
- sexual orientation;
- religion as a `Fact<string>`;
- ethnicity tags;
- political-view tags;
- country and city;
- languages with proficiency;
- relationship status;
- family and friends as named textual connections.

Initial gender vocabulary: `woman`, `man`, `nonBinary`.

Initial orientation vocabulary: `straight`, `gay`, `lesbian`, `bisexual`, `pansexual`, `asexual`, `queer`.

Language proficiency vocabulary: `native`, `fluent`, `intermediate`, `basic`.

Family entries have a controlled relationship and a name. Friend entries have a name. Neither contains a persona ID, so these collections are not a relationship graph.

### Professional

- occupation;
- education level;
- employment status.

### Economic

- annual income in USD;
- debt value in USD;
- asset value in USD.

Each is a `Fact<Money<"USD">>`. Net worth is derived from known asset and debt values and is not stored.

### Personality

- normalized personality-trait tags;
- normalized interest tags.

Political views and ethnicities are also tag collections because one persona may have more than one value. Tags are authored facts for fictional characters and must never be inferred from names or gallery media.

## Gallery

Gallery entries are discriminated image or video values:

```ts
type PersonaMedia =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster: string }
```

Media does not carry a separate description. The UI derives accessible labels from persona name, media type, and position.

## Invariants

- persona and listing IDs are positive integers;
- each listing references an existing persona;
- each persona has either fixed age or birth date, never both;
- physical measurements and known monetary amounts are non-negative;
- listing price uses USDC;
- economic characteristic amounts use USD;
- `none` and `unknown` facts do not contain a value;
- `known` facts always contain a value;
- decorative persona codes are presentation values, not stored identity.

## Future Service Boundary

The in-memory arrays model two independent repositories. A later API or service may replace either repository while preserving numeric IDs, `personaId`, and the application types. No service abstraction is added until an external data source exists.

