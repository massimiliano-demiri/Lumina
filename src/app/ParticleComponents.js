"use client"; // Indica che questo è un Client Component
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Funzione per creare particelle personalizzate come pagine
const FloatingPages = () => {
  const pagesRef = useRef();

  // Rotazione continua delle pagine con movimento più fluido e naturale
  useFrame(() => {
    if (pagesRef.current) {
      pagesRef.current.rotation.x += 0.002; // Movimento più veloce
      pagesRef.current.rotation.y += 0.001; // Movimento leggermente più lento su Y
      pagesRef.current.rotation.z += 0.0015; // Aggiungi rotazione anche sull'asse Z
    }
  });

  return (
    <group ref={pagesRef}>
      {Array.from({ length: 100 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 100, // Posizione casuale su asse X
            (Math.random() - 0.5) * 100, // Posizione casuale su asse Y
            (Math.random() - 0.5) * 100, // Posizione casuale su asse Z
          ]}
          rotation={[
            Math.random() * Math.PI, // Rotazione casuale su asse X
            Math.random() * Math.PI, // Rotazione casuale su asse Y
            Math.random() * Math.PI, // Rotazione casuale su asse Z
          ]}
        >
          {/* Geometria come pagina */}
          <planeGeometry args={[2, 3]} />
          <meshStandardMaterial
            color="#f5f5dc" // Colore simile alla carta
            transparent={true}
            opacity={0.85} // Manteniamo un po' di trasparenza
            metalness={0.3} // Aggiungiamo un effetto riflettente
            roughness={0.5} // Manteniamo una leggera ruvidità per evitare riflessi troppo forti
            shininess={50} // Valore alto per creare un effetto lucido
          />
        </mesh>
      ))}
    </group>
  );
};

const ParticlesComponent = () => {
  return (
    <Canvas style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}>
      <ambientLight intensity={0.3} /> {/* Luce ambientale leggera */}
      <directionalLight position={[5, 5, 5]} intensity={1} />{" "}
      {/* Luce direzionale */}
      <FloatingPages /> {/* Pagine animate */}
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6} // Rotazione più lenta e calma
      />
    </Canvas>
  );
};

export default ParticlesComponent;
