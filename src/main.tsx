import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import './styles/tailwind.css';
import './styles/sections/nosotros.css';
import './styles/sections/formacion.css';
import './styles/sections/comunidad.css';
import './styles/sections/eventos.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('No se encontró #root');

createRoot(root).render(<App />);
