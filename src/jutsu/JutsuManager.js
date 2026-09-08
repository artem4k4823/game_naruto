// Jutsu System: Rasengan, Shadow Clones, Shurikens, and Kyuubi Cloak (Smooth models & tuned costs)
import * as THREE from 'three';
import { sound } from '../audio/SoundFX.js';
import { createToonMaterial } from '../vfx/AnimeVFX.js';

export class JutsuManager {
  constructor(scene, vfx, naruto) {
    this.scene = scene;
    this.vfx = vfx;
    this.naruto = naruto;

    // Cooldowns (in seconds)
    this.cooldowns = {
      shuriken: 0,
      clones: 0,
      rasengan: 0,
      kyuubi: 0
    };

    this.maxCooldowns = {
      shuriken: 0.55,
      clones: 10.0,
      rasengan: 5.0,
      kyuubi: 22.0
    };

    // More generous chakra costs!
    this.chakraCosts = {
      shuriken: 6,
      clones: 25,
      rasengan: 30,
      kyuubi: 60
    };

    this.shurikens = [];
    this.activeClones = [];
    this.rasenganMesh = null;
    this.isRasenganActive = false;
    this.rasenganTimer = 0;

    this.buildRasenganMesh();
  }

  buildRasenganMesh() {
    this.rasenganGroup = new THREE.Group();

    const coreGeo = new THREE.SphereGeometry(0.24, 18, 18);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);

    const shellGeo = new THREE.SphereGeometry(0.42, 18, 18);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.rasenganShell = new THREE.Mesh(shellGeo, shellMat);

