// src/components/Carta.jsx
import React from 'react';
import { useDeckStore } from '../store/useDeckStore';

export default function Carta({ carta, alHacerClicImagen }) {
  const agregarCarta = useDeckStore((state) => state.agregarCarta);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      backgroundColor: '#1e1e24', borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', transition: 'transform 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Contenedor de la Imagen: Ahora es clickeable para abrir el modal */}
      <div 
        onClick={() => alHacerClicImagen(carta)}
        style={{ backgroundColor: '#000', padding: '10px', textAlign: 'center', cursor: 'zoom-in' }}
        title="Ver detalles"
      >
        <img 
          src={carta.imagen_url} 
          alt={carta.nombre} 
          style={{ width: '100%', height: '220px', objectFit: 'contain', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))' }} 
          onError={(e) => { e.target.src = 'https://via.placeholder.com/200x280?text=MyL' }}
        />
      </div>

      <div style={{ padding: '12px', color: '#fff' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#f39c12' }}>{carta.nombre}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: '10px' }}>
          <span>{carta.tipo} {carta.raza ? `- ${carta.raza}` : ''}</span>
          {carta.coste && <span style={{ backgroundColor: '#333', padding: '2px 6px', borderRadius: '4px' }}>Coste: {carta.coste}</span>}
        </div>
        
        <button 
          onClick={() => agregarCarta(carta)}
          style={{ 
            width: '100%', padding: '10px', backgroundColor: '#c0392b', color: 'white', 
            border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          Añadir al Mazo
        </button>
      </div>
    </div>
  );
}