// src/App.jsx
import React from 'react';
import Builder from './pages/Builder';
import { useDeckStore } from './store/useDeckStore';

function App() {
  // Conectamos el Navbar al estado global
  const { mazo, oros, limpiarMazo } = useDeckStore();

  const handleLimpiar = () => {
    if (window.confirm('¿Estás seguro de que deseas descartar este mazo por completo?')) {
      limpiarMazo();
    }
  };

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      <header style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#f39c12', 
        padding: '0 30px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Empuja el logo a la izquierda y los botones a la derecha
        position: 'sticky', // Mantiene el Navbar siempre visible al hacer scroll
        top: 0,
        zIndex: 1000,
        height: '63px' // Altura fija sincronizada con la vista del Builder
      }}>
        
        {/* Sección Izquierda: Logo y Título */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🐉</span>
          <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>FORJA DE MITOS</h1>
        </div>

        {/* Sección Derecha: Estadísticas en vivo y Controles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Contadores */}
          <div style={{ display: 'flex', gap: '15px', fontSize: '0.95rem', color: '#ccc', backgroundColor: '#1a1a1a', padding: '5px 15px', borderRadius: '20px', border: '1px solid #333' }}>
            <span>Mazo: <strong style={{ color: mazo.length === 50 ? '#e74c3c' : '#fff' }}>{mazo.length}/50</strong></span>
            <span>Oros: <strong style={{ color: '#f1c40f' }}>{oros.length}</strong></span>
          </div>

          {/* Botón Limpiar */}
          <button 
            onClick={handleLimpiar}
            disabled={mazo.length === 0 && oros.length === 0}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: (mazo.length === 0 && oros.length === 0) ? '#333' : '#c0392b', 
              color: (mazo.length === 0 && oros.length === 0) ? '#666' : 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: (mazo.length === 0 && oros.length === 0) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => { if (mazo.length > 0 || oros.length > 0) e.target.style.backgroundColor = '#e74c3c' }}
            onMouseLeave={(e) => { if (mazo.length > 0 || oros.length > 0) e.target.style.backgroundColor = '#c0392b' }}
          >
            Limpiar Mazo
          </button>
          
          {/* Botón Guardar (Preparado para Firebase) */}
          <button 
            onClick={() => alert('Pronto conectaremos Firebase para guardar tus mazos en la nube ☁️')}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#2980b9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#3498db'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2980b9'}
          >
            Guardar Mazo
          </button>
          
        </div>
      </header>
      
      <main>
        <Builder />
      </main>
      
    </div>
  );
}

export default App;