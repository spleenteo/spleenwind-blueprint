import { executeQuery as libExecuteQuery } from '@datocms/cda-client';
import type { TadaDocumentNode } from 'gql.tada';

// Get environment variables at runtime to avoid issues during config evaluation
function getEnvTokens() {
  // Try to import from astro:env/server if available, otherwise use process.env
  try {
    // This will be replaced at build time
    const envModule = import.meta.env || process.env;
    return {
      DATOCMS_DRAFT_CONTENT_CDA_TOKEN:
        envModule.DATOCMS_DRAFT_CONTENT_CDA_TOKEN || process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN,
      DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN:
        envModule.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN || process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
    };
  } catch {
    return {
      DATOCMS_DRAFT_CONTENT_CDA_TOKEN: process.env.DATOCMS_DRAFT_CONTENT_CDA_TOKEN,
      DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN: process.env.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
    };
  }
}

/**
 * Executes a GraphQL query using the DatoCMS Content Delivery API, using a
 * different API token depending on whether we want to fetch draft content or
 * published.
 */
export async function executeQuery<Result, Variables>(
  query: TadaDocumentNode<Result, Variables>,
  options?: ExecuteQueryOptions<Variables>
) {
  const tokens = getEnvTokens();

  const result = await libExecuteQuery(query, {
    variables: options?.variables,
    excludeInvalid: true,
    includeDrafts: options?.includeDrafts,
    token: options?.includeDrafts ? tokens.DATOCMS_DRAFT_CONTENT_CDA_TOKEN : tokens.DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN,
  });

  return result;
}

type ExecuteQueryOptions<Variables> = {
  variables?: Variables;
  includeDrafts?: boolean;
};
