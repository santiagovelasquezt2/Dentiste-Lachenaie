import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
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
        m.color.set('#f0eadf');
        m.metalness = 0;
        m.roughness = 0.22;
        m.envMapIntensity = 1.02;

        if ('clearcoat' in m) {
          m.clearcoat = 0.72;
          m.clearcoatRoughness = 0.1;
        }

        if ('sheen' in m) {
          m.sheen = 0.1;
          m.sheenRoughness = 0.55;
          if ('sheenColor' in m && m.sheenColor instanceof THREE.Color) {
            m.sheenColor.set('#f6f0e6');
          }
        }

        m.needsUpdate = true;
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
      <primitive object={scene} scale={1.35} position={[0, -0.38, 0]} />
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
        camera={{ position: [0, 0, 12.8], fov: 42 }}
        className="h-full w-full touch-none bg-transparent"
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.02,
        }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <hemisphereLight color="#fff8f0" groundColor="#a8947a" intensity={0.68} />
        <ambientLight intensity={0.1} />
        <spotLight
          position={[4.5, 9.5, 11]}
          angle={0.24}
          penumbra={0.9}
          intensity={4.3}
          color="#fff3df"
        />
        <spotLight
          position={[-5.5, 5.5, 10]}
          angle={0.36}
          penumbra={1}
          intensity={1.4}
          color="#e5f0ff"
        />
        <directionalLight position={[6.5, 9, 8]} intensity={0.84} color="#fffdf8" />
        <directionalLight position={[-4.5, 1, 6]} intensity={0.36} color="#f9ead7" />
        <directionalLight position={[0, -3.5, 4]} intensity={0.08} color="#dbe7ca" />
        <pointLight position={[0, 2.5, 9.5]} intensity={0.38} color="#ffffff" />

        <Suspense fallback={null}>
          <MolarModel url="/models/molar_tooth.glb" />
          <Environment preset="studio" environmentIntensity={0.75} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

useGLTF.preload('/models/molar_tooth.glb');
