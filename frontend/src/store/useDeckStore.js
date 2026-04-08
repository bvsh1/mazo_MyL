import { create } from 'zustand';

export const useDeckStore = create((set) => ({
  // Estado inicial
  mazo: [], // Aquí irán Aliados, Talismanes, Armas, etc. (Máx 50)
  oros: [], // Los Oros suelen ir en una zona separada

  // Acción: Agregar una carta
  agregarCarta: (carta) => set((state) => {
    // Si es un Oro, lo mandamos a la lista de oros
    if (carta.tipo.toLowerCase() === 'oro') {
      return { oros: [...state.oros, carta] };
    }
    
    // Regla de MyL: El Mazo Castillo tiene un máximo de 50 cartas
    if (state.mazo.length >= 50) {
      alert("Tu Mazo Castillo ya tiene 50 cartas.");
      return state; // No hacemos cambios
    }

    // Regla opcional MVP: Verificar que no haya más de 3 copias de la misma carta
    const copiasActuales = state.mazo.filter(c => c.id === carta.id).length;
    if (copiasActuales >= 3) {
      alert("No puedes tener más de 3 copias de la misma carta (excepto Únicas).");
      return state;
    }

    return { mazo: [...state.mazo, carta] };
  }),

  // Acción: Quitar una carta
  quitarCarta: (cartaId, esOro) => set((state) => {
    if (esOro) {
      const index = state.oros.findIndex(c => c.id === cartaId);
      if (index === -1) return state;
      const nuevosOros = [...state.oros];
      nuevosOros.splice(index, 1); // Quitamos solo una copia
      return { oros: nuevosOros };
    } else {
      const index = state.mazo.findIndex(c => c.id === cartaId);
      if (index === -1) return state;
      const nuevoMazo = [...state.mazo];
      nuevoMazo.splice(index, 1); // Quitamos solo una copia
      return { mazo: nuevoMazo };
    }
  }),

  // Acción: Limpiar todo el mazo para empezar de cero
  limpiarMazo: () => set({ mazo: [], oros: [] }),
}));