// src/components/FilterBar.jsx
import React from 'react';

export default function FilterBar({ filtros, setFiltros }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
      
      {/* 1. Buscador */}
      <input 
        type="text" 
        name="search" 
        placeholder="Buscar por nombre o habilidad..." 
        value={filtros.search || ''} 
        onChange={handleChange}
        style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
      />

      {/* 2. Filtro de Ediciones Correcto */}
      <select name="edicion" value={filtros.edicion || ''} onChange={handleChange} style={inputStyle}>
        <option value="">Todas las Ediciones</option>
        
        <optgroup label="Primera Era">
          <option value="el-reto">El Reto</option>
          <option value="mundo-gotico">Mundo Gótico</option>
          <option value="ira-del-nahual">La Ira del Nahual</option>
          <option value="ragnarok">Ragnarok</option>
          <option value="la-cofradia">La Cofradía</option>
          <option value="espiritu-del-dragon">Espíritu del Dragón</option>
        </optgroup>
        
        <optgroup label="Primer Bloque">
          <option value="espada-sagrada">Espada Sagrada</option>
          <option value="cruzadas">Cruzadas</option>
          <option value="helenica">Helénica</option>
          <option value="imperio">Imperio</option>
          <option value="hijos-de-daana">Hijos de Daana</option>
          <option value="tierras-altas">Tierras Altas</option>
          <option value="dominios-de-ra">Dominios de Ra</option>
          <option value="encrucijada">Encrucijada</option>
        </optgroup>

        <optgroup label="Segundo Bloque">
          <option value="guerrero-jaguar">Guerrero Jaguar</option>
          <option value="vendaval">Vendaval</option>
          <option value="barbarie">Barbarie</option>
          <option value="reino-de-acero">Reino de Acero</option>
          <option value="hordas">Hordas</option>
          <option value="bestiario">Bestiario</option>
          <option value="heroes">Héroes</option>
        </optgroup>

        <optgroup label="Furia">
          <option value="furia">Furia</option>
          <option value="furia-extension">Furia Extensión</option>
          <option value="sumeria">Sumeria</option>
          <option value="rebelion">Rebelión</option>
          <option value="asgard">Asgard</option>
          <option value="midgard">Midgard</option>
          <option value="camelot">Camelot</option>
          <option value="templarios">Templarios</option>
          <option value="bushido">Bushido</option>
          <option value="sol-naciente">Sol Naciente</option>
        </optgroup>

        <optgroup label="Furia Extendido">
          <option value="roma">Roma</option>
          <option value="excalibur">Excalibur</option>
          <option value="troya">Troya</option>
          <option value="guerreros-del-sol">Guerreros del Sol</option>
          <option value="guardianes-de-daana">Guardianes de Daana</option>
        </optgroup>

        <optgroup label="Imperio">
          <option value="kemet">Kemet</option>
          <option value="arsenal">Arsenal</option>
          <option value="angeles-demonios">Ángeles y Demonios</option>
          <option value="explorandum">Exploradores</option>
          <option value="acero">Acero</option>
          <option value="cid">Cid</option>
          <option value="valhalla">Valhalla</option>
          <option value="shogun-1">Shogun</option>
          <option value="keltoi">Keltoi</option>
          <option value="axis-mundi">Axis</option>
          <option value="napoleon">Napoleón</option>
          <option value="bestiarium">Bestiarium</option>
        </optgroup>
      </select>

      {/* 3. Filtro Principal (Tipo de Carta) */}
      <select name="tipo" value={filtros.tipo || ''} onChange={handleChange} style={inputStyle}>
        <option value="">Todos los Tipos</option>
        <option value="Aliado">Aliado</option>
        <option value="Talismán">Talismán</option>
        <option value="Arma">Arma</option>
        <option value="Tótem">Tótem</option>
        <option value="Oro">Oro</option>
      </select>

      {/* 4. Filtro Razas */}
      {filtros.tipo === 'Aliado' && (
        <select name="raza" value={filtros.raza || ''} onChange={handleChange} style={{...inputStyle, border: '1px solid #3498db'}}>
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

      {/* 5. Filtro Subtipos de Oro */}
      {filtros.tipo === 'Oro' && (
        <select name="subtipoOro" value={filtros.subtipoOro || ''} onChange={handleChange} style={{...inputStyle, border: '1px solid #f1c40f'}}>
          <option value="">Cualquier Oro</option>
          <option value="basico">Oro Normal (Sin Habilidad)</option>
          <option value="habilidad">Oro con Habilidad</option>
          <option value="inicial">Oro Inicial</option>
        </select>
      )}

      {/* 6. Botón de Reset */}
      <button 
        onClick={() => setFiltros({ search: '', tipo: '', raza: '', subtipoOro: '', edicion: '' })}
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
        Limpiar
      </button>

    </div>
  );
}