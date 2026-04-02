import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const POINTER_TILT_X = 0.19;
const POINTER_TILT_Y = 0.23;
const POINTER_GAIN = 2.35;
const POINTER_SMOOTH = 22;

function MolarModel({ url, hoverRef }: { url: string; hoverRef: React.MutableRefObject<boolean> }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const spinRef = useRef(0);
  const tiltXRef = useRef(0);
  const tiltYRef = useRef(0);

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

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const { pointer } = state;
    const over = hoverRef.current ?? false;
    const px = over ? THREE.MathUtils.clamp(pointer.x * POINTER_GAIN, -1, 1) : 0;
    const py = over ? THREE.MathUtils.clamp(pointer.y * POINTER_GAIN, -1, 1) : 0;
    const targetX = -py * POINTER_TILT_X;
    const targetY = -px * POINTER_TILT_Y;
    const t = Math.min(1, POINTER_SMOOTH * delta);
    tiltXRef.current = THREE.MathUtils.lerp(tiltXRef.current, targetX, t);
    tiltYRef.current = THREE.MathUtils.lerp(tiltYRef.current, targetY, t);

    spinRef.current += delta * 0.3924;
    g.rotation.x = tiltXRef.current;
    g.rotation.y = spinRef.current + tiltYRef.current;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2} position={[0, -0.55, 0]} />
    </group>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
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
          <p className="text-accent font-nav uppercase tracking-widest">3D Preview Unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const ToothCanvas: React.FC = () => {
  const hoverRef = useRef(false);

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 12.45], fov: 45 }}
        className="h-full w-full touch-none"
        onPointerEnter={() => {
          hoverRef.current = true;
        }}
        onPointerLeave={() => {
          hoverRef.current = false;
        }}
      >
        <hemisphereLight color="#f2f5f7" groundColor="#2a2520" intensity={0.55} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={0.85} />
        <pointLight position={[-6, 4, 6]} intensity={0.35} />
        
        <Suspense fallback={null}>
          <MolarModel url="/models/molar_tooth.glb" hoverRef={hoverRef} />
          <Environment preset="city" environmentIntensity={0.72} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

useGLTF.preload('/models/molar_tooth.glb');
