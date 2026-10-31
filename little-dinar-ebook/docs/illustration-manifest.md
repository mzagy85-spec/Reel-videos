# Illustration manifest

Origin for every asset below: original hand-authored SVG by Claude Code for this project. No third-party assets and no AI image generation.
Usage rights: commissioned work product for Gulf Bank review. No third-party licences are involved.
Editable source: `src/illustrations/scenes.tsx`, `characters.tsx`, `common.tsx`, `MapArt.tsx`. Preview every asset with `npx vite` and open `/illustration-gallery.html` (dev only, not in the production build).

## Format

- Canvas is 1200 x 900. The `wide` crop (desktop) uses `viewBox 0 0 1200 900`. The `tall` crop uses `viewBox 150 100 900 800` (9:8). The reader currently shows the full `wide` canvas (4:3) at every width, because the tall crop cut characters at the edges of some scenes. `tall` stays available for future art that is composed for it.
- Layers, in order: `layer-bg`, `layer-mid`, `layer-chars`, `layer-fg`.
- Ambient-motion hooks are classes only, with no keyframes in the art: `amb-drift` (clouds, sea lines), `amb-bob` (dhows), `amb-twinkle` (sparkles, lantern glow), `amb-sway` (palms, plants). Every scene looks complete when static.
- Protected text areas: none. The reader shows live text beside the art, never on top of it. Prices on the compare shelf use blank tags, and the bank sign panels are left blank so the app can overlay the official logo:
  - `bank-branch`: x 420 to 780, y 110 to 190 (canvas)
  - map bank region: x 680 to 820, y 360 to 400 (map coordinates), which is local x 80 to 220, y 60 to 100 of the bank cell
- Key subjects stay inside x 170 to 1030.
- Protected areas for live text: none are needed, because live text, numbers and the logo never sit on top of the art. They are rendered in HTML beside it, or as an overlay on the blank sign panels (bank-branch: x 420 to 780, y 110 to 190; map bank cell: x 680 to 820, y 360 to 400). The tall crop keeps the children's feet (down to about y 880). The sky above y 100 is trimmed.

## Scenes

