export function paginate<T>(
  items: readonly T[],
  rawPage: string | null,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const requestedPage = Number(rawPage)
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    page,
    totalPages,
  }
}
