# Cryptography App Architecture

This app is a React + Vite + TypeScript browser-only learning lab. Routes are lazy-loaded from `src/routes/router.tsx`, navigation rows are built from `src/data/navigation.ts`, and algorithm descriptions live in `src/data/algorithmMetadata.ts`.

## Route Structure

- `src/routes/router.tsx` is the source for renderable routes.
- `src/data/navigation.ts` is the source for sidebar/search navigation.
- `src/data/routeSmokeList.ts` exports the route list used by smoke tests.
- Demos live under `src/pages/demos`.
- Algorithm pages live under `src/pages/algorithms/**`.

Every route that appears in navigation must have an audit entry in `src/data/moduleAuditRegistry.ts`.

## Metadata Structure

`algorithmMetadata` describes the learner-facing shape of a module:

- title and route
- category and safety status
- input labels
- output labels
- visualization labels
- learning notes

Metadata is not proof of cryptographic correctness. The stricter truth layer is the audit registry.

## Audit Registry

`src/data/moduleAuditRegistry.ts` classifies each route with:

- implementation accuracy
- security use status
- verification status
- browser support status
- current page type
- P0/P1/P2/P3 priority
- required fix and required tests

The registry is intentionally conservative. A standards-heavy page should stay `NEEDS_EXPERT_REVIEW` or `VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT` until official vectors or a vetted library prove the claim.

## Status Taxonomy

`src/lib/auditStatus.ts` defines:

- `ImplementationAccuracy`
- `SecurityUseStatus`
- `VerificationStatus`
- `BrowserSupportStatus`

Shared helpers provide UI labels, tones, and warning decisions.

## Generic Shell vs Custom Page

`AlgorithmPageShell` is useful for broad educational previews and low-risk structured demos. It should not keep growing with algorithm-specific cryptographic logic.

Custom pages should be used when a module needs:

- exact algorithm internals
- official vectors
- complex state diagrams
- standards-specific validation
- large interactive flows

Algorithm logic should live in `src/lib/**` or a small page-local core file, not inside generic UI components.

## Safety Boundaries

`SafetyBoundaryCard` is shown near the top of pages through `PageHeader`. It warns about conceptual previews, deprecated algorithms, attack concepts, secret-input risk, production-use boundaries, and missing vector verification.
