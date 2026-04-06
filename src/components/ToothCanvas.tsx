import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useLanguage } from '../context/LanguageContext';

function MolarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef(0);

  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material;
      const mats = Array.isArray(mat) ? mat : [mat];
      for (const m of mats) {
        if (!m || !('isMeshStandardMaterial' in m) || !m.isMeshStandardMaterial) continue;
        m.envMapIntensity = Math.min(m.envMapIntensity ?? 1, 0.75);
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    spinRef.current += delta * 0.3924;
    g.rotation.x = 0;
    g.rotation.y = spinRef.current;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2} position={[0, -0.55, 0]} />
    </group>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallbackLabel: string }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; fallbackLabel: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-bg-alt rounded-3xl border-2 border-dashed border-accent/20">
          <p className="text-accent font-nav uppercase tracking-[0.18em]">{this.props.fallbackLabel}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ToothCanvas: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ErrorBoundary fallbackLabel={t.tooth3d.previewUnavailable}>
      <Canvas
        camera={{ position: [0, 0, 12.45], fov: 45 }}
        className="h-full w-full touch-none"
      >
        <hemisphereLight color="#f2f5f7" groundColor="#2a2520" intensity={0.55} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={0.85} />
        <pointLight position={[-6, 4, 6]} intensity={0.35} />
        
        <Suspense fallback={null}>
          <MolarModel url="/models/molar_tooth.glb" />
          <Environment preset="city" environmentIntensity={0.72} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

useGLTF.preload('/models/molar_tooth.glb');
