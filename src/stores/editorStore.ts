import { create } from 'zustand';

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  modelType: 'box' | 'cylinder' | 'sphere';
  color: string;
}

export interface Wall {
  id: string;
  start: [number, number];
  end: [number, number];
  height: number;
  thickness: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  furniture: FurnitureItem[];
  walls: Wall[];
  roomWidth: number;
  roomDepth: number;
}

interface EditorState {
  currentProject: Project | null;
  selectedItemId: string | null;
  isGridVisible: boolean;
  cameraPosition: [number, number, number];
  
  // Actions
  setCurrentProject: (project: Project | null) => void;
  selectItem: (id: string | null) => void;
  toggleGrid: () => void;
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  addWall: (wall: Omit<Wall, 'id'>) => void;
  removeWall: (id: string) => void;
  updateRoomSize: (width: number, depth: number) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  currentProject: null,
  selectedItemId: null,
  isGridVisible: true,
  cameraPosition: [10, 10, 10],

  setCurrentProject: (project) => set({ currentProject: project }),
  
  selectItem: (id) => set({ selectedItemId: id }),
  
  toggleGrid: () => set((state) => ({ isGridVisible: !state.isGridVisible })),
  
  addFurniture: (item) => {
    const id = crypto.randomUUID();
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            furniture: [...state.currentProject.furniture, { ...item, id }],
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  updateFurniture: (id, updates) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            furniture: state.currentProject.furniture.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  removeFurniture: (id) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            furniture: state.currentProject.furniture.filter((item) => item.id !== id),
            updatedAt: new Date(),
          }
        : null,
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
  },
  
  addWall: (wall) => {
    const id = crypto.randomUUID();
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            walls: [...state.currentProject.walls, { ...wall, id }],
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  removeWall: (id) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            walls: state.currentProject.walls.filter((wall) => wall.id !== id),
            updatedAt: new Date(),
          }
        : null,
    }));
  },
  
  updateRoomSize: (width, depth) => {
    set((state) => ({
      currentProject: state.currentProject
        ? {
            ...state.currentProject,
            roomWidth: width,
            roomDepth: depth,
            updatedAt: new Date(),
          }
        : null,
    }));
  },
}));
