import { executeQuery } from './datocms/executeQuery';
import { graphql } from './datocms/graphql';

// Query per ottenere i locales disponibili da DatoCMS
const GET_SITE_LOCALES = graphql(`
  query GetSiteLocales {
    _site {
      locales
    }
  }
`);

export default async function getAvailableLocales() {
  try {
    const result = await executeQuery(GET_SITE_LOCALES);
    return result._site.locales;
  } catch (error) {
    console.error('Error fetching locales from DatoCMS:', error);
    // Fallback ai locales definiti in astro.config.mjs
    return ['en', 'it'];
  }
}

export async function getFallbackLocale() {
  const locales = await getAvailableLocales();
  return locales[0]; // Primo locale come fallback
}

// Funzione per costruire un URL con locale
export async function getLocaleSlug(locale: string, path: string) {
  const defaultLocale = await getFallbackLocale();
  const slug = path.split('/').filter(Boolean).slice(1).join('/'); // Remove first segment (locale)

  // Se è il locale di default, non aggiungere prefisso
  if (locale === defaultLocale) {
    return slug ? `/${slug}` : '/';
  }

  // Per gli altri locali, aggiungere il prefisso
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

// Funzione helper per verificare se un locale è valido
export async function isValidLocale(locale: string) {
  const availableLocales = await getAvailableLocales();
  return availableLocales.includes(locale);
}

// Funzione per ottenere il locale dalla URL
export async function getLocaleFromUrl(url: URL | { pathname: string }) {
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const availableLocales = await getAvailableLocales();
  const defaultLocale = await getFallbackLocale();

  // Se il primo segmento è un locale valido, ritornarlo
  if (firstSegment && availableLocales.includes(firstSegment)) {
    return firstSegment;
  }

  // Altrimenti ritornare il locale di default
  return defaultLocale;
}

// Funzione per determinare il locale corrente basato su Astro.params e URL
export async function getCurrentLocale(params: Record<string, string | undefined>, url: URL) {
  // Se abbiamo il parametro locale dall'URL, usarlo
  if (params.locale) {
    const isValid = await isValidLocale(params.locale);
    if (isValid) {
      return params.locale;
    }
  }

  // Altrimenti determinare dal percorso URL
  return await getLocaleFromUrl(url);
}
