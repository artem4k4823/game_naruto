// Stylized Realistic Anime Enemies: Rogue Shinobi & Akatsuki Enforcer
import * as THREE from 'three';
import { createToonMaterial } from '../vfx/AnimeVFX.js';
import { sound } from '../audio/SoundFX.js';

export class Enemy {
  constructor(scene, vfx, type = 'rogue', spawnPos = new THREE.Vector3(), zone = null) {
    this.scene = scene;
    this.vfx = vfx;
    this.type = type;

    this.position = spawnPos.clone();
    this.velocity = new THREE.Vector3();
    this.rotationY = 0;

    // Easy & Accessible Difficulty
    if (this.type === 'akatsuki') {
      this.maxHp = 130;
      this.hp = 130;
      this.speed = 8.0;
      this.attackDamage = 3;
      this.attackRange = 2.4;
      this.scoreValue = 350;
    } else {
      this.maxHp = 50;
      this.hp = 50;
      this.speed = 8.8;
      this.attackDamage = 1.5;
      this.attackRange = 2.1;
      this.scoreValue = 100;
    }

    this.isDead = false;
    this.isAttacking = false;
    this.attackProgress = 0;
    this.attackDuration = 0.52;
    this.attackType = 0;
    this.hasDealtDamage = false;
    this.attackCooldown = 1.2 + Math.random() * 1.5;
    this.fireballCooldown = 6.0 + Math.random() * 2.0;

    this.stunTime = 0;

    // Zone Patrol & Leash AI
    this.zone = zone;
    this.zoneCenter = zone && zone.center ? zone.center.clone() : spawnPos.clone();
    this.patrolRadius = zone && zone.patrolRadius ? zone.patrolRadius : 22;
    this.leashRadius = zone && zone.leashRadius ? zone.leashRadius : 36;
    this.aggroRadius = 18.0;
    this.zoneName = zone ? zone.name : '';

    this.aiState = 'PATROL'; // 'PATROL', 'PATROL_IDLE', 'CHASE', 'ATTACK', 'RETURN', 'FIREBALL'
    this.state = 'PATROL';
    this.patrolTarget = this.pickNewPatrolTarget();
    this.patrolWaitTimer = 1.0 + Math.random() * 2.0;

    this.buildModel();
    this.buildHealthBar();
  }

