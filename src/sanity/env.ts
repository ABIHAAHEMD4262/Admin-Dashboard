export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skcW54eeM5sKpZNdAtlEiTcUZd4Il4YSPQzdQIEO8PhCmN8SJ9XkE19cPXGJOo560DwD1I0vQV5hSfL1UGcn2ixHv6xEpX8tRCtzVvah0q0BYA7pgBTN6OqohPQEvQ2QVl5Wi8G0HySkaQxGgRmN5ZNqngp6l41rAr1k5impeqZOfpWmIO85",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
