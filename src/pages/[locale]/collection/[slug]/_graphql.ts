import { graphql } from '~/lib/datocms/graphql';
import { HeroBlockFragment } from '~/lib/datocms/commonFragments';

export const query = graphql(
  /* GraphQL */ `
    query SinglePage($slug: String!) {
      page(filter: { slug: { eq: $slug } }) {
        title
        id
        sections {
          ... on HeroSectionRecord {
            ...HeroBlockFragment
          }
        }
      }
    }
  `,
  [HeroBlockFragment]
);
