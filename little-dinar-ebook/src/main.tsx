import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/book.css';
import './styles/activities.css';
import './styles/print.css';
import { BookProvider } from './state/store';
import { BookShell } from './app/BookShell';
import { initialLocaleFromUrl } from './lib/host';

// Arabic is the default. A host may pass ?lang=en.
const initialLocale = initialLocaleFromUrl() ?? 'ar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookProvider initialLocale={initialLocale}>
      <BookShell />
    </BookProvider>
  </StrictMode>,
);
