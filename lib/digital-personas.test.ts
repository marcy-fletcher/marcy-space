import { describe, expect, it } from "vitest"

import {
  digitalPersonas,
  formatPersonaCode,
  getPersonaAge,
} from "./digital-personas"

describe("digital persona values", () => {
  it("formats public codes from numeric IDs", () => {
    expect(formatPersonaCode(4821)).toBe("SKN-04821")
    expect(formatPersonaCode(11204)).toBe("SKN-11204")
  })

  it("supports fixed ages and calendar birth dates", () => {
    expect(getPersonaAge({ age: 28 }, new Date("2026-09-01T00:00:00Z"))).toBe(
      28
    )
    expect(
      getPersonaAge(
        { birthDate: "1992-04-17" },
        new Date("2026-04-16T00:00:00Z")
      )
    ).toBe(33)
    expect(
      getPersonaAge(
        { birthDate: "1992-04-17" },
        new Date("2026-04-17T00:00:00Z")
      )
    ).toBe(34)
  })

  it("covers known, absent, and unknown fact states", () => {
    const statuses = digitalPersonas.flatMap((persona) => {
      const { social, economic } = persona.characteristics

      return [
        social.religion.status,
        social.family.status,
        social.friends.status,
        economic.annualIncome.status,
        economic.debtValue.status,
        economic.assetsValue.status,
      ]
    })

    expect(new Set(statuses)).toEqual(new Set(["known", "none", "unknown"]))
  })
})
