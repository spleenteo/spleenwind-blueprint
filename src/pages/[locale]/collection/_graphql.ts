import { graphql } from '~/lib/datocms/graphql';

// Query minima senza frammenti per testare
export const query = graphql(/* GraphQL */ `
  query AllPages {
    allPages {
      id
      title
      slug
    }
    _allPagesMeta {
      count
    }
  }
`);
