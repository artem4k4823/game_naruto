// Naruto Uzumaki Ultra-High Quality 3D Model with Chakra Wall-Running & Rooftop Parkour
import * as THREE from 'three';
import { createToonMaterial } from '../vfx/AnimeVFX.js';
import { sound } from '../audio/SoundFX.js';

export class Naruto {
  constructor(scene, vfx) {
    this.scene = scene;
    this.vfx = vfx;

    // Stats
    this.maxHp = 500;
    this.hp = 500;
    this.maxChakra = 150;
    this.chakra = 150;
    this.isDead = false;

    // Movement & Physics
    this.position = new THREE.Vector3(0, 0, 15);
    this.velocity = new THREE.Vector3();
    this.rotationY = Math.PI;
    this.targetRotationY = Math.PI;
    this.speed = 14.0;
    this.isGrounded = true;
    this.jumpForce = 16;
    this.gravity = 35;
    this.currentGroundY = 0;

    // Wall-Running (Chakra Wall Walking) State
    this.isWallRunning = false;
    this.wallNormal = new THREE.Vector3();
    this.wallRoofY = 0;

    // 5-Hit Taijutsu Combo & Running Combat State
    this.state = 'IDLE'; // IDLE, RUN, JUMP, WALL_RUN, ATTACK, CHARGE_CHAKRA, RASENGAN_DASH
    this.comboStep = 0;
    this.comboTimer = 0;
    this.attackMode = 'STAND_ATTACK'; // 'STAND_ATTACK' or 'RUN_ATTACK'
    this.runAttackStep = 0;
    this.runAttackTimer = 0;
    this.attackProgress = 0;
    this.attackDuration = 0.35;
    this.attackCooldown = 0;
    this.isAttacking = false;
    this.attackHitboxRadius = 3.2;

    // Nine-Tails Mode
    this.isKyuubiMode = false;
    this.kyuubiTimeLeft = 0;

    // Chakra Charge
    this.isChargingChakra = false;

    // Smooth Rig Blending & Physics States
    this.boneTargets = {
      torso: { rot: new THREE.Euler(), pos: new THREE.Vector3(0, 1.15, 0) },
      head: { rot: new THREE.Euler() },
      leftArm: { rot: new THREE.Euler() },
      leftForearm: { rot: new THREE.Euler() },
      rightArm: { rot: new THREE.Euler() },
      rightForearm: { rot: new THREE.Euler() },
      leftLeg: { rot: new THREE.Euler() },
      leftShin: { rot: new THREE.Euler() },
      rightLeg: { rot: new THREE.Euler() },
      rightShin: { rot: new THREE.Euler() }
    };
    this.bankAngle = 0;
    this.wasGrounded = true;
    this.wasMoving = false;
    this.runCycle = 0;
    this.lastSinRun = 0;
    this.wallPuffTimer = 0;
    this.lastSinWall = 0;
    this.wallKickCooldown = 0;
    this.airFlipTimer = 0;
    this.pitchAngle = 0;

    // Double Jump & Sprint States
    this.canDoubleJump = true;
    this.doubleFlipTimer = 0;
    this.isSprinting = false;
    this.wasSprinting = false;
    this.sprintAuraTimer = 0;
    this.prevSpace = false;

    // Build Model & Rig
    this.buildModel();
    this.buildSlashTrail();
  }

  buildModel() {
    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    // Premium Anime Materials
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const orangeMat = createToonMaterial(0xff7300, { roughness: 0.5 });
    const navyMat = createToonMaterial(0x0f1d40, { roughness: 0.55 });
    const hairMat = createToonMaterial(0xffea00, { roughness: 0.3 });
    const metalMat = createToonMaterial(0xf0f4f8, { roughness: 0.15 });
    const whiteMat = createToonMaterial(0xffffff, { roughness: 0.6 });
    const eyeBlueMat = createToonMaterial(0x0099ff, { roughness: 0.2 });
    const pupilMat = createToonMaterial(0x080e18);
    const redMat = createToonMaterial(0xd50000, { roughness: 0.4 });
    const darkMat = createToonMaterial(0x1a1a1a, { roughness: 0.7 });
    const whiskerMat = createToonMaterial(0xb43806);

    this.rig = {};

    // 1. Torso
    this.rig.torso = new THREE.Group();
    this.rig.torso.position.y = 1.15;

    const chestGeo = new THREE.CylinderGeometry(0.39, 0.33, 0.68, 28);
    const chest = new THREE.Mesh(chestGeo, orangeMat);
    chest.position.y = 0.16;
    this.rig.torso.add(chest);

    const shoulderMantleGeo = new THREE.CylinderGeometry(0.42, 0.40, 0.28, 28);
    const shoulderMantle = new THREE.Mesh(shoulderMantleGeo, navyMat);
    shoulderMantle.position.y = 0.36;
    this.rig.torso.add(shoulderMantle);

    const zipGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.68, 8);
    const zip = new THREE.Mesh(zipGeo, metalMat);
    zip.position.set(0, 0.16, 0.37);

