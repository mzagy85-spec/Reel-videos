// neo: Gulf Bank's savings account for children, and its character.
//
// Sources: the supplied "NEO savings account" presentation (BPG, July 2023: positioning, body copy, icon copy,
// call to action, logo, palette, brand elements) and the supplied "neo premiere" banner (character artwork).
// The live product page (e-gulfbank.com .../youth-programs/neo-account/) could not be reached from the build
// environment, so the product facts below are NOT yet checked against current terms. Compliance must confirm
// them before release. Set `showAccountFacts: false` to hide the facts and keep only the general mention.
//
// The guide lines are DRAFT dialogue written for this book. They restate the book's lessons and make no
// product claims. Marketing must approve them as neo's voice, or replace them.

import type { L10n, PageId, SourceId } from './schema';

export const neoConfig = {
  /** Shows neo's guide bubbles, the page 9 panel and the parent information. */
  enabled: true,
  /** Shows the account facts (age range, opening amount, interest, how to open) to parents. */
  showAccountFacts: true,
};

/** Draft guide lines, one per page where neo appears. Pages not listed show no guide. */
export const neoGuide: Partial<Record<PageId, L10n>> = {
  cover: {
    ar: 'مرحبًا! أنا neo من بنك الخليج. هيّا نكتشف المال معًا!',
    en: "Hi! I'm neo from Gulf Bank. Let's discover money together!",
  },
  'needs-wants': {
    ar: 'مشاهدة فيلم مع العائلة شيء ممتع نرغب فيه. أخطّط له بعد أن أشتري ما أحتاجه.',
    en: 'A family movie night is a fun want. I plan for it after I buy what I need.',
  },
  'savings-goal': {
    ar: 'أدّخر قليلًا كل أسبوع، فيقترب هدفي خطوة بعد خطوة.',
    en: 'I save a little every week, and my goal gets closer step by step.',
  },
  'my-step': {
    ar: 'أحسنت! خطوة صغيرة اليوم، وتكبر معك كل يوم.',
    en: 'Well done! One small step today, and it grows with you every day.',
  },
};

export const neoCopy = {
  name: { ar: 'neo', en: 'neo' },
  characterAlt: {
    ar: 'neo، شخصية بنك الخليج الحمراء، يحمل الفشار وتذاكر السينما ويبتسم.',
    en: "neo, Gulf Bank's red character, smiling with popcorn and cinema tickets.",
  },
  logoAlt: { ar: 'شعار neo من بنك الخليج', en: 'neo from Gulf Bank logo' },
  says: { ar: 'يقول neo', en: 'neo says' },
  /** Brand line from the 2023 presentation. Arabic only; no approved English line was supplied. */
  taglineAr: 'دوم نكبر مع بعض',

  // Page 9: child-level mention. No product terms, no call to open an account.
  meetTitle: { ar: 'تعرّف على حساب neo', en: 'Meet the neo account' },
  meetText: {
    ar: 'حساب neo من بنك الخليج حساب توفير للأطفال. يفتحه وليّ الأمر لطفله، ليبدأ الادخار ويتعلّم كيف يتّخذ قراراته المالية.',
    en: 'neo from Gulf Bank is a savings account for children. A parent or guardian opens it, so the child can start saving and learn to make money choices.',
  },
  meetAsk: { ar: 'اسأل وليّ أمرك عنه.', en: 'Ask your parent or guardian about it.' },

  // Parent drawer and page 15 closing information.
  parentTitle: { ar: 'حساب neo من بنك الخليج', en: 'The neo account from Gulf Bank' },
  parentIntro: {
    ar: 'حساب neo يرحّب بالصغار في عالم التوفير لتطوير مقدراتهم على اتخاذ القرارات المالية. خطوة صغيرة نحو تغيير كبير في حياة الجيل الجديد.',
    en: 'The neo account welcomes children into the world of saving and helps them build their ability to make money decisions. A small step towards a big change for the new generation.',
  },
  factsTitle: { ar: 'باختصار', en: 'In short' },
  facts: [
    { ar: 'للأطفال من عمر 0 حتى 14 عامًا', en: 'For children aged 0 to 14' },
    { ar: 'فتح الحساب: 10 د.ك.', en: 'Opening the account: 10 KWD' },
    { ar: 'حساب توفير مع فوائد', en: 'A savings account that earns interest' },
    { ar: 'يفتحه وليّ الأمر عبر تطبيق بنك الخليج', en: 'Opened by a parent or guardian through the Gulf Bank app' },
  ] as L10n[],
  factsNote: {
    ar: 'المعلومات من مواد حساب neo لعام 2023. يُرجى التأكد من الشروط الحالية لدى بنك الخليج قبل فتح أي حساب.',
    en: "Details are from Gulf Bank's 2023 neo materials. Please check the current terms with Gulf Bank before opening any account.",
  },
  optional: {
    ar: 'هذا اختياري تمامًا. لا يتطلّب أي جزء من الكتاب فتح حساب.',
    en: 'This is completely optional. Nothing in this book requires opening an account.',
  },
  moreInfo: { ar: 'لمزيد من المعلومات', en: 'More information' },
  url: 'www.e-gulfbank.com/en/personal/accounts/youth-programs/neo-account/',
  glossaryTerm: { ar: 'حساب neo', en: 'neo account' },
  glossaryDef: {
    ar: 'حساب توفير للأطفال من بنك الخليج، يفتحه وليّ الأمر.',
    en: 'A Gulf Bank savings account for children, opened by a parent or guardian.',
  },
};

/** Cover (page 1) introduction: a small, child-friendly explainer of the account and its features.
 *  Items marked `fact` come from the 2023 materials and are hidden when showAccountFacts is false. */
export const neoIntro = {
  title: { ar: 'ما هو حساب neo؟', en: 'What is the neo account?' },
  lead: {
    ar: 'حساب توفير من بنك الخليج صُمّم للأطفال، ليتعلّموا الادخار منذ الصغر.',
    en: 'A Gulf Bank savings account made for children, so they can learn to save from an early age.',
  },
  features: [
    { icon: 'parents', fact: true, text: { ar: 'يفتحه وليّ الأمر للأطفال من عمر 0 حتى 14 عامًا.', en: 'A parent or guardian opens it for children aged 0 to 14.' } },
    { icon: 'save', fact: true, text: { ar: 'حساب توفير يُفتح بمبلغ 10 د.ك.', en: 'A savings account that opens with 10 KWD.' } },
    { icon: 'star', fact: true, text: { ar: 'يحصل على فوائد: مبلغ صغير إضافي يضيفه البنك إلى المدخرات مع الوقت.', en: 'It earns interest: a small extra amount the bank adds to savings over time.' } },
    { icon: 'account', fact: true, text: { ar: 'يُفتح عبر تطبيق بنك الخليج.', en: 'It is opened through the Gulf Bank app.' } },
    { icon: 'target', fact: false, text: { ar: 'يساعد الأطفال على التدرّب على اتخاذ قراراتهم المالية.', en: 'It helps children practise making their own money choices.' } },
  ] as { icon: 'parents' | 'save' | 'star' | 'account' | 'target'; fact: boolean; text: L10n }[],
  note: {
    ar: 'التفاصيل من مواد عام 2023 وقد تتغيّر. يمكن لوليّ الأمر التأكد من أحدث الشروط لدى بنك الخليج. الكتاب لا يتطلّب فتح أي حساب.',
    en: 'Details are from 2023 materials and may change. A grown-up can check the latest terms with Gulf Bank. The book does not require opening any account.',
  },
};

export const neoSources: SourceId[] = ['neo-deck-2023', 'gb-neo-page'];
