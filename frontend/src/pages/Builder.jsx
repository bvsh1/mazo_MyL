// src/pages/Builder.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Carta from '../components/Card';
import FilterBar from '../components/FilterBar';
import DeckVisualizer from '../components/DeckVisualizer';
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

export default function Builder() {
  const [cartas, setCartas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ search: '', tipo: '', raza: '', subtipoOro: '', edicion: '' });
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [mostrarVisualizador, setMostrarVisualizador] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Reset pagination when filters change
  useEffect(() => {
    setCartas([]);
    setPage(1);
    setHasMore(true);
  }, [filtros]);
  
  const { mazo, oros, quitarCarta } = useDeckStore();

  useEffect(() => {
    if (!hasMore) return;
    setCargando(true);
    api.get('/cartas/', { params: { ...filtros, page } })
      .then(response => {
        const datos = response.data.results || response.data;
        setCartas(prev => page === 1 ? datos : [...prev, ...datos]);
        if (response.data.next === null || !response.data.results) {
          setHasMore(false);
        }
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar:", error);
        setCargando(false);
      });
  }, [filtros, page]);

  const mazoAgrupado = agruparCartas(mazo);
  const orosAgrupados = agruparCartas(oros);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 63px)', backgroundColor: '#121212', color: '#eee' }}>
      
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ color: '#f39c12', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 }}>
          Catálogo General
        </h2>
        
        <FilterBar filtros={filtros} setFiltros={setFiltros} />
        
        {cartas.length === 0 && !cargando ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888', fontSize: '1.2rem' }}>
            No se encontraron cartas con esos filtros.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px',
            paddingTop: '10px'
          }}>
            {cartas.map(carta => (
              <Carta key={carta.id} carta={carta} alHacerClicImagen={setCartaSeleccionada} />
            ))}
          </div>
        )}
        
        {cargando && (
          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', color: '#888', fontSize: '1.2rem' }}>
            Invocando cartas...
          </div>
        )}

        {hasMore && !cargando && (
          <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
            <button 
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '12px 24px', backgroundColor: '#3498db', color: 'white',
                border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
                fontSize: '1rem', transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Cargar Más
            </button>
          </div>
        )}
      </div>

      {/* PANEL LATERAL DEL MAZO */}
      <div style={{ 
        width: '350px', 
        backgroundColor: '#1a1a1a', 
        borderLeft: '1px solid #333',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: 'calc(100vh - 63px)',
        overflowY: 'auto'
      }}>
        
        <div style={{ marginBottom: '30px' }}>
          {/* Título actualizado: ya no muestra el /50 aquí */}
          <h2 style={{ margin: 0, color: '#f39c12', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            Cartas del Castillo
            <span style={{ fontSize: '1rem', color: '#aaa' }}>{mazo.length}</span>
          </h2>
          
          <button
            onClick={() => setMostrarVisualizador(true)}
            style={{
              width: '100%', padding: '12px', backgroundColor: '#3498db', color: 'white',
              border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer',
              marginBottom: '15px', transition: 'background-color 0.2s', fontSize: '0.9rem',
              textTransform: 'uppercase', letterSpacing: '1px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Visualizar Mazo
          </button>
          
          <hr style={{ borderColor: '#333', margin: '10px 0' }}/>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {mazoAgrupado.map((c) => (
              <li key={c.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: '#252525', padding: '8px 12px', marginBottom: '5px', borderRadius: '4px'
              }}>
                <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#aaa', fontWeight: 'bold' }}>x{c.cantidad}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {c.nombre}
                  </span>
                </span>
                <button onClick={() => quitarCarta(c.id, false)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ margin: 0, color: '#f39c12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Oros
            <span style={{ fontSize: '1rem', color: '#aaa' }}>{oros.length}</span>
          </h2>
          <hr style={{ borderColor: '#333', margin: '10px 0' }}/>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {orosAgrupados.map((o) => (
              <li key={o.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: '#252525', padding: '8px 12px', marginBottom: '5px', borderRadius: '4px'
              }}>
                <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>x{o.cantidad}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {o.nombre}
                  </span>
                </span>
                <button onClick={() => quitarCarta(o.id, true)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MODAL DETALLE DE CARTA */}
      {cartaSeleccionada && (
        <div 
          onClick={() => setCartaSeleccionada(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            backdropFilter: 'blur(5px)'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex', backgroundColor: '#1e1e24', borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.8)', maxWidth: '900px', width: '90%', maxHeight: '85vh',
              border: '1px solid #444'
            }}
          >
            {/* Imagen */}
            <div style={{ flex: '1', backgroundColor: '#0f0f13', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
              <img 
                src={cartaSeleccionada.imagen_url} 
                alt={cartaSeleccionada.nombre}
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=MyL' }}
              />
            </div>
            
            {/* Detalles */}
            <div style={{ flex: '1.2', padding: '40px 30px', position: 'relative', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <button 
                onClick={() => setCartaSeleccionada(null)}
                style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: '#aaa', fontSize: '2rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = '#aaa'}
              >
                &times;
              </button>
              
              <h2 style={{ color: '#f39c12', fontSize: '2.2rem', marginTop: 0, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {cartaSeleccionada.nombre}
              </h2>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#2c3e50', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #34495e' }}>{cartaSeleccionada.tipo}</span>
                {cartaSeleccionada.raza && <span style={{ backgroundColor: '#8e44ad', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #9b59b6' }}>{cartaSeleccionada.raza}</span>}
                {cartaSeleccionada.coste != null && <span style={{ backgroundColor: '#c0392b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #e74c3c' }}>Coste: {cartaSeleccionada.coste}</span>}
                {cartaSeleccionada.fuerza != null && <span style={{ backgroundColor: '#27ae60', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #2ecc71' }}>Fuerza: {cartaSeleccionada.fuerza}</span>}
              </div>

              <div style={{ marginBottom: '25px', backgroundColor: '#25252b', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #f39c12' }}>
                <h4 style={{ color: '#f39c12', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Habilidad</h4>
                <p style={{ margin: 0, lineHeight: '1.6', color: '#eee', whiteSpace: 'pre-line' }}>{cartaSeleccionada.habilidad || "Sin habilidad."}</p>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#aaa', display: 'flex', gap: '20px' }}>
                <p><strong style={{ color: '#ccc' }}>Edición:</strong> <span style={{ textTransform: 'capitalize' }}>{cartaSeleccionada.edicion?.replace(/-/g, ' ')}</span></p>
                <p><strong style={{ color: '#ccc' }}>Frecuencia:</strong> <span style={{ textTransform: 'capitalize' }}>{cartaSeleccionada.frecuencia}</span></p>
              </div>

              <button 
                onClick={() => {
                  useDeckStore.getState().agregarCarta(cartaSeleccionada);
                  setCartaSeleccionada(null);
                }}
                style={{ 
                  marginTop: 'auto', width: '100%', padding: '15px', 
                  backgroundColor: '#f39c12', color: '#111', border: 'none', 
                  borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                  transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '1px'
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#f1c40f'; e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = '#f39c12'; e.target.style.transform = 'translateY(0)'; }}
              >
                Añadir al Mazo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VISUALIZADOR DE MAZO */}
      {mostrarVisualizador && (
        <DeckVisualizer onClose={() => setMostrarVisualizador(false)} />
      )}
    </div>
  );
}