| Scene id | Page(s) | Environment | Characters | Alt text (EN) | Alt text (AR) |
|---|---|---|---|---|---|
| waterfront-day | 1 | Kuwait corniche by day, Kuwait Towers, dhow, palms | Hessa (wave), Hamad (savings jar) | Hessa and Hamad on the waterfront with the Kuwait Towers behind them. Hamad holds a savings jar. | حصة وحمد على الواجهة البحرية وخلفهما أبراج الكويت، وحمد يحمل حصّالة. |
| reading-corner | 2 | Home reading corner, majlis seating, Sadu-style cushions, rug with three stepping stones (bag, jar, heart) | Mama reading, Hamad sitting, Hessa pointing | The family reads together at home. A path of three stones on the rug shows spend, save and help. | العائلة تقرأ معًا في البيت، وعلى السجادة ثلاث خطوات: الإنفاق والادخار والمساعدة. |
| tabletop | 3, 5 | Wooden table with felt tray, notebook, pencil, bowl | Hessa thinking, Hamad pointing | Hessa and Hamad lean over a wooden table, ready to count learning tokens. | حصة وحمد عند طاولة خشبية يستعدّان لعدّ القطع التعليمية. |
| school-bag | 4 | Kid's bedroom, open school bag, water bottle, pencil, glitter pencil, toy car | Hessa pointing, Hamad thinking | A school bag on the bed with a water bottle, a pencil, a sparkly pencil and a toy car. | حقيبة مدرسية على السرير، وبجانبها قنينة ماء وقلم وقلم لامع وسيارة لعبة. |
| souq-goal | 6 | Souq Al-Mubarakiya-style covered lane with lanterns and spice sacks; stall with a storybook, art kit and football | Mama, Hamad (wow), Hessa (point) | In a traditional covered souq, the children look at a storybook, an art kit and a football. | في سوق تراثي مسقوف، ينظر الطفلان إلى قصة وعلبة ألوان وكرة قدم. |
| coop-store | 7 | Neighbourhood cooperative store with shelves, produce, trolley and checkout | Cashier, Hessa, Hamad (basket) | Inside a neighbourhood co-op, the children shop with a small basket near the checkout. | داخل جمعية الحي، يتسوّق الطفلان بسلّة صغيرة قرب المحاسب. |
| compare-shelf | 8 | Stationery shelf with two identical notebooks and blank price tags | Hessa thinking, Hamad (basket) | Two identical notebooks sit side by side on a shelf while Hessa compares them. | دفتران متطابقان على الرف، وحصة تقارن بينهما. |
| bank-branch | 9 | Contemporary bank branch frontage, glass, plants, blank sign panel | Banker waving, Mama, Hessa, Hamad | The family arrives at a welcoming bank branch, and a staff member waves hello. | العائلة تصل إلى فرع بنك مرحِّب، وموظفة تلوّح بالتحية. |
| bank-counter | 10 | Branch service counter with wallet and account folder | Banker, Mama, Hessa, Hamad | At the bank counter, a wallet and an account folder sit side by side. | عند كاونتر البنك، محفظة وملف حساب جنبًا إلى جنب. |
| card-atm | 11 | Two separate zones: shop counter with payment terminal (left), ATM wall (right) | Mama with a plain card in the centre, Hessa, Hamad | On one side Mama pays at a shop terminal; on the other side is an ATM. These are two separate examples. | في جهة تدفع الأم عند جهاز الدفع، وفي الجهة الأخرى صرّاف آلي، وهما مثالان منفصلان. |
| message-home | 12 | Sofa at home, tablet, large fictional message bubble with a gift shape and blank lines | Hessa, Hamad, Mama coming to help | The children see a pretend message promising a gift and stop to ask Mama for help. | يرى الطفلان رسالة تخيّلية تعد بهدية، فيتوقّفان ويطلبان المساعدة من أمّهما. |
| helping-home | 13 | Family room, tea tray with dallah and dates | Hessa fixing a pencil case, Hamad sharing a book, cousin, grandma | Hessa fixes her pencil case, Hamad shares a book with a younger cousin, and Grandma has tea. | حصة تصلح مقلمتها، وحمد يشارك قصة مع ابن عمّه الصغير، والجدة تشرب الشاي. |
| notebook-desk | 14 | Desk with an open grid notebook, pencil cup and plant | Hessa cheering, Hamad pointing | Hessa and Hamad lean over an open grid notebook, ready to solve a crossword. | حصة وحمد أمام دفتر مربّعات مفتوح، مستعدّان لحلّ الكلمات المتقاطعة. |
| waterfront-sunset | 15 | Same corniche at sunset, towers in silhouette, sparkles | Hessa and Hamad cheering, Mama | At sunset by the sea, Hessa and Hamad cheer with Mama. | عند الغروب على البحر، يحتفل حصة وحمد مع أمّهما. |

That makes 14 scenes across 12 distinct environments: corniche (day and sunset), reading corner, tabletop, bedroom, souq, co-op, stationery shelf, bank exterior, bank counter, shop/ATM, living room sofa, family room and desk. Page 9 also uses the map below.

## Map (page 9 jigsaw)

`MapArt` is a 900 x 600 illustrated learning map. It is not geographically accurate and not a branch locator. It splits into six 300 x 300 pieces. Roads cross the piece borders so the pieces visibly connect.

| Region | Cell | Content |
|---|---|---|
| towers | col 0, row 0 | Sea and the Kuwait Towers |
| waterfront | col 1, row 0 | Corniche, palms, dhow, benches |
| park | col 2, row 0 | Community park, playground, shaded benches, small library kiosk |
| home | col 0, row 1 | House with courtyard and palm |
| coop | col 1, row 1 | Cooperative store with trolleys |
| bank | col 2, row 1 | Contemporary bank building with a blank sign panel |

`ghost` renders the whole map desaturated at about 38% alpha, for the board silhouette and the hint.

## Props

- `KuwaitTowers`: main tower with two spheres (large lower sphere, small upper sphere), second tower with one sphere, third tower as a plain needle. Spheres carry a blue-green sequin dot pattern. A `silhouette` variant is used at sunset.
- `Dhow`: brown wooden hull with a cream lateen sail. It is drawn to look clearly unlike the Gulf Bank logo's outlined red sail and blue hull.
- `SavingsJar`: glass jar with a grey lid, filled with plain gold tokens that have no markings.

