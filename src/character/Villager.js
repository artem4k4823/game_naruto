// Naruto: Shinobi Chronicles - Konoha Village Inhabitants (Wandering Citizens & Shinobi)
import * as THREE from 'three';
import { createToonMaterial } from '../vfx/AnimeVFX.js';

export class Villager {
  constructor(scene, type = 'chunin', route = [], startProgress = 0) {
    this.scene = scene;
    this.type = type;
    this.route = route;
    this.routeIndex = Math.floor(startProgress * route.length) % route.length;
    this.currentWaypoint = this.route[this.routeIndex] || new THREE.Vector3();
    this.position = this.currentWaypoint.clone();
    this.rotationY = 0;

    // Movement speeds & behavior
    this.walkSpeed = 2.4 + Math.random() * 0.8;
    this.state = 'WALK'; // 'WALK', 'IDLE'
    this.idleTimer = 0;
    this.walkCycleTime = Math.random() * Math.PI * 2;

    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    this.buildModel();
    this.scene.add(this.group);
  }

  buildModel() {
    switch (this.type) {
      case 'chunin':
        this.buildChuninMesh();
        break;
      case 'kimono_girl':
        this.buildKimonoGirlMesh();
        break;
      case 'townsman':
        this.buildTownsmanMesh();
        break;
      case 'elder':
        this.buildElderMesh();
        break;
      case 'academy_student':
        this.buildAcademyStudentMesh();
        break;
      default:
        this.buildChuninMesh();
    }
  }

