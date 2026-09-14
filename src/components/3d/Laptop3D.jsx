"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { Environment, OrbitControls, Bounds, Center } from "@react-three/drei";

function LaptopModel() {
    const materials = useLoader(MTLLoader, "/models/laptap/materials.mtl");
    const obj = useLoader(OBJLoader, "/models/laptap/model.obj", (loader) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const ref = useRef(null);

    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.3;
    });

    return (
        <Center>
            <primitive ref={ref} object={obj} />
        </Center>
    );
}

export default function Laptop3D({ className = "" }) {
    return (
        <div className={`absolute inset-0 ${className}`}>
            <Canvas camera={{ position: [0, 0.5, 3], fov: 40 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 3]} intensity={1} />
                <Suspense fallback={null}>
                    <Bounds fit clip observe margin={1.8}>
                        <LaptopModel />
                    </Bounds>
                    <Environment preset="city" />
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                />
            </Canvas>
        </div>
    );
}