## Optional image-generation upgrade

If the bank later commissions raster art, each prompt below is ready to use. Generate both crops and keep the existing SVG as the fallback.

Base prompt (reused for every scene):

> Create a refined children's financial-literacy storybook illustration set in Kuwait, featuring the same approved Hessa and Hamad character references. Softly modelled 2.5D illustration, tactile materials, friendly expressions, authentic contemporary Kuwaiti surroundings, elegant editorial composition, calm negative space for live text, gentle directional light, Gulf Bank red and blue accents. Scene: [PAGE SCENE]. Camera and crop: [DESKTOP/PORTRAIT]. Keep faces, hands, architecture, and clothing consistent. No embedded words, digits, logos, payment-card details, or realistic banknote artwork. Supply separable foreground, characters, objects, and background where supported.

Replace `[PAGE SCENE]` with one of the scene descriptions below, and `[DESKTOP/PORTRAIT]` with "desktop 4:3 wide shot" or "portrait 5:4 closer crop, subjects centred".

1. waterfront-day: "Daytime Kuwait corniche promenade with the real Kuwait Towers (main tower with two blue-green sequinned spheres, second tower with one sphere, third plain needle), a small brown wooden dhow with a cream lateen sail on the sea, palm trees, Hessa waving and Hamad holding a glass savings jar."
2. reading-corner: "Cosy Kuwaiti family reading corner with low majlis seating and Sadu-pattern cushions, a bookshelf and window light; Mama in a black abaya and grey hijab reads with Hessa and Hamad; a rug with three stepping stones showing a bag, a jar and a heart."
3. tabletop: "Close three-quarter view of a warm wooden table with an empty felt tray, a notebook, a pencil and a ceramic bowl; Hessa and Hamad lean in from behind; keep the centre of the table empty."
4. school-bag: "A child's bedroom with an open school bag on the bed, a water bottle, a plain pencil, a sparkly decorative pencil and a small toy car; Hamad thinks and Hessa points."
5. souq-goal: "A covered lane in Souq Al-Mubarakiya with wooden ceiling beams, arches, warm lanterns and spice sacks; a stall shows a storybook, an art kit and a football with no price tags; Mama with Hessa and Hamad."
6. coop-store: "Interior of a Kuwaiti neighbourhood cooperative store (jam'iya) with aisles, produce, a stationery shelf, a trolley and a checkout with a friendly cashier; the children carry a small basket; no retail logos."
7. compare-shelf: "Close shelf view with two identical blue notebooks side by side, each with a blank price tag; Hessa compares them with her hand at her chin while Hamad holds a basket."
8. bank-branch: "Welcoming contemporary bank branch frontage with glass, plants and seating, and a blank sign panel above the entrance for the official logo to be added later; a staff member in a navy hijab waves as Mama and the children arrive."
9. bank-counter: "Bright bank service counter with a smiling staff member; a wallet and a plain account folder on the counter; Mama, Hessa and Hamad stand side by side."
10. card-atm: "Two clearly separate zones: on the left a shop counter with a payment terminal where Mama holds a plain card with no numbers; on the right an ATM in a wall with a blank screen; Hessa and Hamad watch; Mama stands between the zones."
11. message-home: "Hessa and Hamad sit on a sofa with a tablet; a large, clearly fictional friendly message bubble with a gift shape and blank lines floats above; Mama comes over to help; calm and reassuring."
12. helping-home: "Warm family room: Hessa repairs a pencil case with tape, Hamad shares a book with a younger cousin, and Grandma sits with a tray of Arabic coffee pot (dallah) and dates."
13. notebook-desk: "Top-down desk with an open grid-paper notebook, a pencil cup and a small plant; Hessa and Hamad lean in happily; no letters on the grid."
14. waterfront-sunset: "The same corniche at warm sunset with the Kuwait Towers in silhouette and warm rim light, a dhow on the water, gentle sparkles, Hessa and Hamad cheering with Mama nearby."
