// src/store/useDeckStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. Importamos persist

// 2. Envolvemos toda la creación de nuestro store en persist()
export const useDeckStore = create(
  persist(
    (set) => ({
      mazo: [],
      oros: [],

      agregarCarta: (carta) => set((state) => {
        if (carta.tipo.toLowerCase() === 'oro') {
          return { oros: [...state.oros, carta] };
        }
        
        if (state.mazo.length >= 50) {
          alert("Tu Mazo Castillo ya tiene 50 cartas.");
          return state;
        }

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
      name: 'forja-mitos-storage', // 3. El nombre de la "caja fuerte" en tu navegador
    }
  )
);