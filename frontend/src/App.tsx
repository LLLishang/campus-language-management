import React, { useEffect } from 'react';
import AppRouter from './router';
import { useAuthStore } from './stores/auth.store';

const App: React.FC = () => {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, []);

  return <AppRouter />;
};

export default App;
