import { graphql } from './datocms/graphql';
import { executeQuery } from './datocms/executeQuery';
import getAvailableLocales, { getFallbackLocale } from './i18n';

// GraphQL query for navigation menu from DatoCMS
const NAVIGATION_QUERY = graphql(`
  query NavigationQuery {
    admin {
      navLinks {
        ... on MenuDropdownRecord {
          __typename
          staticLabel
          pages {
            label
            page {
              slug
              title
            }
          }
        }
        ... on MenuExternalItemRecord {
          __typename
          label
          url
        }
        ... on MenuItemRecord {
          __typename
          label
          page {
            slug
            title
          }
        }
      }
    }
  }
`);

// Route mapping configuration
export const ROUTE_MAPPING = {
  Page: '/collection',
  // Add more model mappings as needed
  // 'BlogPost': '/blog',
  // 'Product': '/products',
} as const;

type ModelType = keyof typeof ROUTE_MAPPING;

// Function to build localized URLs
export function buildLocalizedUrl(slug: string, modelType: ModelType, locale: string, defaultLocale: string) {
  const basePath = ROUTE_MAPPING[modelType];
  // With prefixDefaultLocale: true, all locales need prefixes
  return `/${locale}${basePath}/${slug}`;
}

// Function to transform DatoCMS navigation data to Header component format
export async function transformNavigationData(navData: any, currentLocale?: string) {
  const defaultLocale = await getFallbackLocale();
  const locale = currentLocale || defaultLocale;

  return navData.admin.navLinks
    .map((item: any) => {
      switch (item.__typename) {
        case 'MenuDropdownRecord':
          return {
            text: item.staticLabel,
            links: item.pages.map((pageItem: any) => ({
              text: pageItem.label || pageItem.page.title,
              href: buildLocalizedUrl(pageItem.page.slug, 'Page', locale, defaultLocale),
            })),
          };

        case 'MenuExternalItemRecord':
          return {
            text: item.label,
            href: item.url,
          };

        case 'MenuItemRecord':
          return {
            text: item.label,
            href: buildLocalizedUrl(item.page.slug, 'Page', locale, defaultLocale),
          };

        default:
          console.warn('Unknown menu item type:', item.__typename);
          return null;
      }
    })
    .filter(Boolean);
}

// Main function to get navigation data
export async function getNavigationData(currentLocale?: string) {
  try {
    const result = await executeQuery(NAVIGATION_QUERY);
    return await transformNavigationData(result, currentLocale);
  } catch (error) {
    console.error('Error fetching navigation data from DatoCMS:', error);
    // Fallback to empty navigation
    return [];
  }
}
