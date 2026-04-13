// src/store/useDeckStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDeckStore = create(
  persist(
    (set) => ({
      mazo: [],
      oros: [],

      agregarCarta: (carta) => set((state) => {
        // 1. Calculamos el total de cartas en el mazo completo
        const totalCartas = state.mazo.length + state.oros.length;
        
        if (totalCartas >= 50) {
          alert("Tu mazo ya alcanzó el límite máximo de 50 cartas.");
          return state;
        }

        // 2. Si es un Oro, lo guardamos en su lista visual
        if (carta.tipo.toLowerCase() === 'oro') {
          // Si el oro tiene habilidad, no puede haber más de 3
          if (carta.habilidad) {
            const copiasOros = state.oros.filter(c => c.id === carta.id).length;
            if (copiasOros >= 3) {
              alert("No puedes tener más de 3 copias del mismo Oro con habilidad.");
              return state;
            }
          }
          return { oros: [...state.oros, carta] };
        }
        
        // 3. Si es otra carta, validamos el límite de 3 copias
        const copiasActuales = state.mazo.filter(c => c.id === carta.id).length;
        if (copiasActuales >= 3) {
          alert("No puedes tener más de 3 copias de la misma carta (excepto Únicas).");
          return state;
        }

        return { mazo: [...state.mazo, carta] };
      }),

      quitarCarta: (cartaId, esOro) => set((state) => {
        if (esOro) {
          const index = state.oros.findIndex(c => c.id === cartaId);
          if (index === -1) return state;
          const nuevosOros = [...state.oros];
          nuevosOros.splice(index, 1);
          return { oros: nuevosOros };
        } else {
          const index = state.mazo.findIndex(c => c.id === cartaId);
          if (index === -1) return state;
          const nuevoMazo = [...state.mazo];
          nuevoMazo.splice(index, 1);
          return { mazo: nuevoMazo };
        }
      }),

      limpiarMazo: () => set({ mazo: [], oros: [] }),
    }),
    {
      name: 'forja-mitos-storage',
    }
  )
);