# Community website implementation

## Design plan and review
Reuse MBH’s existing navy #0f1b3d, secondary navy #1a2d5e, gold #D4A843, white #FFFFFF and gray #F9FAFB. Keep Inter, existing bold heading scale, max-w-7xl containers, rounded-xl photography and gold buttons. The distinctive element is real people and practical event support, without a new visual brand or monetary counter.

Homepage: existing sections → community copy / six-photo mosaic → shared footer CTA.
Community: MBH hero / Bella photo → Harbour Festival portrait / practical Easter support → raft and Bella stories → gallery → grouped organisation directory.
About: shared compact community section before final CTA.

Review against brief: the earlier blue/Avenir concept is superseded by the site’s actual navy/gold/Inter styling. Existing product and quotation sections remain unchanged.

## Content and photos
James supplied the Downloads photographs and explicitly confirmed Gladstone United’s women’s football photo and the Harbour Festival representative holding the MBH sign. The latter is the main festival image. Original images copied unchanged; Next Image supplies responsive sizing and lazy loading. The photo-source JSON maps each renamed file to its original filename. The two Easter facility photos are from the company’s 4 April 2026 yacht-race social post, collected during the prior research.

Evergreen page: photos span multiple years, explicitly described as such. No annual totals, donor amounts or accounting records are included. Staff shoots and priced Go Kart/McCosker enquiries are excluded. The Bella cheque photo is excluded because its figure represents fundraiser proceeds, not MBH’s contribution. ATRA remains in the organisation list; the watermarked action photo was not selected. Older MTB event graphics were not selected for the main gallery.

Owner-confirmed undated relationships use general support wording. Benaraby is described as road-barrier support without a date or assertion of completed installation. Wider Group support is separately credited. The support directory is editorial content, not a claim that every partnership is a current annual sponsorship.

## Release
Existing MBH Next.js project, Vercel project multitrade-site, repository jamessteele1/MultitradeWebsite. No new dependencies or environment variables.
