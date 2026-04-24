import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { portfolioData } from "../data/portfolioData";

const textureLoader = new THREE.TextureLoader();
const imageUrls = portfolioData.techStack.imageUrls;
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

type OrbProps = {
  base: THREE.Vector3;
  velocity: THREE.Vector3;
  phase: number;
  clusterPoint: THREE.Vector3;
  scale: number;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function Orb({
  base,
  velocity,
  phase,
  clusterPoint,
  scale,
  material,
  isActive,
}: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerWorld = useRef(new THREE.Vector3());
  const current = useRef(base.clone());

  useFrame(({ clock, pointer, viewport }, delta) => {
    if (!meshRef.current) return;
    if (!isActive) return;

    const t = clock.elapsedTime;
    const drift = 0.85;
    const wave = new THREE.Vector3(
      Math.sin(t * velocity.x + phase) * drift,
      Math.cos(t * velocity.y + phase) * drift,
      Math.sin(t * velocity.z + phase) * (drift * 0.65)
    );

    pointerWorld.current.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    const target = base.clone().add(wave);

    // Periodically pull icons toward a compact cluster, then release them back.
    const pulse = (Math.sin(t * 0.42 + phase * 0.2) + 1) / 2;
    const clusterStrength = THREE.MathUtils.smoothstep(pulse, 0.68, 0.98);
    target.lerp(clusterPoint, clusterStrength);

    const repel = target.clone().sub(pointerWorld.current);
    const distance = Math.max(repel.length(), 0.0001);

    if (distance < 2.4) {
      target.add(repel.normalize().multiplyScalar((2.4 - distance) * 0.35));
    }

    current.current.lerp(target, Math.min(1, delta * 2.4));
    meshRef.current.position.copy(current.current);
    meshRef.current.rotation.x += delta * 0.35;
    meshRef.current.rotation.y += delta * 0.55;
  });

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      scale={scale}
      geometry={sphereGeometry}
      material={material}
      position={base}
      rotation={[0.3, 1, 1]}
    />
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const spheres = useMemo(() => {
    const count = isLightMode ? 12 : 20;
    return [...Array(count)].map(() => ({
      scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
      materialIndex: Math.floor(Math.random() * textures.length),
      base: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(14),
        THREE.MathUtils.randFloatSpread(8),
        THREE.MathUtils.randFloatSpread(8)
      ),
      clusterPoint: new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(2.2),
        THREE.MathUtils.randFloatSpread(1.6),
        THREE.MathUtils.randFloatSpread(1.4)
      ),
      velocity: new THREE.Vector3(
        0.4 + Math.random() * 0.8,
        0.45 + Math.random() * 0.75,
        0.35 + Math.random() * 0.65
      ),
      phase: Math.random() * Math.PI * 2,
    }));
  }, [isLightMode]);

  useEffect(() => {
    const setPerfMode = () => {
      setIsLightMode(
        window.innerWidth < 1400 ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    setPerfMode();

    const observer = new IntersectionObserver(
      (entries) => {
        setIsActive(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener("resize", setPerfMode);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setPerfMode);
    };
  }, []);
  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2>{portfolioData.techStack.heading}</h2>

      <Canvas
        shadows={!isLightMode}
        dpr={[1, isLightMode ? 1.25 : 1.6]}
        frameloop={isActive ? "always" : "demand"}
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        {spheres.map((props, i) => (
          <Orb
            key={i}
            base={props.base}
            velocity={props.velocity}
            phase={props.phase}
            clusterPoint={props.clusterPoint}
            scale={props.scale}
            material={materials[props.materialIndex]}
            isActive={isActive}
          />
        ))}
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        {!isLightMode && (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default TechStack;
