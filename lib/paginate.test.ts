import { describe, expect, it } from "vitest"

import { paginate } from "./paginate"

describe("paginate", () => {
  it("selects a page and clamps invalid values", () => {
    const items = Array.from({ length: 34 }, (_, index) => index + 1)

    expect(paginate(items, "2", 12)).toEqual({
      items: items.slice(12, 24),
      page: 2,
      totalPages: 3,
    })
    expect(paginate(items, "99", 12).page).toBe(3)
    expect(paginate(items, "invalid", 12).page).toBe(1)
  })
})
