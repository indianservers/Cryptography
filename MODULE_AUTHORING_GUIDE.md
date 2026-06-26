# Module Authoring Guide

Every new or upgraded module should be honest before it is impressive. A page may be conceptual, educational, exact, or Web Crypto-backed, but the UI and registry must make that status clear.

## Required Page Structure

Each module should define:

- Objective: what the learner should understand or verify.
- Inputs: safe defaults, validation, examples, and recommended limits.
- Outputs: clearly separated intermediate values and final result.
- Formula or algorithm panel: one short explanation before the demo.
- What to observe: the byte, letter, block, round, or parameter that changes.
- Misconception card: the common mistake students make on this topic.
- Real-world use: where the algorithm appears and where it should not be used.
- Safety warning: production, deprecated, attack, or secret-input boundary.
- Presets: beginner, intermediate, and advanced samples.
- Result summary: final state plus a short interpretation.
- Checkpoint quiz: one or two lightweight learner checks when the module matures.
- Accessibility text: table labels, button names, focus states, and non-color cues.
- Test vectors: official vectors or clear `VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT`.
- Mobile QA: controls, output, sticky actions, and no horizontal overflow.

## Implementation Rules

- Put reusable cryptographic helpers in `src/lib/**`.
- Put complex visualizer cores beside the page only when they are page-specific.
- Keep `AlgorithmPageShell` generic.
- Put route-specific learning guidance in `src/data/moduleLearningContent.ts`.
- Reuse `ModuleLearningSection` and its panels instead of hard-coding formulas, misconceptions, or checkpoint copy inside page shells.
- Use Web Crypto or a vetted library for modern production primitives.
- Do not label substitute logic as exact.
- Do not ask for real secrets without `SafetyBoundaryCard` visibility.
- Do not add offensive functionality beyond bounded, local, educational attack concepts.

## Phase 3 Learning Content Rules

Every upgraded priority module should have:

- `objective`: one sentence explaining what the learner should understand.
- `beginnerTakeaway`: the plain-language rule students should remember.
- `formula`: the exact classroom rule or a clearly bounded conceptual rule.
- `variables`: at least two symbols or terms used by the formula.
- `constraints`: at least two safety, scope, or parameter limits.
- `observationPrompts`: what to watch during the visualization.
- `expectedPatterns`: what should visibly happen when inputs change.
- `misconceptions`: the beginner mistake and the correction.
- `realWorldUse`: where the topic appears and what it is not for.
- `checkpointQuestions`: one or more lightweight checks with valid answers.
- `conceptualBoundary`: required when the page is conceptual, hybrid, attack-only, or not yet vector-backed.

Do not claim conceptual or hybrid pages are official, production ready, secure by default, or capable of validating real wallets/certificates unless the implementation is backed by vetted libraries and tests.

## Phase 4 UI Archetype Rules

Choose a route archetype in `src/data/moduleArchetypes.ts` before reshaping a page. Use explicit route mappings for priority pages, then let category inference cover lower-risk pages.

Required layout expectations:

- Start with `PageHeader`; do not duplicate status badges or safety boundaries.
- Use `ModulePageFrame` for consistent spacing and route archetype hints.
- Use `InputPanel` for controls and keep validation near the relevant field.
- Use `OutputPanel` or `ResponsiveDataBlock` for final values, long hex, Base64, binary, PEM, signatures, tags, and digests.
- Put traces, round tables, byte grids, and derivation rows in `IntermediateStepsPanel` or another internally scrollable panel.
- Use `PresetBar` only with toy/sample values; presets must not inject production secrets.
- Use `MobileActionBar` for core actions on small screens when a page has Run, Reset, Copy, or Preset actions.
- Add `StatusLegend` where a shared tool or shell page needs compact status explanations.

Mobile expectations:

- No page-level horizontal overflow at 360px width.
- Long outputs wrap or scroll inside the output panel.
- Tables and matrices scroll inside their own panel.
- Buttons remain at least touch-sized and keep accessible names.
- Warnings must appear before risky secret, key, certificate, wallet, or export inputs.

Output and copy rules:

- Visually separate final outputs from intermediate values.
- Use `secretRisk` for private keys, derived secrets, passwords, exports, signatures with key material, wallet material, or certificate/key conversion output.
- Secret-risk copy actions must warn the learner to review before copying.
- Do not encourage copying production secrets.

Accessibility checklist:

- Use semantic headings and native buttons/inputs.
- Keep focus rings visible.
- Pair color highlights with text labels such as Current, Final output, Intermediate result, Warning, or Exact.
- Add table captions or nearby labels where feasible.
- Reduced-motion users must retain the same information.

## Phase 5 Animation Rules

Animate only when motion teaches cause and effect. Good animation candidates include letter shifts, byte grouping, block flow, key exchange, matrix transforms, hash absorb/compress/squeeze flow, tree construction, modular wraparound, and distribution changes.

Do not animate:

- Decorative background motion.
- Full brute-force loops or large tables.
- Real offensive workflows.
- Production secret handling.
- Anything that implies a conceptual page is exact.

Required for every route animation:

- Add content in `src/data/moduleAnimationContent.ts`.
- Provide at least three ordered steps.
- Provide a `reducedMotionSummary`.
- Show current-step narration near the visual.
- Use `StepPlaybackControls` for replay and step navigation.
- Support reduced motion through `usePrefersReducedMotion` and `useAnimationSequence`.
- Keep text labels for current nodes, cells, bars, mappings, or matrix entries.
- Use a safety or exactness note when the audit registry marks the route conceptual, hybrid, deferred, deprecated, unsafe, or secret-sensitive.

Performance rules:

- Keep arrays small and sample-based.
- Use CSS transitions and state-driven rendering.
- Do not add large animation libraries.
- Do not run cryptographic computations just for animation.
- For large inputs, animate a representative subset and keep final output in `OutputPanel`.

## Phase 6 Guided, Challenge, Export, And QA Rules

Guided content:

- Add route lessons in `src/data/moduleGuidedContent.ts`.
- Each lesson needs at least three steps.
- Each step must include an instruction, learner action, and expected observation.
- Use sample values only.
- Attack lessons must end with defensive mitigation, not operational misuse.

Challenge content:

- Add safe local challenges in `src/data/moduleChallenges.ts`.
- Use multiple-choice or short educational answers.
- Never require real private keys, passwords, certificates, wallets, tokens, or external targets.
- Conceptual pages should ask conceptual interpretation questions only.
- Attack challenges must be defensive and bounded.

Export safety:

- Use `src/lib/exportSafety.ts` for copy/export classification.
- Redact secret-like values by default.
- Secret-risk values must warn before copying or exporting.
- Conceptual/deferred exports must include an exactness note.
- Deprecated/unsafe exports must include a safety note.

Final QA:

- Keep `src/data/finalQAChecklist.ts` passing for all navigation routes.
- Add browser-smoke routes to `src/data/browserSmokeRoutes.ts`.
- Keep `test:browser` as the scaffold for representative render checks until full Playwright coverage is added.
- Release reports must state what the app can and cannot claim.

## Registry Rules

Each route must have an entry in `moduleAuditRegistry` with:

- route and title
- page type
- accuracy status
- security status
- verification status
- browser support status
- priority
- phase target
- risk, fix, tests, and notes

When upgrading a module, update the registry and add or extend tests in `tests/`.