  buildChuninMesh() {
    // Konoha Chunin / Jonin Shinobi patrolling the village
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const navyMat = createToonMaterial(0x1a237e, { roughness: 0.5 });
    const flakMat = createToonMaterial(0x2e7d32, { roughness: 0.6 });
    const darkHairMat = createToonMaterial(0x181818);
    const metalMat = createToonMaterial(0xe0e6ed, { roughness: 0.2 });
    const whiteMat = createToonMaterial(0xf5f5f5);
    const redMat = createToonMaterial(0xd50000);

    this.torso = new THREE.Group();
    this.torso.position.y = 1.05;

    // Navy jumpsuit
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.64, 16), navyMat);
    this.torso.add(body);

    // Green Chunin Flak Jacket
    const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.33, 0.48, 16), flakMat);
    vest.position.y = 0.06;

    // Vest pockets & collar
    for (let px of [-0.18, 0.18]) {
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.08), flakMat);
      pocket.position.set(px, 0.04, 0.34);
      vest.add(pocket);
    }
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.18, 14, 1, false, -1.8, 3.6), flakMat);
    collar.position.set(0, 0.32, -0.05);
    vest.add(collar);

    // Red spiral on back
    const swirl = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 6, 16), redMat);
    swirl.position.set(0, 0.06, -0.34);
    vest.add(swirl);

    this.torso.add(vest);

    // Head
    this.head = new THREE.Group();
    this.head.position.y = 0.62;
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 14), skinMat);
    face.scale.set(1.0, 1.1, 1.0);

    // Konoha Headband
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.11, 16), navyMat);
    band.position.y = 0.12;
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.08, 12, 1, false, -0.5, 1.0), metalMat);
    plate.position.y = 0.12;

    // Spiky Hair
    const hair = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.28, 5), darkHairMat);
      const ang = (i / 7) * Math.PI * 2;
      spike.position.set(Math.cos(ang) * 0.14, 0.22, Math.sin(ang) * 0.14);
      spike.rotation.set(Math.sin(ang) * 0.3, 0, -Math.cos(ang) * 0.3);
      hair.add(spike);
    }
    const topSpike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.34, 5), darkHairMat);
    topSpike.position.set(0, 0.32, 0);
    hair.add(topSpike);

    // Eyes
    const eyeMat = createToonMaterial(0x1a1a1a);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.02), eyeMat);
    eyeL.position.set(-0.09, 0.03, 0.25);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.02), eyeMat);
    eyeR.position.set(0.09, 0.03, 0.25);

    this.head.add(face, band, plate, hair, eyeL, eyeR);
    this.torso.add(this.head);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.58, 10);
    this.lArm = new THREE.Mesh(armGeo, navyMat);
    this.lArm.position.set(-0.42, 0.2, 0);
    this.rArm = new THREE.Mesh(armGeo, navyMat);
    this.rArm.position.set(0.42, 0.2, 0);
    this.torso.add(this.lArm, this.rArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.10, 0.08, 0.68, 10);
    this.lLeg = new THREE.Mesh(legGeo, navyMat);
    this.lLeg.position.set(-0.16, -0.62, 0);
    this.rLeg = new THREE.Mesh(legGeo, navyMat);
    this.rLeg.position.set(0.16, -0.62, 0);

    // Bandages & Kunai holster on right leg
    const bandage = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.16, 10), whiteMat);
    bandage.position.set(0.16, -0.52, 0);
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), createToonMaterial(0x212121));
    holster.position.set(0.24, -0.52, 0);
    this.torso.add(this.lLeg, this.rLeg, bandage, holster);

    this.group.add(this.torso);
  }

  buildKimonoGirlMesh() {
    // Leaf Village Townswoman in Pastel Kimono with Obi Sash
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const kimonoTones = [0xf48fb1, 0xce93d8, 0x81d4fa, 0xa5d6a7, 0xffcc80];
    const pickColor = kimonoTones[Math.floor(Math.random() * kimonoTones.length)];
    const kimonoMat = createToonMaterial(pickColor, { roughness: 0.6 });
    const obiMat = createToonMaterial(0xb71c1c); // Crimson red obi sash
    const hairMat = createToonMaterial(0x3e2723); // Auburn dark hair
    const flowerMat = createToonMaterial(0xff4081);

    this.torso = new THREE.Group();
    this.torso.position.y = 1.0;

    // Elegant flowing kimono body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.72, 16), kimonoMat);
    this.torso.add(body);

    // Wide Obi sash around waist
    const obi = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.18, 16), obiMat);
    obi.position.y = -0.05;

    // Large traditional bow knot on back of obi
    const knot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.12), obiMat);
    knot.position.set(0, -0.05, -0.32);
    obi.add(knot);
    this.torso.add(obi);

    // Head
    this.head = new THREE.Group();
    this.head.position.y = 0.58;
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), skinMat);
    face.scale.set(0.95, 1.05, 0.95);

    // Twin Bun Hairstyle (Odango) with decorative kanzashi hairpins
    const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.26, 14, 12), hairMat);
    hairBase.position.set(0, 0.08, -0.04);

    const bunL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), hairMat);
    bunL.position.set(-0.24, 0.22, -0.05);
    const bunR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), hairMat);
    bunR.position.set(0.24, 0.22, -0.05);

    // Flower ornament in hair
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), flowerMat);
    flower.position.set(0.22, 0.24, 0.08);

    // Gentle anime eyes & smile
    const eyeMat = createToonMaterial(0x2c1d11);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.02, 0.02), eyeMat);
    eyeL.position.set(-0.08, 0.02, 0.23);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.02, 0.02), eyeMat);
    eyeR.position.set(0.08, 0.02, 0.23);

    this.head.add(face, hairBase, bunL, bunR, flower, eyeL, eyeR);
    this.torso.add(this.head);

    // Kimono Sleeves (wide traditional sleeves)
    const sleeveGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.52, 10);
    this.lArm = new THREE.Mesh(sleeveGeo, kimonoMat);
    this.lArm.position.set(-0.36, 0.15, 0);
    this.rArm = new THREE.Mesh(sleeveGeo, kimonoMat);
    this.rArm.position.set(0.36, 0.15, 0);
    this.torso.add(this.lArm, this.rArm);

    // Lower Kimono Skirt & Geta Sandals
    const skirtGeo = new THREE.CylinderGeometry(0.36, 0.44, 0.62, 16);
    const skirt = new THREE.Mesh(skirtGeo, kimonoMat);
    skirt.position.y = -0.58;
    this.torso.add(skirt);

    const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.35, 8);
    this.lLeg = new THREE.Mesh(legGeo, skinMat);
    this.lLeg.position.set(-0.12, -0.75, 0);
    this.rLeg = new THREE.Mesh(legGeo, skinMat);
    this.rLeg.position.set(0.12, -0.75, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.group.add(this.torso);
  }

  buildTownsmanMesh() {
    // Leaf Village Male Citizen in Traditional Haori & Trousers
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const haoriMat = createToonMaterial(0x455a64, { roughness: 0.7 });
    const innerMat = createToonMaterial(0xefebe9);
    const pantsMat = createToonMaterial(0x263238);
    const hairMat = createToonMaterial(0x212121);

    this.torso = new THREE.Group();
    this.torso.position.y = 1.05;

    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.27, 0.65, 14), innerMat);
    const haori = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.32, 0.66, 14, 1, false, -1.9, 3.8), haoriMat);
    this.torso.add(inner, haori);

    // Head with topknot (Chonmage)
    this.head = new THREE.Group();
    this.head.position.y = 0.62;
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.25, 14, 12), skinMat);
    face.scale.set(1.0, 1.1, 1.0);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), hairMat);
    hair.position.set(0, 0.08, -0.04);
    const topKnot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8), hairMat);
    topKnot.position.set(0, 0.32, -0.08);
    topKnot.rotation.x = 0.5;

    const eyeMat = createToonMaterial(0x1a1a1a);
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.02), eyeMat);
    eyeL.position.set(-0.08, 0.04, 0.24);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.02), eyeMat);
    eyeR.position.set(0.08, 0.04, 0.24);

    this.head.add(face, hair, topKnot, eyeL, eyeR);
    this.torso.add(this.head);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.58, 10);
    this.lArm = new THREE.Mesh(armGeo, haoriMat);
    this.lArm.position.set(-0.42, 0.18, 0);
    this.rArm = new THREE.Mesh(armGeo, haoriMat);
    this.rArm.position.set(0.42, 0.18, 0);
    this.torso.add(this.lArm, this.rArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.68, 10);
    this.lLeg = new THREE.Mesh(legGeo, pantsMat);
    this.lLeg.position.set(-0.16, -0.62, 0);
    this.rLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rLeg.position.set(0.16, -0.62, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.group.add(this.torso);
  }

  buildElderMesh() {
    // Wise Elder with Traditional Straw Hat (Kasa) & Walking Staff
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.6 });
    const robeMat = createToonMaterial(0x5d4037, { roughness: 0.8 });
    const hatMat = createToonMaterial(0xd7ccc8, { roughness: 0.9 });
    const woodMat = createToonMaterial(0x3e2723);

    this.torso = new THREE.Group();
    this.torso.position.y = 0.95; // Slightly stooped stance

    const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.40, 0.95, 14), robeMat);
    robe.position.y = -0.12;
    this.torso.add(robe);

    // Head
    this.head = new THREE.Group();
    this.head.position.y = 0.52;
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), skinMat);

    // Straw Kasa Hat
    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.22, 14), hatMat);
    hat.position.y = 0.24;

    // White beard
    const beard = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.25, 8), createToonMaterial(0xe0e0e0));
    beard.position.set(0, -0.18, 0.18);
    beard.rotation.x = 0.2;

    this.head.add(face, hat, beard);
    this.torso.add(this.head);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.52, 8);
    this.lArm = new THREE.Mesh(armGeo, robeMat);
    this.lArm.position.set(-0.36, 0.12, 0);

    this.rArm = new THREE.Group();
    this.rArm.position.set(0.36, 0.12, 0);
    const rArmMesh = new THREE.Mesh(armGeo, robeMat);
    rArmMesh.position.y = -0.22;
    rArmMesh.rotation.x = 0.45;

    // Wooden Walking Staff in right hand
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 8), woodMat);
    staff.position.set(0.12, -0.4, 0.32);
    this.rArm.add(rArmMesh, staff);
    this.torso.add(this.lArm, this.rArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.50, 8);
    this.lLeg = new THREE.Mesh(legGeo, woodMat);
    this.lLeg.position.set(-0.14, -0.68, 0);
    this.rLeg = new THREE.Mesh(legGeo, woodMat);
    this.rLeg.position.set(0.14, -0.68, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.group.add(this.torso);
  }

  buildAcademyStudentMesh() {
    // Young Shinobi Academy Apprentice with Goggles
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const jacketMat = createToonMaterial(0xff6f00); // Bright orange/amber apprentice jacket
    const pantsMat = createToonMaterial(0x1565c0); // Royal blue trousers
    const goggleMat = createToonMaterial(0x263238);
    const lensMat = createToonMaterial(0x00e5ff, { roughness: 0.1 });
    const hairMat = createToonMaterial(0x212121);

    this.torso = new THREE.Group();
    this.torso.position.y = 0.85; // Shorter youth height

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.50, 14), jacketMat);
    this.torso.add(body);

    // Head
    this.head = new THREE.Group();
    this.head.position.y = 0.48;
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), skinMat);

    // Spiky student hair
    const hair = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.32, 7), hairMat);
    hair.position.set(0, 0.20, 0);

    // Shinobi Goggles on forehead (like young Naruto or Obito)
    const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.08, 14), goggleMat);
    strap.position.y = 0.10;
    const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10), lensMat);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(-0.08, 0.10, 0.22);
    const lens2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 10), lensMat);
    lens2.rotation.x = Math.PI / 2;
    lens2.position.set(0.08, 0.10, 0.22);

    this.head.add(face, hair, strap, lens1, lens2);
    this.torso.add(this.head);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.44, 8);
    this.lArm = new THREE.Mesh(armGeo, jacketMat);
    this.lArm.position.set(-0.30, 0.14, 0);
    this.rArm = new THREE.Mesh(armGeo, jacketMat);
    this.rArm.position.set(0.30, 0.14, 0);
    this.torso.add(this.lArm, this.rArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.50, 8);
    this.lLeg = new THREE.Mesh(legGeo, pantsMat);
    this.lLeg.position.set(-0.11, -0.48, 0);
    this.rLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rLeg.position.set(0.11, -0.48, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.group.add(this.torso);
  }

  update(dt, playerPos = null) {
    if (this.route.length === 0) return;

    if (this.state === 'IDLE') {
      this.idleTimer -= dt;
      if (this.idleTimer <= 0) {
        this.state = 'WALK';
        this.routeIndex = (this.routeIndex + 1) % this.route.length;
        this.currentWaypoint = this.route[this.routeIndex];
      }

      // Gentle breathing & looking around when idle
      const time = performance.now() * 0.002;
      if (this.torso) {
        this.torso.position.y = (this.type === 'academy_student' ? 0.85 : 1.05) + Math.sin(time * 2) * 0.01;
      }
      if (this.head) {
        this.head.rotation.y = Math.sin(time * 1.2) * 0.15;
      }
      if (this.lLeg) this.lLeg.rotation.x = 0;
      if (this.rLeg) this.rLeg.rotation.x = 0;
      if (this.lArm) this.lArm.rotation.x = 0;
      if (this.rArm) this.rArm.rotation.x = 0;

    } else if (this.state === 'WALK') {
      const target = this.currentWaypoint;
      const toTarget = new THREE.Vector3(target.x - this.position.x, 0, target.z - this.position.z);
      const dist = toTarget.length();

      if (dist < 1.2) {
        // Reached waypoint: pause briefly to chat, look at shop displays, or rest
        this.state = 'IDLE';
        this.idleTimer = 1.8 + Math.random() * 3.2;
      } else {
        const moveDir = toTarget.normalize();

        // Smooth rotation towards travel direction
        const targetYaw = Math.atan2(moveDir.x, moveDir.z);
        let diff = targetYaw - this.rotationY;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.rotationY += diff * Math.min(1.0, 7.0 * dt);

        this.position.addScaledVector(moveDir, this.walkSpeed * dt);
        this.walkCycleTime += dt * (this.walkSpeed * 1.8);

        // Procedural anime walk cycle
        const wTime = this.walkCycleTime;
        const bounce = Math.abs(Math.sin(wTime * 2)) * 0.035;
        const baseY = (this.type === 'academy_student' ? 0.85 : 1.05);

        if (this.torso) {
          this.torso.position.y = baseY + bounce;
          this.torso.rotation.y = Math.sin(wTime) * 0.06;
        }

        if (this.lLeg && this.rLeg) {
          this.lLeg.rotation.x = Math.sin(wTime) * 0.52;
          this.rLeg.rotation.x = -Math.sin(wTime) * 0.52;
        }

        if (this.lArm && this.rArm) {
          this.lArm.rotation.x = -Math.sin(wTime) * 0.42;
          this.rArm.rotation.x = Math.sin(wTime) * 0.42;
        }

        // Head turns towards player if close!
        if (playerPos && this.head) {
          const dToPlayer = this.position.distanceTo(playerPos);
          if (dToPlayer < 4.5) {
            const lookVec = playerPos.clone().sub(this.position);
            const playerAngle = Math.atan2(lookVec.x, lookVec.z) - this.rotationY;
            this.head.rotation.y = THREE.MathUtils.clamp(playerAngle, -0.6, 0.6);
          } else {
            this.head.rotation.y = 0;
          }
        }
      }
    }

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }
}

