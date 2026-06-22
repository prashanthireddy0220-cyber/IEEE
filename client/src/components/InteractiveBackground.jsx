import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function InteractiveBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.dataset.interactiveBackground = 'true';
    mount.appendChild(renderer.domElement);

    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const group = new THREE.Group();
    scene.add(group);

    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [
      new THREE.Color('#00a4d6'),
      new THREE.Color('#7dd3fc'),
      new THREE.Color('#22c55e'),
      new THREE.Color('#00629b'),
    ];

    for (let index = 0; index < particleCount; index += 1) {
      const radius = 4 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = (radius * Math.cos(phi)) - 2;

      const color = palette[index % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      }),
    );
    group.add(particles);

    const nodeGeometry = new THREE.IcosahedronGeometry(2.15, 1);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: '#7dd3fc',
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(3.8, -0.8, -3);
    group.add(node);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: '#22c55e',
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const ring = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.18, 120, 12), ringMaterial);
    ring.position.set(-4.4, 1.6, -2.2);
    group.add(ring);

    const onPointerMove = (event) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', onResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      pointer.lerp(target, 0.055);

      group.rotation.x = pointer.y * 0.12;
      group.rotation.y = pointer.x * 0.16;
      renderer.domElement.dataset.rotationX = group.rotation.x.toFixed(4);
      renderer.domElement.dataset.rotationY = group.rotation.y.toFixed(4);
      particles.rotation.y = elapsed * 0.025;
      particles.rotation.x = Math.sin(elapsed * 0.24) * 0.04;
      node.rotation.x = elapsed * 0.16 + pointer.y * 0.45;
      node.rotation.y = elapsed * 0.2 + pointer.x * 0.45;
      ring.rotation.x = elapsed * 0.18 - pointer.y * 0.35;
      ring.rotation.z = elapsed * 0.22 - pointer.x * 0.3;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      particleGeometry.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      ring.geometry.dispose();
      ringMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="interactive-bg" aria-hidden="true" />;
}
