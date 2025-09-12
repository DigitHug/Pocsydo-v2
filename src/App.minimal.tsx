import { BrowserRouter, Routes, Route } from "react-router-dom";

// Version minimale pour tester
const HomePage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>🏠 Page d'accueil</h1>
    <p>Application SydoFlow - Version de test</p>
    <div style={{ 
      background: '#f0f0f0', 
      padding: '20px', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h2>Navigation</h2>
      <ul>
        <li><a href="/projets">Projets</a></li>
        <li><a href="/pipeline">Pipeline</a></li>
        <li><a href="/equipe">Équipe</a></li>
        <li><a href="/calendrier">Calendrier</a></li>
      </ul>
    </div>
  </div>
);

const ProjetsPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1>📁 Projets</h1>
    <p>Page des projets - Version de test</p>
    <div style={{ 
      background: '#e8f4fd', 
      padding: '20px', 
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>Projets de test</h3>
      <ul>
        <li>Refonte Site Web Luxe - En cours</li>
        <li>App Mobile E-commerce - Review</li>
        <li>Plateforme SaaS - Planifié</li>
      </ul>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projets" element={<ProjetsPage />} />
      <Route path="/pipeline" element={<div style={{padding: '20px'}}><h1>Pipeline</h1><p>Page en construction</p></div>} />
      <Route path="/equipe" element={<div style={{padding: '20px'}}><h1>Équipe</h1><p>Page en construction</p></div>} />
      <Route path="/calendrier" element={<div style={{padding: '20px'}}><h1>Calendrier</h1><p>Page en construction</p></div>} />
      <Route path="*" element={<div style={{padding: '20px'}}><h1>404</h1><p>Page non trouvée</p></div>} />
    </Routes>
  </BrowserRouter>
);

export default App;