export class VillagerManager {
  constructor(scene) {
    this.scene = scene;
    this.villagers = [];
    this.spawnVillagers();
  }

  spawnVillagers() {
    // Curated safe walking circuits across Konoha's streets, plazas, and alleys
    const routes = [
      // Route 1: Main Paved Avenue (South Gate to Hokage Plaza)
      [
        new THREE.Vector3(2, 0, 75),
        new THREE.Vector3(2, 0, 35),
        new THREE.Vector3(3, 0, -5),
        new THREE.Vector3(2, 0, -32),
        new THREE.Vector3(-2, 0, -32),
        new THREE.Vector3(-3, 0, -5),
        new THREE.Vector3(-2, 0, 35),
        new THREE.Vector3(-2, 0, 75)
      ],
      // Route 2: Central Market Street & Ramen / Weapon Pavilion
      [
        new THREE.Vector3(-14, 0, 30),
        new THREE.Vector3(-14, 0, 15),
        new THREE.Vector3(-6, 0, 15),
        new THREE.Vector3(6, 0, 15),
        new THREE.Vector3(16, 0, 15),
        new THREE.Vector3(16, 0, 30),
        new THREE.Vector3(4, 0, 30)
      ],
      // Route 3: East District (Uchiha Compound & Residential Quarter)
      [
        new THREE.Vector3(28, 0, 60),
        new THREE.Vector3(48, 0, 60),
        new THREE.Vector3(48, 0, 25),
        new THREE.Vector3(68, 0, 25),
        new THREE.Vector3(68, 0, -15),
        new THREE.Vector3(35, 0, -15),
        new THREE.Vector3(28, 0, 20)
      ],
      // Route 4: West District (Ninja Academy & Clan Lane)
      [
        new THREE.Vector3(-28, 0, 60),
        new THREE.Vector3(-45, 0, 60),
        new THREE.Vector3(-45, 0, 25),
        new THREE.Vector3(-70, 0, 25),
        new THREE.Vector3(-70, 0, -15),
        new THREE.Vector3(-35, 0, -15),
        new THREE.Vector3(-28, 0, 20)
      ],
      // Route 5: Hokage Mansion Plaza & Mission Desk Promenade
      [
        new THREE.Vector3(-18, 0, -35),
        new THREE.Vector3(-4, 0, -35),
        new THREE.Vector3(6, 0, -26),
        new THREE.Vector3(18, 0, -35),
        new THREE.Vector3(26, 0, -42),
        new THREE.Vector3(0, 0, -46),
        new THREE.Vector3(-26, 0, -42)
      ],
      // Route 6: South Gate Bazaar & Training Yard Alley
      [
        new THREE.Vector3(-12, 0, 80),
        new THREE.Vector3(-35, 0, 80),
        new THREE.Vector3(-35, 0, 65),
        new THREE.Vector3(-15, 0, 65),
        new THREE.Vector3(15, 0, 65),
        new THREE.Vector3(35, 0, 65),
        new THREE.Vector3(35, 0, 80),
        new THREE.Vector3(12, 0, 80)
      ]
    ];

    const types = ['chunin', 'kimono_girl', 'townsman', 'elder', 'academy_student'];

    // Spawn 14 animated Konoha citizens across the routes
    const spawns = [
      { type: 'chunin', routeIdx: 0, prog: 0.1 },
      { type: 'kimono_girl', routeIdx: 1, prog: 0.2 },
      { type: 'townsman', routeIdx: 0, prog: 0.6 },
      { type: 'elder', routeIdx: 4, prog: 0.15 },
      { type: 'chunin', routeIdx: 4, prog: 0.65 },
      { type: 'academy_student', routeIdx: 3, prog: 0.3 },
      { type: 'kimono_girl', routeIdx: 2, prog: 0.4 },
      { type: 'townsman', routeIdx: 2, prog: 0.8 },
      { type: 'chunin', routeIdx: 3, prog: 0.75 },
      { type: 'elder', routeIdx: 1, prog: 0.7 },
      { type: 'kimono_girl', routeIdx: 5, prog: 0.2 },
      { type: 'academy_student', routeIdx: 5, prog: 0.7 },
      { type: 'chunin', routeIdx: 5, prog: 0.45 },
      { type: 'townsman', routeIdx: 1, prog: 0.4 }
    ];

    spawns.forEach(s => {
      const route = routes[s.routeIdx];
      const villager = new Villager(this.scene, s.type, route, s.prog);
      this.villagers.push(villager);
    });
  }

  update(dt, playerPos = null) {
    this.villagers.forEach(v => v.update(dt, playerPos));
  }

  reset() {
    this.villagers.forEach(v => this.scene.remove(v.group));
    this.villagers = [];
    this.spawnVillagers();
  }
}
