import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Grid } from "@react-three/drei";
import { useRef, Suspense, useState } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://algdhvoyrlnrxpqjzqkt.supabase.co/storage/v1/object/public/models//tiny_isometric_room.glb";

/* ---------------- Rotating Model ---------------- */

function RotatingModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={0.1} position={[0, -0.65, 0]}>
      <primitive object={scene.clone()} />
    </group>
  );
}

/* ---------------- Grid with Hover Glow ---------------- */

function HoverGrid() {
  return (
    <Grid
      position={[0, -0.85, 0]}
      args={[20, 20]}
      cellSize={0.01}
      cellThickness={0.4}
      sectionSize={1}
      sectionThickness={1}
      fadeDistance={6}
      fadeStrength={1.5}
      infiniteGrid={false}
      cellColor="#444444"
      sectionColor="#555555"
    />
  );
}

/* ---------------- Fallback ---------------- */

function FallbackHouse() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2, 1.5, 1.5]} />
        <meshStandardMaterial color="#f8e8d0" />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[1.6, 0.8, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  );
}

/* ---------------- Hero Preview ---------------- */

export function HeroPreview() {
  return (
    <Canvas shadows camera={{ position: [4, 3, 4], fov: 45 }}>
      {/* 🌫 Fog */}
      <fog attach="fog" args={["#0f172a", 4, 10]} />

      {/* Lights */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1} castShadow />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* Grid */}
      <HoverGrid />

      {/* Model */}
      <Suspense fallback={<FallbackHouse />}>
        <RotatingModel />
      </Suspense>

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}

/* ---------------- Preload ---------------- */

useGLTF.preload(MODEL_URL);
