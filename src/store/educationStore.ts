import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EducationEntry, EducationStore } from '../types/education';

export const useEducationStore = create<EducationStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set((state) => ({
        entries: [...state.entries, { ...entry, id: Date.now() }]
      })),
      updateEntry: (id, updatedEntry) => set((state) => ({
        entries: state.entries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
  )
})),
      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id)
      })),
    }),
    {
      name: 'education-storage',
    }
  )
);