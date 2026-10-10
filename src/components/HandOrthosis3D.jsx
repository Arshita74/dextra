import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HandOrthosis3D({ isAnimating = false, repTrigger = 0, isConnected = true, height = "300px" }) {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // WebGL Capability Check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const h = container.clientHeight || 300;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep medical dark background

    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
    camera.position.set(0, 5, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x0d9488, 1.2); // Clinical teal directional light
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 1);
    pointLight.position.set(-10, -5, 5);
    scene.add(pointLight);

    // -------------------------------------------------------------
    // Build Stylized 3D Hand-Wrist Orthosis Model
    // -------------------------------------------------------------
    const orthosisGroup = new THREE.Group();

    // Forearm / Brace Base
    const forearmGeo = new THREE.CylinderGeometry(1.4, 1.6, 6, 32);
    const braceMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.3,
      roughness: 0.4,
    });
    const forearm = new THREE.Mesh(forearmGeo, braceMat);
    forearm.rotation.z = Math.PI / 2;
    forearm.position.set(-3.5, 0, 0);
    orthosisGroup.add(forearm);

    // Metallic Servo Mounting Bracket
    const bracketGeo = new THREE.BoxGeometry(1.8, 1.8, 1.2);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const bracket = new THREE.Mesh(bracketGeo, metalMat);
    bracket.position.set(-1.8, 0, 0);
    orthosisGroup.add(bracket);

    // Dual MG90S Servos (Represented as blue servo blocks)
    const servoGeo = new THREE.BoxGeometry(1.2, 0.8, 0.8);
    const servoMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    
    const servo1 = new THREE.Mesh(servoGeo, servoMat);
    servo1.position.set(-1.8, 0.9, 0.7);
    orthosisGroup.add(servo1);

    const servo2 = new THREE.Mesh(servoGeo, servoMat);
    servo2.position.set(-1.8, -0.9, -0.7);
    orthosisGroup.add(servo2);

    // Wrist Joint Pivot
    const wristPivot = new THREE.Group();
    wristPivot.position.set(0, 0, 0);
    orthosisGroup.add(wristPivot);

    const jointGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x0d9488, metalness: 0.5, roughness: 0.3 });
    const joint = new THREE.Mesh(jointGeo, jointMat);
    wristPivot.add(joint);

    // Palm / Hand Structural Plate
    const palmGeo = new THREE.BoxGeometry(3.5, 0.6, 2.8);
    const handMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const palm = new THREE.Mesh(palmGeo, handMat);
    palm.position.set(2, 0, 0);
    wristPivot.add(palm);

    // 4 Actuated Finger Strips
    const fingerGroup = new THREE.Group();
    fingerGroup.position.set(3.8, 0, 0);
    wristPivot.add(fingerGroup);

    const fingerGeo = new THREE.BoxGeometry(2.2, 0.3, 0.4);
    const fingerMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, metalness: 0.4 });

    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(fingerGeo, fingerMat);
      finger.position.set(1.1, 0, (i - 1.5) * 0.7);
      fingerGroup.add(finger);
    }

    scene.add(orthosisGroup);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle idle or active flexion sweep animation
      if (isAnimating) {
        const angle = Math.sin(elapsedTime * 3) * 0.4;
        wristPivot.rotation.z = angle;
        fingerGroup.rotation.z = angle * 0.5;
        jointMat.color.setHex(0x14b8a6);
      } else {
        wristPivot.rotation.z = THREE.MathUtils.lerp(wristPivot.rotation.z, 0, 0.05);
        fingerGroup.rotation.z = THREE.MathUtils.lerp(fingerGroup.rotation.z, 0, 0.05);
        jointMat.color.setHex(isConnected ? 0x0d9488 : 0xef4444);
      }

      // Slow rotational view drift for presentation aesthetics
      orthosisGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // Repetition Trigger Pulsing Effect
    if (repTrigger > 0) {
      jointMat.color.setHex(0x22c55e);
    }

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h_new = container.clientHeight || 300;
      camera.aspect = w / h_new;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h_new);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAnimating, repTrigger, isConnected]);

  if (!hasWebGL) {
    return (
      <div className="hand-orthosis-fallback flex flex-col items-center justify-center bg-slate-900 rounded-xl p-6 text-center border border-slate-700" style={{ height }}>
        <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 text-2xl font-bold animate-pulse">
          🦾
        </div>
        <h4 className="text-white font-semibold mb-1">DEXTRA 3D Orthosis Visualizer</h4>
        <p className="text-xs text-slate-400 max-w-xs">
          Flexion/Extension angle: {isAnimating ? 'Active Sweep (45°)' : 'Rest Position (0°)'} | Servos: 🟢 Ready
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60 shadow-lg bg-slate-900" style={{ height }}>
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-700/50 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
        {isConnected ? '3D Telemetry Syncing' : 'Simulator Standby'}
      </div>
    </div>
  );
}
