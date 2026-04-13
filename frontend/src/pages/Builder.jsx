// src/pages/Builder.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Carta from '../components/Card';
import FilterBar from '../components/FilterBar';
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
  
  const { mazo, oros, quitarCarta } = useDeckStore();

  useEffect(() => {
    setCargando(true);
    api.get('/cartas/', { params: filtros })
      .then(response => {
        const datos = response.data.results || response.data;
        setCartas(datos);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar:", error);
        setCargando(false);
      });
  }, [filtros]);

  const mazoAgrupado = agruparCartas(mazo);
  const orosAgrupados = agruparCartas(oros);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 63px)', backgroundColor: '#121212', color: '#eee' }}>
      
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ color: '#f39c12', borderBottom: '2px solid #333', paddingBottom: '10px', marginTop: 0 }}>
          Catálogo General
        </h2>
        
        <FilterBar filtros={filtros} setFiltros={setFiltros} />
        
        {cargando ? (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888', fontSize: '1.2rem' }}>
            Invocando cartas...
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '20px',
            paddingTop: '10px'
          }}>
            {cartas.slice(0, 100).map(carta => (
              <Carta key={carta.id} carta={carta} />
            ))}
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
          <h2 style={{ margin: 0, color: '#f39c12', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Cartas del Castillo
            <span style={{ fontSize: '1rem', color: '#aaa' }}>{mazo.length}</span>
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
    </div>
  );
}