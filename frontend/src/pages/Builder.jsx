// src/pages/Builder.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Carta from '../components/Card';
import FilterBar from '../components/FilterBar';
import { useDeckStore } from '../store/useDeckStore';

// Función auxiliar para agrupar cartas repetidas en la vista del mazo
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
  // Estados locales para las cartas y la interfaz
  const [cartas, setCartas] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // ESTADO ACTUALIZADO: Agregamos subtipoOro para los nuevos filtros dinámicos
  const [filtros, setFiltros] = useState({ search: '', tipo: '', raza: '', subtipoOro: '' });
  
  // Extraemos el estado global desde Zustand
  const { mazo, oros, quitarCarta } = useDeckStore();

  // Efecto que consulta a Django cada vez que cambian los filtros
  useEffect(() => {
    setCargando(true);
    
    // Axios convierte automáticamente el objeto 'filtros' en query params de la URL
    api.get('/cartas/', { params: filtros })
      .then(response => {
        // DRF paginado devuelve los datos dentro de 'results', si no, es un array directo
        const datos = response.data.results || response.data;
        setCartas(datos);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar desde la API:", error);
        setCargando(false);
      });
  }, [filtros]);

  // Agrupamos las cartas antes de renderizarlas en la barra lateral
  const mazoAgrupado = agruparCartas(mazo);
  const orosAgrupados = agruparCartas(oros);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 63px)', backgroundColor: '#121212', color: '#eee' }}>
      
      {/* ==========================================
          COLUMNA IZQUIERDA: CATÁLOGO Y FILTROS
          ========================================== */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ color: '#f39c12', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 }}>
          Catálogo General
        </h2>
        
        {/* Barra de Búsqueda y Filtros Dinámicos */}
        <FilterBar filtros={filtros} setFiltros={setFiltros} />
        
        {/* Grilla de Cartas */}
        {cargando ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888', fontSize: '1.2rem' }}>
            Invocando cartas desde el servidor...
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px',
            paddingTop: '10px'
          }}>
            {/* Limitamos a 100 visualmente para no saturar el DOM en el MVP */}
            {cartas.slice(0, 100).map(carta => (
              <Carta key={carta.id} carta={carta} />
            ))}
            
            {cartas.length === 0 && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#aaa', padding: '40px 0' }}>
                No se encontraron cartas con esos filtros en tu biblioteca.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ==========================================
          COLUMNA DERECHA: PANEL LATERAL DEL MAZO
          ========================================== */}
      <div style={{ 
        width: '350px', 
        backgroundColor: '#1a1a1a', 
        borderLeft: '1px solid #333',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: 'calc(100vh - 63px)', // Restamos la altura aproximada del header
        overflowY: 'auto'
      }}>
        
        {/* --- Sección: Mazo Castillo --- */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#f39c12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Mazo Castillo 
            <span style={{ fontSize: '1rem', color: mazo.length === 50 ? '#e74c3c' : '#aaa' }}>
              {mazo.length}/50
            </span>
          </h2>
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
                <button 
                  onClick={() => quitarCarta(c.id, false)} 
                  style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', transition: 'transform 0.1s' }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ×
                </button>
              </li>
            ))}
            {mazo.length === 0 && <li style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>El mazo está vacío</li>}
          </ul>
        </div>

        {/* --- Sección: Oros --- */}
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
                <button 
                  onClick={() => quitarCarta(o.id, true)} 
                  style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px', transition: 'transform 0.1s' }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  ×
                </button>
              </li>
            ))}
            {oros.length === 0 && <li style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>No has agregado oros</li>}
          </ul>
        </div>
        
      </div>
    </div>
  );
}