  pickNewPatrolTarget(arena) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (this.patrolRadius * 0.75);
    const target = new THREE.Vector3(
      this.zoneCenter.x + Math.cos(angle) * dist,
      0,
      this.zoneCenter.z + Math.sin(angle) * dist
    );
    if (arena && arena.clampPosition) {
      arena.clampPosition(target, 0.6);
    }
    return target;
  }

  smoothTurnTowards(dir, dt, turnSpeed = 12.0) {
    const targetYaw = Math.atan2(dir.x, dir.z);
    let diff = targetYaw - this.rotationY;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.rotationY += diff * Math.min(1.0, turnSpeed * dt);
  }

  buildModel() {
    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    if (this.type === 'akatsuki') {
      this.buildAkatsukiMesh();
    } else {
      this.buildRogueMesh();
    }

    this.scene.add(this.group);
  }

  buildRogueMesh() {
    // Rogue Shinobi: Dark tactical flak vest, face mask, slashed headband, katana
    const darkGreyMat = createToonMaterial(0x283038, { roughness: 0.6 });
    const vestMat = createToonMaterial(0x1a2128, { roughness: 0.5 });
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const maskMat = createToonMaterial(0x11161a, { roughness: 0.7 });
    const metalMat = createToonMaterial(0xdfe6ec, { roughness: 0.2 });
    const hairDarkMat = createToonMaterial(0x181818);
    const redMat = createToonMaterial(0xd50000);

    // 1. Torso with flak vest armor plates
    this.torso = new THREE.Group();
    this.torso.position.y = 1.1;

    const bodyGeo = new THREE.CylinderGeometry(0.36, 0.30, 0.66, 20);
    const body = new THREE.Mesh(bodyGeo, darkGreyMat);
    this.torso.add(body);

    // Tactical Vest Plates & Pockets
    const vestCollarGeo = new THREE.TorusGeometry(0.24, 0.08, 10, 20);
    vestCollarGeo.rotateX(Math.PI / 2);
    const vestCollar = new THREE.Mesh(vestCollarGeo, vestMat);
    vestCollar.position.y = 0.36;

    const chestPocket1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.06), vestMat);
    chestPocket1.position.set(-0.13, 0.15, 0.34);
    const chestPocket2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.06), vestMat);
    chestPocket2.position.set(0.13, 0.15, 0.34);
    this.torso.add(vestCollar, chestPocket1, chestPocket2);

    // Katana strapped onto back with hilt and handguard
    const scabbardGeo = new THREE.CylinderGeometry(0.032, 0.032, 1.15, 10);
    scabbardGeo.rotateZ(0.65);
    const scabbard = new THREE.Mesh(scabbardGeo, createToonMaterial(0x101010));
    scabbard.position.set(-0.12, 0.1, -0.36);

    const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 10), metalMat);
    tsuba.position.set(0.25, 0.45, -0.36);
    tsuba.rotation.z = 0.65;

    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.32, 8), darkGreyMat);
    hilt.position.set(0.36, 0.58, -0.36);
    hilt.rotation.z = 0.65;
    this.torso.add(scabbard, tsuba, hilt);

    // 2. Head with Ninja Mask
    this.head = new THREE.Group();
    this.head.position.y = 0.64;

    const headGeo = new THREE.SphereGeometry(0.31, 20, 18);
    headGeo.scale(1.0, 1.15, 1.0);
    const headBase = new THREE.Mesh(headGeo, skinMat);
    this.head.add(headBase);

    // Dark Ninja Mask covering nose and mouth
    const maskGeo = new THREE.SphereGeometry(0.315, 18, 14, 0, Math.PI * 2, Math.PI * 0.44, Math.PI * 0.46);
    const mask = new THREE.Mesh(maskGeo, maskMat);
    this.head.add(mask);

    // Menacing Red Ninja Eyes
    const eyeGeo = new THREE.PlaneGeometry(0.08, 0.04);
    const eyeMat = createToonMaterial(0xff1744);
    const lEye = new THREE.Mesh(eyeGeo, eyeMat);
    lEye.position.set(-0.1, 0.07, 0.29);
    const rEye = new THREE.Mesh(eyeGeo, eyeMat);
    rEye.position.set(0.1, 0.07, 0.29);
    this.head.add(lEye, rEye);

    // Slashed Forehead Protector
    const bandGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.13, 20);
    const band = new THREE.Mesh(bandGeo, maskMat);
    band.position.y = 0.15;

    const plateGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.1, 16, 1, false, -0.6, 1.2);
    const plate = new THREE.Mesh(plateGeo, metalMat);
    plate.position.y = 0.15;

    const slashGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 6);
    slashGeo.rotateZ(Math.PI / 3);
    const slash = new THREE.Mesh(slashGeo, redMat);
    slash.position.set(0, 0.15, 0.34);
    this.head.add(band, plate, slash);

    // Dark Spiky Hair
    const hairGeo = new THREE.ConeGeometry(0.30, 0.38, 8);
    const hair = new THREE.Mesh(hairGeo, hairDarkMat);
    hair.position.set(0, 0.36, -0.06);
    hair.rotation.x = -0.2;
    this.head.add(hair);

    this.torso.add(this.head);

    // 3. Smooth Limbs with Shoulder Joint Pivots
    const armGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.68, 14);
    
    this.lArm = new THREE.Group();
    this.lArm.position.set(-0.46, 0.28, 0); // Shoulder socket
    const lArmMesh = new THREE.Mesh(armGeo, darkGreyMat);
    lArmMesh.position.y = -0.34;
    this.lArm.add(lArmMesh);

    this.rArm = new THREE.Group();
    this.rArm.position.set(0.46, 0.28, 0); // Shoulder socket
    const rArmMesh = new THREE.Mesh(armGeo, darkGreyMat);
    rArmMesh.position.y = -0.34;

    // Kunai firmly in hand at tip of arm
    const kunaiBlade = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.38, 4), metalMat);
    kunaiBlade.position.set(0, -0.68, 0.18);
    kunaiBlade.rotation.x = Math.PI / 2;
    this.rArm.add(rArmMesh, kunaiBlade);

    this.torso.add(this.lArm, this.rArm);

    // 4. Smooth Legs
    const legGeo = new THREE.CylinderGeometry(0.13, 0.095, 0.76, 14);
    this.lLeg = new THREE.Mesh(legGeo, vestMat);
    this.lLeg.position.set(-0.19, -0.66, 0);

    this.rLeg = new THREE.Mesh(legGeo, vestMat);
    this.rLeg.position.set(0.19, -0.66, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.group.add(this.torso);
  }

  buildAkatsukiMesh() {
    // Akatsuki Enforcer: Flowing dark cloak with red clouds, straw Kasa hat, steel katana
    const blackMat = createToonMaterial(0x0e1116, { roughness: 0.6 });
    const redMat = createToonMaterial(0xd50000, { roughness: 0.4 });
    const whiteMat = createToonMaterial(0xffffff, { roughness: 0.5 });
    const skinMat = createToonMaterial(0xffcca0, { roughness: 0.45 });
    const strawMat = createToonMaterial(0xded6cc, { roughness: 0.5 });
    const steelMat = createToonMaterial(0xf0f4f8, { roughness: 0.15 });

    this.torso = new THREE.Group();
    this.torso.position.y = 1.05;

    // Flowing Cloak (Tapered chest + flared lower robe)
    const upperCloakGeo = new THREE.CylinderGeometry(0.39, 0.45, 0.72, 22);
    const upperCloak = new THREE.Mesh(upperCloakGeo, blackMat);
    upperCloak.position.y = 0.2;

    const lowerRobeGeo = new THREE.CylinderGeometry(0.45, 0.64, 0.95, 22);
    const lowerRobe = new THREE.Mesh(lowerRobeGeo, blackMat);
    lowerRobe.position.y = -0.46;

    // High Upturned Collar (Signature Akatsuki look)
    const collarGeo = new THREE.CylinderGeometry(0.37, 0.39, 0.44, 20, 1, true);
    const collar = new THREE.Mesh(collarGeo, blackMat);
    collar.position.y = 0.66;

    // Embroidered Red Clouds with White Border
    const createCloud = (scale, x, y, z, rotY) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.rotation.y = rotY;

      const border = new THREE.Mesh(new THREE.CircleGeometry(0.22 * scale, 18), whiteMat);
      const fill = new THREE.Mesh(new THREE.CircleGeometry(0.19 * scale, 18), redMat);
      fill.position.z = 0.01;
      g.add(border, fill);
      return g;
    };

    this.torso.add(upperCloak, lowerRobe, collar);
    this.torso.add(createCloud(1.0, 0.16, 0.25, 0.42, 0));
    this.torso.add(createCloud(0.9, -0.19, -0.25, 0.50, 0));
    this.torso.add(createCloud(1.1, 0, 0.12, -0.44, Math.PI));

    // Head
    this.head = new THREE.Group();
    this.head.position.y = 0.76;
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.29, 20, 16), skinMat);
    this.head.add(headMesh);

    // Glowing Sharingan Eye
    const sharingan = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 10), redMat);
    sharingan.position.set(-0.09, 0.04, 0.26);
    this.head.add(sharingan);

    // Straw Conical Hat (Kasa) with drooping white fabric tassels
    const hatGeo = new THREE.ConeGeometry(0.74, 0.34, 24);
    const hat = new THREE.Mesh(hatGeo, strawMat);
    hat.position.y = 0.34;

    for (let i = -2; i <= 2; i++) {
      const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.34), whiteMat);
      strip.position.set(i * 0.16, -0.16, 0.44 - Math.abs(i) * 0.05);
      hat.add(strip);
    }
    this.head.add(hat);
    this.torso.add(this.head);

    // Arms with Shoulder Joint Pivots
    const sleeveGeo = new THREE.CylinderGeometry(0.14, 0.19, 0.76, 16);
    this.lArm = new THREE.Group();
    this.lArm.position.set(-0.50, 0.32, 0); // Shoulder socket
    const lSleeve = new THREE.Mesh(sleeveGeo, blackMat);
    lSleeve.position.y = -0.38;
    this.lArm.add(lSleeve);

    this.rArm = new THREE.Group();
    this.rArm.position.set(0.50, 0.32, 0); // Shoulder socket
    const rSleeve = new THREE.Mesh(sleeveGeo, blackMat);
    rSleeve.position.y = -0.38;

    // Akatsuki Nodachi Sword attached to hand
    const bladeGeo = new THREE.BoxGeometry(0.06, 1.15, 0.03);
    const blade = new THREE.Mesh(bladeGeo, steelMat);
    blade.position.set(0, -1.05, 0.32);
    blade.rotation.x = Math.PI / 4;

    const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 10), createToonMaterial(0xffc107));
    tsuba.position.set(0, -0.62, 0.14);
    tsuba.rotation.x = Math.PI / 4;

    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), redMat);
    hilt.position.set(0, -0.49, 0.06);
    hilt.rotation.x = Math.PI / 4;

    this.rArm.add(rSleeve, blade, tsuba, hilt);
    this.torso.add(this.lArm, this.rArm);

    // Legs inside robe
    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.62, 12);
    this.lLeg = new THREE.Mesh(legGeo, blackMat);
    this.lLeg.position.set(-0.19, -0.72, 0);
    this.rLeg = new THREE.Mesh(legGeo, blackMat);
    this.rLeg.position.set(0.19, -0.72, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.group.add(this.torso);
  }

  buildHealthBar() {
    this.hpBarGroup = new THREE.Group();
    this.hpBarGroup.position.set(0, 2.5, 0);

    const bgMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.14), bgMat);

    const fillMat = new THREE.MeshBasicMaterial({ color: this.type === 'akatsuki' ? 0xff1744 : 0x00e676 });
    this.hpFill = new THREE.Mesh(new THREE.PlaneGeometry(1.16, 0.1), fillMat);
    this.hpFill.position.z = 0.01;

    this.hpBarGroup.add(bg, this.hpFill);
    this.group.add(this.hpBarGroup);
  }

  update(dt, player, arena, camera, onPlayerHit, onSpawnFireball) {
    if (this.isDead) return;

    if (camera) {
      this.hpBarGroup.quaternion.copy(camera.quaternion);
    }

    if (this.stunTime > 0) {
      this.stunTime -= dt;
      this.position.addScaledVector(this.velocity, dt);
      this.velocity.multiplyScalar(0.86);
      if (this.position.y > 0) {
        this.position.y = Math.max(0, this.position.y - 15 * dt);
      }
      this.group.position.copy(this.position);

      // Organic Hit-Stun stagger reaction
      const stagger = Math.min(1.0, this.stunTime * 2.5);
      this.torso.rotation.x = -0.38 * stagger;
      this.head.rotation.x = -0.32 * stagger;
      this.lArm.rotation.set(0.55 * stagger, 0, 0.45 * stagger);
      this.rArm.rotation.set(0.55 * stagger, 0, -0.45 * stagger);
      return;
    }

    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.fireballCooldown > 0) this.fireballCooldown -= dt;

    const time = performance.now() * 0.007;

    const distToPlayer = this.position.distanceTo(player.position);
    const distFromZone = this.position.distanceTo(this.zoneCenter);
    const playerDistFromZone = player.position.distanceTo(this.zoneCenter);

    // 1. LEASH CHECK: Did enemy get lured too far from their designated territory?
    const isLeashed = (distFromZone > this.leashRadius) ||
                      (playerDistFromZone > this.leashRadius + 8.0 && distToPlayer > 18.0);

    if (isLeashed && this.aiState !== 'RETURN') {
      this.aiState = 'RETURN';
      this.isAttacking = false;
      this.state = 'RETURN';
    }

    // 2. RETURN STATE: Breaking off chase and running back to zone center
    if (this.aiState === 'RETURN') {
      const toZone = this.zoneCenter.clone().sub(this.position).setY(0);
      const distRemain = toZone.length();

      if (distRemain < this.patrolRadius * 0.65) {
        // Safely returned home to zone! Resume peaceful patrol
        this.aiState = 'PATROL_IDLE';
        this.state = 'IDLE';
        this.patrolWaitTimer = 1.5 + Math.random() * 2.0;
        this.patrolTarget = this.pickNewPatrolTarget(arena);
      } else {
        const returnDir = toZone.normalize();
        this.smoothTurnTowards(returnDir, dt, 12.0);
        this.position.addScaledVector(returnDir, this.speed * 0.85 * dt);

        // Running back animation
        this.torso.position.y = (this.type === 'akatsuki' ? 1.05 : 1.1) + Math.abs(Math.sin(time * 3.4)) * 0.06;
        this.torso.rotation.set(0.14, 0, 0);
        this.head.rotation.set(-0.05, 0, 0);
        this.lLeg.rotation.x = Math.sin(time * 3.4) * 0.75;
        this.rLeg.rotation.x = -Math.sin(time * 3.4) * 0.75;
        this.lArm.rotation.set(-Math.sin(time * 3.4) * 0.5, 0, 0.12);
        this.rArm.rotation.set(Math.sin(time * 3.4) * 0.5, 0, -0.12);

        if (arena) arena.clampPosition(this.position, 0.5);
        this.group.position.copy(this.position);
        this.group.rotation.y = this.rotationY;
        return;
      }
    }

    // 3. AGGRO CHECK: Player enters patrol territory or gets close
    if (this.aiState === 'PATROL' || this.aiState === 'PATROL_IDLE') {
      if (!isLeashed && (distToPlayer <= this.aggroRadius || playerDistFromZone <= this.patrolRadius + 2.0)) {
        // Alert! Player detected inside our patrol sector!
        this.aiState = 'CHASE';
        this.state = 'CHASE';
        this.vfx.spawnSmokePoof(this.position.clone().setY(this.position.y + 1.6), 6, 0.45);
      }
    }

    // 4. PATROL IDLE: Standing at waypoint, surveying territory
    if (this.aiState === 'PATROL_IDLE') {
      this.patrolWaitTimer -= dt;
      const lookSway = Math.sin(time * 1.4) * 0.35;
      this.rotationY += (lookSway * 0.2) * dt;
      this.torso.rotation.set(0.04, lookSway, 0);
      this.head.rotation.set(0, lookSway * 0.6, 0);
      this.lArm.rotation.set(-0.25, 0, 0.15);
      this.rArm.rotation.set(-0.25, 0, -0.15);
      this.lLeg.rotation.set(0, 0, 0);
      this.rLeg.rotation.set(0, 0, 0);

      if (this.patrolWaitTimer <= 0) {
        this.aiState = 'PATROL';
        this.state = 'PATROL';
        this.patrolTarget = this.pickNewPatrolTarget(arena);
      }

      if (arena) arena.clampPosition(this.position, 0.5);
      this.group.position.copy(this.position);
      this.group.rotation.y = this.rotationY;
      return;
    }

    // 5. PATROL: Walking calmly within designated zone
    if (this.aiState === 'PATROL') {
      const toPatrol = this.patrolTarget.clone().sub(this.position).setY(0);
      const distToPatrol = toPatrol.length();

      if (distToPatrol < 1.4) {
        // Reached patrol waypoint
        this.aiState = 'PATROL_IDLE';
        this.state = 'IDLE';
        this.patrolWaitTimer = 2.0 + Math.random() * 3.0;
      } else {
        const patrolDir = toPatrol.normalize();
        this.smoothTurnTowards(patrolDir, dt, 8.0);
        this.position.addScaledVector(patrolDir, this.speed * 0.42 * dt);

        // Calm, watchful patrol walk cycle
        this.torso.position.y = (this.type === 'akatsuki' ? 1.05 : 1.1) + Math.abs(Math.sin(time * 2.2)) * 0.03;
        this.torso.rotation.set(0.06, Math.sin(time * 1.1) * 0.04, 0);
        this.head.rotation.set(-0.02, 0, 0);
        this.lLeg.rotation.x = Math.sin(time * 2.2) * 0.48;
        this.rLeg.rotation.x = -Math.sin(time * 2.2) * 0.48;
        this.lArm.rotation.set(-Math.sin(time * 2.2) * 0.35, 0, 0.12);
        this.rArm.rotation.set(Math.sin(time * 2.2) * 0.35, 0, -0.12);
      }

      if (arena) arena.clampPosition(this.position, 0.5);
      this.group.position.copy(this.position);
      this.group.rotation.y = this.rotationY;
      return;
    }

    // 6. COMBAT: CHASE / ATTACK / FIREBALL (Active engagement)
    const toPlayer = player.position.clone().sub(this.position).setY(0);
    const dir = toPlayer.clone().normalize();
    this.smoothTurnTowards(dir, dt, 14.0);

    // Fireball skill (Akatsuki only)
    if (this.type === 'akatsuki' && this.fireballCooldown <= 0 && distToPlayer > 5 && distToPlayer < 22) {
      this.fireballCooldown = 7.0;
      this.aiState = 'FIREBALL';
      this.state = 'FIREBALL';
      sound.playHandSeal();

      this.rArm.rotation.set(-1.15, -0.35, 0.35);
      this.lArm.rotation.set(-1.15, 0.35, -0.35);

      setTimeout(() => {
        if (!this.isDead && onSpawnFireball) {
          const spawnPt = this.position.clone().add(dir.clone().multiplyScalar(1.2)).setY(1.4);
          onSpawnFireball(spawnPt, dir);
        }
        this.aiState = 'CHASE';
        this.state = 'CHASE';
        this.rArm.rotation.set(0, 0, 0);
        this.lArm.rotation.set(0, 0, 0);
      }, 550);
      return;
    }

    if (this.aiState === 'FIREBALL') return;

    // Procedural Attack Animation Processing
    if (this.isAttacking) {
      this.attackProgress += dt / this.attackDuration;
      const p = this.attackProgress;

      if (this.attackType === 0) {
        // Horizontal Weapon Slash / Heavy Hook Sweep
        if (p < 0.35) {
          const w = p / 0.35;
          this.torso.rotation.y = 0.48 * w;
          this.torso.rotation.x = -0.08 * w;
          this.rArm.rotation.set(-0.35 * w, -0.55 * w, -0.28 * w);
          this.lArm.rotation.set(-0.55 * w, 0, 0.25 * w);
        } else if (p < 0.72) {
          const s = (p - 0.35) / 0.37;
          this.torso.rotation.y = 0.48 - 1.05 * s;
          this.torso.rotation.x = 0.22 * Math.sin(s * Math.PI);
          this.rArm.rotation.set(-1.48 - 0.12 * Math.sin(s * Math.PI), 0.65 * s, 0.35 * s);
          this.lArm.rotation.set(0.15 * s, 0, 0.2);

          // Damage check at apex of swing
          if (p >= 0.48 && !this.hasDealtDamage) {
            this.hasDealtDamage = true;
            if (distToPlayer <= this.attackRange + 0.8) {
              player.takeDamage(this.attackDamage);
              if (onPlayerHit) onPlayerHit(this.attackDamage);
              this.vfx.spawnHitSparks(player.position.clone().setY(player.position.y + 1.0), false);
            }
          }
        } else {
          const r = (p - 0.72) / 0.28;
          const rec = 1 - r;
          this.torso.rotation.y = -0.57 * rec;
          this.torso.rotation.x = 0;
          this.rArm.rotation.set(-1.48 * rec, 0.65 * rec, 0.35 * rec);
          this.lArm.rotation.set(0.15 * rec, 0, 0.2 * rec);
        }
      } else {
        // Overhead Cleave / Downward Vertical Strike
        if (p < 0.38) {
          const w = p / 0.38;
          this.torso.rotation.x = -0.28 * w;
          this.torso.rotation.y = 0;
          this.rArm.rotation.set(-2.15 * w, 0, 0.15 * w);
          this.lArm.rotation.set(-1.6 * w, 0, -0.15 * w);
        } else if (p < 0.75) {
          const s = (p - 0.38) / 0.37;
          this.torso.rotation.x = -0.28 + 0.58 * s;
          this.rArm.rotation.set(-0.45, 0, 0);
          this.lArm.rotation.set(-0.45, 0, 0);

          if (p >= 0.52 && !this.hasDealtDamage) {
            this.hasDealtDamage = true;
            if (distToPlayer <= this.attackRange + 0.8) {
              player.takeDamage(this.attackDamage * 1.3);
              if (onPlayerHit) onPlayerHit(this.attackDamage * 1.3);
              this.vfx.spawnHitSparks(player.position.clone().setY(player.position.y + 1.0), true);
            }
          }
        } else {
          const r = (p - 0.75) / 0.25;
          const rec = 1 - r;
          this.torso.rotation.x = 0.30 * rec;
          this.rArm.rotation.set(-0.45 * rec, 0, 0);
          this.lArm.rotation.set(-0.45 * rec, 0, 0);
        }
      }

      if (p >= 1.0) {
        this.isAttacking = false;
        this.attackCooldown = 1.2 + Math.random() * 0.8;
        this.torso.rotation.set(0, 0, 0);
        this.rArm.rotation.set(0, 0, 0);
        this.lArm.rotation.set(0, 0, 0);
      }
      return;
    }

    if (distToPlayer > this.attackRange) {
      this.state = 'CHASE';
      this.position.addScaledVector(dir, this.speed * dt);

      // Living organic walk cycle
      this.torso.position.y = (this.type === 'akatsuki' ? 1.05 : 1.1) + Math.abs(Math.sin(time * 3.2)) * 0.05;
      this.torso.rotation.x = 0.12;
      this.torso.rotation.y = Math.sin(time * 1.6) * 0.05;
      this.head.rotation.x = -0.05;

      this.lLeg.rotation.x = Math.sin(time * 3.2) * 0.75;
      this.rLeg.rotation.x = -Math.sin(time * 3.2) * 0.75;
      this.lArm.rotation.set(-Math.sin(time * 3.2) * 0.5, 0, 0.12);
      this.rArm.rotation.set(Math.sin(time * 3.2) * 0.5, 0, -0.12);

    } else {
      this.state = 'ATTACK';
      // Trigger attack if off cooldown
      if (this.attackCooldown <= 0 && !this.isAttacking) {
        this.isAttacking = true;
        this.attackProgress = 0;
        this.attackType = Math.random() > 0.45 ? 1 : 0;
        this.attackDuration = this.type === 'akatsuki' ? 0.65 : 0.48;
        this.hasDealtDamage = false;
        sound.playHit(false);

        // Slight forward step into the attack
        this.position.addScaledVector(dir, 0.45);
      } else {
        // Idle combat stance
        this.torso.rotation.set(0.05, 0, 0);
        this.lArm.rotation.set(-0.35, 0, 0.2);
        this.rArm.rotation.set(-0.35, 0, -0.2);
        this.lLeg.rotation.set(0.1, 0, 0);
        this.rLeg.rotation.set(-0.1, 0, 0);
      }
    }

    if (arena) {
      arena.clampPosition(this.position, 0.5);
    }

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }

  takeDamage(amount, knockbackVel) {
    if (this.isDead) return;

    this.hp = Math.max(0, this.hp - amount);
    this.hpFill.scale.x = Math.max(0.01, this.hp / this.maxHp);

    // If attacked while on patrol or returning, immediately aggro and engage player
    if (this.aiState === 'PATROL' || this.aiState === 'PATROL_IDLE' || this.aiState === 'RETURN') {
      this.aiState = 'CHASE';
      this.state = 'CHASE';
    }

    if (knockbackVel) {
      this.velocity.copy(knockbackVel);
      this.stunTime = 0.48;
    }

    this.group.traverse(child => {
      if (child.isMesh && child.material && child.material.color) {
        const orig = child.material.color.getHex();
        child.material.color.setHex(0xffffff);
        setTimeout(() => {
          if (child && child.material) child.material.color.setHex(orig);
        }, 80);
      }
    });

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.vfx.spawnSmokePoof(this.position, 28, 1.3);
    sound.playSmokePoof();
    this.scene.remove(this.group);
  }
}

