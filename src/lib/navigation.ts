import { graphql } from './datocms/graphql';
import { executeQuery } from './datocms/executeQuery';
import getAvailableLocales, { getFallbackLocale } from './i18n';

// GraphQL query for navigation menu from DatoCMS
const NAVIGATION_QUERY = graphql(`
  query NavigationQuery {
    admin {
      logo {
        url
        alt
        title
      }
      calloutBackground {
        hex
      }
      calloutText
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

// GraphQL query for footer data from DatoCMS
const FOOTER_QUERY = graphql(`
  query FooterQuery {
    admin {
      logo {
        url
        alt
        title
      }
      footerLinks {
        navLinks {
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
            }
          }
        }
        widgetLabel
      }
      legalText {
        value
      }
      socialLinks {
        platform
        url
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

// Social platform to icon mapping
export const SOCIAL_ICON_MAPPING = {
  facebook: 'tabler:brand-facebook',
  twitter: 'tabler:brand-x',
  x: 'tabler:brand-x',
  instagram: 'tabler:brand-instagram',
  linkedin: 'tabler:brand-linkedin',
  youtube: 'tabler:brand-youtube',
  tiktok: 'tabler:brand-tiktok',
  github: 'tabler:brand-github',
  telegram: 'tabler:brand-telegram',
  whatsapp: 'tabler:brand-whatsapp',
  discord: 'tabler:brand-discord',
  rss: 'tabler:rss',
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

// Function to transform footer data from DatoCMS
export async function transformFooterData(footerData: any, currentLocale?: string) {
  const defaultLocale = await getFallbackLocale();
  const locale = currentLocale || defaultLocale;

  // Transform footer links into columns
  const links = footerData.admin.footerLinks.map((column: any) => ({
    title: column.widgetLabel,
    links: column.navLinks
      .map((item: any) => {
        switch (item.__typename) {
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
            return null;
        }
      })
      .filter(Boolean),
  }));

  // Transform social links
  const socialLinks = footerData.admin.socialLinks.map((social: any) => {
    const platform = social.platform.toLowerCase();
    const icon = SOCIAL_ICON_MAPPING[platform as keyof typeof SOCIAL_ICON_MAPPING];

    return {
      ariaLabel: social.platform,
      href: social.url,
      icon: icon || 'tabler:external-link',
    };
  });

  // Get legal text
  const footNote = footerData.admin.legalText?.value || '';

  return {
    links,
    socialLinks,
    footNote,
    secondaryLinks: [], // We can add this later if needed
  };
}

// Main function to get navigation data
export async function getNavigationData(currentLocale?: string) {
  try {
    const result = await executeQuery(NAVIGATION_QUERY);
    const navigationData = await transformNavigationData(result, currentLocale);
    return {
      links: navigationData,
      logo: result.admin.logo
        ? {
            url: result.admin.logo.url,
            alt: result.admin.logo.alt,
            title: result.admin.logo.title,
          }
        : null,
      callout: {
        text: result.admin.calloutText || '',
        backgroundColor: result.admin.calloutBackground?.hex || '#000000',
      },
    };
  } catch (error) {
    console.error('Error fetching navigation data from DatoCMS:', error);
    // Fallback to empty navigation
    return {
      links: [],
      logo: null,
      callout: {
        text: '',
        backgroundColor: '#000000',
      },
    };
  }
}

// Main function to get footer data
export async function getFooterData(currentLocale?: string) {
  try {
    const result = await executeQuery(FOOTER_QUERY);
    const footerData = await transformFooterData(result, currentLocale);
    return {
      ...footerData,
      logo: result.admin.logo
        ? {
            url: result.admin.logo.url,
            alt: result.admin.logo.alt,
            title: result.admin.logo.title,
          }
        : null,
    };
  } catch (error) {
    console.error('Error fetching footer data from DatoCMS:', error);
    // Fallback to empty footer
    return {
      links: [],
      socialLinks: [],
      footNote: '',
      secondaryLinks: [],
      logo: null,
    };
  }
}
