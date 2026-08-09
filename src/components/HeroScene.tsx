import { Suspense, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { RoundedBox, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const INK = "#2f3a4d";
const RULE = "#c9cfd8";
const BLUE = "#2563eb";

/** A thin measurement tick / rule drawn as a flat strip on the plate face. */
function Strip({
  position,
  width,
  height = 0.012,
  color = RULE,
  opacity = 1,
}: {
  position: [number, number, number];
  width: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

/** Open rectangle (crop boundary) built from four strips. */
function Frame({
  w,
  h,
  z,
  color = BLUE,
  t = 0.008,
  opacity = 0.85,
}: {
  w: number;
  h: number;
  z: number;
  color?: string;
  t?: number;
  opacity?: number;
}) {
  return (
    <group position={[0, 0, z]}>
      <Strip position={[0, h / 2, 0]} width={w} height={t} color={color} opacity={opacity} />
      <Strip position={[0, -h / 2, 0]} width={w} height={t} color={color} opacity={opacity} />
      <mesh position={[-w / 2, 0, 0]}>
        <planeGeometry args={[t, h]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
      <mesh position={[w / 2, 0, 0]}>
        <planeGeometry args={[t, h]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * The file card as a physical object: a plate with real thickness, a milled
 * inset photo panel, printed metadata rules and a crop boundary. It breathes
 * and answers the pointer — it never spins.
 */
function Plate(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const D = 0.11; // plate thickness

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { pointer, clock } = state;
    const time = clock.elapsedTime;
    // very subtle float — a sheet resting on air, not an orbiting object
    const restX = -0.055 + Math.sin(time * 0.45) * 0.018;
    const restY = -0.2 + Math.sin(time * 0.32) * 0.022;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, restX + pointer.y * 0.11, 3.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, restY + pointer.x * 0.2, 3.2, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, Math.sin(time * 0.27) * 0.008, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, 0.05 + Math.sin(time * 0.5) * 0.022, 2.4, delta);
  });

  return (
    <group ref={group} {...props}>
      {/* body — thickness with a lightly warmer edge so the side reads as paper stock */}
      <RoundedBox args={[2.0, 2.45, D]} radius={0.018} smoothness={5}>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.38}
          metalness={0}
          clearcoat={0.45}
          clearcoatRoughness={0.42}
          sheen={0.3}
          sheenColor="#e8eefb"
        />
      </RoundedBox>

      {/* milled photo panel, recessed a hair below the face */}
      <mesh position={[0, 0.24, D / 2 + 0.0005]}>
        <planeGeometry args={[1.72, 1.68]} />
        <meshStandardMaterial color="#dde7f6" roughness={0.78} />
      </mesh>
      <mesh position={[0, 0.42, D / 2 + 0.003]}>
        <circleGeometry args={[0.36, 48]} />
        <meshStandardMaterial color="#7ba7e8" roughness={0.62} />
      </mesh>
      <mesh position={[0, -0.28, D / 2 + 0.003]}>
        <circleGeometry args={[0.62, 48, 0, Math.PI]} />
        <meshStandardMaterial color="#7ba7e8" roughness={0.62} />
      </mesh>

      {/* crop boundary sitting on the photo panel */}
      <Frame w={1.5} h={1.46} z={D / 2 + 0.006} />
      {[
        [-0.75, 0.97],
        [0.75, 0.97],
        [-0.75, -0.49],
        [0.75, -0.49],
      ].map(([x, y]) => (
        <mesh key={`${x}:${y}`} position={[x as number, y as number, D / 2 + 0.007]}>
          <planeGeometry args={[0.05, 0.05]} />
          <meshBasicMaterial color={BLUE} toneMapped={false} />
        </mesh>
      ))}

      {/* measurement ticks along the top edge */}
      {Array.from({ length: 17 }).map((_, i) => (
        <Strip
          key={i}
          position={[-0.8 + i * 0.1, 1.1, D / 2 + 0.002]}
          width={0.006}
          height={i % 4 === 0 ? 0.07 : 0.038}
          color={RULE}
          opacity={0.9}
        />
      ))}

      {/* metadata layers */}
      <Strip position={[-0.46, -0.98, D / 2 + 0.002]} width={0.86} height={0.036} color={INK} />
      <Strip position={[-0.24, -1.09, D / 2 + 0.002]} width={1.3} height={0.028} color="#9aa6b8" />
      <Strip position={[0, -0.82, D / 2 + 0.002]} width={1.72} height={0.006} color={RULE} />

      {/* verified mark */}
      <mesh position={[0.76, -1.03, D / 2 + 0.003]}>
        <circleGeometry args={[0.062, 32]} />
        <meshBasicMaterial color="#2f9e6e" toneMapped={false} />
      </mesh>

      {/* companion plate resting behind, giving the scene real depth */}
      <group position={[0.8, -0.52, -0.42]} rotation={[0.04, -0.4, 0.05]}>
        <RoundedBox args={[1.3, 0.74, 0.07]} radius={0.014} smoothness={4}>
          <meshPhysicalMaterial color="#f7f6f2" roughness={0.5} clearcoat={0.18} />
        </RoundedBox>
        <Strip position={[-0.2, 0.1, 0.037]} width={0.6} height={0.03} color="#b8c0cc" />
        <Strip position={[-0.32, -0.02, 0.037]} width={0.36} height={0.024} color="#cfd5de" />
      </group>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0.35, 0.15, 6.6], fov: 32 }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        {/* key */}
        <directionalLight position={[3, 4.5, 5]} intensity={1.45} />
        {/* cool fill for the edge */}
        <directionalLight position={[-4.5, -0.5, 2]} intensity={0.42} color="#8fd0ff" />
        {/* rim, catching the plate's thickness */}
        <directionalLight position={[-1.5, 2, -4]} intensity={0.9} color="#ffffff" />
        <Plate position={[-0.12, 0.05, 0]} />
        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.32}
          scale={7}
          blur={2.8}
          far={3}
          resolution={512}
          color="#2a2f3a"
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
