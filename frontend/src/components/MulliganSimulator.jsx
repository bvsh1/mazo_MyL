// src/components/MulliganSimulator.jsx
import React, { useState, useEffect } from 'react';
import { useDeckStore } from '../store/useDeckStore';
import Carta from './Card'; // Reutilizamos tu componente de carta para mostrarlas

export default function MulliganSimulator({ isOpen, onClose }) {
  const { mazo, oros } = useDeckStore();
  const [mano, setMano] = useState([]);
  const [cartasARobar, setCartasARobar] = useState(8);

  // Función para mezclar y robar cartas
  const robarMano = (cantidad) => {
    const mazoCompleto = [...mazo, ...oros];
    
    if (mazoCompleto.length === 0) return;

    // Algoritmo de Fisher-Yates para mezclar aleatoriamente
    let mazoMezclado = [...mazoCompleto];
    for (let i = mazoMezclado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mazoMezclado[i], mazoMezclado[j]] = [mazoMezclado[j], mazoMezclado[i]];
    }

    setMano(mazoMezclado.slice(0, cantidad));
  };

  // Cuando se abre el modal, robamos 8 cartas por defecto
  useEffect(() => {
    if (isOpen) {
      setCartasARobar(8);
      robarMano(8);
    }
  }, [isOpen]);

  const handleMulligan = () => {
    if (cartasARobar > 1) {
      const nuevaCantidad = cartasARobar - 1;
      setCartasARobar(nuevaCantidad);
      robarMano(nuevaCantidad);
    }
  };

  const handleReiniciar = () => {
    setCartasARobar(8);
    robarMano(8);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', 
        width: '100%', maxWidth: '1000px', border: '1px solid #333',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Cabecera del Simulador */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ color: '#f39c12', margin: 0 }}>Simulador de Mano Inicial</h2>
            <p style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
              Mazo actual: {mazo.length + oros.length} cartas
            </p>
          </div>
          
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#e74c3c', fontSize: '2rem', cursor: 'pointer'
          }}>&times;</button>
        </div>

        {/* Controles de Mulligan */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', justifyContent: 'center' }}>
          <button onClick={handleReiniciar} style={{
            padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            Robar 8 Cartas Nuevas
          </button>
          
          <button 
            onClick={handleMulligan} 
            disabled={cartasARobar <= 1}
            style={{
              padding: '10px 20px', backgroundColor: cartasARobar <= 1 ? '#555' : '#d35400', 
              color: 'white', border: 'none', borderRadius: '6px', cursor: cartasARobar <= 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold'
          }}>
            Hacer Mulligan (Robar {cartasARobar - 1})
          </button>
        </div>

        {/* Área de Cartas (Mano) */}
        <div style={{ 
          display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', 
          overflowY: 'auto', padding: '10px'
        }}>
          {mano.length > 0 ? mano.map((carta, index) => (
             // Usamos index en la key porque puede haber cartas repetidas en la mano
            <Carta key={`${carta.id}-${index}`} carta={carta} />
          )) : (
            <p style={{ color: '#666' }}>No hay suficientes cartas en el mazo para simular.</p>
          )}
        </div>

      </div>
    </div>
  );
}