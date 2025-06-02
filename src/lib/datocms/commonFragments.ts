import { graphql } from '~/lib/datocms/graphql';

/*
 * This file lists a series of fragments not related to any specific Vue
 * component, but necessary in various parts of the code.
 */

export const TagFragment = graphql(`
  fragment TagFragment on Tag @_unmask {
    tag
    attributes
    content
  }
`);

export const HeroBlockFragment = graphql(`
  fragment HeroBlockFragment on HeroSectionRecord @_unmask {
    _modelApiKey
    heroTitle
    heroSubtitle
    displayOptions
    buttons {
      url
      label
      primary
    }
  }
`);
