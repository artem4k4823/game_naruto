// Konoha Training Ground 44 & Hidden Leaf Arena
import * as THREE from 'three';
import { createToonMaterial, createOutlineMesh } from '../vfx/AnimeVFX.js';

export class Arena {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.trainingLogs = [];
    this.clouds = [];
    this.radius = 45; // Arena boundary radius

    this.buildGround();
    this.buildToriiGate();
    this.buildTrainingLogs();
    this.buildAnimeTrees();
    this.buildBoulders();
    this.buildBarrierPerimeter();
    this.buildHokageBackdrop();
    this.buildSky();
  }

  buildGround() {
    // Main circular arena ground
    const groundGeo = new THREE.CylinderGeometry(this.radius + 5, this.radius + 5, 1.5, 48);
    const groundMat = createToonMaterial(0x4caf50); // Vibrant anime grass green
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.75;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Inner combat ring (dirt / sand circle)
    const ringGeo = new THREE.RingGeometry(0, 18, 36);
    const ringMat = createToonMaterial(0xc29b62, { side: THREE.DoubleSide }); // Warm earthen dirt
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.receiveShadow = true;
    this.scene.add(ring);

    // Earthen footpaths leading from the ring
    const pathGeo = new THREE.PlaneGeometry(6, 25);
    const path1 = new THREE.Mesh(pathGeo, ringMat);
    path1.rotation.x = -Math.PI / 2;
    path1.position.set(0, 0.015, 20);
    this.scene.add(path1);
  }

  buildToriiGate() {
    const toriiGroup = new THREE.Group();
    toriiGroup.position.set(0, 0, 32);

    const redWoodMat = createToonMaterial(0xd82613); // Torii vermilion red
    const blackWoodMat = createToonMaterial(0x1a1a1a); // Torii black trim
    const goldMat = createToonMaterial(0xffb300);

    // Pillars (Pillars on left and right)
    const pillarGeo = new THREE.CylinderGeometry(0.4, 0.45, 9, 16);
    const leftPillar = new THREE.Mesh(pillarGeo, redWoodMat);
    leftPillar.position.set(-4.5, 4.5, 0);
    const rightPillar = new THREE.Mesh(pillarGeo, redWoodMat);
    rightPillar.position.set(4.5, 4.5, 0);

    toriiGroup.add(leftPillar, rightPillar);

    // Main top crossbar (Kasagi - curved top)
    const topBarGeo = new THREE.BoxGeometry(13.5, 0.8, 1.0);
    const topBar = new THREE.Mesh(topBarGeo, blackWoodMat);
    topBar.position.set(0, 8.8, 0);
    toriiGroup.add(topBar);

    // Secondary lower crossbar (Nuki)
    const lowerBarGeo = new THREE.BoxGeometry(11, 0.5, 0.6);
    const lowerBar = new THREE.Mesh(lowerBarGeo, redWoodMat);
    lowerBar.position.set(0, 7.3, 0);
    toriiGroup.add(lowerBar);

    // Center tablet (Gakuzuka) with Konoha leaf symbol
    const tabletGeo = new THREE.BoxGeometry(1.2, 1.5, 0.4);
    const tablet = new THREE.Mesh(tabletGeo, blackWoodMat);
    tablet.position.set(0, 8.0, 0);

    const leafGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 8);
    leafGeo.rotateX(Math.PI / 2);
    const leaf = new THREE.Mesh(leafGeo, goldMat);
    leaf.position.set(0, 8.0, 0.22);
    toriiGroup.add(tablet, leaf);

    // Add colliders for pillars
    this.colliders.push({ pos: new THREE.Vector3(-4.5, 0, 32), radius: 0.8 });
    this.colliders.push({ pos: new THREE.Vector3(4.5, 0, 32), radius: 0.8 });

    this.scene.add(toriiGroup);
  }

  buildTrainingLogs() {
    // Three iconic training logs (Team 7 Kakashi bell test)
    const logPositions = [
      new THREE.Vector3(-7, 0, -8),
      new THREE.Vector3(-4.5, 0, -9.5),
      new THREE.Vector3(-2, 0, -8)
    ];

    const barkMat = createToonMaterial(0x6d4c41);
    const woodTopMat = createToonMaterial(0xd7ccc8);
    const ropeMat = createToonMaterial(0xffe082);

    logPositions.forEach((pos, idx) => {
      const logGroup = new THREE.Group();
      logGroup.position.copy(pos);

      // Log Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.45, 0.5, 3.2, 14);
      const trunk = new THREE.Mesh(trunkGeo, barkMat);
      trunk.position.y = 1.6;
      trunk.castShadow = true;
      logGroup.add(trunk);

      // Top wood face
      const topGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.05, 14);
      const top = new THREE.Mesh(topGeo, woodTopMat);
      top.position.y = 3.21;
      logGroup.add(top);

      // Rope wraps
      const ropeGeo = new THREE.TorusGeometry(0.48, 0.08, 8, 16);
      ropeGeo.rotateX(Math.PI / 2);
      const rope1 = new THREE.Mesh(ropeGeo, ropeMat);
      rope1.position.y = 2.4;
      const rope2 = new THREE.Mesh(ropeGeo, ropeMat);
      rope2.position.y = 1.0;
      logGroup.add(rope1, rope2);

      this.scene.add(logGroup);

      // Save as interactive training target dummy
      const dummy = {
        mesh: logGroup,
        pos: pos.clone().setY(1.5),
        radius: 0.8,
        hp: 999999,
        isTrainingLog: true
      };
      this.trainingLogs.push(dummy);
      this.colliders.push({ pos: pos, radius: 0.8 });
    });
  }

  buildAnimeTrees() {
    const treeMat = createToonMaterial(0x2e7d32); // Deep forest green
    const trunkMat = createToonMaterial(0x4e342e); // Dark brown trunk

    // Position trees along arena border
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2;
      // Skip entrance near torii gate
      if (Math.abs(angle - Math.PI / 2) < 0.3) continue;

      const dist = this.radius - 3 + (Math.random() * 4 - 2);
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      // Trunk
      const trunkH = 4 + Math.random() * 2;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, trunkH, 8), trunkMat);
      trunk.position.y = trunkH / 2;
      tree.add(trunk);

      // Stylized tiered foliage spheres/cones (Anime cloud-like tree canopy)
      const foliageGroup = new THREE.Group();
      foliageGroup.position.y = trunkH;

      const tiers = 3;
      for (let t = 0; t < tiers; t++) {
        const radius = (2.4 - t * 0.5) * (0.9 + Math.random() * 0.3);
        const geo = new THREE.DodecahedronGeometry(radius, 1);
        const foliage = new THREE.Mesh(geo, treeMat);
        foliage.position.y = t * 1.5;
        foliage.rotation.y = Math.random() * Math.PI;
        foliageGroup.add(foliage);
      }

      tree.add(foliageGroup);
      this.scene.add(tree);
      this.colliders.push({ pos: new THREE.Vector3(x, 0, z), radius: 1.2 });
    }
  }

  buildBoulders() {
    const rockMat = createToonMaterial(0x78909c); // Slate grey rock
    const rockPositions = [
      new THREE.Vector3(14, 0, 10),
      new THREE.Vector3(18, 0, -12),
      new THREE.Vector3(-18, 0, 12),
      new THREE.Vector3(-12, 0, -22),
      new THREE.Vector3(22, 0, -5)
    ];

    rockPositions.forEach(pos => {
      const scale = 1.4 + Math.random() * 1.2;
      const geo = new THREE.DodecahedronGeometry(scale, 1);
      const boulder = new THREE.Mesh(geo, rockMat);
      boulder.position.copy(pos);
      boulder.position.y = scale * 0.7;
      boulder.rotation.set(Math.random(), Math.random(), Math.random());
      this.scene.add(boulder);

      this.colliders.push({ pos: pos, radius: scale * 0.9 });
    });
  }

  buildBarrierPerimeter() {
    // Ninja barrier talisman seals (Ofuda) floating around arena edge
    const sealGroup = new THREE.Group();
    const paperMat = createToonMaterial(0xfff9c4); // Aged yellow paper
    const kanjiMat = createToonMaterial(0xd50000); // Red seal ink

    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const x = Math.cos(angle) * (this.radius - 0.5);
      const z = Math.sin(angle) * (this.radius - 0.5);

      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 2.8, 6),
        createToonMaterial(0x424242)
      );
      post.position.set(x, 1.4, z);
      sealGroup.add(post);

      // Ofuda talisman paper
      const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.9), paperMat);
      paper.position.set(x, 2.2, z);
      paper.lookAt(0, 2.2, 0); // Faces center of arena
      paper.rotation.y += Math.PI;

      // Kanji mark on paper
      const kanji = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.6), kanjiMat);
      kanji.position.set(x, 2.2, z);
      kanji.lookAt(0, 2.2, 0);
      kanji.position.add(kanji.getWorldDirection(new THREE.Vector3()).multiplyScalar(-0.01));

      sealGroup.add(paper, kanji);
    }

    this.scene.add(sealGroup);
  }

  buildHokageBackdrop() {
    // Distant mountain range with stylized Hokage Monument cliff
    const cliffGroup = new THREE.Group();
    cliffGroup.position.set(0, 0, -85);

    const mountainMat = createToonMaterial(0x546e7a); // Distant blueish-grey rock
    const faceMat = createToonMaterial(0x78909c); // Stone face tone

    // Main cliff wall
    const cliffGeo = new THREE.BoxGeometry(160, 45, 20);
    const cliff = new THREE.Mesh(cliffGeo, mountainMat);
    cliff.position.y = 15;
    cliffGroup.add(cliff);

    // 4 Stylized carved Hokage Faces (Hashirama, Tobirama, Hiruzen, Minato)
    const facePositions = [-32, -11, 11, 32];
    facePositions.forEach((x, i) => {
      const headGroup = new THREE.Group();
      headGroup.position.set(x, 24, 10);

      // Head shape
      const head = new THREE.Mesh(new THREE.BoxGeometry(10, 13, 6), faceMat);
      headGroup.add(head);

      // Hair silhouette
      const hair = new THREE.Mesh(new THREE.ConeGeometry(6, 6, 4), faceMat);
      hair.position.y = 8;
      hair.rotation.y = Math.PI / 4;
      headGroup.add(hair);

      cliffGroup.add(headGroup);
    });

    this.scene.add(cliffGroup);
  }

  buildSky() {
    // Anime Sky Gradient Sphere
    const skyGeo = new THREE.SphereGeometry(150, 32, 15);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x64b5f6, // Bright anime sky blue
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);

    // Stylized Anime Clouds
    const cloudMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 14; i++) {
      const cloud = new THREE.Group();
      const numPuffs = 4 + Math.floor(Math.random() * 4);

      for (let j = 0; j < numPuffs; j++) {
        const r = 3 + Math.random() * 4;
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), cloudMat);
        puff.position.set(
          (j - numPuffs / 2) * 4 + (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 2
        );
        cloud.add(puff);
      }

      cloud.position.set(
        (Math.random() - 0.5) * 200,
        35 + Math.random() * 25,
        -40 - Math.random() * 80
      );

      this.scene.add(cloud);
      this.clouds.push(cloud);
    }
  }

  update(dt) {
    // Drift clouds slowly
    this.clouds.forEach(cloud => {
      cloud.position.x += 1.2 * dt;
      if (cloud.position.x > 120) {
        cloud.position.x = -120;
      }
    });
  }

  // Constrain position within arena boundary
  clampPosition(pos, charRadius = 0.5) {
    const maxR = this.radius - 1.5 - charRadius;
    const dist = Math.hypot(pos.x, pos.z);
    if (dist > maxR) {
      const factor = maxR / dist;
      pos.x *= factor;
      pos.z *= factor;
    }

    // Check collisions with world obstacles (logs, rocks, torii)
    this.colliders.forEach(col => {
      const dx = pos.x - col.pos.x;
      const dz = pos.z - col.pos.z;
      const d = Math.hypot(dx, dz);
      const minDist = col.radius + charRadius;
      if (d < minDist && d > 0.001) {
        pos.x = col.pos.x + (dx / d) * minDist;
        pos.z = col.pos.z + (dz / d) * minDist;
      }
    });

    return pos;
  }
}
