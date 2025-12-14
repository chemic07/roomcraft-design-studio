import { useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useEditorStore, Project, FurnitureItem } from '@/stores/editorStore';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { ModelCatalog } from '@/components/editor/ModelCatalog';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, useGLTF } from '@react-three/drei';
import { useEditorStore as useStore } from '@/stores/editorStore';

// Default project template
const createDefaultProject = (name: string): Project => ({
  id: crypto.randomUUID(),
  name,
  createdAt: new Date(),
  updatedAt: new Date(),
  furniture: [],
  walls: [],
  roomWidth: 10,
  roomDepth: 10,
});

function GLTFModel({ url, item, isSelected, onSelect }: { url: string; item: FurnitureItem; isSelected: boolean; onSelect: () => void }) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone();
  
  return (
    <primitive
      object={clonedScene}
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={(e: any) => { e.stopPropagation(); onSelect(); }}
    />
  );
}

function FallbackShape({ item, isSelected, onSelect }: { item: FurnitureItem; isSelected: boolean; onSelect: () => void }) {
  return (
    <mesh
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      castShadow
    >
      {item.modelType === 'cylinder' ? (
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      ) : item.modelType === 'sphere' ? (
        <sphereGeometry args={[0.5, 32, 32]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial 
        color={item.color} 
        emissive={isSelected ? item.color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function FurnitureItemComponent({ item, isSelected, onSelect }: { item: FurnitureItem; isSelected: boolean; onSelect: () => void }) {
  if (item.modelUrl) {
    return (
      <Suspense fallback={<FallbackShape item={item} isSelected={isSelected} onSelect={onSelect} />}>
        <GLTFModel url={item.modelUrl} item={item} isSelected={isSelected} onSelect={onSelect} />
      </Suspense>
    );
  }
  
  return <FallbackShape item={item} isSelected={isSelected} onSelect={onSelect} />;
}

function Scene() {
  const { currentProject, selectedItemId, isGridVisible, selectItem } = useStore();

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
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[currentProject?.roomWidth || 10, currentProject?.roomDepth || 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Furniture */}
      {currentProject?.furniture.map((item) => (
        <FurnitureItemComponent
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onSelect={() => selectItem(item.id)}
        />
      ))}

      <OrbitControls makeDefault minDistance={5} maxDistance={30} maxPolarAngle={Math.PI / 2.1} />
    </>
  );
}

export default function Editor() {
  const { id } = useParams();
  const { setCurrentProject, currentProject } = useEditorStore();

  useEffect(() => {
    if (id === 'new' || !currentProject) {
      setCurrentProject(createDefaultProject('Untitled Room'));
    }
  }, [id, setCurrentProject, currentProject]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorToolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <ModelCatalog />
        
        <div className="flex-1 relative bg-background">
          <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
            <Scene />
          </Canvas>
          
          <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-2 text-xs text-muted-foreground">
            <span className="font-medium">Controls:</span> Drag to rotate • Scroll to zoom • Right-click to pan
          </div>
        </div>
        
        <PropertiesPanel />
      </div>
    </div>
  );
}
