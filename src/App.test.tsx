import { createRoot } from 'react-dom/client'
import './index.css'

// Version de test simple pour diagnostiquer le problème
const TestApp = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>Test de l'application</h1>
    <p>Si vous voyez ceci, React fonctionne correctement.</p>
    <div style={{ 
      background: '#f0f0f0', 
      padding: '20px', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2>Diagnostic</h2>
      <p>✅ React se charge</p>
      <p>✅ CSS se charge</p>
      <p>✅ Vite fonctionne</p>
    </div>
  </div>
);

createRoot(document.getElementById("root")!).render(<TestApp />);
