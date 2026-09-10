export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/**
 * Witryna działa bez CMS-u — na treści startowej z `src/content`.
 * Dopiero uzupełnienie identyfikatora projektu włącza Sanity i Studio pod /studio.
 */
export const isSanityConfigured = projectId.length > 0;
