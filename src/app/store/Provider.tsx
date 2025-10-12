// src/app/store/Provider.tsx

"use client";

import { Provider } from 'react-redux';
import { store } from './store';

// We use an empty interface as no props are strictly required for a simple Provider
interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}