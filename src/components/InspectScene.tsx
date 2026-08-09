import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

const RULE = "#c9cfd8";
const BLUE = "#2563eb";
const GREEN = "#2f9e6e";
const RED = "#d64545";

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

function Frame({
  w,
  h,
  z,
  color,
  t = 0.008,
  opacity = 0.9,
}: {
  w: number;
  h: number;
  z: number;
  color: string;
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
 * The examined file as a physical plate: real thickness, the user's own image
 * milled into the face, verdict-coloured crop boundary, printed metadata rules.
 * It rests and answers the pointer — it never spins.
 */
function Plate({
  url,
  ratio,
  accent,
}: {
  url: string;
  ratio: number;
  accent: string;
}) {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture(url);
  const D = 0.11;

  const { pw, ph } = useMemo(() => {
    const maxW = 1.72;
    const maxH = 1.68;
    const w = ratio >= maxW / maxH ? maxW : maxH * ratio;
    const h = ratio >= maxW / maxH ? maxW / ratio : maxH;
    return { pw: w, ph: h };
  }, [ratio]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const { pointer, clock } = state;
    const time = clock.elapsedTime;
    const restX = -0.045 + Math.sin(time * 0.45) * 0.016;
    const restY = -0.16 + Math.sin(time * 0.32) * 0.02;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, restX + pointer.y * 0.1, 3.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, restY + pointer.x * 0.18, 3.2, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, Math.sin(time * 0.27) * 0.007, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, 0.05 + Math.sin(time * 0.5) * 0.02, 2.4, delta);
  });

  return (
    <group ref={group} position={[-0.1, 0.05, 0]}>
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

      {/* recessed panel the photograph sits in */}
      <mesh position={[0, 0.24, D / 2 + 0.0005]}>
        <planeGeometry args={[1.72, 1.68]} />
        <meshStandardMaterial color="#e6ebf3" roughness={0.8} />
      </mesh>

      {/* the actual file */}
      <mesh position={[0, 0.24, D / 2 + 0.003]}>
        <planeGeometry args={[pw, ph]} />
        <meshStandardMaterial map={texture} roughness={0.62} toneMapped={false} />
      </mesh>

      <group position={[0, 0.24, 0]}>
        <Frame w={pw + 0.02} h={ph + 0.02} z={D / 2 + 0.006} color={accent} />
      </group>
      {[
        [-(pw + 0.02) / 2, 0.24 + (ph + 0.02) / 2],
        [(pw + 0.02) / 2, 0.24 + (ph + 0.02) / 2],
        [-(pw + 0.02) / 2, 0.24 - (ph + 0.02) / 2],
        [(pw + 0.02) / 2, 0.24 - (ph + 0.02) / 2],
      ].map(([x, y]) => (
        <mesh key={`${x}:${y}`} position={[x as number, y as number, D / 2 + 0.007]}>
          <planeGeometry args={[0.05, 0.05]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
      ))}

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

      <Strip position={[-0.46, -0.98, D / 2 + 0.002]} width={0.86} height={0.036} color="#2f3a4d" />
      <Strip position={[-0.24, -1.09, D / 2 + 0.002]} width={1.3} height={0.028} color="#9aa6b8" />
      <Strip position={[0, -0.82, D / 2 + 0.002]} width={1.72} height={0.006} color={RULE} />

      <mesh position={[0.76, -1.03, D / 2 + 0.003]}>
        <circleGeometry args={[0.062, 32]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function InspectScene({
  url,
  ratio,
  verdict = "pending",
}: {
  url: string;
  ratio: number;
  verdict?: "pass" | "fail" | "pending";
}) {
  const accent = verdict === "pass" ? GREEN : verdict === "fail" ? RED : BLUE;

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0.35, 0.15, 6.6], fov: 32 }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4.5, 5]} intensity={1.45} />
        <directionalLight position={[-4.5, -0.5, 2]} intensity={0.42} color="#8fd0ff" />
        <directionalLight position={[-1.5, 2, -4]} intensity={0.9} color="#ffffff" />
        <Plate url={url} ratio={ratio} accent={accent} />
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
