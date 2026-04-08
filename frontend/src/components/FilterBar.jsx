// src/components/FilterBar.jsx
import React from 'react';

export default function FilterBar({ filtros, setFiltros }) {
  
  // Manejador genérico para todos los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Regla especial: Si el usuario cambia el "Tipo Principal", 
    // limpiamos la raza y el subtipoOro para que no queden filtros ocultos bugeando la búsqueda
    if (name === 'tipo') {
      setFiltros(prev => ({ ...prev, tipo: value, raza: '', subtipoOro: '' }));
    } else {
      setFiltros(prev => ({ ...prev, [name]: value }));
    }
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #333',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    outline: 'none',
    fontSize: '0.95rem'
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      marginBottom: '20px', 
      backgroundColor: '#252525', 
      padding: '15px', 
      borderRadius: '8px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      
      {/* 1. Buscador por texto (Nombre o Habilidad) */}
      <input 
        type="text" 
        name="search" 
        placeholder="Buscar por nombre o habilidad..." 
        value={filtros.search} 
        onChange={handleChange}
        style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
      />

      {/* 2. Filtro Principal (Tipo de Carta) */}
      <select name="tipo" value={filtros.tipo} onChange={handleChange} style={inputStyle}>
        <option value="">Todos los Tipos</option>
        <option value="Aliado">Aliado</option>
        <option value="Talismán">Talismán</option>
        <option value="Arma">Arma</option>
        <option value="Tótem">Tótem</option>
        <option value="Oro">Oro</option>
      </select>

      {/* 3. Filtro Secundario A: Razas (SOLO aparece si eliges Aliado) */}
      {filtros.tipo === 'Aliado' && (
        <select name="raza" value={filtros.raza} onChange={handleChange} style={{...inputStyle, border: '1px solid #3498db'}}>
          <option value="">Todas las Razas</option>
          <option value="Caballero">Caballero</option>
          <option value="Dragón">Dragón</option>
          <option value="Sombra">Sombra</option>
          <option value="Faerie">Faerie</option>
          <option value="Guerrero">Guerrero</option>
          <option value="Bestia">Bestia</option>
          <option value="Eterno">Eterno</option>
          <option value="Sacerdote">Sacerdote</option>
          <option value="Ancestral">Ancestral</option>
          <option value="Samurái">Samurái</option>
        </select>
      )}

      {/* 4. Filtro Secundario B: Subtipos de Oro (SOLO aparece si eliges Oro) */}
      {filtros.tipo === 'Oro' && (
        <select name="subtipoOro" value={filtros.subtipoOro} onChange={handleChange} style={{...inputStyle, border: '1px solid #f1c40f'}}>
          <option value="">Cualquier Oro</option>
          <option value="basico">Oro Normal (Sin Habilidad)</option>
          <option value="habilidad">Oro con Habilidad</option>
          <option value="inicial">Oro Inicial</option>
        </select>
      )}

      {/* 5. Botón de Reset */}
      <button 
        onClick={() => setFiltros({ search: '', tipo: '', raza: '', subtipoOro: '' })}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#c0392b', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
          height: '40px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#e74c3c'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#c0392b'}
      >
        Limpiar Filtros
      </button>

    </div>
  );
}