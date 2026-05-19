# 50 UI Tweaks Still Worth Doing

Implemented in this pass:

1. Collapsible shared cards.
2. Collapsible input panels.
3. Collapsible output panels.
4. Per-output copy feedback.
5. Character counts on output rows.
6. Byte counts on output rows.
7. Byte counters on ASCII crypto material fields.
8. Expected byte targets on key, IV, nonce, and block inputs.
9. Field-level hints explaining internal ASCII conversion.
10. Internal hex previews in generic modules.
11. Status chips for ASCII input and validation readiness.
12. Safer placeholders for generic module fields.
13. Better overview labels that say ASCII instead of hex.
14. Consistent output copy affordance across `ValueRow`.
15. Resizable textareas for long plaintext.
16. Better wrapping for long crypto material.
17. Compact metadata pills.
18. Collapsible panel accessibility with `aria-expanded`.
19. Shared panel disclosure icons.
20. Lower layout noise by hiding collapsed internals on demand.

Still open for later passes:

21. Persist collapsed panel state per route.
22. Add global expand-all and collapse-all controls.
23. Add a beginner/expert mode toggle.
24. Add an app-wide preferred output encoding setting.
25. Add a strict versus auto-pad/truncate toggle.
26. Add "copy bundle" for ciphertext, IV, tag, and AAD.
27. Add route-level visual regression screenshots.
28. Add keyboard shortcuts for Run, Reset, Copy, Next step.
29. Add input dirty-state indicators.
30. Add stale-output indicators after input changes.
31. Add one-click "fix length" beside short key fields.
32. Add warnings when ASCII material is truncated.
33. Add warnings when ASCII material is zero-padded.
34. Add a global clear-sensitive-fields action.
35. Add a local-only privacy indicator beside each input group.
36. Add saved UI preferences for compact mode.
37. Add pinned/favorite algorithms.
38. Add recently used algorithms.
39. Add related-module chips inside every page.
40. Add a glossary drawer.
41. Add mobile card versions of wide trace tables.
42. Add route-specific loading skeletons.
43. Add "show/hide internal hex" toggles.
44. Add batch test-vector progress indicators.
45. Add module-specific safe and unsafe presets everywhere.
46. Add AEAD-specific tag/cipher/nonce export grouping.
47. Add compare drawer for two algorithms.
48. Add print-friendly lesson layouts.
49. Add QR export for short outputs.
50. Add browser API availability diagnostics.
