import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Pages{
      allPages {
        title
        slug
      }
      _allPagesMeta {
        count
      }
    }
  `,
  [TagFragment],
);