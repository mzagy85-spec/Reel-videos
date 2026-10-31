import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react';
import type { InteractionKind, PageRecord } from '../content/schema';
import { useT } from './i18n';
import { useBook } from '../state/store';
import { ui } from '../content/copy';
import { SceneFigure } from './SceneFigure';
import { NarrationControls } from './NarrationControls';
import { Icon } from './Icons';
import { CoverPage } from '../activities/CoverPage';
import { MoneyChoices } from '../activities/MoneyChoices';
import { MoneyTokens } from '../activities/MoneyTokens';
import { NeedsWantsActivity } from '../activities/NeedsWantsActivity';
import { JarPlanner } from '../activities/JarPlanner';
import { SavingsGoal } from '../activities/SavingsGoal';
import { ShoppingBudget } from '../activities/ShoppingBudget';
import { CompareChange } from '../activities/CompareChange';
import { BankLedger } from '../activities/BankLedger';
import { CardAtm } from '../activities/CardAtm';
import { SafetyChoice } from '../activities/SafetyChoice';
import { HelpChoice } from '../activities/HelpChoice';
import { CompletionPage } from '../activities/CompletionPage';

// The two puzzles are the heaviest activities, so they load on demand.
const MapPuzzle = lazy(() => import('../activities/MapPuzzle').then((m) => ({ default: m.MapPuzzle })));
const CrosswordPage = lazy(() => import('../activities/CrosswordActivity').then((m) => ({ default: m.CrosswordPage })));

export interface ActivityProps { page: PageRecord; onGo: (n: number) => void }

const ACTIVITIES: Record<Exclude<InteractionKind, 'cover'>, ComponentType<ActivityProps>> = {
  moneyChoices: MoneyChoices,
  moneyTokens: MoneyTokens,
  needsWants: NeedsWantsActivity,
  jarPlanner: JarPlanner,
  savingsGoal: SavingsGoal,
  shoppingBudget: ShoppingBudget,
  compareChange: CompareChange,
  mapPuzzle: MapPuzzle,
  bankLedger: BankLedger,
  cardAtm: CardAtm,
  safetyChoice: SafetyChoice,
  helpChoice: HelpChoice,
  crossword: CrosswordPage,
  completion: CompletionPage,
};

export function PageRenderer({ page, onGo }: ActivityProps) {
  const { t } = useT();
  const { state } = useBook();
  const [justStamped, setJustStamped] = useState(false);
  const stamped = !!state.concepts[page.concept];
  const [wasStamped] = useState(stamped);
  useEffect(() => { if (stamped && !wasStamped) setJustStamped(true); }, [stamped, wasStamped]);

  if (page.interaction === 'cover') return <CoverPage page={page} onGo={onGo} />;
  const Activity = ACTIVITIES[page.interaction];

  return (
    <article className={`page spread scene-${page.scene.id}`} aria-labelledby="page-heading">
      <div className="spread-art">
        <SceneFigure scene={page.scene.id} alt={t(page.scene.alt)} />
      </div>
      <div className="spread-text">
        <header className="page-head">
          <p className="page-kicker"><span className="kicker-num">{page.number}</span><span className="visually-hidden"> / 15</span></p>
          <h1 id="page-heading" tabIndex={-1}>{t(page.title)}</h1>
        </header>
        <p className="story">{t(page.story)}</p>
        <div className="page-meta">
          <NarrationControls page={page} />
          {page.learningExamples ? (
            <p className="learning-badge" title={t(ui.learningExamplesNote)}>
              <Icon name="info" size={18} /><span>{t(ui.learningExamples)}</span>
              <span className="visually-hidden">: {t(ui.learningExamplesNote)}</span>
            </p>
          ) : null}
        </div>
        {page.explain ? (
          <details className="explain">
            <summary><Icon name="bulb" size={20} /><span>{t(ui.tellMeMore)}</span></summary>
            <p>{t(page.explain)}</p>
          </details>
        ) : null}
        <section className="activity" aria-labelledby="activity-instruction">
          <p id="activity-instruction" className="instruction">{t(page.instruction)}</p>
          <Suspense fallback={<div className="activity-loading" aria-busy="true" />}>
            <Activity page={page} onGo={onGo} />
          </Suspense>
          {stamped && page.number !== 15 ? (
            <p className={`stamp-note ${justStamped ? 'is-new' : ''}`} role={justStamped ? 'status' : undefined}>
              <span className="stamp" aria-hidden="true"><Icon name="star" size={22} /></span>
              {t(ui.stampEarned)}
            </p>
          ) : null}
        </section>
      </div>
    </article>
  );
}
