// ═══════════════════════════════════════════════════════════════════
//  Choose Your Own Adventure — the library shelf.
//
//  One entry per book. To add a book:
//    1. Copy an existing book folder (e.g. aethelgard/) to a new slug,
//       replace its pages.js, and empty its audio/ folder.
//    2. Drop a cover image at covers/<slug>.webp. The cover art carries
//       the title itself, so nothing is drawn over it — keep any text
//       inside the image.
//    3. Add an entry below.
//
//  Fields:
//    slug   folder name under /tools/cyoa/, and the cover's filename.
//    title  used for the link's accessible name and the cover's alt
//           text. Not drawn on the page; the cover image shows it.
//    ready  false while the book has no pages yet. The shelf then
//           shows the cover as a placeholder instead of a link.
// ═══════════════════════════════════════════════════════════════════

const CYOA_BOOKS = [
  { slug: "aethelgard", title: "Twin Paths of Aethelgard", ready: true },
  { slug: "boba",       title: "Boba & Beyond",            ready: true  },
];
