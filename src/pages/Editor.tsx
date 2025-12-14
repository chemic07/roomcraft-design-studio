// Add this to your Editor.tsx - Enhanced keyboard controls

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent default for our shortcuts
    const key = e.key.toLowerCase();
    
    // Tool switching
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      switch(key) {
        case 'v':
          setActiveTool('select');
          e.preventDefault();
          break;
        case 'g':
          setActiveTool('move');
          e.preventDefault();
          break;
        case 'r':
          setActiveTool('rotate');
          e.preventDefault();
          break;
        case 's':
          setActiveTool('scale');
          e.preventDefault();
          break;
        case 'w':
          setActiveTool('wall');
          e.preventDefault();
          break;
        case 'escape':
          setDrawingWall(false);
          setWallStartPoint(null);
          selectItem(null);
          selectWall(null);
          break;
        case 'delete':
        case 'backspace':
          if (selectedItemId) {
            removeFurniture(selectedItemId);
          } else if (selectedWallId) {
            removeWall(selectedWallId);
          }
          e.preventDefault();
          break;
      }
    }
    
    // Grid toggle
    if (e.altKey && key === 'g') {
      toggleGrid();
      e.preventDefault();
    }
    
    // Duplicate selected item
    if ((e.ctrlKey || e.metaKey) && key === 'd') {
      if (selectedItemId && currentProject) {
        const item = currentProject.furniture.find(f => f.id === selectedItemId);
        if (item) {
          addFurniture({
            ...item,
            position: [item.position[0] + 1, item.position[1], item.position[2] + 1]
          });
        }
      }
      e.preventDefault();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [
  setActiveTool, 
  setDrawingWall, 
  setWallStartPoint, 
  selectedItemId, 
  selectedWallId,
  removeFurniture,
  removeWall,
  toggleGrid,
  selectItem,
  selectWall,
  currentProject,
  addFurniture
]);


// ============================================
// Enhanced Scene with Mouse Transform Controls
// ============================================

function Scene() {
  const { 
    currentProject, 
    selectedItemId, 
    selectedWallId,
    isGridVisible, 
    selectItem, 
    selectWall,
    activeTool,
    updateFurniture,
    addWall,
    isDrawingWall,
    wallStartPoint,
    setDrawingWall,
    setWallStartPoint
  } = useEditorStore();

  const [previewPoint, setPreviewPoint] = React.useState<[number, number] | null>(null);
  const controlsRef = useRef<any>(null);

  const handleFloorClick = (e: ThreeEvent<MouseEvent>) => {
    if (activeTool === 'wall') {
      const point = e.point;
      const snappedPoint: [number, number] = [
        Math.round(point.x * 2) / 2,
        Math.round(point.z * 2) / 2
      ];
      
      if (!isDrawingWall) {
        setWallStartPoint(snappedPoint);
        setDrawingWall(true);
      } else if (wallStartPoint) {
        addWall({
          start: wallStartPoint,
          end: snappedPoint,
          height: 2.5,
          thickness: 0.15
        });
        setWallStartPoint(snappedPoint);
      }
    } else {
      selectItem(null);
      selectWall(null);
    }
  };

  const handleFloorMove = (e: ThreeEvent<MouseEvent>) => {
    if (activeTool === 'wall' && isDrawingWall) {
      const point = e.point;
      setPreviewPoint([
        Math.round(point.x * 2) / 2,
        Math.round(point.z * 2) / 2
      ]);
    }
  };

  const handleTransformEnd = (id: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]) => {
    updateFurniture(id, { position, rotation, scale });
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
      <Environment preset="city" />
      
      {isGridVisible && (
        <Grid
          infiniteGrid
          cellSize={1}
          sectionSize={5}
          sectionColor="#06b6d4"
          cellColor="#1e293b"
          fadeDistance={30}
        />
      )}

      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow 
        onClick={handleFloorClick}
        onPointerMove={handleFloorMove}
      >
        <planeGeometry args={[currentProject?.roomWidth || 10, currentProject?.roomDepth || 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Walls */}
      {currentProject?.walls.map((wall) => (
        <WallMesh
          key={wall.id}
          wall={wall}
          isSelected={selectedWallId === wall.id}
          onSelect={() => selectWall(wall.id)}
        />
      ))}

      {/* Wall Preview */}
      {isDrawingWall && wallStartPoint && previewPoint && (
        <WallPreview start={wallStartPoint} current={previewPoint} />
      )}

      {/* Furniture with Transform Controls */}
      {currentProject?.furniture.map((item) => (
        <TransformableFurniture
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onSelect={() => selectItem(item.id)}
          activeTool={activeTool}
          onTransformEnd={(pos, rot, scl) => handleTransformEnd(item.id, pos, rot, scl)}
        />
      ))}

      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        minDistance={5} 
        maxDistance={30} 
        maxPolarAngle={Math.PI / 2.1}
        enabled={activeTool !== 'wall' || !isDrawingWall}
      />
    </>
  );
}


// ============================================
// Store Updates - Add to editorStore.ts
// ============================================

interface EditorStore {
  // ... existing properties
  activeTool: 'select' | 'move' | 'rotate' | 'scale' | 'wall';
  setActiveTool: (tool: 'select' | 'move' | 'rotate' | 'scale' | 'wall') => void;
}

// In your store:
activeTool: 'select',
setActiveTool: (tool) => set({ activeTool: tool }),