    const puller = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.02), metalMat);
    puller.position.set(0, 0.46, 0.39);
    this.rig.torso.add(zip, puller);

    const collarGeo = new THREE.TorusGeometry(0.25, 0.09, 16, 32);
    collarGeo.rotateX(Math.PI / 2);
    const collar = new THREE.Mesh(collarGeo, whiteMat);
    collar.position.y = 0.54;
    this.rig.torso.add(collar);

    const jacketHemGeo = new THREE.CylinderGeometry(0.34, 0.37, 0.24, 28);
    const jacketHem = new THREE.Mesh(jacketHemGeo, orangeMat);
    jacketHem.position.y = -0.22;

    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.365, 0.365, 0.08, 28), darkMat);
    belt.position.y = -0.16;

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.04), metalMat);
    buckle.position.set(0, -0.16, 0.37);
    this.rig.torso.add(jacketHem, belt, buckle);

    const backSwirl = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 12, 32), redMat);
    backSwirl.position.set(0, 0.16, -0.37);
    this.rig.torso.add(backSwirl);

    // 2. Head & Spiky Hair
    this.rig.head = new THREE.Group();
    this.rig.head.position.y = 0.70;

    const faceGeo = new THREE.SphereGeometry(0.33, 28, 24);
    faceGeo.scale(1.0, 1.15, 1.05);
    const face = new THREE.Mesh(faceGeo, skinMat);
    this.rig.head.add(face);

    const chinGeo = new THREE.ConeGeometry(0.14, 0.18, 12);
    chinGeo.rotateX(Math.PI);
    const chin = new THREE.Mesh(chinGeo, skinMat);
    chin.position.set(0, -0.26, 0.18);
    this.rig.head.add(chin);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 8), skinMat);
    nose.position.set(0, -0.02, 0.35);
    nose.rotation.x = Math.PI / 2;
    this.rig.head.add(nose);

    const createEye = (isLeft) => {
      const g = new THREE.Group();
      const x = isLeft ? -0.115 : 0.115;
      g.position.set(x, 0.06, 0.285);
      g.rotation.y = isLeft ? 0.16 : -0.16;

      const eyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 12), whiteMat);
      eyeWhite.scale.set(1.0, 1.25, 0.3);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), eyeBlueMat);
      iris.position.z = 0.016;
      iris.scale.set(1.0, 1.2, 0.3);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), pupilMat);
      pupil.position.z = 0.028;
      pupil.scale.set(1.0, 1.1, 0.3);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), whiteMat);
      glint.position.set(0.016, 0.022, 0.035);

      g.add(eyeWhite, iris, pupil, glint);
      return g;
    };

    this.leftEye = createEye(true);
    this.rightEye = createEye(false);
    this.rig.head.add(this.leftEye, this.rightEye);

    const browGeo = new THREE.BoxGeometry(0.1, 0.025, 0.02);
    const browL = new THREE.Mesh(browGeo, hairMat);
    browL.position.set(-0.12, 0.15, 0.32);
    browL.rotation.z = -0.14;
    const browR = new THREE.Mesh(browGeo, hairMat);
    browR.position.set(0.12, 0.15, 0.32);
    browR.rotation.z = 0.14;
    this.rig.head.add(browL, browR);

    for (let w = -1; w <= 1; w++) {
      const wGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 8);
      wGeo.rotateZ(Math.PI / 2);
      const lw = new THREE.Mesh(wGeo, whiskerMat);
      lw.position.set(-0.20, -0.06 + w * 0.04, 0.23);
      lw.rotation.y = 0.46;
      lw.rotation.z = 0.08 * w;

      const rw = new THREE.Mesh(wGeo, whiskerMat);
      rw.position.set(0.20, -0.06 + w * 0.04, 0.23);
      rw.rotation.y = -0.46;
      rw.rotation.z = -0.08 * w;
      this.rig.head.add(lw, rw);
    }

    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.15, 28), navyMat);
    band.position.y = 0.15;
    this.rig.head.add(band);

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.355, 0.12, 24, 1, false, -0.65, 1.3), metalMat);
    plate.position.y = 0.15;

    const leafCrest = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 8, 18), darkMat);
    leafCrest.position.set(0, 0.15, 0.365);

    const rivetGeo = new THREE.SphereGeometry(0.014, 8, 8);
    const r1 = new THREE.Mesh(rivetGeo, darkMat); r1.position.set(-0.16, 0.18, 0.33);
    const r2 = new THREE.Mesh(rivetGeo, darkMat); r2.position.set(0.16, 0.18, 0.33);
    const r3 = new THREE.Mesh(rivetGeo, darkMat); r3.position.set(-0.16, 0.12, 0.33);
    const r4 = new THREE.Mesh(rivetGeo, darkMat); r4.position.set(0.16, 0.12, 0.33);
    this.rig.head.add(plate, leafCrest, r1, r2, r3, r4);

    this.rig.headbandTails = new THREE.Group();
    this.rig.headbandTails.position.set(0, 0.15, -0.34);
    const tailGeo = new THREE.CylinderGeometry(0.03, 0.07, 0.48, 10);
    tailGeo.rotateX(Math.PI / 4.5);
    const tail1 = new THREE.Mesh(tailGeo, navyMat);
    tail1.position.set(-0.065, -0.19, -0.09);
    const tail2 = new THREE.Mesh(tailGeo, navyMat);
    tail2.position.set(0.065, -0.19, -0.09);
    this.rig.headbandTails.add(tail1, tail2);
    this.rig.head.add(this.rig.headbandTails);

    this.rig.hair = new THREE.Group();
    this.rig.hair.position.y = 0.17;
    const hairBase = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 20), hairMat);
    hairBase.position.y = 0.08;
    this.rig.hair.add(hairBase);

    const hairSpikes = [
      { x: 0, y: 0.36, z: 0.05, r: 0.15, h: 0.40, rx: 0.1, rz: 0 },
      { x: -0.16, y: 0.34, z: 0.13, r: 0.13, h: 0.36, rx: 0.3, rz: 0.4 },
      { x: 0.16, y: 0.34, z: 0.13, r: 0.13, h: 0.36, rx: 0.3, rz: -0.4 },
      { x: -0.24, y: 0.29, z: 0, r: 0.14, h: 0.38, rx: 0, rz: 0.65 },
      { x: 0.24, y: 0.29, z: 0, r: 0.14, h: 0.38, rx: 0, rz: -0.65 },
      { x: -0.19, y: 0.25, z: -0.19, r: 0.14, h: 0.35, rx: -0.4, rz: 0.55 },
      { x: 0.19, y: 0.25, z: -0.19, r: 0.14, h: 0.35, rx: -0.4, rz: -0.55 },
      { x: 0, y: 0.29, z: -0.27, r: 0.15, h: 0.40, rx: -0.65, rz: 0 },
      { x: -0.13, y: 0.15, z: 0.29, r: 0.10, h: 0.25, rx: 0.85, rz: 0.25 },
      { x: 0.13, y: 0.15, z: 0.29, r: 0.10, h: 0.25, rx: 0.85, rz: -0.25 },
      { x: 0, y: 0.17, z: 0.31, r: 0.10, h: 0.27, rx: 0.85, rz: 0 },
      { x: -0.27, y: 0.17, z: 0.15, r: 0.11, h: 0.30, rx: 0.3, rz: 0.8 },
      { x: 0.27, y: 0.17, z: 0.15, r: 0.11, h: 0.30, rx: 0.3, rz: -0.8 }
    ];

    hairSpikes.forEach(s => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(s.r, s.h, 10), hairMat);
      cone.position.set(s.x, s.y, s.z);
      cone.rotation.set(s.rx, 0, s.rz);
      this.rig.hair.add(cone);
    });

    this.rig.head.add(this.rig.hair);
    this.rig.torso.add(this.rig.head);

    // 3. Limbs & Joint Rig
    this.rig.leftArm = new THREE.Group();
    this.rig.leftArm.position.set(-0.47, 0.36, 0);
    const shoulderGeo = new THREE.SphereGeometry(0.145, 16, 14);
    const lShoulder = new THREE.Mesh(shoulderGeo, navyMat);
    const upperArmGeo = new THREE.CylinderGeometry(0.125, 0.115, 0.38, 16);
    const lUpperArm = new THREE.Mesh(upperArmGeo, orangeMat);
    lUpperArm.position.y = -0.18;
    this.rig.leftArm.add(lShoulder, lUpperArm);

    this.rig.leftForearm = new THREE.Group();
    this.rig.leftForearm.position.y = -0.38;
    const elbowGeo = new THREE.SphereGeometry(0.11, 14, 12);
    const lElbow = new THREE.Mesh(elbowGeo, orangeMat);
    const foreArmGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.36, 16);
    const lFore = new THREE.Mesh(foreArmGeo, orangeMat);
    lFore.position.y = -0.15;
    const lWrist = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.095, 0.12, 16), whiteMat);
    lWrist.position.y = -0.27;
    const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12), skinMat);
    lHand.scale.set(1.0, 1.25, 0.7);
    lHand.position.y = -0.37;
    this.rig.leftForearm.add(lElbow, lFore, lWrist, lHand);
    this.rig.leftArm.add(this.rig.leftForearm);

    this.rig.rightArm = new THREE.Group();
    this.rig.rightArm.position.set(0.47, 0.36, 0);
    const rShoulder = new THREE.Mesh(shoulderGeo, navyMat);
    const rUpperArm = new THREE.Mesh(upperArmGeo, orangeMat);
    rUpperArm.position.y = -0.18;
    this.rig.rightArm.add(rShoulder, rUpperArm);

    this.rig.rightForearm = new THREE.Group();
    this.rig.rightForearm.position.y = -0.38;
    const rElbow = new THREE.Mesh(elbowGeo, orangeMat);
    const rFore = new THREE.Mesh(foreArmGeo, orangeMat);
    rFore.position.y = -0.15;
    const rWrist = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.095, 0.12, 16), whiteMat);
    rWrist.position.y = -0.27;
    const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12), skinMat);
    rHand.scale.set(1.0, 1.25, 0.7);
    rHand.position.y = -0.37;

    this.rasenganAnchor = new THREE.Group();
    this.rasenganAnchor.position.set(0, -0.46, 0);
    this.rig.rightForearm.add(this.rasenganAnchor);

    this.rig.rightForearm.add(rElbow, rFore, rWrist, rHand);
    this.rig.rightArm.add(this.rig.rightForearm);

    this.rig.torso.add(this.rig.leftArm, this.rig.rightArm);

    // 4. Legs
    this.rig.leftLeg = new THREE.Group();
    this.rig.leftLeg.position.set(-0.21, -0.36, 0);
    const thighGeo = new THREE.CylinderGeometry(0.145, 0.125, 0.45, 16);
    const lThigh = new THREE.Mesh(thighGeo, orangeMat);
    lThigh.position.y = -0.22;
    this.rig.leftLeg.add(lThigh);

    this.rig.leftShin = new THREE.Group();
    this.rig.leftShin.position.y = -0.45;
    const lKnee = new THREE.Mesh(elbowGeo, orangeMat);
    const lShin = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.105, 0.44, 16), orangeMat);
    lShin.position.y = -0.22;
    const lAnkle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.105, 0.18, 16), whiteMat);
    lAnkle.position.y = -0.33;

    const sandalGroup = new THREE.Group();
    sandalGroup.position.set(0, -0.44, 0.06);
    const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.05, 16), darkMat);
    sole.scale.set(1.0, 1.0, 1.7);
    const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16, 1, false, 0, Math.PI), navyMat);
    strap.position.set(0, 0.05, -0.04);
    const toes = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), skinMat);
    toes.position.set(0, 0.02, 0.1);

    // Glowing Chakra Soles (for wall running & ninja sprints)
    const chakraSoleMatL = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.leftChakraSole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.025, 16), chakraSoleMatL);
    this.leftChakraSole.scale.set(1.0, 1.0, 1.8);
    this.leftChakraSole.position.set(0, -0.03, 0);

    sandalGroup.add(sole, strap, toes, this.leftChakraSole);

    this.rig.leftShin.add(lKnee, lShin, lAnkle, sandalGroup);
    this.rig.leftLeg.add(this.rig.leftShin);

    this.rig.rightLeg = new THREE.Group();
    this.rig.rightLeg.position.set(0.21, -0.36, 0);
    const rThigh = new THREE.Mesh(thighGeo, orangeMat);
    rThigh.position.y = -0.22;
    const thighBandage = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.22, 16), whiteMat);
    thighBandage.position.y = -0.22;
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.1), darkMat);
    pouch.position.set(0.155, -0.22, 0);
    this.rig.rightLeg.add(rThigh, thighBandage, pouch);

    this.rig.rightShin = new THREE.Group();
    this.rig.rightShin.position.y = -0.45;
    const rKnee = new THREE.Mesh(elbowGeo, orangeMat);
    const rShin = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.105, 0.44, 16), orangeMat);
    rShin.position.y = -0.22;
    const rAnkle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.105, 0.18, 16), whiteMat);
    rAnkle.position.y = -0.33;

    const rSandalGroup = new THREE.Group();
    rSandalGroup.position.set(0, -0.44, 0.06);
    const rSole = sole.clone();
    const rStrap = strap.clone();
    const rToes = toes.clone();
    const chakraSoleMatR = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.rightChakraSole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.025, 16), chakraSoleMatR);
    this.rightChakraSole.scale.set(1.0, 1.0, 1.8);
    this.rightChakraSole.position.set(0, -0.03, 0);
    rSandalGroup.add(rSole, rStrap, rToes, this.rightChakraSole);

    this.rig.rightShin.add(rKnee, rShin, rAnkle, rSandalGroup);
    this.rig.rightLeg.add(this.rig.rightShin);

    this.rig.torso.add(this.rig.leftLeg, this.rig.rightLeg);
    this.group.add(this.rig.torso);

    this.scene.add(this.group);
  }

  buildSlashTrail() {
    const trailGeo = new THREE.RingGeometry(0.6, 1.4, 24, 1, 0, Math.PI * 0.9);
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    this.slashTrail = new THREE.Mesh(trailGeo, trailMat);
    this.slashTrail.position.set(0, 1.2, 0.6);
    this.slashTrail.rotation.x = Math.PI / 2;
    this.group.add(this.slashTrail);
  }

  showSlashTrail(color = 0x00f0ff, rotZ = 0) {
    this.slashTrail.material.color.setHex(color);
    this.slashTrail.rotation.z = rotZ;
    this.slashTrail.material.opacity = 0.85;

    let fade = 0.85;
    const fadeTimer = setInterval(() => {
      fade -= 0.15;
      if (fade <= 0) {
        this.slashTrail.material.opacity = 0;
        clearInterval(fadeTimer);
      } else {
        this.slashTrail.material.opacity = fade;
      }
    }, 25);
  }

  update(dt, input, cameraAngle, city) {
    if (this.isDead) return;

    // Passive Nine-Tails Regeneration (+8 HP/s)
    this.hp = Math.min(this.maxHp, this.hp + 8.0 * dt);

    if (this.isKyuubiMode) {
      this.kyuubiTimeLeft -= dt;
      this.vfx.spawnChakraAuraWisp(this.position, true);
      if (this.kyuubiTimeLeft <= 0) this.deactivateKyuubiMode();
    }

    // Chakra Concentration
    if (this.isChargingChakra && this.isGrounded && !this.isAttacking) {
      this.chakra = Math.min(this.maxChakra, this.chakra + 65 * dt);
      this.vfx.spawnChakraAuraWisp(this.position, false);
      const cv = document.getElementById('chakra-vignette');
      if (cv) cv.classList.add('charging');
    } else {
      this.chakra = Math.min(this.maxChakra, this.chakra + 8.0 * dt);
      const cv = document.getElementById('chakra-vignette');
      if (cv) cv.classList.remove('charging');
    }

    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.wallKickCooldown > 0) this.wallKickCooldown -= dt;
    if (this.airFlipTimer > 0) this.airFlipTimer -= dt;
    if (this.doubleFlipTimer > 0) this.doubleFlipTimer -= dt;

    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0 && !this.isAttacking) this.comboStep = 0;
    }
    if (this.runAttackTimer > 0) {
      this.runAttackTimer -= dt;
      if (this.runAttackTimer <= 0 && !this.isAttacking) this.runAttackStep = 0;
    }

    if (this.isAttacking) {
      this.attackProgress += dt / this.attackDuration;
      if (this.attackProgress >= 1.0) {
        this.isAttacking = false;
        this.attackProgress = 0;
        if (this.isGrounded) {
          const isStillMoving = !!(input && (input.w || input.s || input.a || input.d));
          this.state = isStillMoving ? 'RUN' : 'IDLE';
        }
      }
    }

    // Single-frame edge trigger for space jump / double jump
    const spaceJustPressed = !!(input.space && !this.prevSpace);
    this.prevSpace = !!input.space;

    // Movement Input
    const moveX = (input.d ? 1 : 0) - (input.a ? 1 : 0);
    const moveZ = (input.s ? 1 : 0) - (input.w ? 1 : 0);
    const isMoving = (moveX !== 0 || moveZ !== 0) && !this.isChargingChakra && this.state !== 'RASENGAN_DASH';

    // High-Speed Ninja Sprint (Shift + Movement)
    this.isSprinting = !!input.shift && isMoving && !this.isChargingChakra && this.state !== 'CHARGE_CHAKRA';

    // Initial dash smoke burst when sprint engages
    if (this.isSprinting && !this.wasSprinting) {
      sound.playDash();
      this.vfx.spawnSmokePoof(this.position, 10, 0.65);
    }
    this.wasSprinting = this.isSprinting;

    let sprintMult = 1.0;
    if (this.isSprinting) {
      sprintMult = 1.65;
      if (this.chakra > 1) {
        this.chakra = Math.max(0, this.chakra - 3.5 * dt);
      } else {
        sprintMult = 1.35; // Still brisk sprint even if chakra depleted
      }

      // Dynamic speed lines & trailing chakra flame wisps
      this.vfx.setSpeedLines(0.65);
      this.sprintAuraTimer = (this.sprintAuraTimer || 0) + dt;
      if (this.sprintAuraTimer > 0.07) {
        this.sprintAuraTimer = 0;
        this.vfx.spawnChakraAuraWisp(this.position, this.isKyuubiMode);
      }
    } else if (this.state !== 'RASENGAN_DASH') {
      this.vfx.setSpeedLines(0);
    }

    let targetSpeed = this.speed * sprintMult * (this.isKyuubiMode ? 1.45 : 1.0);

    // Check Wall Collision for Chakra Wall Running!
    let wallCheck = { hit: false };
    if (city && city.checkWall) {
      wallCheck = city.checkWall(this.position, 0.85);
    }

    // Trigger Chakra Wall Running when moving into a building wall!
    if (wallCheck.hit && isMoving && this.position.y < wallCheck.roofY - 0.25) {
      this.isWallRunning = true;
      this.state = 'WALL_RUN';
      this.wallRoofY = wallCheck.roofY;

      // Smoothly orient body to face directly into the wall surface
      const targetWallYaw = Math.atan2(-wallCheck.wallNormal.x, -wallCheck.wallNormal.z);
      let wallAngleDiff = targetWallYaw - this.rotationY;
      while (wallAngleDiff > Math.PI) wallAngleDiff -= Math.PI * 2;
      while (wallAngleDiff < -Math.PI) wallAngleDiff += Math.PI * 2;
      this.rotationY += wallAngleDiff * Math.min(1.0, 24 * dt);

      // Fast vertical climb velocity straight UP (NO velocity pushing inside the building!)
      const climbSpeed = targetSpeed * 1.15;
      this.velocity.y = climbSpeed;
      this.velocity.x = 0;
      this.velocity.z = 0;

      // Player movement inputs in world space for lateral wall navigation
      const inputAngle = Math.atan2(moveX, moveZ);
      const moveDirAngle = cameraAngle + inputAngle;
      const moveDirX = Math.sin(moveDirAngle);
      const moveDirZ = Math.cos(moveDirAngle);

      // Lock Naruto's position strictly so feet are planted right on the wall / cylinder surface
      if (wallCheck.shape === 'cylinder') {
        // Direction from cylinder center to player:
        let dx = this.position.x - wallCheck.centerX;
        let dz = this.position.z - wallCheck.centerZ;
        let curDist = Math.sqrt(dx * dx + dz * dz) || 1;

        // Tangent vector along circular cylinder circumference
        const tangX = -dz / curDist;
        const tangZ = dx / curDist;

        // Lateral steering around the circular tree trunk or round tower!
        const lateralIntent = moveDirX * tangX + moveDirZ * tangZ;
        const circSpeed = lateralIntent * targetSpeed * 0.7;
        this.position.x += tangX * circSpeed * dt;
        this.position.z += tangZ * circSpeed * dt;

        // Strictly re-project to circle radius so feet hug the trunk bark / curved wall without floating
        dx = this.position.x - wallCheck.centerX;
        dz = this.position.z - wallCheck.centerZ;
        curDist = Math.sqrt(dx * dx + dz * dz) || 1;
        const surfaceOffset = wallCheck.radius + 0.14;
        this.position.x = wallCheck.centerX + (dx / curDist) * surfaceOffset;
        this.position.z = wallCheck.centerZ + (dz / curDist) * surfaceOffset;
      } else {
        if (wallCheck.axis === 'x') {
          this.position.x = wallCheck.wallPos + wallCheck.wallNormal.x * 0.14;
          this.position.z += moveDirZ * targetSpeed * 0.7 * dt;
          if (wallCheck.building) {
            this.position.z = Math.max(wallCheck.building.minZ + 0.15, Math.min(wallCheck.building.maxZ - 0.15, this.position.z));
          }
        } else if (wallCheck.axis === 'z') {
          this.position.z = wallCheck.wallPos + wallCheck.wallNormal.z * 0.14;
          this.position.x += moveDirX * targetSpeed * 0.7 * dt;
          if (wallCheck.building) {
            this.position.x = Math.max(wallCheck.building.minX + 0.15, Math.min(wallCheck.building.maxX - 0.15, this.position.x));
          }
        }
      }

      // Pulse bright cyan Chakra Soles
      const solePulse = 0.85 + Math.sin(performance.now() * 0.02) * 0.15;
      if (this.leftChakraSole) this.leftChakraSole.material.opacity = solePulse;
      if (this.rightChakraSole) this.rightChakraSole.material.opacity = solePulse;

      // Advance runCycle dynamically so the wall-running animation vigorously pumps legs!
      this.runCycle += dt * targetSpeed * 1.35;

      // Periodic alternating wall footsteps smoke puffs from each foot impact
      const sinWall = Math.sin(this.runCycle * 1.8);
      if ((sinWall > 0.85 && this.lastSinWall <= 0.85) || (sinWall < -0.85 && this.lastSinWall >= -0.85)) {
        const isLeft = sinWall > 0;
        const footPos = this.position.clone();
        if (wallCheck.shape === 'cylinder') {
          const tangX = -wallCheck.wallNormal.z;
          const tangZ = wallCheck.wallNormal.x;
          footPos.x += tangX * (isLeft ? -0.2 : 0.2);
          footPos.z += tangZ * (isLeft ? -0.2 : 0.2);
        } else if (wallCheck.axis === 'x') {
          footPos.x = wallCheck.wallPos;
          footPos.z += isLeft ? -0.2 : 0.2;
        } else {
          footPos.z = wallCheck.wallPos;
          footPos.x += isLeft ? -0.2 : 0.2;
        }
        footPos.y += 0.2;
        this.vfx.spawnWallPuff(footPos, wallCheck.wallNormal);
        this.vfx.spawnChakraAuraWisp(footPos, false);
      }
      this.lastSinWall = sinWall;

      // Wall-Kick / Eject with Space (Acrobatic backflip off the wall)
      if (spaceJustPressed && this.wallKickCooldown <= 0) {
        this.wallKickCooldown = 0.5;
        sound.playDash();
        this.isWallRunning = false;
        this.isGrounded = false;
        this.canDoubleJump = true; // Allow double jump after kicking off wall
        this.state = 'JUMP';
        this.airFlipTimer = 0.6; // Backflip rotation in air
        this.velocity.y = this.jumpForce * 1.25;
        this.velocity.x = wallCheck.wallNormal.x * 14.0;
        this.velocity.z = wallCheck.wallNormal.z * 14.0;
        this.position.x += wallCheck.wallNormal.x * 0.5;
        this.position.z += wallCheck.wallNormal.z * 0.5;
        this.vfx.spawnSmokePoof(this.position, 16, 0.9);
        this.vfx.spawnWallPuff(this.position, wallCheck.wallNormal);
      }

      // Reached the roof ledge? Smoothly vault onto the roof!
      if (this.position.y >= wallCheck.roofY - 0.25) {
        this.isWallRunning = false;
        this.position.y = wallCheck.roofY;
        const forward = wallCheck.wallNormal.clone().negate();
        this.position.x += forward.x * 1.2;
        this.position.z += forward.z * 1.2;
        this.velocity.x = forward.x * 7.5;
        this.velocity.z = forward.z * 7.5;
        this.velocity.y = 1.8;
        this.isGrounded = true;
        this.canDoubleJump = true;
        this.doubleFlipTimer = 0;
        this.state = 'RUN';
        this.vfx.spawnLandingDust(this.position, 7);
      }
    } else {
      this.isWallRunning = false;
      const soleSprint = this.isSprinting ? 0.75 : 0;
      if (this.leftChakraSole) this.leftChakraSole.material.opacity = Math.max(0, THREE.MathUtils.lerp(this.leftChakraSole.material.opacity, soleSprint, Math.min(1.0, 10 * dt)));
      if (this.rightChakraSole) this.rightChakraSole.material.opacity = Math.max(0, THREE.MathUtils.lerp(this.rightChakraSole.material.opacity, soleSprint, Math.min(1.0, 10 * dt)));
    }

    // Normal Horizontal Ground Movement (Smooth acceleration, turn banking & footstep dust)
    if (isMoving && !this.isAttacking && !this.isWallRunning) {
      const inputAngle = Math.atan2(moveX, moveZ);
      this.targetRotationY = cameraAngle + inputAngle;

      let angleDiff = this.targetRotationY - this.rotationY;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.rotationY += angleDiff * Math.min(1.0, 16 * dt);

      // Smooth banking lean into turns
      this.bankAngle = THREE.MathUtils.damp(this.bankAngle, -angleDiff * 0.42, 12, dt);

      // Smooth responsive acceleration with organic ease
      const desiredVx = Math.sin(this.targetRotationY) * targetSpeed;
      const desiredVz = Math.cos(this.targetRotationY) * targetSpeed;
      const accel = this.isGrounded ? 18.0 : 7.0;
      this.velocity.x += (desiredVx - this.velocity.x) * Math.min(1.0, accel * dt);
      this.velocity.z += (desiredVz - this.velocity.z) * Math.min(1.0, accel * dt);

      if (this.isGrounded) {
        this.state = 'RUN';

        // Sprint kick-off smoke burst when starting to run
        if (!this.wasMoving) {
          this.vfx.spawnFootstepDust(this.position, 1.4);
        }

        // Alternating footstep smoke puffs during sprint
        this.runCycle += dt * targetSpeed * (this.isSprinting ? 1.25 : 0.95);
        const sinRun = Math.sin(this.runCycle);
        if ((sinRun > 0.85 && this.lastSinRun <= 0.85) || (sinRun < -0.85 && this.lastSinRun >= -0.85)) {
          const isLeft = sinRun > 0;
          const footOffset = new THREE.Vector3(
            isLeft ? -0.22 : 0.22,
            0.05,
            -0.12
          ).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
          const dustScale = this.isSprinting ? 1.35 : 0.88;
          this.vfx.spawnFootstepDust(this.position.clone().add(footOffset), dustScale);
        }
        this.lastSinRun = sinRun;
      }
    } else if (this.state !== 'RASENGAN_DASH' && !this.isAttacking && !this.isWallRunning) {
      // Smooth natural deceleration damping
      const friction = this.isGrounded ? 13.0 : 3.5;
      this.velocity.x += (0 - this.velocity.x) * Math.min(1.0, friction * dt);
      this.velocity.z += (0 - this.velocity.z) * Math.min(1.0, friction * dt);
      this.bankAngle = THREE.MathUtils.damp(this.bankAngle, 0, 14, dt);
      if (this.isGrounded && !this.isChargingChakra) {
        this.state = 'IDLE';
      }
    } else if (this.isAttacking && !this.isWallRunning && this.state !== 'RASENGAN_DASH') {
      // Attack deceleration damping: prevents runaway acceleration while keeping punch/slide momentum organic!
      if (this.attackMode === 'RUN_ATTACK') {
        const slideFriction = this.isGrounded ? (this.runAttackStep === 1 ? 4.6 : 5.6) : 2.6;
        this.velocity.x += (0 - this.velocity.x) * Math.min(1.0, slideFriction * dt);
        this.velocity.z += (0 - this.velocity.z) * Math.min(1.0, slideFriction * dt);

        // While sliding in Move 1, spawn continuous slide dust on the ground
        if (this.runAttackStep === 1 && this.isGrounded && Math.random() < 0.45) {
          this.vfx.spawnFootstepDust(this.position, 1.25);
        }
      } else {
        // Standing attack: crisp martial arts step that settles quickly into the strike stance
        const standFriction = this.isGrounded ? 15.0 : 4.0;
        this.velocity.x += (0 - this.velocity.x) * Math.min(1.0, standFriction * dt);
        this.velocity.z += (0 - this.velocity.z) * Math.min(1.0, standFriction * dt);
      }
      this.bankAngle = THREE.MathUtils.damp(this.bankAngle, 0, 14, dt);
    }
    this.wasMoving = isMoving;

    // Jump & Double Jump System with Frontflip Somersault
    if (spaceJustPressed && !this.isChargingChakra && this.state !== 'RASENGAN_DASH' && !this.isWallRunning) {
      if (this.isGrounded) {
        // Ground / Rooftop Jump
        this.velocity.y = this.jumpForce;
        this.isGrounded = false;
        this.canDoubleJump = true;
        this.state = 'JUMP';
        this.vfx.spawnFootstepDust(this.position, 1.35);
        sound.playDash();
      } else if (this.canDoubleJump) {
        // Mid-air Double Jump with 360° Frontflip Somersault (Кувырок в воздухе)
        this.canDoubleJump = false;
        this.state = 'JUMP';
        this.doubleFlipTimer = 0.48;
        this.velocity.y = this.jumpForce * 1.18;

        if (isMoving) {
          const inputAngle = Math.atan2(moveX, moveZ);
          const jumpYaw = cameraAngle + inputAngle;
          this.rotationY = jumpYaw;
          const airPush = this.speed * (this.isSprinting ? 1.45 : 1.15);
          this.velocity.x = Math.sin(jumpYaw) * airPush;
          this.velocity.z = Math.cos(jumpYaw) * airPush;
        }

        const footPos = this.position.clone().setY(this.position.y - 0.2);
        if (this.vfx.spawnDoubleJumpEffect) {
          this.vfx.spawnDoubleJumpEffect(footPos);
        } else {
          this.vfx.spawnSmokePoof(footPos, 14, 0.85);
        }
        sound.playDash();
      }
    }

    // Gravity applied when not wall-running
    if (!this.isGrounded && !this.isWallRunning) {
      this.velocity.y -= this.gravity * dt;
    }

    // Apply Velocity
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.position.z += this.velocity.z * dt;

    // Solid collision with buildings: if NOT wall-running, resolve building collision so player NEVER penetrates inside!
    if (!this.isWallRunning && city && city.resolveCollision) {
      city.resolveCollision(this.position, 0.55);
    }

    // Rooftop & Terrain Height System
    const groundHeight = city && city.getGroundHeight ? city.getGroundHeight(this.position.x, this.position.z, this.position.y) : 0;
    this.currentGroundY = groundHeight;

    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
      this.velocity.y = 0;
      if (!this.isGrounded) {
        this.isGrounded = true;
        this.canDoubleJump = true;
        this.doubleFlipTimer = 0;
        this.vfx.spawnLandingDust(this.position, 8);
      }
    } else if (this.position.y > groundHeight + 0.3 && !this.isWallRunning) {
      this.isGrounded = false;
    }
    this.wasGrounded = this.isGrounded;

    // Clamp inside Konoha borders (only when not wall running)
    if (!this.isWallRunning && city && city.clampPosition) {
      city.clampPosition(this.position, 0.6);
    }

    // Smooth dynamic pitch angle for wall running: tilts body so feet are planted on wall and upper body/belly are held out in open air!
    const targetPitch = this.isWallRunning ? -0.72 : 0;
    this.pitchAngle = THREE.MathUtils.damp(this.pitchAngle, targetPitch, 16, dt);

    this.group.position.copy(this.position);
    this.group.rotation.x = this.pitchAngle;
    this.group.rotation.y = this.rotationY;

    // Procedural Rig Animation with Smooth Blending
    this.animateRig(dt);
  }

  animateRig(dt) {
    const time = performance.now() * 0.006;
    const runFreq = this.runCycle;
    const target = this.boneTargets;

    // Secondary animation: Headband tails flutter dynamically with wind & velocity
    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const tailFlutter = Math.sin(time * 5.5) * (0.22 + horizSpeed * 0.035);
    this.rig.headbandTails.rotation.x = THREE.MathUtils.lerp(
      this.rig.headbandTails.rotation.x,
      tailFlutter,
      Math.min(1.0, 16 * dt)
    );

    if (this.isAttacking) {
      if (this.attackMode === 'RUN_ATTACK') {
        this.animateRunningAttackPose(this.attackProgress, this.runAttackStep);
      } else {
        this.animateAttackPose(this.attackProgress, this.comboStep);
      }
      this.applyRigSmoothing(dt);
      return;
    }

    if (this.isWallRunning) {
      // Iconic Naruto Ninja Wall-Run: High-speed athletic leg pump, streamlined arms, dynamic stride bob
      const wallFreq = runFreq * 1.8;
      const bob = Math.abs(Math.sin(wallFreq)) * 0.08;
      target.torso.pos.set(0, 1.05 + bob, 0);
      target.torso.rot.set(0.18, 0, 0); // Natural spine curvature
      target.head.rot.set(-0.45, 0, 0); // Head looks up towards roof ledge

      // Iconic Naruto Run arms streamlined straight back with wind flutter
      const armFlutter = Math.sin(time * 9) * 0.08;
      target.leftArm.rot.set(1.52 + armFlutter, 0, 0.22);
      target.leftForearm.rot.set(0.06, 0, 0);
      target.rightArm.rot.set(1.52 - armFlutter, 0, -0.22);
      target.rightForearm.rot.set(0.06, 0, 0);

      // Deep knee drive & full athletic leg sprint cycle against the wall surface!
      target.leftLeg.rot.set(Math.sin(wallFreq) * 1.15, 0, 0);
      target.leftShin.rot.set(Math.max(0, -Math.sin(wallFreq) * 1.45), 0, 0);

      target.rightLeg.rot.set(-Math.sin(wallFreq) * 1.15, 0, 0);
      target.rightShin.rot.set(Math.max(0, Math.sin(wallFreq) * 1.45), 0, 0);

    } else if (this.state === 'RUN') {
      // The Iconic Naruto Ninja Run with dynamic lean & arms trailing straight behind
      const isSprint = this.isSprinting;
      const bob = Math.abs(Math.sin(runFreq)) * (isSprint ? 0.07 : 0.11);
      const torsoLean = isSprint ? 0.86 : 0.68;
      target.torso.pos.set(0, (isSprint ? 0.98 : 1.05) + bob, 0);
      target.torso.rot.set(torsoLean, 0, this.bankAngle);
      target.head.rot.set(isSprint ? -0.72 : -0.55, 0, 0);

      // Arms locked back with high-frequency aerodynamic wind flutter
      const flutterRate = isSprint ? 14 : 9;
      const flutterAmp = isSprint ? 0.05 : 0.07;
      const armFlutter = Math.sin(time * flutterRate) * flutterAmp;
      const armBackAngle = isSprint ? 1.68 : 1.55;
      const armSpread = isSprint ? 0.18 : 0.22;

      target.leftArm.rot.set(armBackAngle + armFlutter, 0, armSpread);
      target.leftForearm.rot.set(0.06, 0, 0);
      target.rightArm.rot.set(armBackAngle - armFlutter, 0, -armSpread);
      target.rightForearm.rot.set(0.06, 0, 0);

      const legSwing = isSprint ? 1.35 : 1.0;
      const shinBend = isSprint ? 1.6 : 1.35;
      target.leftLeg.rot.set(Math.sin(runFreq) * legSwing, 0, 0);
      target.leftShin.rot.set(Math.max(0, -Math.sin(runFreq) * shinBend), 0, 0);

      target.rightLeg.rot.set(-Math.sin(runFreq) * legSwing, 0, 0);
      target.rightShin.rot.set(Math.max(0, Math.sin(runFreq) * shinBend), 0, 0);

    } else if (this.state === 'JUMP') {
      target.torso.pos.set(0, 1.15, 0);
      if (this.doubleFlipTimer > 0) {
        // Acrobatic 360-degree frontflip somersault (Кувырок вперед в воздухе)
        const flipProgress = 1.0 - (this.doubleFlipTimer / 0.48);
        const flipAngle = Math.PI * 2 * flipProgress;
        target.torso.rot.set(flipAngle, 0, 0);

        if (flipProgress < 0.75) {
          // Compact ninja somersault ball tuck pose
          target.head.rot.set(0.45, 0, 0);
          target.leftArm.rot.set(0.9, 0, 0.35);
          target.leftForearm.rot.set(1.1, 0, 0);
          target.rightArm.rot.set(0.9, 0, -0.35);
          target.rightForearm.rot.set(1.1, 0, 0);
          target.leftLeg.rot.set(-1.4, 0, 0);
          target.leftShin.rot.set(1.8, 0, 0);
          target.rightLeg.rot.set(-1.4, 0, 0);
          target.rightShin.rot.set(1.8, 0, 0);
        } else {
          // Snap out cleanly into landing ready stance
          target.head.rot.set(-0.25, 0, 0);
          target.leftArm.rot.set(1.2, 0, 0.4);
          target.leftForearm.rot.set(0.2, 0, 0);
          target.rightArm.rot.set(1.2, 0, -0.4);
          target.rightForearm.rot.set(0.2, 0, 0);
          target.leftLeg.rot.set(-0.5, 0, 0);
          target.leftShin.rot.set(0.9, 0, 0);
          target.rightLeg.rot.set(-0.3, 0, 0);
          target.rightShin.rot.set(0.6, 0, 0);
        }
      } else if (this.airFlipTimer > 0) {
        // Acrobatic backflip rotation off wall kick
        const flipProgress = 1.0 - (this.airFlipTimer / 0.6);
        target.torso.rot.set(-Math.PI * 2 * flipProgress, 0, 0);
        target.head.rot.set(-0.25, 0, 0);
        target.leftArm.rot.set(0.85, 0, 0.45);
        target.leftForearm.rot.set(0.2, 0, 0);
        target.rightArm.rot.set(0.85, 0, -0.45);
        target.rightForearm.rot.set(0.2, 0, 0);
        target.leftLeg.rot.set(-0.75, 0, 0);
        target.leftShin.rot.set(1.15, 0, 0);
        target.rightLeg.rot.set(-0.45, 0, 0);
        target.rightShin.rot.set(0.85, 0, 0);
      } else {
        target.torso.rot.set(0.35, 0, 0);
        target.head.rot.set(-0.25, 0, 0);
        target.leftArm.rot.set(1.2, 0, 0.38);
        target.leftForearm.rot.set(0.12, 0, 0);
        target.rightArm.rot.set(1.2, 0, -0.38);
        target.rightForearm.rot.set(0.12, 0, 0);
        target.leftLeg.rot.set(-0.75, 0, 0);
        target.leftShin.rot.set(1.15, 0, 0);
        target.rightLeg.rot.set(-0.45, 0, 0);
        target.rightShin.rot.set(0.85, 0, 0);
      }

    } else if (this.state === 'CHARGE_CHAKRA') {
      target.torso.pos.set(0, 1.05, 0);
      target.torso.rot.set(0.18, 0, 0);
      target.head.rot.set(0.2, 0, 0);
      target.leftArm.rot.set(0.8, 0.4, -0.5);
      target.rightArm.rot.set(0.8, -0.4, 0.5);
      target.leftForearm.rot.set(0.7, 0, 0);
      target.rightForearm.rot.set(0.7, 0, 0);
      target.leftLeg.rot.set(0.15, 0, 0.12);
      target.rightLeg.rot.set(0.15, 0, -0.12);

    } else if (this.state === 'RASENGAN_DASH') {
      target.torso.pos.set(0, 1.1, 0);
      target.torso.rot.set(0.45, 0, 0);
      target.head.rot.set(-0.35, 0, 0);
      target.rightArm.rot.set(1.65, -0.1, 0);
      target.rightForearm.rot.set(0.2, 0, 0);
      target.leftArm.rot.set(-0.95, 0, 0.35);
      target.leftForearm.rot.set(-0.2, 0, 0);
      target.leftLeg.rot.set(Math.sin(runFreq * 1.4) * 0.9, 0, 0);
      target.leftShin.rot.set(0.4, 0, 0);
      target.rightLeg.rot.set(-Math.sin(runFreq * 1.4) * 0.9, 0, 0);
      target.rightShin.rot.set(0.4, 0, 0);

    } else {
      // IDLE: Organic breathing and subtle living stance
      const breath = Math.sin(time * 2.2) * 0.025;
      target.torso.pos.set(0, 1.15 + breath, 0);
      target.torso.rot.set(0, 0, 0);
      target.head.rot.set(Math.sin(time * 1.3) * 0.03, Math.sin(time * 0.8) * 0.04, 0);

      target.leftArm.rot.set(0.18, 0, 0.18 + breath);
      target.leftForearm.rot.set(0.35, 0, 0);
      target.rightArm.rot.set(0.18, 0, -0.18 - breath);
      target.rightForearm.rot.set(0.35, 0, 0);

      target.leftLeg.rot.set(0, 0, 0.08);
      target.leftShin.rot.set(0, 0, 0);
      target.rightLeg.rot.set(0, 0, -0.08);
      target.rightShin.rot.set(0, 0, 0);
    }

    this.applyRigSmoothing(dt);
  }

  applyRigSmoothing(dt) {
    const speed = this.isAttacking ? 34.0 : 16.0;
    const t = Math.min(1.0, speed * dt);

    for (const [name, target] of Object.entries(this.boneTargets)) {
      const bone = this.rig[name];
      if (!bone || !target) continue;

      bone.rotation.x += (target.rot.x - bone.rotation.x) * t;
      bone.rotation.y += (target.rot.y - bone.rotation.y) * t;
      bone.rotation.z += (target.rot.z - bone.rotation.z) * t;

      if (target.pos) {
        bone.position.x += (target.pos.x - bone.position.x) * t;
        bone.position.y += (target.pos.y - bone.position.y) * t;
        bone.position.z += (target.pos.z - bone.position.z) * t;
      }
    }
  }

  animateAttackPose(p, step) {
    const target = this.boneTargets;

    if (step === 1) {
      // Step 1: Left Lead Jab / Hook with full forward extension & hip rotation
      if (p < 0.25) {
        const w = p / 0.25;
        target.torso.rot.set(-0.06 * w, -0.32 * w, 0);
        target.torso.pos.set(0, 1.15, -0.05 * w);
        target.leftArm.rot.set(-0.35 * w, -0.2 * w, 0.25 * w);
        target.leftForearm.rot.set(1.25 * w, 0, 0);
        target.rightArm.rot.set(-0.65 * w, 0.1 * w, -0.25 * w);
        target.rightForearm.rot.set(1.15 * w, 0, 0);
        target.leftLeg.rot.set(0.3 * w, 0, 0);
        target.leftShin.rot.set(0.35 * w, 0, 0);
        target.rightLeg.rot.set(-0.25 * w, 0, 0);
        target.head.rot.set(-0.05 * w, 0.2 * w, 0);
      } else if (p < 0.65) {
        const s = (p - 0.25) / 0.40;
        const strikeCurve = Math.sin(s * Math.PI);
        target.torso.rot.set(0.22 * Math.sin(s * Math.PI * 0.5), -0.32 + 0.92 * s, 0);
        target.torso.pos.set(0, 1.15 - 0.03 * strikeCurve, 0.35 * strikeCurve);
        target.leftArm.rot.set(-1.54 - 0.12 * strikeCurve, 0.12 * s, -0.10 * s);
        target.leftForearm.rot.set(0.08 * (1 - s), 0, 0);
        target.rightArm.rot.set(0.15 * s, 0, -0.28);
        target.rightForearm.rot.set(0.95, 0, 0);
        target.leftLeg.rot.set(0.4, 0, 0);
        target.leftShin.rot.set(0.4, 0, 0);
        target.rightLeg.rot.set(-0.4, 0, 0);
        target.rightShin.rot.set(0.1, 0, 0);
        target.head.rot.set(-0.15 * strikeCurve, -0.25 * s, 0);
      } else {
        const r = (p - 0.65) / 0.35;
        const rec = 1 - r;
        target.torso.rot.set(0.22 * rec, 0.60 * rec, 0);
        target.torso.pos.set(0, 1.15, 0.35 * rec);
        target.leftArm.rot.set(-1.54 * rec + 0.18 * r, 0.12 * rec, -0.10 * rec + 0.18 * r);
        target.leftForearm.rot.set(0.08 * rec + 0.35 * r, 0, 0);
        target.rightArm.rot.set(0.15 * rec + 0.18 * r, 0, -0.28 * rec - 0.18 * r);
        target.rightForearm.rot.set(0.95 * rec + 0.35 * r, 0, 0);
        target.leftLeg.rot.set(0.4 * rec, 0, 0.08);
        target.rightLeg.rot.set(-0.4 * rec, 0, -0.08);
        target.head.rot.set(-0.15 * rec, -0.25 * rec, 0);
      }

    } else if (step === 2) {
      // Step 2: Right Power Cross with deep torso wind-up and heavy forward punch
      if (p < 0.25) {
        const w = p / 0.25;
        target.torso.rot.set(-0.06 * w, 0.48 * w, 0);
        target.torso.pos.set(0, 1.15, -0.06 * w);
        target.rightArm.rot.set(-0.38 * w, -0.35 * w, -0.35 * w);
        target.rightForearm.rot.set(1.35 * w, 0, 0);
        target.leftArm.rot.set(-0.75 * w, 0, 0.25 * w);
        target.leftForearm.rot.set(0.95 * w, 0, 0);
        target.rightLeg.rot.set(-0.35 * w, 0, 0);
        target.rightShin.rot.set(0.35 * w, 0, 0);
        target.leftLeg.rot.set(0.3 * w, 0, 0);
        target.head.rot.set(-0.05 * w, -0.25 * w, 0);
      } else if (p < 0.65) {
        const s = (p - 0.25) / 0.40;
        const strikeCurve = Math.sin(s * Math.PI);
        target.torso.rot.set(0.24 * Math.sin(s * Math.PI * 0.5), 0.48 - 1.15 * s, 0);
        target.torso.pos.set(0, 1.15 - 0.03 * strikeCurve, 0.42 * strikeCurve);
        target.rightArm.rot.set(-1.58 - 0.15 * strikeCurve, -0.15 * s, 0.10 * s);
        target.rightForearm.rot.set(0.06 * (1 - s), 0, 0);
        target.leftArm.rot.set(0.20 * s, 0, 0.32);
        target.leftForearm.rot.set(0.85, 0, 0);
        target.rightLeg.rot.set(-0.45, 0, 0);
        target.rightShin.rot.set(0.25, 0, 0);
        target.leftLeg.rot.set(0.45, 0, 0);
        target.leftShin.rot.set(0.35, 0, 0);
        target.head.rot.set(-0.15 * strikeCurve, 0.35 * s, 0);
      } else {
        const r = (p - 0.65) / 0.35;
        const rec = 1 - r;
        target.torso.rot.set(0.24 * rec, -0.67 * rec, 0);
        target.torso.pos.set(0, 1.15, 0.42 * rec);
        target.rightArm.rot.set(-1.58 * rec + 0.18 * r, -0.15 * rec, 0.10 * rec - 0.18 * r);
        target.rightForearm.rot.set(0.06 * rec + 0.35 * r, 0, 0);
        target.leftArm.rot.set(0.20 * rec + 0.18 * r, 0, 0.32 * rec + 0.18 * r);
        target.leftForearm.rot.set(0.85 * rec + 0.35 * r, 0, 0);
        target.head.rot.set(-0.15 * rec, 0.35 * rec, 0);
      }

    } else if (step === 3) {
      // Step 3: Spinning 360° Whirlwind Crescent Roundhouse Kick
      const spinAngle = -Math.PI * 2 * p;
      const kickP = Math.sin(p * Math.PI);
      target.torso.rot.set(0.14 * kickP, spinAngle, 0);
      target.torso.pos.set(0, 1.15 + 0.24 * kickP, 0.25 * kickP);
      target.rightLeg.rot.set(-1.58 * kickP, 0, -1.25 * kickP);
      target.rightShin.rot.set(0.08, 0, 0);
      target.leftLeg.rot.set(0.25 * kickP, 0, 0);
      target.leftShin.rot.set(0.45 * kickP, 0, 0);
      target.leftArm.rot.set(-0.68, 0, 0.72);
      target.leftForearm.rot.set(0.35, 0, 0);
      target.rightArm.rot.set(-0.68, 0, -0.72);
      target.rightForearm.rot.set(0.35, 0, 0);
      target.head.rot.set(-0.1, 0, 0);

    } else if (step === 4) {
      // Step 4: Rising Dragon Uppercut + Flying Knee Launch
      if (p < 0.24) {
        const w = p / 0.24;
        target.torso.pos.set(0, 1.15 - 0.22 * w, -0.06 * w);
        target.torso.rot.set(0.16 * w, 0.26 * w, 0);
        target.rightArm.rot.set(-0.25 * w, 0.2 * w, -0.2 * w);
        target.rightForearm.rot.set(1.42 * w, 0, 0);
        target.leftArm.rot.set(-0.55 * w, 0, 0.3 * w);
        target.leftForearm.rot.set(0.85 * w, 0, 0);
        target.leftLeg.rot.set(0.65 * w, 0, 0);
        target.leftShin.rot.set(0.85 * w, 0, 0);
        target.rightLeg.rot.set(0.65 * w, 0, 0);
        target.rightShin.rot.set(0.85 * w, 0, 0);
      } else if (p < 0.70) {
        const s = (p - 0.24) / 0.46;
        const launchY = Math.sin(s * Math.PI);
        target.torso.pos.set(0, 1.15 + 0.65 * launchY, 0.35 * s);
        target.torso.rot.set(-0.25 * s, -0.25 * s, 0);
        target.rightArm.rot.set(-2.22, -0.12, 0.16);
        target.rightForearm.rot.set(0.52, 0, 0);
        target.rightLeg.rot.set(-1.68 * launchY, 0, 0);
        target.rightShin.rot.set(1.60 * launchY, 0, 0);
        target.leftLeg.rot.set(0.15, 0, 0);
        target.leftShin.rot.set(0.12, 0, 0);
        target.leftArm.rot.set(0.45, 0, 0.3);
        target.leftForearm.rot.set(0.2, 0, 0);
        target.head.rot.set(-0.5, 0, 0);
      } else {
        const r = (p - 0.70) / 0.30;
        const rec = 1 - r;
        target.torso.pos.set(0, 1.15 + 0.65 * rec, 0.35 * rec);
        target.torso.rot.set(-0.25 * rec, -0.25 * rec, 0);
        target.rightArm.rot.set(-2.22 * rec + 0.18 * r, 0, -0.18 * r);
        target.rightForearm.rot.set(0.52 * rec + 0.35 * r, 0, 0);
        target.rightLeg.rot.set(-1.68 * rec, 0, -0.08 * r);
        target.rightShin.rot.set(1.60 * rec, 0, 0);
        target.head.rot.set(-0.5 * rec, 0, 0);
      }

    } else if (step === 5) {
      // Step 5: Uzumaki Finisher: High Flying Hammer Slam with Two-Handed Strike
      if (p < 0.40) {
        const w = p / 0.40;
        const leapY = Math.sin(w * Math.PI * 0.5);
        target.torso.pos.set(0, 1.15 + 1.1 * leapY, 0.25 * w);
        target.torso.rot.set(-0.25 * w, 0, 0);
        target.leftArm.rot.set(-2.28 * w, 0.15, -0.15);
        target.leftForearm.rot.set(0.38 * w, 0, 0);
        target.rightArm.rot.set(-2.28 * w, -0.15, 0.15);
        target.rightForearm.rot.set(0.38 * w, 0, 0);
        target.rightLeg.rot.set(-1.82 * w, 0, 0);
        target.rightShin.rot.set(0.15, 0, 0);
        target.leftLeg.rot.set(-0.65 * w, 0, 0);
        target.leftShin.rot.set(0.9 * w, 0, 0);
        target.head.rot.set(-0.35 * w, 0, 0);
      } else if (p < 0.72) {
        const s = (p - 0.40) / 0.32;
        const slamCurve = Math.sin(s * Math.PI);
        target.torso.pos.set(0, 1.15 + 1.1 * (1 - s) - 0.25 * slamCurve, 0.55 * s);
        target.torso.rot.set(-0.25 * (1 - s) + 0.68 * s, 0, 0);
        target.leftArm.rot.set(-0.48, 0, -0.12);
        target.leftForearm.rot.set(0.12, 0, 0);
        target.rightArm.rot.set(-0.48, 0, 0.12);
        target.rightForearm.rot.set(0.12, 0, 0);
        target.rightLeg.rot.set(0.55, 0, -0.2);
        target.rightShin.rot.set(0.7, 0, 0);
        target.leftLeg.rot.set(0.55, 0, 0.2);
        target.leftShin.rot.set(0.7, 0, 0);
        target.head.rot.set(0.25 * s, 0, 0);
      } else {
        const r = (p - 0.72) / 0.28;
        const rec = 1 - r;
        target.torso.pos.set(0, 1.15 - 0.25 * rec, 0.55 * rec);
        target.torso.rot.set(0.68 * rec, 0, 0);
        target.leftArm.rot.set(-0.48 * rec + 0.18 * r, 0, -0.12 * rec + 0.18 * r);
        target.leftForearm.rot.set(0.12 * rec + 0.35 * r, 0, 0);
        target.rightArm.rot.set(-0.48 * rec + 0.18 * r, 0, 0.12 * rec - 0.18 * r);
        target.rightForearm.rot.set(0.12 * rec + 0.35 * r, 0, 0);
        target.leftLeg.rot.set(0.55 * rec, 0, 0.08);
        target.rightLeg.rot.set(0.55 * rec, 0, -0.08);
        target.head.rot.set(0.25 * rec, 0, 0);
      }
    }
  }

  animateRunningAttackPose(p, step) {
    const target = this.boneTargets;

    if (step === 1) {
      // Run Attack 1: Low Shinobi Ground Slide Sweep Kick (Низкий подкат с подсечкой под врага)
      if (p < 0.65) {
        const s = p / 0.65;
        const slideCurve = Math.sin(s * Math.PI * 0.5);
        // Naruto drops low under enemy strikes
        target.torso.pos.set(0, 0.56 + 0.06 * (1 - slideCurve), 0.18 * slideCurve);
        target.torso.rot.set(-0.36, 0.28 * slideCurve, 0);
        target.head.rot.set(0.40, -0.20 * slideCurve, 0);

        // Right leg shoots out forward flat along the ground to sweep legs
        target.rightLeg.rot.set(-1.62, 0, -0.15);
        target.rightShin.rot.set(0.04, 0, 0);

        // Left leg folded neatly under hips
        target.leftLeg.rot.set(0.85, 0, 0.22);
        target.leftShin.rot.set(1.68, 0, 0);

        // Right arm trailing back touching ground for balance
        target.rightArm.rot.set(1.42, -0.22, -0.32);
        target.rightForearm.rot.set(0.12, 0, 0);

        // Left arm guarding chest and face
        target.leftArm.rot.set(-0.65, 0.25, 0.42);
        target.leftForearm.rot.set(1.25, 0, 0);
      } else {
        // Recovery: spring back up onto feet into run
        const r = (p - 0.65) / 0.35;
        const rec = 1 - r;
        target.torso.pos.set(0, 0.56 * rec + 1.05 * r, 0.18 * rec);
        target.torso.rot.set(-0.36 * rec + 0.68 * r, 0.28 * rec, 0);
        target.head.rot.set(0.40 * rec - 0.55 * r, -0.20 * rec, 0);

        target.rightLeg.rot.set(-1.62 * rec + 0.4 * r, 0, -0.15 * rec);
        target.rightShin.rot.set(0.04 * rec + 0.3 * r, 0, 0);

        target.leftLeg.rot.set(0.85 * rec - 0.4 * r, 0, 0.22 * rec);
        target.leftShin.rot.set(1.68 * rec + 0.2 * r, 0, 0);

        target.rightArm.rot.set(1.42 * rec + 1.55 * r, 0, -0.32 * rec - 0.22 * r);
        target.rightForearm.rot.set(0.12 * rec + 0.06 * r, 0, 0);

        target.leftArm.rot.set(-0.65 * rec + 1.55 * r, 0, 0.42 * rec + 0.22 * r);
        target.leftForearm.rot.set(1.25 * rec + 0.06 * r, 0, 0);
      }

    } else if (step === 2) {
      // Run Attack 2: Flying Dragon Dropkick (Удар двумя ногами в прыжке с налета)
      if (p < 0.72) {
        const s = p / 0.72;
        const airCurve = Math.sin(s * Math.PI);
        // Airborne horizontal dropkick pose
        target.torso.pos.set(0, 1.28 + 0.18 * airCurve, 0.30 * s);
        target.torso.rot.set(-0.58, 0, 0);
        target.head.rot.set(0.55, 0, 0);

        // Both legs thrust together straight forward
        target.rightLeg.rot.set(-1.68, 0, -0.08);
        target.rightShin.rot.set(0.05, 0, 0);
        target.leftLeg.rot.set(-1.68, 0, 0.08);
        target.leftShin.rot.set(0.05, 0, 0);

        // Arms swept outward like wings for momentum and aerodynamic balance
        target.rightArm.rot.set(1.38, -0.22, -0.58);
        target.rightForearm.rot.set(0.18, 0, 0);
        target.leftArm.rot.set(1.38, 0.22, 0.58);
        target.leftForearm.rot.set(0.18, 0, 0);
      } else {
        // Recovery: tuck legs for clean landing
        const r = (p - 0.72) / 0.28;
        const rec = 1 - r;
        target.torso.pos.set(0, 1.28 * rec + 1.05 * r, 0.30 * rec);
        target.torso.rot.set(-0.58 * rec + 0.68 * r, 0, 0);
        target.head.rot.set(0.55 * rec - 0.55 * r, 0, 0);

        target.rightLeg.rot.set(-1.68 * rec + 0.3 * r, 0, -0.08 * rec);
        target.rightShin.rot.set(0.05 * rec + 0.8 * r, 0, 0);
        target.leftLeg.rot.set(-1.68 * rec - 0.3 * r, 0, 0.08 * rec);
        target.leftShin.rot.set(0.05 * rec + 0.8 * r, 0, 0);

        target.rightArm.rot.set(1.38 * rec + 1.55 * r, 0, -0.58 * rec - 0.22 * r);
        target.rightForearm.rot.set(0.18 * rec + 0.06 * r, 0, 0);
        target.leftArm.rot.set(1.38 * rec + 1.55 * r, 0, 0.58 * rec + 0.22 * r);
        target.leftForearm.rot.set(0.18 * rec + 0.06 * r, 0, 0);
      }

    } else if (step === 3) {
      // Run Attack 3: High-Speed Chakra Palm Drive (Стремительный выпад ладонью с чакрой)
      if (p < 0.28) {
        const w = p / 0.28;
        // Deep forward coil & windup
        target.torso.pos.set(0, 1.02 - 0.08 * w, -0.05 * w);
        target.torso.rot.set(0.52 * w, -0.32 * w, 0);
        target.head.rot.set(-0.35 * w, 0.22 * w, 0);

        target.rightArm.rot.set(0.35 * w, 0.28 * w, -0.22 * w);
        target.rightForearm.rot.set(1.38 * w, 0, 0);
        target.leftArm.rot.set(1.48 * w, 0, 0.25 * w);
        target.leftForearm.rot.set(0.08 * w, 0, 0);

        target.leftLeg.rot.set(0.45 * w, 0, 0);
        target.leftShin.rot.set(0.65 * w, 0, 0);
        target.rightLeg.rot.set(-0.45 * w, 0, 0);
        target.rightShin.rot.set(0.25 * w, 0, 0);
      } else if (p < 0.68) {
        const s = (p - 0.28) / 0.40;
        const strikeCurve = Math.sin(s * Math.PI);
        // Explosive palm strike lunge
        target.torso.pos.set(0, 0.94, 0.45 * s);
        target.torso.rot.set(0.72, 0.28 * s, 0);
        target.head.rot.set(-0.55, -0.18 * s, 0);

        // Right palm thrusts forward like a spear
        target.rightArm.rot.set(-1.66 - 0.12 * strikeCurve, -0.16, 0.06);
        target.rightForearm.rot.set(0.04 * (1 - s), 0, 0);

        // Left arm locked straight behind
        target.leftArm.rot.set(1.72, 0, 0.22);
        target.leftForearm.rot.set(0.05, 0, 0);

        // Deep aggressive shinobi sprint stance
        target.leftLeg.rot.set(0.78, 0, 0);
        target.leftShin.rot.set(0.88, 0, 0);
        target.rightLeg.rot.set(-0.86, 0, 0);
        target.rightShin.rot.set(0.12, 0, 0);
      } else {
        // Recovery smoothly back to run
        const r = (p - 0.68) / 0.32;
        const rec = 1 - r;
        target.torso.pos.set(0, 0.94 * rec + 1.05 * r, 0.45 * rec);
        target.torso.rot.set(0.72 * rec + 0.68 * r, 0.28 * rec, 0);
        target.head.rot.set(-0.55 * rec - 0.55 * r, -0.18 * rec, 0);

        target.rightArm.rot.set(-1.66 * rec + 1.55 * r, -0.16 * rec, 0.06 * rec - 0.22 * r);
        target.rightForearm.rot.set(0.04 * rec + 0.06 * r, 0, 0);

        target.leftArm.rot.set(1.72 * rec + 1.55 * r, 0, 0.22);
        target.leftForearm.rot.set(0.05 * rec + 0.06 * r, 0, 0);

        target.leftLeg.rot.set(0.78 * rec, 0, 0);
        target.leftShin.rot.set(0.88 * rec, 0, 0);
        target.rightLeg.rot.set(-0.86 * rec, 0, 0);
        target.rightShin.rot.set(0.12 * rec, 0, 0);
      }
    }
  }

  performAttack(onHitCallback, inputKeys) {
    if (this.attackCooldown > 0 || this.isChargingChakra || this.state === 'RASENGAN_DASH') return;

    this.isAttacking = true;
    this.attackProgress = 0;

    const horizSpeed = Math.hypot(this.velocity.x, this.velocity.z);
    const hasMoveKeys = inputKeys && (inputKeys.w || inputKeys.s || inputKeys.a || inputKeys.d);
    const isShiftPressed = inputKeys ? !!inputKeys.shift : false;
    // Running combat animations activate ONLY when sprinting on Shift!
    const isSprintAttack = (this.isSprinting || isShiftPressed) && (hasMoveKeys || this.state === 'RUN' || horizSpeed > 3.0);

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);

    if (isSprintAttack) {
      // Sprint Combat System: Only activated when attacking while sprinting on Shift!
      this.attackMode = 'RUN_ATTACK';
      this.runAttackStep = (this.runAttackStep % 3) + 1;
      this.runAttackTimer = 1.8;

      let isFinisher = false;
      let hitDelay = 110;
      let baseDmg = 85;

      if (this.runAttackStep === 1) {
        // Move 1: Shinobi Low Slide Sweep Kick
        this.attackDuration = 0.42;
        this.attackCooldown = 0.16;
        const slideSpeed = 14.5;
        // Set velocity directly, NEVER += accumulate!
        this.velocity.x = forward.x * slideSpeed;
        this.velocity.z = forward.z * slideSpeed;
        this.vfx.spawnFootstepDust(this.position, 1.6);
        this.showSlashTrail(0x00f0ff, 0.15);
        sound.playHit(false);
        hitDelay = 100;
        baseDmg = 85;
      } else if (this.runAttackStep === 2) {
        // Move 2: Flying Dragon Dropkick
        this.attackDuration = 0.48;
        this.attackCooldown = 0.22;
        const kickSpeed = 15.5;
        // Set velocity directly, NEVER += accumulate!
        this.velocity.x = forward.x * kickSpeed;
        this.velocity.z = forward.z * kickSpeed;
        this.velocity.y = 4.2;
        this.isGrounded = false;
        this.vfx.spawnFootstepDust(this.position, 1.4);
        this.showSlashTrail(0xff9100, -0.25);
        sound.playHit(true);
        hitDelay = 140;
        baseDmg = 125;
        isFinisher = true;
      } else {
        // Move 3: High-Speed Chakra Palm Drive
        this.attackDuration = 0.40;
        this.attackCooldown = 0.28;
        const palmSpeed = 16.5;
        // Set velocity directly, NEVER += accumulate!
        this.velocity.x = forward.x * palmSpeed;
        this.velocity.z = forward.z * palmSpeed;
        this.vfx.setSpeedLines(0.75);
        setTimeout(() => this.vfx.setSpeedLines(0), 220);
        this.vfx.spawnChakraAuraWisp(this.position, this.isKyuubiMode);
        this.showSlashTrail(0x00e5ff, 1.25);
        sound.playHit(true);
        hitDelay = 120;
        baseDmg = 160;
        isFinisher = true;
      }

      const stepKey = 'RUN_' + this.runAttackStep;
      setTimeout(() => {
        if (onHitCallback) {
          const damage = baseDmg * (this.isKyuubiMode ? 2.2 : 1.0);
          onHitCallback(this.getAttackCenter(), this.attackHitboxRadius + 0.3, damage, isFinisher, stepKey);
        }
      }, hitDelay);

    } else {
      // Standing 5-Hit Taijutsu Combo
      this.attackMode = 'STAND_ATTACK';
      this.comboStep = (this.comboStep % 5) + 1;
      this.comboTimer = 1.6;

      if (this.comboStep === 1) this.attackDuration = 0.26;
      else if (this.comboStep === 2) this.attackDuration = 0.30;
      else if (this.comboStep === 3) this.attackDuration = 0.38;
      else if (this.comboStep === 4) this.attackDuration = 0.36;
      else if (this.comboStep === 5) this.attackDuration = 0.54;

      const isFinisher = this.comboStep === 5;
      this.attackCooldown = isFinisher ? 0.38 : 0.16;

      sound.playHit(isFinisher);

      // Controlled martial arts lunge step (REPLACES velocity, NEVER += accumulates!)
      const stepPower = this.comboStep === 5 ? 4.2 : (this.comboStep === 4 ? 3.5 : (this.comboStep === 3 ? 3.0 : 2.2));
      this.velocity.x = forward.x * stepPower;
      this.velocity.z = forward.z * stepPower;

      const colors = [0x00f0ff, 0xffea00, 0xff9100, 0x00e5ff, 0xff1744];
      const slashAngles = [0.2, -0.3, 0.0, 1.4, -1.2];
      this.showSlashTrail(colors[this.comboStep - 1], slashAngles[this.comboStep - 1]);

      const hitDelays = [75, 90, 130, 110, 240];
      setTimeout(() => {
        if (onHitCallback) {
          let baseDmg = 55;
          if (this.comboStep === 2) baseDmg = 75;
          if (this.comboStep === 3) baseDmg = 95;
          if (this.comboStep === 4) baseDmg = 120;
          if (this.comboStep === 5) baseDmg = 200;

          const damage = baseDmg * (this.isKyuubiMode ? 2.2 : 1.0);
          onHitCallback(this.getAttackCenter(), this.attackHitboxRadius, damage, isFinisher, this.comboStep);
        }
      }, hitDelays[this.comboStep - 1]);
    }
  }

  getAttackCenter() {
    const dir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    if (this.attackMode === 'RUN_ATTACK') {
      const reach = this.runAttackStep === 1 ? 2.5 : (this.runAttackStep === 2 ? 2.8 : 2.4);
      const height = this.runAttackStep === 1 ? 0.45 : (this.runAttackStep === 2 ? 1.4 : 1.1);
      return this.position.clone().add(dir.multiplyScalar(reach)).setY(this.position.y + height);
    }
    const reach = this.comboStep === 5 ? 2.4 : (this.comboStep === 3 ? 2.2 : 1.9);
    const height = this.comboStep === 4 ? 2.0 : 1.2;
    return this.position.clone().add(dir.multiplyScalar(reach)).setY(this.position.y + height);
  }

  takeDamage(amount) {
    if (this.isDead) return;

    const actualDamage = Math.max(1, amount * 0.5);
    this.hp = Math.max(0, this.hp - actualDamage);

    const dv = document.getElementById('damage-vignette');
    if (dv) {
      dv.classList.add('active');
      setTimeout(() => dv.classList.remove('active'), 250);
    }

    this.vfx.spawnHitSparks(this.position.clone().setY(this.position.y + 1.2), false);
    sound.playHit(false);

    if (this.hp <= 0) {
      this.die();
    }
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    sound.playPickup();
    this.vfx.spawnChakraAuraWisp(this.position, false);
  }

  addChakra(amount) {
    this.chakra = Math.min(this.maxChakra, this.chakra + amount);
    sound.playPickup();
    this.vfx.spawnChakraAuraWisp(this.position, false);
  }

  activateKyuubiMode() {
    this.isKyuubiMode = true;
    this.kyuubiTimeLeft = 18;
    sound.playKyuubiRoar();
    this.vfx.triggerScreenShake(0.5, 0.4);
    this.vfx.spawnSmokePoof(this.position, 25, 1.4);

    const avatar = document.getElementById('avatar-img');
    if (avatar) avatar.classList.add('kyuubi');

    const badge = document.getElementById('kyuubi-status');
    if (badge) badge.classList.remove('hidden');
  }

  deactivateKyuubiMode() {
    this.isKyuubiMode = false;
    this.kyuubiTimeLeft = 0;

    const avatar = document.getElementById('avatar-img');
    if (avatar) avatar.classList.remove('kyuubi');

    const badge = document.getElementById('kyuubi-status');
    if (badge) badge.classList.add('hidden');
  }

  triggerSprintDash() {
    if (this.isDead || this.isChargingChakra) return;
    sound.playDash();
    this.vfx.spawnSmokePoof(this.position, 10, 0.7);
    this.vfx.setSpeedLines(0.75);
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    this.velocity.x += forward.x * 6.5;
    this.velocity.z += forward.z * 6.5;
  }

  die() {
    this.isDead = true;
    this.vfx.spawnSmokePoof(this.position, 30, 1.5);
    sound.playSmokePoof();
    this.group.visible = false;
  }

  reset() {
    this.isDead = false;
    this.hp = this.maxHp;
    this.chakra = this.maxChakra;
    this.position.set(0, 0, 15);
    this.velocity.set(0, 0, 0);
    this.state = 'IDLE';
    this.comboStep = 0;
    this.attackMode = 'STAND_ATTACK';
    this.runAttackStep = 0;
    this.runAttackTimer = 0;
    this.isAttacking = false;
    this.isWallRunning = false;
    this.pitchAngle = 0;
    this.bankAngle = 0;
    this.wallKickCooldown = 0;
    this.airFlipTimer = 0;
    this.canDoubleJump = true;
    this.doubleFlipTimer = 0;
    this.isSprinting = false;
    this.wasSprinting = false;
    this.prevSpace = false;
    if (this.leftChakraSole) this.leftChakraSole.material.opacity = 0;
    if (this.rightChakraSole) this.rightChakraSole.material.opacity = 0;
    this.group.visible = true;
    this.deactivateKyuubiMode();
  }
}
