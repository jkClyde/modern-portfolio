"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { Environment, Bounds, Center } from "@react-three/drei";

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
    // Purely decorative model — no drag/zoom/rotate interaction, so it
    // should never capture touch/scroll events. Smaller margin = bigger
    // model; used to size it up on mobile vs desktop.
    const [margin, setMargin] = useState(1.8);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const update = () => setMargin(mq.matches ? 1 : 1.8);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    return (
        <div className={`pointer-events-none absolute inset-0 ${className}`}>
            <Canvas
                camera={{ position: [0, 0.5, 3], fov: 40 }}
                style={{ touchAction: "auto" }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 3]} intensity={1} />
                <Suspense fallback={null}>
                    <Bounds fit clip observe margin={margin}>
                        <LaptopModel />
                    </Bounds>
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}