# Schema.org 30.1 audit

This note records the one-time vocabulary review performed for the 0.9 stabilization
release. The source of truth was the official Schema.org 30.1 JSON-LD release snapshot:

<https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/30.1/schemaorg-current-https.jsonld>

## Scope and result

- The 53 exported builder functions emit 50 unique Schema.org types. All emitted types
  exist in 30.1.
- Every modeled top-level output property was checked for existence, domain compatibility,
  range compatibility, and supersession in 30.1.
- The public catalog is a curated subset of Schema.org, not a complete implementation of
  the vocabulary.
- No removed type is used and no other known superseded term remains presented as current.

The reviewed surface covers the common, content, commerce, identity, and lodging schemas,
including the high-risk Article, Recipe, Event, JobPosting, Product, Offer, Service,
Organization, LocalBusiness, Restaurant, Store, LodgingBusiness, Hotel, VacationRental,
Dataset, ProfilePage, FAQPage, QAPage, HowTo, VideoObject, SoftwareApplication,
WebApplication, and MobileApplication families.

## Corrections and intentional input adapters

| Surface | 30.1 finding | Decision for 0.9 |
| --- | --- | --- |
| `Restaurant.menu` | `menu` is superseded by `hasMenu` | Replace it with `hasMenu`; cover the breaking pre-v1 correction in tests, migration docs, and changelog. |
| `servesCuisine`, `hasMenu` | Their domain is `FoodEstablishment` | Scope them to `Restaurant`; remove them from generic `LocalBusiness`, `Store`, and lodging inputs. |
| `FAQPage.questions` | Library input helper, not emitted vocabulary | Transform it to `mainEntity`. |
| `WebSite.searchUrl` | Library input helper, not emitted vocabulary | Transform it to a `potentialAction` SearchAction. |
| QA `question` / `answer` shorthands | Library input helpers | Transform them to the modeled Question/Answer output. |
| `query-input` | SearchAction EntryPoint key | Preserve it as an emitted Schema.org key where that helper creates the EntryPoint. |

## Schema.org and Google boundary

Base builders validate the library's curated Schema.org model. Required fields on those
builders are intentional minimum viable-entity rules in the library contract; they do not
claim complete Google validation or guarantee rich-result eligibility. Additional Google
constraints live only in explicitly named profiles such as `GoogleArticle` and
`GoogleRecipe`.

This audit is deliberately offline in CI. Builder tests and the public-package fixture
encode the reviewed result; CI does not download the Schema.org vocabulary.
