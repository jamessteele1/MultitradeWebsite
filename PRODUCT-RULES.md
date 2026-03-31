# Product Service Upgrade Rules

Rules governing which service upgrade prompts appear when adding products to a quote.

## Upgrade Tiers

### Full Service Upgrades (Power + Mine-Spec + Water Tank)
These products get the complete dialog flow.

| Product | Plug Size | Water Tank Question |
|---------|-----------|-------------------|
| 12x3m Office | 32A single phase | No |
| 6x3m Office | 15A | No |
| 6x3m Supervisor Office | 15A | No |
| 3x3m Office | 15A | No |
| 20ft Container Office | 15A | No |
| Gatehouse | 32A single phase | No |
| 12x3m Crib Room | 32A single phase | Yes |
| 6x3m Crib Room | 15A | Yes |
| 6x3m Toilet Block | 15A | Yes |
| 3.6x2.4m Toilet | 15A | Yes |
| 4.2x3m Shower Block | 15A | Yes |
| Bathhouse | - | No (mine-spec only) |
| All Complexes (12x6m, 12x9m, 12x12m, Custom) | 32A single phase | No |

### Mine-Spec Only (No Power, No Water Tank)
Self-contained/solar buildings that have their own power and water. Only asked about mine-spec electrical compliance.

| Product | Reason |
|---------|--------|
| Self-Contained Supervisor Office | Has own power/water |
| 12x3m Mobile Crib | 11.2kVA Kubota generator + onboard water |
| 6.6x3m Self-Contained Crib | Has own power/water |
| 7.2x3m Self-Contained Crib | Has own power/water |
| 9.6x3m Living Quarters | Has own power/water |
| Solar Facility | 20.5kW battery, off-grid solar (standard is mine-spec but good to confirm) |
| Bathhouse | Custom build, mine-spec question only |

### No Service Upgrades
These products skip the dialog entirely and add straight to cart.

| Product | Reason |
|---------|--------|
| All Containers | Storage only, no electrical fit-out |
| All Ancillary Items | Accessories (tanks, decks, stairs, etc.) |
| Solar Toilet | Fully self-contained, already mine-spec |
| Chemical Toilet | Portable, no electrical |
| PWD Chemical Toilet | Portable, no electrical |

## Plug Size Rules

- **15A** -- Buildings smaller than 9x3m (6x3m, 3x3m, 3.6x2.4m, etc.)
- **32A single phase** -- 12x3m buildings and larger, or buildings with more than 1 AC unit

## Water Tank Rules

- Only offered for **crib rooms** and **ablutions** (not offices, complexes, or containers)
- Uses existing `5000l-tank-pump` product (5000L skid-mounted tank with pressure pump)
- Added as a separate ancillary cart line item
- If a tank is already in the cart, the question is skipped for subsequent products

## Implementation Reference

- Product ID sets: `NO_UPGRADES` and `MINE_SPEC_ONLY` in `src/components/AddToQuoteButton.tsx`
- Dialog component: `src/components/ServiceUpgradesDialog.tsx` (`mineSpecOnly` prop)
- Cart type: `ServiceUpgrades` in `src/context/QuoteCartContext.tsx`
