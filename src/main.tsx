import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import './styles/tailwind.css';
import './styles/compat-fixes.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root');

createRoot(root).render(<App />);
