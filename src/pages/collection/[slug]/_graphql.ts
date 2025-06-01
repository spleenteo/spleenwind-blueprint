import { graphql } from '~/lib/datocms/graphql';

// Query minima senza frammenti per testare
export const query = graphql(
  /* GraphQL */ `
    query SinglePage($slug: String!) {
      page(filter: { slug: { eq: $slug } }) {
        title
        id
      }
    }
    
  `
);