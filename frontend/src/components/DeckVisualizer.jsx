import React from 'react';
import { useDeckStore } from '../store/useDeckStore';

const agruparCartas = (lista) => {
  const conteo = {};
  lista.forEach(carta => {
    if (conteo[carta.id]) {
      conteo[carta.id].cantidad += 1;
    } else {
      conteo[carta.id] = { ...carta, cantidad: 1 };
    }
  });
  return Object.values(conteo);
};

export default function DeckVisualizer({ onClose }) {
  const { mazo, oros } = useDeckStore();
  const mazoAgrupado = agruparCartas(mazo);
  const orosAgrupados = agruparCartas(oros);
  
  const allCards = [...mazoAgrupado, ...orosAgrupados];

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e24', borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)', maxWidth: '90%', width: '1000px', maxHeight: '90vh',
          border: '1px solid #444', padding: '30px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
          <h2 style={{ color: '#f39c12', margin: 0, fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Visualizador de Mazo <span style={{ color: '#aaa', fontSize: '1.2rem' }}>({mazo.length + oros.length}/50 cartas)</span>
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', border: 'none', color: '#aaa', fontSize: '2.5rem', cursor: 'pointer',
              lineHeight: '1', padding: '0', transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = '#aaa'}
          >
            &times;
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
          {allCards.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '50px', fontSize: '1.2rem' }}>
              Tu mazo está vacío. Añade algunas cartas primero.
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
              gap: '25px',
              padding: '10px 5px'
            }}>
              {allCards.map(carta => (
                <div key={carta.id} style={{ position: 'relative' }}>
                  <img 
                    src={carta.imagen_url} 
                    alt={carta.nombre}
                    style={{ 
                      width: '100%', 
                      borderRadius: '8px', 
                      boxShadow: '0 6px 12px rgba(0,0,0,0.6)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x280?text=MyL' }}
                  />
                  <div style={{
                    position: 'absolute', top: '-12px', right: '-12px', backgroundColor: '#e74c3c', color: '#fff',
                    borderRadius: '50%', width: '35px', height: '35px', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 3px 6px rgba(0,0,0,0.5)', border: '2px solid #fff'
                  }}>
                    x{carta.cantidad}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