    this.ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.025, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x80d8ff })
    );
    this.ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.025, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    this.ring2.rotation.x = Math.PI / 2;

    this.rasenganGroup.add(core, this.rasenganShell, this.ring1, this.ring2);
    this.rasenganGroup.visible = false;
    this.naruto.rasenganAnchor.add(this.rasenganGroup);
  }

  castShuriken() {
    if (this.cooldowns.shuriken > 0) return false;
    if (this.naruto.chakra < this.chakraCosts.shuriken) return false;

    this.naruto.chakra -= this.chakraCosts.shuriken;
    this.cooldowns.shuriken = this.maxCooldowns.shuriken;

    sound.playShurikenThrow();

    const angles = [-0.12, 0, 0.12];
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);

    angles.forEach(offsetAngle => {
      const dir = forward.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), offsetAngle).normalize();
      const spawnPos = this.naruto.position.clone().add(dir.clone().multiplyScalar(0.8)).setY(1.2);

      const shurikenGroup = new THREE.Group();
      shurikenGroup.position.copy(spawnPos);

      const starGeo = new THREE.BoxGeometry(0.34, 0.02, 0.08);
      const starGeo2 = new THREE.BoxGeometry(0.08, 0.02, 0.34);
      const metalMat = createToonMaterial(0x546e7a, { roughness: 0.2 });

      const blade1 = new THREE.Mesh(starGeo, metalMat);
      const blade2 = new THREE.Mesh(starGeo2, metalMat);
      const centerHole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 8), createToonMaterial(0x212121));

      shurikenGroup.add(blade1, blade2, centerHole);
      this.scene.add(shurikenGroup);

      this.shurikens.push({
        mesh: shurikenGroup,
        velocity: dir.multiplyScalar(30),
        life: 1.6,
        damage: (this.naruto.isKyuubiMode ? 55 : 32)
      });
    });

    return true;
  }

  castShadowClones(enemiesList) {
    if (this.cooldowns.clones > 0) return false;
    if (this.naruto.chakra < this.chakraCosts.clones) return false;

    this.naruto.chakra -= this.chakraCosts.clones;
    this.cooldowns.clones = this.maxCooldowns.clones;

    sound.playHandSeal();
    setTimeout(() => sound.playSmokePoof(), 100);

    const offsets = [
      new THREE.Vector3(-2.4, 0, -1),
      new THREE.Vector3(2.4, 0, -1)
    ];

    offsets.forEach(offset => {
      const worldOffset = offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);
      const spawnPos = this.naruto.position.clone().add(worldOffset);

      this.vfx.spawnSmokePoof(spawnPos, 22, 1.2);
      const clone = new ShadowClone(this.scene, this.vfx, spawnPos, this.naruto);
      this.activeClones.push(clone);
    });

    return true;
  }

  castRasengan() {
    if (this.cooldowns.rasengan > 0 || this.isRasenganActive) return false;
    if (this.naruto.chakra < this.chakraCosts.rasengan) return false;

    this.naruto.chakra -= this.chakraCosts.rasengan;
    this.cooldowns.rasengan = this.maxCooldowns.rasengan;

    this.isRasenganActive = true;
    this.rasenganTimer = 0.6;
    this.rasenganGroup.visible = true;

    sound.startRasengan();
    this.naruto.state = 'RASENGAN_DASH';
    this.vfx.setSpeedLines(1.0);

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);
    this.naruto.velocity.copy(forward.multiplyScalar(28));

    return true;
  }

  castKyuubiMode() {
    if (this.cooldowns.kyuubi > 0) return false;
    if (this.naruto.chakra < this.chakraCosts.kyuubi) return false;

    this.naruto.chakra -= this.chakraCosts.kyuubi;
    this.cooldowns.kyuubi = this.maxCooldowns.kyuubi;

    this.naruto.activateKyuubiMode();
    return true;
  }

  update(dt, enemiesList, onEnemyHit) {
    for (const key in this.cooldowns) {
      if (this.cooldowns[key] > 0) {
        this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
      }
    }

    // Update Rasengan
    if (this.isRasenganActive) {
      this.rasenganTimer -= dt;
      this.rasenganShell.rotation.y += 20 * dt;
      this.ring1.rotation.x += 16 * dt;
      this.ring2.rotation.y += 18 * dt;

      this.vfx.spawnChakraAuraWisp(this.naruto.position, this.naruto.isKyuubiMode);

      const attackPos = this.naruto.getAttackCenter();
      let hitSomething = false;

      for (const enemy of enemiesList) {
        if (enemy.isDead) continue;
        const dist = enemy.position.distanceTo(attackPos);
        if (dist < 2.6) {
          const dmg = this.naruto.isKyuubiMode ? 240 : 140;
          this.vfx.spawnRasenganExplosion(attackPos);
          sound.playRasenganDetonate();

          const knockbackDir = enemy.position.clone().sub(this.naruto.position).normalize().setY(0.7);
          enemy.takeDamage(dmg, knockbackDir.multiplyScalar(22));
          if (onEnemyHit) onEnemyHit(enemy, dmg, true);

          hitSomething = true;
          break;
        }
      }

      if (hitSomething || this.rasenganTimer <= 0) {
        this.isRasenganActive = false;
        this.rasenganGroup.visible = false;
        sound.stopRasengan();
        this.naruto.state = 'IDLE';
        this.vfx.setSpeedLines(0);
      }
    }

    // Update Shurikens
    for (let i = this.shurikens.length - 1; i >= 0; i--) {
      const s = this.shurikens[i];
      s.life -= dt;
      s.mesh.position.addScaledVector(s.velocity, dt);
      s.mesh.rotation.y += 35 * dt;

      let collided = false;
      for (const enemy of enemiesList) {
        if (enemy.isDead) continue;
        if (enemy.position.clone().setY(1.0).distanceTo(s.mesh.position) < 1.5) {
          enemy.takeDamage(s.damage, s.velocity.clone().normalize().multiplyScalar(5));
          this.vfx.spawnHitSparks(s.mesh.position, false);
          sound.playShurikenHit();
          if (onEnemyHit) onEnemyHit(enemy, s.damage, false);
          collided = true;
          break;
        }
      }

      if (collided || s.life <= 0) {
        this.scene.remove(s.mesh);
        this.shurikens.splice(i, 1);
      }
    }

    // Update Shadow Clones
    for (let i = this.activeClones.length - 1; i >= 0; i--) {
      const clone = this.activeClones[i];
      clone.update(dt, enemiesList, onEnemyHit);
      if (clone.isDead) {
        this.activeClones.splice(i, 1);
      }
    }
  }
}

