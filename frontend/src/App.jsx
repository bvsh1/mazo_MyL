// src/App.jsx
import React, { useState } from 'react';
import Builder from './pages/Builder';
import MulliganSimulator from './components/MulliganSimulator';
import { useDeckStore } from './store/useDeckStore';

function App() {
  const { mazo, oros, limpiarMazo } = useDeckStore();
  const [showSimulator, setShowSimulator] = useState(false);

  const handleLimpiar = () => {
    if (window.confirm('¿Estás seguro de que deseas descartar este mazo por completo?')) {
      limpiarMazo();
    }
  };

  const totalMazo = mazo.length + oros.length;

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      <header style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#f39c12', 
        padding: '0 30px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        height: '63px'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🐉</span>
          <h1 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '1px' }}>FORJA DE MITOS</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* Contadores actualizados: Oros ahora suman al total de 50 */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            fontSize: '0.95rem', 
            color: '#ccc', 
            backgroundColor: '#1a1a1a', 
            padding: '5px 15px', 
            borderRadius: '20px', 
            border: '1px solid #333' 
          }}>
            <span>Total Mazo: <strong style={{ color: totalMazo === 50 ? '#27ae60' : '#fff' }}>{totalMazo}/50</strong></span>
            <span style={{ borderLeft: '1px solid #444', paddingLeft: '15px' }}>Castillo: <strong>{mazo.length}</strong></span>
            <span>Oros: <strong style={{ color: '#f1c40f' }}>{oros.length}</strong></span>
          </div>

          <button 
            onClick={() => setShowSimulator(true)}
            disabled={totalMazo === 0}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: totalMazo === 0 ? '#333' : '#8e44ad', 
              color: totalMazo === 0 ? '#666' : 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: totalMazo === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Simular Mano
          </button>

          <button 
            onClick={handleLimpiar}
            disabled={totalMazo === 0}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: totalMazo === 0 ? '#333' : '#c0392b', 
              color: totalMazo === 0 ? '#666' : 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: totalMazo === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Limpiar Mazo
          </button>
          
          <button 
            onClick={() => alert('Pronto conectaremos Firebase ☁️')}
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#2980b9', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Guardar Mazo
          </button>
          
        </div>
      </header>
      
      <main>
        <Builder />
      </main>

      <MulliganSimulator 
        isOpen={showSimulator} 
        onClose={() => setShowSimulator(false)} 
      />
      
    </div>
  );
}

export default App;