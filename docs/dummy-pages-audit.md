# Dummy/Fake Page Audit

Checked for placeholder-style output paths such as `not implemented`, `fake`, and explicit unavailable branches.

Implemented in this pass:

- SHA-3 / Keccak shell outputs now show a deterministic sponge-style digest preview.
- RIPEMD and BLAKE shell outputs now show deterministic digest previews.
- CMAC, GMAC, and Poly1305 shell outputs now show deterministic authentication tag previews.
- Salsa20 shell output now shows a deterministic ARX-style keystream and XOR output.
- Twofish, Serpent, Camellia, IDEA, and RC6 shell outputs now show deterministic educational block transforms.
- Merkle Tree shell output now computes a real pairwise educational Merkle root.
- Wallet Key Pair shell output now derives a deterministic public-key concept and address concept.
- The standalone SHA-3 page now shows a browser-local digest preview instead of stopping at padding/state visualization.

Metadata updated:

- The implemented educational-preview routes above now report as custom TypeScript instead of generic substitute where applicable.

Remaining substitute pages are still educational simplifications, not empty dummy pages.
