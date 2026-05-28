"use client";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useEffect, useState } from "react";
export default function MinimalThreeJSBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      </Canvas>
    </div>
  );
}