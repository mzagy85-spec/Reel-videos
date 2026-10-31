// The 15 shared page records. Edit copy here; components read it by pageId.
// Marketing/editorial: keep story text short (about 20 to 40 words) and keep the arithmetic unchanged.

import type { PageRecord } from './schema';

const NO_AUDIO = { ar: null, en: null };

export const pages: PageRecord[] = [
  {
    pageId: 'cover',
    number: 1,
    navLabel: { ar: 'الغلاف', en: 'Cover' },
    title: { ar: 'رحلة الدينار الصغير', en: 'The Little Dinar Journey' },
    story: {
      ar: 'انضمّ إلى حصة وحمد في رحلة ممتعة حول الكويت. نكتشف قيمة المال، ونتعلّم كيف نختار وندّخر!',
      en: 'Join Hessa and Hamad on a fun journey around Kuwait. Discover the value of money and learn how to choose and save!',
    },
    instruction: { ar: 'اختر لغتك، ثم اضغط «ابدأ الرحلة».', en: 'Choose your language, then press "Start the journey".' },
    scene: {
      id: 'waterfront-day',
      alt: {
        ar: 'حصة وحمد على الواجهة البحرية في الكويت، وخلفهما أبراج الكويت وسفينة شراعية تقليدية. حمد يحمل حصالة زجاجية.',
        en: 'Hessa and Hamad on the Kuwait waterfront with the Kuwait Towers and a traditional dhow behind them. Hamad holds a glass savings jar.',
      },
    },
    interaction: 'cover',
    concept: 'choices',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['brand-guide', 'diraya-about'],
  },
  {
    pageId: 'money-choices',
    number: 2,
    navLabel: { ar: 'أتعامل مع المال بذكاء', en: 'Thoughtful money choices' },
    title: { ar: 'أتعامل مع المال بذكاء', en: 'Making thoughtful money choices' },
    story: {
      ar: 'الثقافة المالية تعني أن نفهم المال ونختار كيف نستخدمه. يكسب الكبار المال من العمل، وقد نحصل على مصروف أو عيدية. نستطيع أن ننفق جزءًا، وندّخر جزءًا، ونساعد الآخرين.',
      en: 'Financial literacy means understanding money and choosing how to use it. Adults earn money through work. We may receive pocket money or Eid gifts. We can spend some, save some, and help others.',
    },
    instruction: { ar: 'اضغط على كل خيار لترى مثالًا من حياتنا.', en: 'Tap each choice to see an everyday example.' },
    explain: {
      ar: 'ليست كل الأسر متشابهة. بعض الأطفال يحصلون على مصروف وبعضهم لا، وهذا طبيعي. المهم أن نفكّر قبل أن نستخدم المال.',
      en: 'Every family is different. Some children get pocket money and some do not, and that is fine. What matters is thinking before we use money.',
    },
    scene: {
      id: 'reading-corner',
      alt: {
        ar: 'ركن القراءة في البيت. الأم تقرأ مع حصة وحمد، وعلى السجادة طريق صغير فيه ثلاث خطوات: حقيبة تسوّق وحصالة وقلب.',
        en: 'A family reading corner at home. Mum reads with Hessa and Hamad. On the rug, a little path has three stepping stones: a shopping bag, a jar and a heart.',
      },
    },
    interaction: 'moneyChoices',
    concept: 'choices',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'meet-dinar',
    number: 3,
    navLabel: { ar: 'تعرّف على الدينار', en: 'Meet the dinar' },
    title: { ar: 'تعرّف على الدينار الكويتي', en: 'Meet the Kuwaiti dinar' },
    story: {
      ar: 'عملتنا هي الدينار الكويتي. كل دينار يساوي 1000 فلس. عشر قطع تعليمية، قيمة كل منها 100 فلس، تكوّن دينارًا واحدًا.',
      en: 'Our currency is the Kuwaiti dinar. One dinar equals 1,000 fils. Ten learning tokens worth 100 fils each make one dinar.',
    },
    instruction: { ar: 'أضف القطع إلى الصينية واحدة واحدة، وراقب المجموع.', en: 'Add the tokens to the tray one at a time and watch the total.' },
    explain: {
      ar: 'هذه قطع تعليمية للعدّ فقط، وليست صورًا للنقود الحقيقية. في الكويت عملات معدنية من فئة 5 و10 و20 و50 و100 فلس، وأوراق نقدية من ربع دينار إلى 20 دينارًا.',
      en: 'These are learning tokens for counting, not pictures of real money. Kuwait has coins of 5, 10, 20, 50 and 100 fils, and banknotes from a quarter dinar up to 20 dinars.',
    },
    scene: {
      id: 'tabletop',
      alt: {
        ar: 'طاولة خشبية عليها صينية ودفتر وقلم، وحصة وحمد ينحنيان فوقها ليعدّا معًا.',
        en: 'A wooden table with a tray, a notebook and a pencil. Hessa and Hamad lean over it to count together.',
      },
    },
    interaction: 'moneyTokens',
    concept: 'dinar',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['cbk-banknotes', 'cbk-coins'],
  },
  {
    pageId: 'needs-wants',
    number: 4,
    navLabel: { ar: 'أحتاجه أم أرغب فيه؟', en: 'Need or want?' },
    title: { ar: 'أحتاجه أم أرغب فيه؟', en: 'Do I need it or want it?' },
    story: {
      ar: 'بعض الأشياء نحتاجها، مثل الماء وأدوات المدرسة. وأشياء أخرى نرغب فيها للمتعة. نفكّر أولًا: ماذا أحتاج الآن؟ وقد تختلف حاجاتنا من موقف إلى آخر.',
      en: 'We need some things, such as water and school supplies. We want other things for fun. First ask: what do I need now? Our needs can change with the situation.',
    },
    instruction: { ar: 'اقرأ الموقف، ثم اختر: أحتاجه أم أرغب فيه.', en: 'Read the situation, then choose: need or want.' },
    explain: {
      ar: 'الرغبة ليست خطأ. الأشياء الممتعة جميلة، لكن عندما يكون المال قليلًا نبدأ بما نحتاجه.',
      en: 'Wanting something is not wrong. Fun things are nice, but when money is limited we start with what we need.',
    },
    scene: {
      id: 'school-bag',
      alt: {
        ar: 'غرفة طفل فيها حقيبة مدرسية مفتوحة على السرير، وبجانبها قارورة ماء وقلم وقلم لامع وسيارة لعبة صغيرة. حمد يفكّر وحصة تشير.',
        en: "A child's bedroom with an open school bag on the bed, a water bottle, a pencil, a glittery pencil and a small toy car. Hamad is thinking and Hessa is pointing.",
      },
    },
    interaction: 'needsWants',
    concept: 'needs',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'money-plan',
    number: 5,
    navLabel: { ar: 'لكل مبلغ خطة', en: 'Give money a plan' },
    title: { ar: 'لكل مبلغ خطة', en: 'Give your money a plan' },
    story: {
      ar: 'قبل أن أستخدم مالي، أضع له خطة. يمكنني أن أخصّص جزءًا للإنفاق، وجزءًا للادخار، وجزءًا للمساعدة إذا استطعت. أختار ما يناسب هدفي.',
      en: 'Before using my money, I make a plan. I can set some aside to spend, some to save, and some to help if I can. I choose a plan that fits my goal.',
    },
    instruction: { ar: 'وزّع عشر قطع (كل قطعة 100 فلس) على الحصالات الثلاث.', en: 'Share ten tokens (100 fils each) between the three jars.' },
    explain: {
      ar: 'لا توجد خطة واحدة صحيحة للجميع. يمكن أن تبقى حصالة المساعدة فارغة، فالمساعدة قد تكون بالوقت أو الجهد.',
      en: 'There is no single right plan for everyone. The Help jar can stay empty, because helping can also mean time or effort.',
    },
    scene: {
      id: 'tabletop',
      alt: {
        ar: 'طاولة خشبية يجلس حولها حصة وحمد ليخطّطا كيف يوزّعان قطعهما التعليمية.',
        en: 'Hessa and Hamad at a wooden table, planning how to share out their learning tokens.',
      },
    },
    interaction: 'jarPlanner',
    concept: 'plan',
    learningExamples: true,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'savings-goal',
    number: 6,
    navLabel: { ar: 'هدفي يستحق الانتظار', en: 'A goal worth saving for' },
    title: { ar: 'هدفي يستحق الانتظار', en: 'A goal worth saving for' },
    story: {
      ar: 'أختار هدفًا أحبّه، وأعرف كم أحتاج إليه. ثم أدّخر قليلًا كل مرة. إذا كان هدفي 10 دنانير ومعي 5، فأحتاج إلى 5 دنانير أخرى.',
      en: 'I choose a goal I care about and find out how much I need. Then I save a little at a time. If my goal costs 10 dinars and I have 5, I need 5 more.',
    },
    instruction: { ar: 'اختر هدفًا، ثم أضف ادخار كل أسبوع.', en: 'Pick a goal, then add each week’s saving.' },
    explain: {
      ar: 'في هذا المثال ندّخر المبلغ نفسه كل أسبوع، ولا نصرف شيئًا من مال الهدف. في الحياة قد يتغيّر ذلك، فنعدّل خطتنا.',
      en: 'This example saves the same amount every week and spends nothing from the goal money. In real life things can change, and we adjust the plan.',
    },
    scene: {
      id: 'souq-goal',
      alt: {
        ar: 'ممر مسقوف في سوق المباركية بفوانيس دافئة. حصة وحمد مع أمهما ينظران إلى كتاب قصص وعلبة ألوان وكرة قدم على أحد المحلات.',
        en: 'A covered lane in Souq Al-Mubarakiya with warm lanterns. Hessa and Hamad with their mum look at a storybook, an art kit and a football on a stall.',
      },
    },
    interaction: 'savingsGoal',
    concept: 'goal',
    learningExamples: true,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'budget-shop',
    number: 7,
    navLabel: { ar: 'أتسوّق ضمن ميزانيتي', en: 'Shop within your budget' },
    title: { ar: 'أتسوّق ضمن ميزانيتي', en: 'Shop within your budget' },
    story: {
      ar: 'الميزانية خطة للمبلغ الذي أستطيع استخدامه. في الجمعية، أراجع قائمتي والأسعار قبل أن أشتري. وإذا لم يكفِ المال، أختار الأهم أو أنتظر.',
      en: 'A budget is a plan for the money I can use. At the cooperative store, I check my list and the prices before buying. If I do not have enough, I choose what matters most or wait.',
    },
    instruction: { ar: 'ضع ما تحتاجه في السلة، ثم ادفع إذا كفى المال.', en: 'Put what you need in the basket, then pay if there is enough money.' },
    explain: {
      ar: 'إذا كان المجموع أكبر من المال الذي معنا، لا نستدين ولا نأخذ ما ليس لنا. نُرجع شيئًا أو نؤجّله إلى وقت آخر.',
      en: 'If the total is more than the money we have, we do not borrow or take what is not ours. We put something back or leave it for another time.',
    },
    scene: {
      id: 'coop-store',
      alt: {
        ar: 'داخل جمعية تعاونية في الحي: رفوف خضار وأدوات مدرسية، وأمين صندوق مبتسم، وحصة وحمد يحملان سلة تسوّق صغيرة.',
        en: 'Inside a neighbourhood cooperative store: shelves of vegetables and school supplies, a smiling cashier, and Hessa and Hamad with a small shopping basket.',
      },
    },
    interaction: 'shoppingBudget',
    concept: 'budget',
    learningExamples: true,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'compare-change',
    number: 8,
    navLabel: { ar: 'أقارن وأحسب الباقي', en: 'Compare and check change' },
    title: { ar: 'أقارن وأحسب الباقي', en: 'Compare and check your change' },
    story: {
      ar: 'أقارن سعر الشيء نفسه قبل الشراء، وأتأكّد من الجودة والحاجة إليه. وبعد الدفع، أراجع الباقي. الاختيار الجيد يساعدني على استخدام مالي بحكمة.',
      en: 'I compare the price of the same item and think about its quality and whether I need it. After paying, I check my change. Thoughtful choices help me use money wisely.',
    },
    instruction: { ar: 'قارن بين الدفترين، ثم اختر الباقي الصحيح.', en: 'Compare the two notebooks, then pick the right change.' },
    explain: {
      ar: 'هنا الدفتران متطابقان، فلا فرق في الجودة ولا تكاليف أخرى. الأرخص ليس الأفضل دائمًا، وشراء شيء لا نحتاجه لأنه مخفّض ليس ادخارًا.',
      en: 'Here the two notebooks are identical, with the same quality and no extra costs. The cheapest is not always best, and buying something you do not need because it is on offer is not saving.',
    },
    scene: {
      id: 'compare-shelf',
      alt: {
        ar: 'رف عليه دفتران متطابقان لكل منهما بطاقة سعر. حصة تقارن بينهما، وحمد يحمل السلة.',
        en: 'A shelf with two identical notebooks, each with a price tag. Hessa compares them while Hamad holds the basket.',
      },
    },
    interaction: 'compareChange',
    concept: 'compare',
    learningExamples: true,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'bank-map',
    number: 9,
    navLabel: { ar: 'ماذا يفعل البنك؟', en: 'What does a bank do?' },
    title: { ar: 'ماذا يفعل البنك؟', en: 'What does a bank do?' },
    story: {
      ar: 'يساعدنا البنك على حفظ المال في حساب، ومعرفة الرصيد، والدفع أو التحويل عند الحاجة. أزور البنك مع وليّ أمري لنتعلّم معًا كيف نستخدم خدماته.',
      en: 'A bank helps us keep money in an account, check the balance, and make payments or transfers when needed. I visit the bank with my parent or guardian to learn about its services.',
    },
    instruction: { ar: 'ركّب خريطة رحلة المال، ثم طابق كل مهمة بمكانها.', en: 'Build the Money Journey Map, then match each mission to its place.' },
    explain: {
      ar: 'البنك لا يضع نقودك في صندوق باسمك. هو يسجّل رصيدك في حساب، ويحفظ سجلًا لكل إيداع وسحب ودفع.',
      en: 'A bank does not keep your exact notes in a box with your name. It records your balance in an account and keeps a record of every deposit, withdrawal and payment.',
    },
    scene: {
      id: 'bank-branch',
      alt: {
        ar: 'فرع بنك حديث بواجهة زجاجية ونباتات. الأم تدخل مع حصة وحمد، وموظفة البنك ترحّب بهم.',
        en: 'A modern bank branch with a glass front and plants. Mum walks in with Hessa and Hamad, and a bank employee waves hello.',
      },
    },
    interaction: 'mapPuzzle',
    concept: 'map',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['gb-diraya-2025'],
  },
  {
    pageId: 'balance',
    number: 10,
    navLabel: { ar: 'كيف يتغيّر الرصيد؟', en: 'How balance changes' },
    title: { ar: 'كيف يتغيّر الرصيد؟', en: 'How does the balance change?' },
    story: {
      ar: 'الرصيد هو المبلغ الموجود في الحساب. عندما أودع مالًا يزيد الرصيد، وعندما أسحب منه يقلّ. الإيداع والسحب ينقلان المال، ولا يصنعان مالًا جديدًا.',
      en: 'The balance is the amount in the account. Depositing money increases it, and withdrawing money reduces it. Deposits and withdrawals move money; they do not create new money.',
    },
    instruction: { ar: 'جرّب الإيداع ثم السحب، وراقب المحفظة والحساب معًا.', en: 'Try a deposit, then a withdrawal, and watch the wallet and account together.' },
    explain: {
      ar: 'هذه تجربة تعليمية عند مكتب الخدمة في البنك. المجموع يبقى 5 دنانير لأن المال ينتقل فقط من مكان إلى آخر.',
      en: 'This is a learning simulation at a bank service counter. The total stays at 5 dinars because the money only moves from one place to another.',
    },
    scene: {
      id: 'bank-counter',
      alt: {
        ar: 'داخل البنك عند مكتب الخدمة. موظفة البنك تبتسم، وحمد وحصة مع أمهما، وعلى المكتب محفظة وملف حساب.',
        en: 'Inside the bank at the service counter. The bank employee smiles at Hamad, Hessa and their mum. A wallet and an account folder sit on the counter.',
      },
    },
    interaction: 'bankLedger',
    concept: 'balance',
    learningExamples: true,
    narrationAudio: NO_AUDIO,
    sources: ['gb-diraya-2025'],
  },
  {
    pageId: 'card-atm',
    number: 11,
    navLabel: { ar: 'البطاقة والصراف الآلي', en: 'Cards and ATMs' },
    title: { ar: 'البطاقة تستخدم مالًا حقيقيًا', en: 'A card uses real money' },
    story: {
      ar: 'بطاقة السحب تستخدم المال الموجود في الحساب. والصراف الآلي يتيح سحب النقد من الرصيد المتاح. حتى عندما لا نرى النقود، فإن الدفع يغيّر رصيدنا. أتعلّم ذلك مع وليّ أمري.',
      en: 'A debit card uses money in the account. An ATM lets us withdraw cash from the available balance. Even when we cannot see the cash, paying changes our balance. I learn with my parent or guardian.',
    },
    instruction: { ar: 'جرّب المثال الأول، ثم المثال الثاني إن أحببت.', en: 'Try the first example, then the second one if you like.' },
    explain: {
      ar: 'هناك أنواع مختلفة من البطاقات. البطاقة الائتمانية تعني الاقتراض، وهي ليست جزءًا من هذا النشاط.',
      en: 'There are different kinds of cards. A credit card means borrowing, and it is not part of this activity.',
    },
    scene: {
      id: 'card-atm',
      alt: {
        ar: 'مثالان منفصلان: على اليسار جهاز دفع في متجر، وعلى اليمين صراف آلي في الجدار. الأم تقف بينهما مع حصة وحمد.',
        en: 'Two separate examples: a shop payment terminal on the left and an ATM in the wall on the right. Mum stands between them with Hessa and Hamad.',
      },
    },
    interaction: 'cardAtm',
    concept: 'card',
    learningExamples: true,
    narrationAudio: NO_AUDIO,
    sources: ['gb-phishing'],
  },
  {
    pageId: 'stay-safe',
    number: 12,
    navLabel: { ar: 'أتوقّف وأطلب المساعدة', en: 'Stop and ask for help' },
    title: { ar: 'أتوقّف وأطلب المساعدة', en: 'Stop and ask for help' },
    story: {
      ar: 'لا أشارك الرقم السري أو رمز التحقّق مع أي شخص. إذا وصلت رسالة تطلب معلومات بنكية أو تعدني بجائزة، لا أضغط على الرابط. أتوقّف وأطلب المساعدة من وليّ أمري.',
      en: 'I do not share a PIN or verification code with anyone. If a message asks for banking details or promises a prize, I do not tap its link. I stop and ask my parent or guardian for help.',
    },
    instruction: { ar: 'اقرأ الرسالة التدريبية، ثم اختر ما تفعله.', en: 'Read the practice message, then choose what to do.' },
    explain: {
      ar: 'طلب المساعدة لا يعني أن تخبر أحدًا بالرمز السري. تُري وليّ أمرك الرسالة فقط، وهو يعرف ماذا يفعل.',
      en: 'Asking for help does not mean telling anyone the secret code. You just show the message to your parent or guardian, and they will know what to do.',
    },
    scene: {
      id: 'message-home',
      alt: {
        ar: 'حصة وحمد على الأريكة ينظران إلى جهاز لوحي، وفوقه فقاعة رسالة تدريبية فيها رمز هدية. الأم تقترب لتساعدهما.',
        en: 'Hessa and Hamad on the sofa looking at a tablet, with a practice message bubble showing a gift symbol. Mum comes over to help.',
      },
    },
    interaction: 'safetyChoice',
    concept: 'safety',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['gb-phishing', 'diraya-about'],
  },
  {
    pageId: 'help-care',
    number: 13,
    navLabel: { ar: 'أساعد وأحافظ على أشيائي', en: 'Help and care' },
    title: { ar: 'أساعد وأحافظ على أشيائي', en: 'Help and care for what you have' },
    story: {
      ar: 'أستطيع أن أساعد بوقتي أو جهدي، وبجزء من مالي إذا استطعت. وأحافظ على أشيائي وأعيد استخدامها. العطاء ليس بالمبلغ الكبير، بل بالاهتمام بالآخرين.',
      en: 'I can help with my time or effort, and with some money if I can. I look after my things and reuse them. Helping is about caring for others, not giving a large amount.',
    },
    instruction: { ar: 'اختر طريقة تحب أن تساعد بها اليوم.', en: 'Choose a way you would like to help today.' },
    scene: {
      id: 'helping-home',
      alt: {
        ar: 'في البيت: حصة تصلح مقلمتها بشريط لاصق، وحمد يقرأ كتابًا مع ابن عمه الصغير، وعلى الطاولة صينية شاي وتمر للعائلة.',
        en: 'At home: Hessa mends her pencil case with tape, Hamad shares a book with his little cousin, and a tray of tea and dates waits for the family.',
      },
    },
    interaction: 'helpChoice',
    concept: 'helping',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['cfpb-youth'],
  },
  {
    pageId: 'crossword',
    number: 14,
    navLabel: { ar: 'كلمات المال المتقاطعة', en: 'Money Words Crossword' },
    title: { ar: 'كلمات المال المتقاطعة', en: 'Money Words Crossword' },
    story: {
      ar: 'اكتشف كلمات تعلّمتها في رحلتك! اقرأ التلميح أو استمع إليه، ثم ضع الكلمة في مكانها. كل كلمة تذكّرك بفكرة تساعدك على استخدام المال بذكاء.',
      en: 'Discover words from your journey! Read or listen to the clue, then put the word in its place. Each word reminds you of a thoughtful way to use money.',
    },
    instruction: { ar: 'اختر تلميحًا، ثم اختر الكلمة من بنك الكلمات أو اكتبها.', en: 'Pick a clue, then choose the word from the word bank or type it.' },
    scene: {
      id: 'notebook-desk',
      alt: {
        ar: 'مكتب عليه دفتر مربعات مفتوح وأقلام ونبتة صغيرة، وحصة وحمد ينحنيان فوقه بسعادة.',
        en: 'A desk with an open squared notebook, pencils and a small plant. Hessa and Hamad lean over it happily.',
      },
    },
    interaction: 'crossword',
    concept: 'crossword',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['cbk-banknotes'],
  },
  {
    pageId: 'my-step',
    number: 15,
    navLabel: { ar: 'خطوتي الصغيرة', en: 'My small step' },
    title: { ar: 'خطوتي الصغيرة تبدأ اليوم', en: 'My small step starts today' },
    story: {
      ar: 'أحسنت الاستكشاف! اختر عادة تبدأ بها مع وليّ أمرك: تضع هدفًا، أو تدّخر مبلغًا بسيطًا، أو تراجع مشترياتك. كل خطوة مدروسة تساعدك على التعلّم.',
      en: 'Well done exploring! Choose one habit to try with your parent or guardian: set a goal, save a small amount, or review your purchases. Each thoughtful step helps you learn.',
    },
    instruction: { ar: 'اختر عادة واحدة، واحصل على بطاقة «مستكشف المال».', en: 'Choose one habit and get your Money Explorer card.' },
    scene: {
      id: 'waterfront-sunset',
      alt: {
        ar: 'الواجهة البحرية وقت الغروب، وأبراج الكويت في ضوء دافئ. حصة وحمد يحتفلان بهدوء، وأمهما خلفهما.',
        en: 'The waterfront at sunset with the Kuwait Towers in warm light. Hessa and Hamad celebrate quietly with their mum behind them.',
      },
    },
    interaction: 'completion',
    concept: 'habit',
    learningExamples: false,
    narrationAudio: NO_AUDIO,
    sources: ['diraya-about', 'cbk-diraya-2021', 'gb-diraya-2025'],
  },
];

export const TOTAL_PAGES = pages.length;
export const pageByNumber = (n: number) => pages.find((p) => p.number === n);
export const pageById = (id: string) => pages.find((p) => p.pageId === id);
