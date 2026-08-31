import type { Money } from "./money"

export const bodyTypes = [
  "slim",
  "average",
  "athletic",
  "curvy",
  "muscular",
  "plusSize",
] as const

export const genders = ["woman", "man", "nonBinary"] as const

export const sexualOrientations = [
  "straight",
  "gay",
  "lesbian",
  "bisexual",
  "pansexual",
  "asexual",
  "queer",
] as const

export const languageProficiencies = [
  "native",
  "fluent",
  "intermediate",
  "basic",
] as const

export const relationshipStatuses = [
  "single",
  "partnered",
  "married",
  "divorced",
  "widowed",
] as const

export const familyRelationships = [
  "partner",
  "husband",
  "wife",
  "parent",
  "father",
  "mother",
  "child",
  "son",
  "daughter",
  "sibling",
  "brother",
  "sister",
] as const

export const educationLevels = [
  "secondary",
  "vocational",
  "bachelors",
  "masters",
  "doctorate",
] as const

export const employmentStatuses = [
  "employed",
  "selfEmployed",
  "unemployed",
  "student",
  "retired",
] as const

export type BodyType = (typeof bodyTypes)[number]
export type Gender = (typeof genders)[number]
export type SexualOrientation = (typeof sexualOrientations)[number]
export type LanguageProficiency = (typeof languageProficiencies)[number]
export type RelationshipStatus = (typeof relationshipStatuses)[number]
export type FamilyRelationship = (typeof familyRelationships)[number]
export type EducationLevel = (typeof educationLevels)[number]
export type EmploymentStatus = (typeof employmentStatuses)[number]

export type Fact<T> =
  | Readonly<{ status: "unknown" }>
  | Readonly<{ status: "none" }>
  | Readonly<{ status: "known"; value: T }>

export type PersonaMedia =
  | Readonly<{ type: "image"; src: string }>
  | Readonly<{ type: "video"; src: string; poster: string }>

export type PersonaAge =
  | Readonly<{ age: number; birthDate?: never }>
  | Readonly<{
      birthDate: `${number}-${number}-${number}`
      age?: never
    }>

export type FamilyMember = Readonly<{
  relationship: FamilyRelationship
  name: string
}>

export type Friend = Readonly<{ name: string }>

export type Language = Readonly<{
  name: string
  proficiency: LanguageProficiency
}>

export type PhysicalCharacteristics = Readonly<{
  heightCm: number
  weightKg: number
  chestCircumferenceCm: number
  bodyType: BodyType
  eyeColor: string
  hairColor: string
}>

export type SocialCharacteristics = Readonly<{
  gender: Gender
  sexualOrientation: SexualOrientation
  religion: Fact<string>
  ethnicities: readonly string[]
  politicalViews: readonly string[]
  location: Readonly<{ country: string; city: string }>
  languages: readonly Language[]
  relationshipStatus: RelationshipStatus
  family: Fact<readonly FamilyMember[]>
  friends: Fact<readonly Friend[]>
}>

export type ProfessionalCharacteristics = Readonly<{
  occupation: string
  educationLevel: EducationLevel
  employmentStatus: EmploymentStatus
}>

export type EconomicCharacteristics = Readonly<{
  annualIncome: Fact<Money<"USD">>
  debtValue: Fact<Money<"USD">>
  assetsValue: Fact<Money<"USD">>
}>

export type PersonalityCharacteristics = Readonly<{
  traits: readonly string[]
  interests: readonly string[]
}>

export type DigitalPersona = PersonaAge &
  Readonly<{
    id: number
    name: string
    description: string
    gallery: readonly PersonaMedia[]
    characteristics: Readonly<{
      physical: PhysicalCharacteristics
      social: SocialCharacteristics
      professional: ProfessionalCharacteristics
      economic: EconomicCharacteristics
      personality: PersonalityCharacteristics
    }>
  }>

export function formatPersonaCode(id: number) {
  return `SKN-${String(id).padStart(5, "0")}`
}

export function getPersonaAge(
  personaAge: PersonaAge,
  onDate: Date = new Date()
) {
  if (personaAge.age !== undefined) return personaAge.age

  const [birthYear, birthMonth, birthDay] = personaAge.birthDate
    .split("-")
    .map(Number)
  const currentYear = onDate.getUTCFullYear()
  const currentMonth = onDate.getUTCMonth() + 1
  const currentDay = onDate.getUTCDate()
  const birthdayHasPassed =
    currentMonth > birthMonth ||
    (currentMonth === birthMonth && currentDay >= birthDay)

  return currentYear - birthYear - (birthdayHasPassed ? 0 : 1)
}

