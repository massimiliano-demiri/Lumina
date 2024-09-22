"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const FloatingLetters = () => {
  const groupRef = useRef();
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // Lettere da visualizzare

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.001; // Rotazione lenta sull'asse X
      groupRef.current.rotation.y += 0.001; // Rotazione lenta sull'asse Y
    }
  });

  return (
    <group ref={groupRef}>
      {letters.map((letter, index) => (
        <Text3D
          key={index}
          font="./helvetiker_regular.typeface.json" // Percorso relativo al componente          size={1.5}
          height={0.1}
          position={[
            (Math.random() - 0.5) * 20, // Posizione X casuale
            (Math.random() - 0.5) * 20, // Posizione Y casuale
            (Math.random() - 0.5) * 20, // Posizione Z casuale
          ]}
          rotation={[
            Math.random() * Math.PI, // Rotazione casuale sull'asse X
            Math.random() * Math.PI, // Rotazione casuale sull'asse Y
            Math.random() * Math.PI, // Rotazione casuale sull'asse Z
          ]}
        >
          {letter}
          <meshStandardMaterial
            color="#90caf9"
            metalness={0.8}
            roughness={0.2}
          />
        </Text3D>
      ))}
    </group>
  );
};

const FloatingLettersBackground = () => (
  <Canvas style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <FloatingLetters />
    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
  </Canvas>
);

export default FloatingLettersBackground;
