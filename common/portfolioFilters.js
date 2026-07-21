// Single source of truth for the portfolio filter chips.
// Used by both the public page (components/p-masonry/Portfolio.jsx) and the
// admin panel (app/admin/portfolio/page.js) so the two always match.

// Chips that always appear, even before any item uses them.
export const PINNED_CATEGORIES = ['Website Design'];

// Special filters that match on a property rather than the category field.
export const F_VIDEOS = 'Videos';
export const F_SOCIAL = 'Social Media Posts';
export const SPECIAL_FILTERS = [F_VIDEOS, F_SOCIAL];

// Categories that never get their own chip:
//  - 'Social Media' is superseded by the "Social Media Posts" filter
//  - 'Web Design' is a legacy duplicate of 'Website Design'
// Their items still appear under "All".
export const HIDDEN_CATEGORIES = ['Social Media', 'Web Design'];

// Build the ordered chip list from the categories present in the data.
export function buildFilterList(foundCategories) {
  const found = [...new Set((foundCategories || []).filter(Boolean))];
  const pinned = PINNED_CATEGORIES.filter((c) => !found.includes(c));
  return [
    ...SPECIAL_FILTERS,
    ...[...found, ...pinned].filter((c) => !HIDDEN_CATEGORIES.includes(c)),
  ];
}

// Does an item belong under the given filter? (`all` handled by the caller,
// since the public page additionally hides website entries from "All".)
export function matchesFilter(item, filter) {
  if (filter === F_VIDEOS) return Boolean(item.video_url);
  if (filter === F_SOCIAL) return item.category === 'Social Media';
  return item.category === filter;
}
