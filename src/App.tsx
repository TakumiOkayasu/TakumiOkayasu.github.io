import type React from 'react';
import Portfolio from './components/Portfolio';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Portfolio />
    </ThemeProvider>
  );
};

export default App;
