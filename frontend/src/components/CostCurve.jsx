// src/components/CostCurve.jsx
import React from 'react';
import { useDeckStore } from '../store/useDeckStore';

export default function CostCurve() {
  const { mazo } = useDeckStore();

  // Si no hay cartas, no mostramos el gráfico para mantener limpio el diseño
  if (mazo.length === 0) return null;

  // 1. Inicializamos los contadores para cada coste
  const distribucion = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, '5+': 0 };

  // 2. Llenamos los contadores leyendo el mazo
  mazo.forEach(carta => {
    // Convertimos el coste a número (por si viene como string desde Django)
    const coste = parseInt(carta.coste);
    
    // Si la carta no tiene coste numérico válido, la ignoramos en el gráfico
    if (isNaN(coste)) return; 

    // Agrupamos los costes mayores a 5 para que el gráfico no se alargue infinitamente
    if (coste >= 5) {
      distribucion['5+'] += 1;
    } else {
      distribucion[coste] += 1;
    }
  });

  // 3. Calculamos cuál es la barra más alta para usarla como 100% de referencia
  // Usamos Math.max con un mínimo de 1 para evitar divisiones por cero
  const maxCartas = Math.max(...Object.values(distribucion), 1);

  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '15px', 
      backgroundColor: '#252525', 
      borderRadius: '8px',
      border: '1px solid #333'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#aaa', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Curva de Coste
      </h3>
      
      {/* Contenedor del Gráfico */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', // Alinea las barras hacia abajo
        height: '100px', // Altura máxima del gráfico
        paddingTop: '20px' // Espacio para el numerito de arriba
      }}>
        {Object.entries(distribucion).map(([coste, cantidad]) => {
          // Regla de 3 simple para calcular el porcentaje de altura de la barra
          const alturaPorcentaje = (cantidad / maxCartas) * 100;
          
          return (
            <div key={coste} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '15%' }}>
              
              {/* Etiqueta superior (Cantidad de cartas) */}
              <span style={{ fontSize: '0.8rem', color: '#f39c12', fontWeight: 'bold', marginBottom: '5px', height: '15px' }}>
                {cantidad > 0 ? cantidad : ''}
              </span>
              
              {/* La Barra */}
              <div style={{ 
                width: '100%', 
                height: `${alturaPorcentaje}%`, 
                backgroundColor: '#3498db', 
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease-in-out', // Animación suave al agregar cartas
                minHeight: cantidad > 0 ? '4px' : '0' // Mínimo visible si hay al menos 1 carta
              }}></div>
              
              {/* Etiqueta inferior (Valor del Coste) */}
              <span style={{ fontSize: '0.9rem', color: '#fff', marginTop: '5px', fontWeight: 'bold' }}>
                {coste}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}