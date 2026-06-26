# Cryptography Learning Suite

A browser-only React + Vite + TypeScript cryptography learning app for classroom demonstrations, self-study, and safe algorithm exploration.

This project is an educational lab. It is not a production cryptography toolkit, wallet, certificate validator, compliance suite, or offensive security platform.

## What The App Does

- Explains classical, symmetric, asymmetric, hash, MAC, KDF, encoding, PKI, blockchain, attack-concept, and math topics.
- Shows status and safety boundaries near the top of pages.
- Separates exact educational logic, Web Crypto-backed behavior, conceptual previews, deprecated demos, and deferred library-required modules.
- Provides route-driven learning panels, visual animations, guided mode, and safe challenge mode.
- Keeps copy/export behavior conservative around secrets and conceptual outputs.

## Run Locally

```bash
npm install
npm run dev
```

## Test

```bash
npm run typecheck
npm run test:vectors
npm run test:smoke
npm run test:browser
npm test
```

## Build

```bash
npm run build
```

## Project Structure

- `src/data/moduleAuditRegistry.ts`: route trust, exactness, safety, and verification taxonomy.
- `src/data/moduleLearningContent.ts`: route-specific learning objectives, formulas, misconceptions, and checkpoint content.
- `src/data/moduleAnimationContent.ts`: route-driven visual walkthrough content.
- `src/data/moduleGuidedContent.ts`: guided lesson steps.
- `src/data/moduleChallenges.ts`: safe local challenges.
- `src/data/finalQAChecklist.ts`: release QA matrix.
- `src/components/common/**`: shared page, panel, copy/export, guided, challenge, and status UI.
- `src/components/visual/**`: reusable visual animation primitives.
- `tests/**`: vector, smoke, content, animation, guided, challenge, export, and QA tests.

## Phase Summary

- Phase 1: accuracy foundation and audit registry.
- Phase 2: P0 correctness decisions and exact helper tests.
- Phase 3: educational clarity panels.
- Phase 4: UI archetypes and mobile-safe output.
- Phase 5: visual educational animations.
- Phase 6: guided mode, challenge mode, final QA, export safety, and release certification.

## Known Limitations

- Browser-render smoke testing is scaffolded through Vitest route expectations; Playwright can be added later for full DOM rendering.
- Conceptual/deferred modules are intentionally not promoted to exact status.
- Production Argon2, bcrypt, scrypt, wallet, Ethereum signature, and certificate validation require vetted libraries and expanded vectors.
- The app is classroom-ready, not production-cryptography-ready.