// Interactive Pickups: Ichiraku Ramen, Chakra Scroll & Golden Ryo Coins
export class PickupItem {
  constructor(scene, pos, type = 'ramen', value = 25) {
    this.scene = scene;
    this.pos = pos.clone().setY(0.75);
    this.type = type;
    this.value = value;
    this.isCollected = false;

    this.buildModel();
  }

  buildModel() {
    this.group = new THREE.Group();
    this.group.position.copy(this.pos);

    if (this.type === 'ramen') {
      const bowlGeo = new THREE.CylinderGeometry(0.38, 0.22, 0.32, 20);
      const bowlMat = createToonMaterial(0xd32f2f);
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);

      const noodleGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 20);
      const noodleMat = createToonMaterial(0xfff59d);
      const noodles = new THREE.Mesh(noodleGeo, noodleMat);
      noodles.position.y = 0.16;

      const stickGeo = new THREE.CylinderGeometry(0.02, 0.015, 0.75, 8);
      const stickMat = createToonMaterial(0x8d6e63);
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.set(0.12, 0.26, 0);
      stick.rotation.z = 0.7;

      this.group.add(bowl, noodles, stick);
    } else if (this.type === 'ryo') {
      // Ancient Shinobi Golden Ryo (Ryō) Oval / Round Coin
      const goldMat = createToonMaterial(0xffd700, { roughness: 0.2 });
      const rimMat = createToonMaterial(0xffaa00, { roughness: 0.3 });
      const darkGoldMat = createToonMaterial(0xb8860b);

      const coinGroup = new THREE.Group();
      // Main Coin Disc
      const coinGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.06, 24);
      coinGeo.rotateX(Math.PI / 2);
      const coinMesh = new THREE.Mesh(coinGeo, goldMat);

      // Outer raised rim
      const rimGeo = new THREE.TorusGeometry(0.33, 0.035, 8, 24);
      const rimMesh = new THREE.Mesh(rimGeo, rimMat);

      // Traditional center square hole (ancient Mon / Ryo currency)
      const hole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.07), darkGoldMat);

      // Engraved Shinobi leaf marks on front and back
      const markGeo = new THREE.ConeGeometry(0.06, 0.12, 6);
      const mark1 = new THREE.Mesh(markGeo, darkGoldMat);
      mark1.position.set(0, 0.18, 0.035);
      const mark2 = new THREE.Mesh(markGeo, darkGoldMat);
      mark2.position.set(0, -0.18, 0.035);
      mark2.rotation.z = Math.PI;

      coinGroup.add(coinMesh, rimMesh, hole, mark1, mark2);
      this.group.add(coinGroup);

      // Sparkling aura glow
      const haloGeo = new THREE.SphereGeometry(0.46, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffea00,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });
      this.halo = new THREE.Mesh(haloGeo, haloMat);
      this.group.add(this.halo);
    } else {
      const rollGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.7, 16);
      const rollMat = createToonMaterial(0x00e5ff);
      const roll = new THREE.Mesh(rollGeo, rollMat);
      roll.rotation.z = Math.PI / 2;

      const endGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.09, 16);
      const endMat = createToonMaterial(0xffd600);
      const end1 = new THREE.Mesh(endGeo, endMat);
      end1.position.x = 0.38;
      end1.rotation.z = Math.PI / 2;
      const end2 = new THREE.Mesh(endGeo, endMat);
      end2.position.x = -0.38;
      end2.rotation.z = Math.PI / 2;

      this.group.add(roll, end1, end2);
    }

    this.scene.add(this.group);
  }

  update(dt, player, vfx, onCollectCallback) {
    if (this.isCollected) return;

    const time = performance.now() * 0.003;
    this.group.position.y = this.pos.y + Math.sin(time * 2.8) * 0.14;
    this.group.rotation.y += (this.type === 'ryo' ? 3.4 : 2.2) * dt;

    if (this.halo) {
      this.halo.rotation.x += 1.5 * dt;
      this.halo.rotation.z += 1.8 * dt;
    }

    const dist = player.position.distanceTo(this.group.position);

    // Magnetic pull towards player when close
    if (dist < 4.0 && dist > 1.2) {
      const pullDir = player.position.clone().add(new THREE.Vector3(0, 0.8, 0)).sub(this.group.position).normalize();
      this.group.position.addScaledVector(pullDir, 6.5 * dt);
    }

    if (dist < 1.8) {
      this.isCollected = true;
      if (this.type === 'ramen') {
        player.heal(80);
      } else if (this.type === 'ryo') {
        if (player.addRyo) {
          player.addRyo(this.value);
        } else {
          player.ryo = (player.ryo || 0) + this.value;
        }
        sound.playCoinPickup();
        if (vfx && vfx.spawnCoinSparkles) {
          vfx.spawnCoinSparkles(this.group.position);
        }
        if (onCollectCallback) {
          onCollectCallback(this.group.position, this.value);
        }
      } else {
        player.addChakra(75);
      }
      this.scene.remove(this.group);
    }
  }
}