export const digitalPersonas = [
  {
    id: 4821,
    name: "Ava Rose Sterling",
    age: 28,
    description:
      "A calm visual storyteller with a sharp eye for people, places, and the small details others miss.",
    gallery: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=900&h=1200&q=85",
      },
      {
        type: "video",
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        poster:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=entropy&w=900&h=1200&q=85",
      },
    ],
    characteristics: {
      physical: {
        heightCm: 168,
        weightKg: 59,
        chestCircumferenceCm: 88,
        bodyType: "slim",
        eyeColor: "green",
        hairColor: "auburn",
      },
      social: {
        gender: "woman",
        sexualOrientation: "bisexual",
        religion: { status: "unknown" },
        ethnicities: ["Irish American"],
        politicalViews: ["progressive", "green"],
        location: { country: "United States", city: "New York" },
        languages: [
          { name: "English", proficiency: "native" },
          { name: "Spanish", proficiency: "intermediate" },
        ],
        relationshipStatus: "married",
        family: {
          status: "known",
          value: [
            { relationship: "husband", name: "Henry Jones" },
            { relationship: "father", name: "Alan Peterson" },
          ],
        },
        friends: {
          status: "known",
          value: [{ name: "Lena Ortiz" }, { name: "Maya Brooks" }],
        },
      },
      professional: {
        occupation: "Editorial photographer",
        educationLevel: "bachelors",
        employmentStatus: "selfEmployed",
      },
      economic: {
        annualIncome: {
          status: "known",
          value: { amount: 92_000, currency: "USD" },
        },
        debtValue: { status: "none" },
        assetsValue: {
          status: "known",
          value: { amount: 180_000, currency: "USD" },
        },
      },
      personality: {
        traits: ["calm", "observant", "curious"],
        interests: ["photography", "travel", "jazz"],
      },
    },
  },
  {
    id: 9317,
    name: "Thea Bennett",
    birthDate: "1992-04-17",
    description:
      "Practical, exacting, and quietly inventive. Turns rough ideas into objects people want to keep.",
    gallery: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=faces&w=900&h=1200&q=85",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=entropy&w=900&h=1200&q=85",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&crop=top&w=900&h=1200&q=85",
      },
    ],
    characteristics: {
      physical: {
        heightCm: 174,
        weightKg: 67,
        chestCircumferenceCm: 94,
        bodyType: "athletic",
        eyeColor: "blue",
        hairColor: "blonde",
      },
      social: {
        gender: "woman",
        sexualOrientation: "straight",
        religion: { status: "none" },
        ethnicities: ["English", "German"],
        politicalViews: ["centrist"],
        location: { country: "United Kingdom", city: "Manchester" },
        languages: [
          { name: "English", proficiency: "native" },
          { name: "German", proficiency: "basic" },
        ],
        relationshipStatus: "single",
        family: { status: "none" },
        friends: {
          status: "known",
          value: [{ name: "Jonas Meyer" }],
        },
      },
      professional: {
        occupation: "Industrial designer",
        educationLevel: "masters",
        employmentStatus: "employed",
      },
      economic: {
        annualIncome: {
          status: "known",
          value: { amount: 115_000, currency: "USD" },
        },
        debtValue: {
          status: "known",
          value: { amount: 24_000, currency: "USD" },
        },
        assetsValue: { status: "unknown" },
      },
      personality: {
        traits: ["practical", "precise", "inventive"],
        interests: ["industrial design", "cycling", "architecture"],
      },
    },
  },
  {
    id: 11204,
    name: "Mina Okafor",
    age: 31,
    description:
      "Connects emerging ideas with communities and brands, bringing clarity to complex cultural shifts.",
    gallery: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=faces&w=900&h=1200&q=85",
      },
    ],
    characteristics: {
      physical: {
        heightCm: 171,
        weightKg: 63,
        chestCircumferenceCm: 91,
        bodyType: "curvy",
        eyeColor: "brown",
        hairColor: "black",
      },
      social: {
        gender: "woman",
        sexualOrientation: "lesbian",
        religion: { status: "known", value: "Islam" },
        ethnicities: ["Nigerian British"],
        politicalViews: ["social-democratic"],
        location: { country: "United Kingdom", city: "London" },
        languages: [
          { name: "English", proficiency: "native" },
          { name: "Yoruba", proficiency: "fluent" },
        ],
        relationshipStatus: "partnered",
        family: {
          status: "known",
          value: [
            { relationship: "father", name: "Ade Okafor" },
            { relationship: "mother", name: "Nneka Okafor" },
          ],
        },
        friends: { status: "unknown" },
      },
      professional: {
        occupation: "Cultural strategist",
        educationLevel: "masters",
        employmentStatus: "employed",
      },
      economic: {
        annualIncome: { status: "unknown" },
        debtValue: { status: "none" },
        assetsValue: {
          status: "known",
          value: { amount: 95_000, currency: "USD" },
        },
      },
      personality: {
        traits: ["empathetic", "analytical", "articulate"],
        interests: ["cultural research", "literature", "live music"],
      },
    },
  },
] as const satisfies readonly DigitalPersona[]