// Organic Smooth Shadow Clone
class ShadowClone {
  constructor(scene, vfx, spawnPos, player) {
    this.scene = scene;
    this.vfx = vfx;
    this.player = player;
    this.position = spawnPos.clone();
    this.velocity = new THREE.Vector3();
    this.rotationY = player.rotationY;
    this.life = 25;
    this.hp = 60;
    this.isDead = false;
    this.attackCooldown = 0;

    this.buildCloneModel();
  }

  buildCloneModel() {
    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    const orangeMat = createToonMaterial(0xff9100);
    const skinMat = createToonMaterial(0xffcc80);
    const navyMat = createToonMaterial(0x1a237e);
    const hairMat = createToonMaterial(0xffeb3b);

    // Smooth Torso
    this.torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.65, 14), orangeMat);
    this.torso.position.y = 1.1;
    this.group.add(this.torso);

    // Smooth Head
    this.head = new THREE.Group();
    this.head.position.y = 0.62;
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 12), skinMat);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.12, 14), navyMat);
    band.position.y = 0.1;
    const hair = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.32, 6), hairMat);
    hair.position.y = 0.32;

    this.head.add(headMesh, band, hair);
    this.torso.add(this.head);

    // Smooth Limbs
    const armGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.6, 10);
    this.lArm = new THREE.Mesh(armGeo, orangeMat);
    this.lArm.position.set(-0.42, 0.1, 0);

    this.rArm = new THREE.Mesh(armGeo, orangeMat);
    this.rArm.position.set(0.42, 0.1, 0);
    this.torso.add(this.lArm, this.rArm);

    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.7, 10);
    this.lLeg = new THREE.Mesh(legGeo, orangeMat);
    this.lLeg.position.set(-0.18, -0.65, 0);

    this.rLeg = new THREE.Mesh(legGeo, orangeMat);
    this.rLeg.position.set(0.18, -0.65, 0);
    this.torso.add(this.lLeg, this.rLeg);

    this.scene.add(this.group);
  }

  update(dt, enemiesList, onEnemyHit) {
    if (this.isDead) return;

    this.life -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    if (this.life <= 0 || this.hp <= 0) {
      this.destroy();
      return;
    }

    let nearestEnemy = null;
    let minDist = 30;

    for (const enemy of enemiesList) {
      if (enemy.isDead) continue;
      const d = this.position.distanceTo(enemy.position);
      if (d < minDist) {
        minDist = d;
        nearestEnemy = enemy;
      }
    }

    const time = performance.now() * 0.007;

    if (nearestEnemy) {
      const dir = nearestEnemy.position.clone().sub(this.position).setY(0).normalize();
      this.rotationY = Math.atan2(dir.x, dir.z);

      if (minDist > 1.9) {
        this.position.addScaledVector(dir, 10.0 * dt);
        this.lLeg.rotation.x = Math.sin(time * 3) * 0.7;
        this.rLeg.rotation.x = -Math.sin(time * 3) * 0.7;
        this.lArm.rotation.x = -0.9;
        this.rArm.rotation.x = -0.9;
      } else {
        if (this.attackCooldown <= 0) {
          this.attackCooldown = 0.55;
          this.rArm.rotation.x = 1.4;
          nearestEnemy.takeDamage(20, dir.multiplyScalar(4));
          this.vfx.spawnHitSparks(this.position.clone().add(dir.multiplyScalar(1.2)).setY(1.0), false);
          sound.playHit(false);
          if (onEnemyHit) onEnemyHit(nearestEnemy, 20, false);

          setTimeout(() => {
            if (this.rArm) this.rArm.rotation.x = 0;
          }, 200);
        }
      }
    } else {
      const dToPlayer = this.position.distanceTo(this.player.position);
      if (dToPlayer > 4.0) {
        const dir = this.player.position.clone().sub(this.position).setY(0).normalize();
        this.rotationY = Math.atan2(dir.x, dir.z);
        this.position.addScaledVector(dir, 10.0 * dt);
      }
    }

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotationY;
  }

  destroy() {
    this.isDead = true;
    this.vfx.spawnSmokePoof(this.position, 18, 1.1);
    sound.playSmokePoof();
    this.scene.remove(this.group);
  }
}
