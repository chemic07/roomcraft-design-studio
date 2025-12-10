import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditorStore } from '@/stores/editorStore';
import { 
  Sofa, 
  Armchair, 
  Lamp, 
  Table, 
  BedDouble, 
  CookingPot,
  Tv,
  BookOpen
} from 'lucide-react';

interface ModelItem {
  id: string;
  name: string;
  icon: React.ElementType;
  category: string;
  modelType: 'box' | 'cylinder' | 'sphere';
  defaultScale: [number, number, number];
  color: string;
}

const modelLibrary: ModelItem[] = [
  { id: 'sofa', name: 'Sofa', icon: Sofa, category: 'Living Room', modelType: 'box', defaultScale: [2, 0.8, 1], color: '#4a90a4' },
  { id: 'armchair', name: 'Armchair', icon: Armchair, category: 'Living Room', modelType: 'box', defaultScale: [1, 0.8, 1], color: '#6b8e7f' },
  { id: 'coffee-table', name: 'Coffee Table', icon: Table, category: 'Living Room', modelType: 'box', defaultScale: [1.2, 0.4, 0.6], color: '#8b7355' },
  { id: 'floor-lamp', name: 'Floor Lamp', icon: Lamp, category: 'Living Room', modelType: 'cylinder', defaultScale: [0.3, 1.5, 0.3], color: '#d4af37' },
  { id: 'tv-stand', name: 'TV Stand', icon: Tv, category: 'Living Room', modelType: 'box', defaultScale: [1.8, 0.5, 0.4], color: '#2c3e50' },
  { id: 'bed', name: 'Double Bed', icon: BedDouble, category: 'Bedroom', modelType: 'box', defaultScale: [2, 0.6, 2.2], color: '#7d8c8d' },
  { id: 'nightstand', name: 'Nightstand', icon: Table, category: 'Bedroom', modelType: 'box', defaultScale: [0.5, 0.5, 0.4], color: '#5d4e37' },
  { id: 'desk', name: 'Desk', icon: Table, category: 'Office', modelType: 'box', defaultScale: [1.4, 0.75, 0.7], color: '#34495e' },
  { id: 'bookshelf', name: 'Bookshelf', icon: BookOpen, category: 'Office', modelType: 'box', defaultScale: [1, 2, 0.3], color: '#6c5b4a' },
  { id: 'dining-table', name: 'Dining Table', icon: Table, category: 'Kitchen', modelType: 'box', defaultScale: [1.8, 0.75, 1], color: '#5c4033' },
  { id: 'kitchen-island', name: 'Kitchen Island', icon: CookingPot, category: 'Kitchen', modelType: 'box', defaultScale: [1.5, 0.9, 0.8], color: '#2f4f4f' },
  { id: 'plant-pot', name: 'Plant Pot', icon: Lamp, category: 'Decor', modelType: 'cylinder', defaultScale: [0.4, 0.8, 0.4], color: '#228b22' },
];

const categories = ['All', ...new Set(modelLibrary.map(m => m.category))];

export function ModelCatalog() {
  const { addFurniture } = useEditorStore();

  const handleDragStart = (e: React.DragEvent, model: ModelItem) => {
    e.dataTransfer.setData('model', JSON.stringify(model));
  };

  const handleAddModel = (model: ModelItem) => {
    addFurniture({
      name: model.name,
      category: model.category,
      position: [Math.random() * 4 - 2, model.defaultScale[1] / 2, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale: model.defaultScale,
      modelType: model.modelType,
      color: model.color,
    });
  };

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold font-heading">Model Library</h2>
        <p className="text-sm text-muted-foreground">Drag or click to add</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {categories.slice(1).map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
              <div className="grid grid-cols-2 gap-2">
                {modelLibrary
                  .filter((m) => m.category === category)
                  .map((model) => (
                    <div
                      key={model.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, model)}
                      onClick={() => handleAddModel(model)}
                      className="p-3 rounded-lg glass hover:bg-secondary/80 cursor-pointer transition-all group"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors"
                        style={{ backgroundColor: model.color + '30' }}
                      >
                        <model.icon 
                          className="w-4 h-4 transition-colors" 
                          style={{ color: model.color }}
                        />
                      </div>
                      <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                        {model.name}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
