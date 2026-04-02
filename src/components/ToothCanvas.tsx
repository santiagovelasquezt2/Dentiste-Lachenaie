import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

function MolarModel({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url);
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
      if (!meshRef.current) return;
      // Idle rotation
      meshRef.current.rotation.y += 0.005;
      
      // Inverse cursor parallax
      const targetX = -state.pointer.y * 0.2;
      const targetY = state.pointer.x * 0.2;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetY, 0.1);
    });

    return (
      <primitive 
        ref={meshRef}
        object={scene} 
        scale={2.5} 
        position={[0, -1, 0]}
      />
    );
  } catch (e) {
    return (
      <Text
        color="#B0D64E"
        fontSize={0.5}
        maxWidth={2}
        textAlign="center"
        font="/fonts/Syne-Bold.ttf"
      >
        3D Model Loading...
      </Text>
    );
  }
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
  return (
    <ErrorBoundary>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <MolarModel url="/models/molar_tooth.glb" />
          </Float>
          <Environment preset="city" />
        </Suspense>
        
        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2} 
          far={4.5} 
        />
      </Canvas>
    </ErrorBoundary>
  );
};

