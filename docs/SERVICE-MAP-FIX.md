# Service-area map repair — 11 October 2026

The homepage Hire Service Area and Sales Australia-Wide maps displayed CARTO's API KEY REQUIRED watermark. Replaced the two raster tile URLs with the OpenStreetMap standard endpoint and updated visible attribution. Existing Leaflet interactions, coverage shapes, yard markers, map sizing and MBH styling remain intact.

Provider references:
- https://www.carto.com/basemaps/apikey/
- https://operations.osmfoundation.org/policies/tiles/

Normal browser tile loading retains browser caching and referrer behaviour; no proxy, bulk download or offline prefetch is introduced. No API credentials or new paid service are required.

Validation before release: Next.js production build passed, including lint and type checks (147 routes); both map tabs visually checked; mobile hire map at 390px has no horizontal overflow and zoom loads the next zoom level. Existing unrelated changes in the primary checkout were excluded by using a clean worktree from origin/main.
