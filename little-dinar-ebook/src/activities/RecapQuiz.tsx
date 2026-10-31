import { useT } from '../app/i18n';
import { useBook, QUIZ_ANSWERS } from '../state/store';
import { quiz as c } from '../content/copy';
import { Icon } from '../app/Icons';

const QUESTIONS = [
  { id: 'q1', q: c.q1, options: { a: c.q1a, b: c.q1b, c: c.q1c }, why: c.q1why },
  { id: 'q2', q: c.q2, options: { a: c.q2a, b: c.q2b, c: c.q2c }, why: c.q2why },
  { id: 'q3', q: c.q3, options: { a: c.q3a, b: c.q3b, c: c.q3c }, why: c.q3why },
  { id: 'q4', q: c.q4, options: { a: c.q4a, b: c.q4b, c: c.q4c }, why: c.q4why },
] as const;

/** Optional, collapsed by default, on the same numbered page. Mastery counts once per question. */
export function RecapQuiz() {
  const { t } = useT();
  const { state, dispatch } = useBook();
  const answers = state.act.quiz;
  const answered = Object.keys(answers).length;
  return (
    <details className="quiz">
      <summary><Icon name="star" size={20} /><span>{t(c.title)}</span></summary>
      <p className="muted">{t(c.intro)}</p>
      <ol className="quiz-list">
        {QUESTIONS.map((q) => {
          const picked = answers[q.id];
          const right = picked === QUIZ_ANSWERS[q.id];
          return (
            <li key={q.id}>
              <fieldset>
                <legend>{t(q.q)}</legend>
                <div className="quiz-options">
                  {(Object.keys(q.options) as ('a' | 'b' | 'c')[]).map((k) => (
                    <button key={k} type="button" className={`btn btn-small ${picked === k ? (right ? 'is-right' : 'is-wrong') : ''}`} aria-pressed={picked === k} onClick={() => dispatch({ type: 'quiz', q: q.id, answer: k })}>
                      <bdi>{t(q.options[k])}</bdi>
                    </button>
                  ))}
                </div>
                {picked ? (
                  <p className={`quiz-why ${right ? 'tone-good' : 'tone-try'}`} role="status">
                    <Icon name={right ? 'check' : 'bulb'} size={18} /> <strong>{t(right ? c.right : c.notQuite)}</strong> <bdi>{t(q.why)}</bdi>
                  </p>
                ) : null}
              </fieldset>
            </li>
          );
        })}
      </ol>
      <p className="muted small">{t(c.score, { n: answered })} · {t(c.continueAnyway)}</p>
    </details>
  );
}
