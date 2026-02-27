'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function LimaGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuración de la escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Cielo azul de Lima
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // Suelo (representa el suelo de Lima)
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xd4a574,
      roughness: 0.8 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Plaza de Armas (centro)
    const createPlazaDeArmas = () => {
      const group = new THREE.Group();
      
      // Base de la plaza
      const plazaGeometry = new THREE.BoxGeometry(20, 0.2, 20);
      const plazaMaterial = new THREE.MeshStandardMaterial({ color: 0x8B7355 });
      const plaza = new THREE.Mesh(plazaGeometry, plazaMaterial);
      plaza.position.y = 0.1;
      plaza.receiveShadow = true;
      group.add(plaza);

      // Catedral (edificio principal)
      const cathedralGeometry = new THREE.BoxGeometry(8, 6, 4);
      const cathedralMaterial = new THREE.MeshStandardMaterial({ color: 0xF5DEB3 });
      const cathedral = new THREE.Mesh(cathedralGeometry, cathedralMaterial);
      cathedral.position.set(0, 3, -8);
      cathedral.castShadow = true;
      group.add(cathedral);

      // Torres de la catedral
      const towerGeometry = new THREE.BoxGeometry(1.5, 4, 1.5);
      const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 });
      
      const leftTower = new THREE.Mesh(towerGeometry, towerMaterial);
      leftTower.position.set(-3, 7, -8);
      leftTower.castShadow = true;
      group.add(leftTower);

      const rightTower = new THREE.Mesh(towerGeometry, towerMaterial);
      rightTower.position.set(3, 7, -8);
      rightTower.castShadow = true;
      group.add(rightTower);

      // Fuente central
      const fountainBase = new THREE.CylinderGeometry(2, 2.5, 1, 8);
      const fountainMaterial = new THREE.MeshStandardMaterial({ color: 0x708090 });
      const fountain = new THREE.Mesh(fountainBase, fountainMaterial);
      fountain.position.set(0, 0.5, 0);
      fountain.castShadow = true;
      group.add(fountain);

      // Agua de la fuente
      const waterGeometry = new THREE.CylinderGeometry(1.8, 1.8, 0.3, 16);
      const waterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4169E1,
        transparent: true,
        opacity: 0.6 
      });
      const water = new THREE.Mesh(waterGeometry, waterMaterial);
      water.position.set(0, 1.2, 0);
      group.add(water);

      return group;
    };

    // Huaca Pucllana (pirámide pre-inca)
    const createHuacaPucllana = () => {
      const group = new THREE.Group();
      
      // Base de la pirámide
      const base1 = new THREE.BoxGeometry(12, 2, 12);
      const base2 = new THREE.BoxGeometry(9, 2, 9);
      const base3 = new THREE.BoxGeometry(6, 2, 6);
      const base4 = new THREE.BoxGeometry(3, 2, 3);
      
      const pyramidMaterial = new THREE.MeshStandardMaterial({ color: 0xCD853F });
      
      const level1 = new THREE.Mesh(base1, pyramidMaterial);
      level1.position.y = 1;
      level1.castShadow = true;
      group.add(level1);

      const level2 = new THREE.Mesh(base2, pyramidMaterial);
      level2.position.y = 3;
      level2.castShadow = true;
      group.add(level2);

      const level3 = new THREE.Mesh(base3, pyramidMaterial);
      level3.position.y = 5;
      level3.castShadow = true;
      group.add(level3);

      const level4 = new THREE.Mesh(base4, pyramidMaterial);
      level4.position.y = 7;
      level4.castShadow = true;
      group.add(level4);

      group.position.set(-30, 0, -20);
      return group;
    };

    // Parque del Amor (Miraflores)
    const createParqueDelAmor = () => {
      const group = new THREE.Group();
      
      // Base del parque
      const parkGeometry = new THREE.CircleGeometry(8, 32);
      const parkMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      const park = new THREE.Mesh(parkGeometry, parkMaterial);
      park.rotation.x = -Math.PI / 2;
      park.position.y = 0.1;
      park.receiveShadow = true;
      group.add(park);

      // Escultura "El Beso"
      const sculptureBase = new THREE.CylinderGeometry(1, 1, 2, 16);
      const sculptureMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
      const sculpture = new THREE.Mesh(sculptureBase, sculptureMaterial);
      sculpture.position.y = 1;
      sculpture.castShadow = true;
      group.add(sculpture);

      // Representación abstracta de la pareja
      const couple = new THREE.SphereGeometry(1.2, 16, 16);
      const coupleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const coupleStatue = new THREE.Mesh(couple, coupleMaterial);
      coupleStatue.position.y = 3;
      coupleStatue.castShadow = true;
      group.add(coupleStatue);

      // Flores alrededor
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const flowerGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const flowerMaterial = new THREE.MeshStandardMaterial({ 
          color: Math.random() > 0.5 ? 0xFF69B4 : 0xFF0000 
        });
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
        flower.position.set(
          Math.cos(angle) * 6,
          0.3,
          Math.sin(angle) * 6
        );
        group.add(flower);
      }

      group.position.set(30, 0, 15);
      return group;
    };

    // Edificios modernos de Miraflores
    const createModernBuildings = () => {
      const group = new THREE.Group();
      
      for (let i = 0; i < 5; i++) {
        const height = 10 + Math.random() * 15;
        const buildingGeometry = new THREE.BoxGeometry(4, height, 4);
        const buildingMaterial = new THREE.MeshStandardMaterial({ 
          color: new THREE.Color().setHSL(0.6, 0.2, 0.7 + Math.random() * 0.2)
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(
          40 + i * 6,
          height / 2,
          -10 + Math.random() * 20
        );
        building.castShadow = true;
        group.add(building);
      }

      return group;
    };

    // Malecón (vista al océano Pacífico)
    const createMalecon = () => {
      const group = new THREE.Group();
      
      // Barandilla del malecón
      const railingGeometry = new THREE.BoxGeometry(60, 1, 0.5);
      const railingMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const railing = new THREE.Mesh(railingGeometry, railingMaterial);
      railing.position.set(30, 1, 30);
      railing.castShadow = true;
      group.add(railing);

      // Representación del océano
      const oceanGeometry = new THREE.PlaneGeometry(100, 50);
      const oceanMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x006994,
        transparent: true,
        opacity: 0.7
      });
      const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
      ocean.rotation.x = -Math.PI / 2;
      ocean.position.set(30, 0.05, 55);
      group.add(ocean);

      return group;
    };

    // Agregar todos los monumentos
    const plazaDeArmas = createPlazaDeArmas();
    scene.add(plazaDeArmas);

    const huacaPucllana = createHuacaPucllana();
    scene.add(huacaPucllana);

    const parqueDelAmor = createParqueDelAmor();
    scene.add(parqueDelAmor);

    const modernBuildings = createModernBuildings();
    scene.add(modernBuildings);

    const malecon = createMalecon();
    scene.add(malecon);

    // Palmeras
    const createPalmTree = (x: number, z: number) => {
      const group = new THREE.Group();
      
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 5, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 2.5;
      trunk.castShadow = true;
      group.add(trunk);

      const leavesGeometry = new THREE.SphereGeometry(2, 8, 8);
      const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 5.5;
      leaves.scale.y = 0.5;
      leaves.castShadow = true;
      group.add(leaves);

      group.position.set(x, 0, z);
      return group;
    };

    // Agregar palmeras alrededor
    const palmPositions = [
      [15, 20], [-15, 20], [20, -15], [-20, -15],
      [25, 10], [-25, 10], [10, -25], [-10, -25]
    ];

    palmPositions.forEach(([x, z]) => {
      scene.add(createPalmTree(x, z));
    });

    // Controles de movimiento
    const keys: { [key: string]: boolean } = {};
    const velocity = new THREE.Vector3();
    const speed = 0.3;

    window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
    });

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Movimiento del jugador
      velocity.set(0, 0, 0);

      if (keys['w'] || keys['arrowup']) velocity.z -= speed;
      if (keys['s'] || keys['arrowdown']) velocity.z += speed;
      if (keys['a'] || keys['arrowleft']) velocity.x -= speed;
      if (keys['d'] || keys['arrowright']) velocity.x += speed;

      camera.position.add(velocity);
      
      // Rotar cámara con mouse
      camera.rotation.y = -mouseX * 0.5;
      camera.rotation.x = mouseY * 0.3;

      // Límites del mapa
      camera.position.x = Math.max(-80, Math.min(80, camera.position.x));
      camera.position.z = Math.max(-80, Math.min(80, camera.position.z));
      camera.position.y = Math.max(2, Math.min(30, camera.position.y));

      renderer.render(scene, camera);
    };

    animate();

    // Manejo de resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', () => {});
      window.removeEventListener('keyup', () => {});
      window.removeEventListener('mousemove', () => {});
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.bensound.com/bensound-music/bensound-tenderness.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log('Audio playback failed:', err));
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Explora Lima, Perú 🇵🇪
          </h1>
          <p className="text-white drop-shadow-md text-lg">
            Usa WASD o las flechas para moverte • Mueve el mouse para mirar alrededor
          </p>
        </div>
      </div>

      {/* Controles de música */}
      <button
        onClick={toggleMusic}
        className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-gray-800 font-semibold py-3 px-6 rounded-full shadow-lg transition-all pointer-events-auto"
      >
        {isPlaying ? '🔊 Pausar Música' : '🎵 Reproducir Música Peruana'}
      </button>

      {/* Información de lugares */}
      <div className="absolute bottom-6 left-6 bg-black/70 text-white p-4 rounded-lg max-w-sm pointer-events-none">
        <h3 className="font-bold text-lg mb-2">Lugares de Interés:</h3>
        <ul className="text-sm space-y-1">
          <li>🏛️ Plaza de Armas (Centro)</li>
          <li>🔺 Huaca Pucllana (Izquierda)</li>
          <li>💑 Parque del Amor (Derecha)</li>
          <li>🌊 Malecón de Miraflores (Al fondo)</li>
          <li>🏢 Edificios Modernos (San Isidro)</li>
        </ul>
      </div>
    </div>
  );
}
