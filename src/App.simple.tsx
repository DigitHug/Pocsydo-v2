import { BrowserRouter, Routes, Route } from "react-router-dom";

// Version simple avec juste du HTML/CSS inline
const HomePage = () => (
  <div style={{ 
    padding: '40px', 
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    color: 'white'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.1)',
      padding: '40px',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🏠 SydoFlow</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Gestion de projets moderne</p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>📁 Projets</h3>
          <p>Gestion des projets</p>
          <a href="/projets" style={{ 
            color: 'white', 
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.3)',
            padding: '10px 20px',
            borderRadius: '5px',
            display: 'inline-block',
            marginTop: '10px'
          }}>Voir les projets</a>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>📊 Pipeline</h3>
          <p>Suivi commercial</p>
          <a href="/pipeline" style={{ 
            color: 'white', 
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.3)',
            padding: '10px 20px',
            borderRadius: '5px',
            display: 'inline-block',
            marginTop: '10px'
          }}>Voir le pipeline</a>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>👥 Équipe</h3>
          <p>Gestion d'équipe</p>
          <a href="/equipe" style={{ 
            color: 'white', 
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.3)',
            padding: '10px 20px',
            borderRadius: '5px',
            display: 'inline-block',
            marginTop: '10px'
          }}>Voir l'équipe</a>
        </div>
      </div>
    </div>
  </div>
);

const ProjetsPage = () => (
  <div style={{ 
    padding: '40px', 
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    minHeight: '100vh',
    color: 'white'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.1)',
      padding: '40px',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>📁 Projets</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Gestion et suivi de tous vos projets</p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>Refonte Site Web Luxe</h3>
          <p><strong>Client:</strong> Maison Martin</p>
          <p><strong>Statut:</strong> En cours</p>
          <p><strong>Responsable:</strong> Sarah Martin</p>
          <p><strong>Progression:</strong> 75%</p>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>App Mobile E-commerce</h3>
          <p><strong>Client:</strong> TechStart</p>
          <p><strong>Statut:</strong> Review</p>
          <p><strong>Responsable:</strong> Tom Chen</p>
          <p><strong>Progression:</strong> 60%</p>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <h3>Plateforme SaaS</h3>
          <p><strong>Client:</strong> InnovateCorp</p>
          <p><strong>Statut:</strong> Planifié</p>
          <p><strong>Responsable:</strong> Emma Wilson</p>
          <p><strong>Progression:</strong> 25%</p>
        </div>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a href="/" style={{ 
          color: 'white', 
          textDecoration: 'none',
          background: 'rgba(255,255,255,0.3)',
          padding: '15px 30px',
          borderRadius: '10px',
          fontSize: '1.1rem'
        }}>← Retour à l'accueil</a>
      </div>
    </div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projets" element={<ProjetsPage />} />
      <Route path="/pipeline" element={<div style={{padding: '40px', textAlign: 'center'}}><h1>📊 Pipeline</h1><p>Page en construction</p><a href="/">← Retour</a></div>} />
      <Route path="/equipe" element={<div style={{padding: '40px', textAlign: 'center'}}><h1>👥 Équipe</h1><p>Page en construction</p><a href="/">← Retour</a></div>} />
      <Route path="/calendrier" element={<div style={{padding: '40px', textAlign: 'center'}}><h1>📅 Calendrier</h1><p>Page en construction</p><a href="/">← Retour</a></div>} />
      <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}><h1>404</h1><p>Page non trouvée</p><a href="/">← Retour</a></div>} />
    </Routes>
  </BrowserRouter>
);

export default App;
