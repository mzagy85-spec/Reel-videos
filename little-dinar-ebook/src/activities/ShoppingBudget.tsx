import type { ActivityProps } from '../app/PageRenderer';
import { useT } from '../app/i18n';
import { useBook } from '../state/store';
import { shop as c, ui } from '../content/copy';
import { SHOP_ITEMS, SHOP_WALLET, shopCanPay, shopHasRequired, shopOverBy, shopTotal } from '../lib/activities';
import { subtract } from '../lib/money';
import { Amount, Feedback, ResetButton } from './shared';
import { Icon } from '../app/Icons';
import { playEffect } from '../lib/audio';

export function ShoppingBudget(_: ActivityProps) {
  const { t, kwd, fils } = useT();
  const { state, dispatch } = useBook();
  const s = state.act.shop;
  const fx = state.settings.effects;
  const total = shopTotal(s);
  const over = shopOverBy(s);
  const name = (id: 'notebook' | 'pencil' | 'stickers') => t(c[id]);

  let fb: { tone: 'good' | 'try' | 'info'; text: string | null } = { tone: 'info', text: null };
  if (s.paid) {
    fb = { tone: 'good', text: s.basket.stickers ? t(c.paidAll, { total: kwd(s.paidTotal), left: kwd(s.wallet) }) : t(c.paid, { total: kwd(s.paidTotal), left: kwd(s.wallet) }) };
  } else if (over > 0) {
    fb = { tone: 'try', text: t(c.over, { total: kwd(total), wallet: kwd(SHOP_WALLET), over: fils(over) }) };
  } else if (total > 0 && !shopHasRequired(s)) {
    fb = { tone: 'info', text: t(c.needRequired) };
  } else if (total > 0) {
    fb = { tone: 'info', text: t(c.left, { amount: kwd(subtract(SHOP_WALLET, total)) }) };
  }

  return (
    <div className="shop-activity">
      <div className="wallet-card">
        <Icon name="wallet" size={28} />
        <span>{t(c.wallet)}</span>
        <strong><Amount>{kwd(s.wallet)}</Amount></strong>
      </div>
      <ul className="shelf" role="list">
        {SHOP_ITEMS.map((item) => {
          const inBasket = s.basket[item.id];
          return (
            <li key={item.id} className={`shelf-item ${inBasket ? 'in-basket' : ''}`}>
              <div className="shelf-info">
                <span className="shelf-name">{name(item.id)}</span>
                <span className={`shelf-tag ${item.required ? 'req' : 'opt'}`}>{t(item.required ? c.required : c.optional)}</span>
              </div>
              <span className="price-tag"><Amount>{fils(item.price)}</Amount></span>
              <button
                type="button"
                className={`btn btn-small ${inBasket ? '' : 'btn-primary'}`}
                aria-pressed={inBasket}
                disabled={s.paid}
                onClick={() => { dispatch({ type: 'shop', a: { type: 'toggle', item: item.id } }); playEffect('tap', fx); }}
              >
                {inBasket ? t(c.removeFromBasket, { item: name(item.id) }) : t(c.addToBasket, { item: name(item.id) })}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={`basket ${over > 0 ? 'is-over' : ''}`}>
        <p className="basket-total"><Icon name="spend" size={22} /> <Amount>{t(c.basketTotal, { amount: kwd(total) })}</Amount></p>
        <div className="budget-bar" aria-hidden="true">
          <span className="budget-fill" style={{ inlineSize: `${Math.min(100, (total / SHOP_WALLET) * 100)}%` }} />
          {over > 0 ? <span className="budget-over" style={{ inlineSize: `${Math.min(40, (over / SHOP_WALLET) * 100)}%` }} /> : null}
        </div>
      </div>
      <div className="btn-row">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!shopCanPay(s)}
          onClick={() => { if (shopCanPay(s)) { dispatch({ type: 'shop', a: { type: 'pay' } }); playEffect('success', fx); } }}
        >
          {t(c.pay, { amount: kwd(total) })}
        </button>
        <ResetButton label={t(ui.reset)} onClick={() => dispatch({ type: 'shop', a: { type: 'reset' } })} />
      </div>
      <Feedback tone={fb.tone}>{fb.text}</Feedback>
    </div>
  );
}
