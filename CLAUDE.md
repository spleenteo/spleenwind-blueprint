# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview build locally

# Code Quality
npm run check        # Run Astro, ESLint, and Prettier checks
npm run fix          # Fix ESLint and Prettier issues
npm run lint         # Check Prettier formatting
npm run format       # Format code with Prettier

# Schema Generation
npm run generate-schema  # Generate GraphQL schema from DatoCMS
```

## Architecture Overview

### Core Technology Stack
- **Astro 5.0** with server-side rendering (`output: 'server'`)
- **DatoCMS** headless CMS integration with GraphQL
- **i18n** with dynamic locale detection from DatoCMS
- **Tailwind CSS** with custom design system
- **TypeScript** with strict type checking

### Key Integrations
- **DatoCMS**: Content management via GraphQL API with draft/published modes
- **Internationalization**: Dynamic locale configuration fetched from DatoCMS (`src/lib/i18n.ts`)
- **Environment Variables**: Validated schema in `astro.config.ts` for DatoCMS tokens
- **Git Hooks**: Pre-commit formatting with `simple-git-hooks`

### Project Structure Patterns

#### Content Management
- `src/lib/datocms/`: GraphQL queries and execution utilities
- `src/pages/[locale]/`: Internationalized routing structure  
- `src/content/`: Astro content collections for blog posts
- Dynamic locale detection from DatoCMS replaces static i18n config

#### Component Architecture
- `src/components/widgets/`: Main page sections (Hero, Features, etc.)
- `src/components/ui/`: Reusable UI primitives
- `src/components/blog/`: Blog-specific components
- `src/layouts/`: Page layout templates

#### Configuration
- `src/config.yaml`: Site configuration, SEO metadata, and i18n settings
- `astro.config.ts`: Dynamic i18n configuration from DatoCMS
- `tailwind.config.js`: Custom design system with CSS variables

### Development Considerations

#### Environment Setup
Required environment variables (see `.env.example`):
- `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN`
- `DATOCMS_DRAFT_CONTENT_CDA_TOKEN` 
- `DATOCMS_CMA_TOKEN`
- `SECRET_API_TOKEN`
- `SIGNED_COOKIE_JWT_SECRET`

#### DatoCMS Integration
- Uses `gql.tada` for type-safe GraphQL queries
- Draft mode support for content preview
- Automatic schema generation from DatoCMS endpoint
- Dynamic locale configuration fetched at build time

#### Code Quality
- ESLint + Prettier with Astro-specific rules
- TypeScript strict mode enabled
- Automatic formatting on commit via git hooks
- Use `npm run check` before committing changes

#### Styling System
- Tailwind CSS with custom color variables in `src/assets/styles/tailwind.css`
- Design customization in `src/components/CustomStyles.astro`
- Dark mode support via class strategy