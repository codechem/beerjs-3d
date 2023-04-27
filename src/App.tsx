import React, { useEffect, useRef, useState } from 'react'
import { Canvas, Euler, Vector3, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import { Environment } from '@react-three/drei'
import { RgbaColorPicker } from "react-colorful";
import { PresetsType } from '@react-three/drei/helpers/environment-assets';
import * as THREE from 'three';

type SceneProps = {
  sceneUrl: string;
  scale?: Vector3;
  rotation?: Euler;
  position?: Vector3;
  spin?: boolean;
  color?: number[];
};

const Scene: React.FC<SceneProps> = ({
  color,
  sceneUrl,
  position,
  scale,
  rotation,
  spin,
}) => {
  const gltf = useGLTF(sceneUrl)
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const materials: Record<string, THREE.MeshStandardMaterial> | undefined = (gltf as any)?.materials as Record<string, THREE.MeshStandardMaterial>;
    const supportedMaterials = ['Laces', 'ShoeSurface', 'paint'];
    for (const key in materials) {
      if (supportedMaterials.includes(key) && color) {
        materials[key].color = new THREE.Color(...color);
      }
    }
  }, [gltf, color]);

  useFrame(() => {
    if (groupRef.current && spin) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
};


const App: React.FC = () => {
  const [color, setColor] = useState({ r: 200, g: 150, b: 35, a: 0.5 });
  const envs = [
    'sunset',
    'dawn',
    'night',
    'warehouse',
    'forest',
    'apartment',
    'studio',
    'city',
    'park',
    'lobby',
  ];

  const scenes = [
    { name: 'Porsche', url: 'porsche/porsche.gltf' },
    { name: 'Beer', url: 'beer-can/beer-can.glb' },
    { name: 'Nike', url: 'scene.glb' },
  ];

  const { progress } = useProgress();

  const [env, setEnv] = useState<PresetsType>("apartment");
  const [sceneUrl, setSceneUrl] = useState('scene.glb');
  const [showControls, setShowControls] = useState(true);

  return (
    <div>
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{ fov: 45, position: [3, 3, -3] }}
      >
        <Scene sceneUrl={sceneUrl} color={[color.r / 255, color.g / 255, color.b / 255]} />
        <ambientLight />
        <OrbitControls target={[0, 0.3, 0]} enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} />
        <Environment ground={{ height: 32, radius: 150, scale: 10 }} preset={env} background />
      </Canvas>
      <div style={{
        position: 'absolute',
        zIndex: 10,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}>
        <a
          href="https://codechem.com"
          target="_blank"
          style={{ pointerEvents: 'all' }}
        >
          <img
            alt="CodeChem"
            style={{
              bottom: '80px',
              left: '30px',
              position: 'absolute',
              height: '100px'
            }}
            src="cc.svg"
          />
        </a>

        <a
          href="https://beerjs.mk"
          target="_blank"
          style={{ pointerEvents: 'all' }}
        >
          <img
            alt="Beer JS"
            style={{
              bottom: '200px',
              left: '35px',
              position: 'absolute',
              height: '100px'
            }}
            src="beerjs.svg"
          />
        </a>
        {showControls && (<div
          style={{
            top: '10px',
            width: '100vw',
            position: 'absolute',
          }}>
          {envs.map((env) => (
            <button
              style={{
                marginLeft: '10px',
                marginBottom: '10px',
                pointerEvents: 'all',
              }}
              onClick={() => setEnv(env as PresetsType)}>
              {env}
            </button>
          ))}
          <div>
            {scenes.map((scene) => (
              <button
                style={{
                  marginLeft: '10px',
                  marginBottom: '10px',
                  pointerEvents: 'all',
                  background: "#1f3659",
                }}
                onClick={() => setSceneUrl(scene.url)}>
                {scene.name}
              </button>
            ))}
          </div>
          <RgbaColorPicker
            color={color}
            onChange={setColor}
            style={{
              marginLeft: '10px',
              pointerEvents: 'all',
            }}
          />
        </div>)}
        <button
          onClick={() => setShowControls(!showControls)}
          style={{
            bottom: '100px',
            position: 'absolute',
            right: '10px',
            pointerEvents: 'all',
          }}>
          {showControls ? 'Show Controls' : 'Hide Controls'}
        </button>
      </div>
      {((progress < 100)) && (
        <div style={{
          position: 'absolute',
          top: '0',
          pointerEvents: 'none',
          display: 'flex',
          zIndex: 1000,
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2em',
          fontWeight: 'bold',
          width: '100vw',
          height: '100vh',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
        }}>
          Loading content...
        </div>
      )}
    </div>

  );
};

export default App;