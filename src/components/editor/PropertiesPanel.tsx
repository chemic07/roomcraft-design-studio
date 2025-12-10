import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/stores/editorStore';
import { Trash2, RotateCcw, Move, Scaling } from 'lucide-react';

export function PropertiesPanel() {
  const { currentProject, selectedItemId, updateFurniture, removeFurniture } = useEditorStore();

  const selectedItem = currentProject?.furniture.find((f) => f.id === selectedItemId);

  if (!selectedItem) {
    return (
      <div className="w-72 border-l border-border bg-card/50 p-4">
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Select an item to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePositionChange = (axis: number, value: number) => {
    const newPosition = [...selectedItem.position] as [number, number, number];
    newPosition[axis] = value;
    updateFurniture(selectedItem.id, { position: newPosition });
  };

  const handleRotationChange = (axis: number, value: number) => {
    const newRotation = [...selectedItem.rotation] as [number, number, number];
    newRotation[axis] = (value * Math.PI) / 180;
    updateFurniture(selectedItem.id, { rotation: newRotation });
  };

  const handleScaleChange = (axis: number, value: number) => {
    const newScale = [...selectedItem.scale] as [number, number, number];
    newScale[axis] = value;
    updateFurniture(selectedItem.id, { scale: newScale });
  };

  return (
    <div className="w-72 border-l border-border bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold font-heading">{selectedItem.name}</h2>
        <p className="text-sm text-muted-foreground">{selectedItem.category}</p>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-auto">
        {/* Position */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Move className="w-4 h-4" />
            Position
          </div>
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="flex items-center gap-3">
              <Label className="w-6 text-xs text-muted-foreground">{axis}</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedItem.position[index].toFixed(1)}
                onChange={(e) => handlePositionChange(index, parseFloat(e.target.value) || 0)}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Rotation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <RotateCcw className="w-4 h-4" />
            Rotation (degrees)
          </div>
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">{axis}</Label>
                <span className="text-xs text-muted-foreground">
                  {Math.round((selectedItem.rotation[index] * 180) / Math.PI)}°
                </span>
              </div>
              <Slider
                value={[(selectedItem.rotation[index] * 180) / Math.PI]}
                onValueChange={([v]) => handleRotationChange(index, v)}
                min={-180}
                max={180}
                step={1}
              />
            </div>
          ))}
        </div>

        {/* Scale */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Scaling className="w-4 h-4" />
            Scale
          </div>
          {['W', 'H', 'D'].map((axis, index) => (
            <div key={axis} className="flex items-center gap-3">
              <Label className="w-6 text-xs text-muted-foreground">{axis}</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedItem.scale[index].toFixed(1)}
                onChange={(e) => handleScaleChange(index, parseFloat(e.target.value) || 0.1)}
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>

        {/* Color */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={selectedItem.color}
              onChange={(e) => updateFurniture(selectedItem.id, { color: e.target.value })}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer"
            />
            <Input
              value={selectedItem.color}
              onChange={(e) => updateFurniture(selectedItem.id, { color: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => removeFurniture(selectedItem.id)}
        >
          <Trash2 className="w-4 h-4" />
          Delete Item
        </Button>
      </div>
    </div>
  );
}
