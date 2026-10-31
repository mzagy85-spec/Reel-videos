// Source registry: claim, reference, review date and owner. Shown to adults in the parent drawer.
// Dates are when the reference was listed for this project brief. Recheck mutable claims before release.

import type { SourceRecord } from './schema';

export const sources: SourceRecord[] = [
  {
    id: 'brand-guide',
    claim: { ar: 'الألوان والخط والشعار والأسهم والأيقونات', en: 'Colours, typeface, logo, arrows and icons' },
    ref: 'Supplied file: Gulf Bank Brand Guidelines 2026 (Brand Guidelines 26.pdf), PDF pages 5–6, 10, 12, 14–15, 17–19',
    reviewed: '2026-10-31',
    owner: 'Gulf Bank Brand',
  },
  {
    id: 'cbk-banknotes',
    claim: { ar: 'الدينار الكويتي = 1000 فلس، وفئات الأوراق النقدية', en: '1 Kuwaiti dinar = 1,000 fils; banknote denominations' },
    ref: 'https://www.cbk.gov.kw/en/banknotes-and-coins/banknotes/introduction',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Editorial / Compliance',
  },
  {
    id: 'cbk-coins',
    claim: { ar: 'فئات العملات المعدنية: 5 و10 و20 و50 و100 فلس', en: 'Coin denominations: 5, 10, 20, 50 and 100 fils' },
    ref: 'https://www.cbk.gov.kw/en/banknotes-and-coins/coins',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Editorial / Compliance',
  },
  {
    id: 'gb-phishing',
    claim: { ar: 'عدم مشاركة الرقم السري ورمز التحقّق، والحذر من الروابط', en: 'Never share a PIN or OTP; be careful with links' },
    ref: 'https://www.e-gulfbank.com/en/direct-banking/safe-banking/avoid-phishing/',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Information Security',
  },
  {
    id: 'gb-diraya-2025',
    claim: { ar: 'دعم بنك الخليج لحملة «لنكن على دراية» والتوعية المالية', en: "Gulf Bank's support for Diraya and financial literacy" },
    ref: 'https://www.e-gulfbank.com/en/about-us/media/press-releases/2025/03/gulf-bank-reaffirms-commitment-to-diraya-campaign-promoting-financial-literacy-customer-protection-and-safe-banking-practices/',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Marketing',
  },
  {
    id: 'cbk-diraya-2021',
    claim: { ar: 'الحملة بإشراف بنك الكويت المركزي وإدارة اتحاد مصارف الكويت وبمشاركة البنوك', en: 'Campaign overseen by CBK, managed by the Kuwait Banking Association, with banks taking part' },
    ref: 'https://www.cbk.gov.kw/en/cbk-news/announcements-and-press-releases/press-releases/2021/01/cbk-launching-diraya-financial-awareness-campaign',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Compliance',
  },
  {
    id: 'diraya-about',
    claim: { ar: 'وصف حملة «لنكن على دراية»', en: 'Description of the Diraya campaign' },
    ref: 'https://www.dirayakw.com/ar/about',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Marketing / Compliance',
  },
  {
    id: 'cfpb-youth',
    claim: { ar: 'مبادئ تعلّم المال حسب العمر (مرجع تربوي عام فقط)', en: 'Age-appropriate money learning principles (general educational background only)' },
    ref: 'https://www.consumerfinance.gov/consumer-tools/educator-tool/youth-financial-education/learn/',
    reviewed: '2026-11-01 (brief); recheck before release',
    owner: 'Editorial',
  },
  {
    id: 'neo-deck-2023',
    claim: { ar: 'حساب neo: الفئة العمرية ومبلغ الفتح والفوائد وطريقة الفتح، والشعار والألوان', en: 'neo account: age range, opening amount, interest, how to open; logo and palette' },
    ref: 'Supplied file: NEO_presentation_202309_07.pdf (BPG, July 2023), pages 7-9, 17, 22-27; neo character from the supplied "neo premiere" banner',
    reviewed: '2026-10-31',
    owner: 'Marketing / Compliance',
  },
  {
    id: 'gb-neo-page',
    claim: { ar: 'الشروط الحالية لحساب neo', en: 'Current neo account terms' },
    ref: 'https://www.e-gulfbank.com/en/personal/accounts/youth-programs/neo-account/ (not reachable from the build environment; NOT yet checked)',
    reviewed: 'pending',
    owner: 'Compliance',
  },
  {
    id: 'wcag22',
    claim: { ar: 'معيار إمكانية الوصول WCAG 2.2', en: 'Accessibility standard WCAG 2.2' },
    ref: 'https://www.w3.org/TR/WCAG22/',
    reviewed: '2026-11-01 (brief)',
    owner: 'Accessibility',
  },
];
