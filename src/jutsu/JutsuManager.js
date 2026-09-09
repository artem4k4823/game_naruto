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
      kyuubi: 0,
      rasenshuriken: 0,
      sage: 0
    };

    this.maxCooldowns = {
      shuriken: 0.55,
      clones: 10.0,
      rasengan: 5.0,
      kyuubi: 22.0,
      rasenshuriken: 8.0,
      sage: 35.0
    };

    // Tuned chakra costs
    this.chakraCosts = {
      shuriken: 6,
      clones: 25,
      rasengan: 30,
      kyuubi: 60,
      rasenshuriken: 45,
      sage: 55
    };

    this.shurikens = [];
    this.activeClones = [];
    this.rasenshurikens = [];
    this.bijuuDamas = [];
    this.kuramaCooldowns = { tailSweep: 0, roar: 0, bijuuDama: 0 };
    this.rasenganMesh = null;
    this.isRasenganActive = false;
    this.rasenganTimer = 0;

    this.buildRasenganMesh();
  }

  createRasenshurikenMesh() {
    const group = new THREE.Group();

    // Central Sphere Core (Dense Spiraling Pure Cyan Chakra)
    const coreGeo = new THREE.SphereGeometry(0.55, 20, 20);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const core = new THREE.Mesh(coreGeo, coreMat);

    const shellGeo = new THREE.SphereGeometry(0.85, 20, 20);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);

    // 4 Curved Aerodynamic Wind Blades in a Shuriken Cross
    const bladeGroup = new THREE.Group();
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 0xe0f7fa,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    for (let b = 0; b < 4; b++) {
      const angle = (b * Math.PI) / 2;
      const bladeGeo = new THREE.ConeGeometry(0.45, 1.8, 4);
      bladeGeo.rotateZ(Math.PI / 2);
      bladeGeo.scale(1.0, 0.15, 1.0);
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
      blade.rotation.y = -angle + 0.35;
      bladeGroup.add(blade);
    }

    // Outer Spinning Halo Ring
    const haloGeo = new THREE.TorusGeometry(1.6, 0.05, 8, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x80deea, transparent: true, opacity: 0.9 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;

    group.add(core, shell, bladeGroup, halo);
    group.userData = { bladeGroup, shell, halo };
    return group;
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

    const hasTajuu = this.naruto.hasSkill('tajuu_clones');
    const offsets = hasTajuu ? [
      new THREE.Vector3(-2.4, 0, -1),
      new THREE.Vector3(2.4, 0, -1),
      new THREE.Vector3(-4.2, 0, -2.2),
      new THREE.Vector3(4.2, 0, -2.2)
    ] : [
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
    this.rasenganTimer = 0.65;
    this.rasenganGroup.visible = true;

    const isOodama = this.naruto.hasSkill('oodama_rasengan');
    if (isOodama) {
      this.rasenganGroup.scale.set(1.9, 1.9, 1.9);
    } else {
      this.rasenganGroup.scale.set(1.0, 1.0, 1.0);
    }

    sound.startRasengan();
    this.naruto.state = 'RASENGAN_DASH';
    this.vfx.setSpeedLines(1.0);

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);
    this.naruto.velocity.copy(forward.multiplyScalar(isOodama ? 32 : 28));

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

  castRasenshuriken() {
    if (!this.naruto.hasSkill('rasenshuriken')) return false;
    if (this.cooldowns.rasenshuriken > 0) return false;
    if (this.naruto.chakra < this.chakraCosts.rasenshuriken) return false;

    this.naruto.chakra -= this.chakraCosts.rasenshuriken;
    this.cooldowns.rasenshuriken = this.maxCooldowns.rasenshuriken;

    sound.playRasenshurikenWhistle();
    if (this.naruto.triggerRasenshurikenPose) {
      this.naruto.triggerRasenshurikenPose();
    }

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);
    const spawnPos = this.naruto.position.clone().add(forward.clone().multiplyScalar(1.2)).setY(1.4);

    const mesh = this.createRasenshurikenMesh();
    mesh.position.copy(spawnPos);
    this.scene.add(mesh);

    const isEmpowered = this.naruto.isSageMode || this.naruto.isKyuubiMode;
    const baseDamage = isEmpowered ? 480 : 360;

    this.rasenshurikens.push({
      mesh,
      velocity: forward.multiplyScalar(24),
      life: 3.5,
      damage: baseDamage,
      pullRadius: 7.5,
      blastRadius: 9.0
    });

    this.vfx.setSpeedLines(0.65);
    setTimeout(() => this.vfx.setSpeedLines(0), 400);

    return true;
  }

  castSageMode() {
    if (!this.naruto.hasSkill('sage_mode')) return false;
    if (this.cooldowns.sage > 0) return false;
    if (this.naruto.chakra < this.chakraCosts.sage) return false;

    this.naruto.chakra -= this.chakraCosts.sage;
    this.cooldowns.sage = this.maxCooldowns.sage;

    this.naruto.activateSageMode();
    return true;
  }

  createBijuuDamaMesh() {
    const group = new THREE.Group();

    // 1. Ultra-dense black/violet chakra core
    const coreGeo = new THREE.SphereGeometry(2.2, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x0a0014 });
    const core = new THREE.Mesh(coreGeo, coreMat);

    // 2. Swirling glowing crimson/red wireframe shell
    const shellGeo = new THREE.SphereGeometry(2.65, 22, 22);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xff1744,
      wireframe: true,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);

    // 3. Dual perpendicular orbit rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.14, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0xff3d00, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending })
    );
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.14, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending })
    );
    ring2.rotation.x = Math.PI / 2;

    group.add(core, shell, ring1, ring2);
    group.userData = { shell, ring1, ring2 };
    return group;
  }

  castKuramaTailSweep(enemiesList, onEnemyHit) {
    if (this.kuramaCooldowns.tailSweep > 0) return false;
    this.kuramaCooldowns.tailSweep = 3.5;

    this.naruto.executeKuramaTailSweep((center, radius, dmg, isFinisher, key) => {
      this.dealAreaDamage(center, radius, dmg, isFinisher, key, enemiesList, onEnemyHit);
    });
    return true;
  }

  castKuramaRoar(enemiesList, onEnemyHit) {
    if (this.kuramaCooldowns.roar > 0) return false;
    this.kuramaCooldowns.roar = 2.8;

    this.naruto.executeKuramaRoar((center, radius, dmg, isFinisher, key) => {
      this.dealAreaDamage(center, radius, dmg, isFinisher, key, enemiesList, onEnemyHit);
    });
    return true;
  }

  castKuramaBijuuDama() {
    if (this.kuramaCooldowns.bijuuDama > 0) return false;
    this.kuramaCooldowns.bijuuDama = 6.0;

    this.naruto.executeKuramaBijuuDama((projData) => {
      const mesh = this.createBijuuDamaMesh();
      mesh.position.copy(projData.pos);
      this.scene.add(mesh);

      this.bijuuDamas.push({
        mesh,
        velocity: projData.dir.clone().multiplyScalar(projData.speed),
        life: 3.5,
        damage: projData.damage,
        blastRadius: projData.blastRadius
      });
    });
    return true;
  }

  dealAreaDamage(center, radius, dmg, isFinisher, key, enemiesList, onEnemyHit) {
    if (!enemiesList) return;
    for (const enemy of enemiesList) {
      if (enemy.isDead) continue;
      const dist = enemy.position.distanceTo(center);
      if (dist <= radius) {
        const knockback = enemy.position.clone().sub(this.naruto.position).normalize().setY(0.6).multiplyScalar(28);
        enemy.takeDamage(dmg, knockback);
        if (this.vfx) {
          this.vfx.spawnHitSparks(enemy.position.clone().setY(enemy.position.y + 1.2), true);
        }
        if (onEnemyHit) onEnemyHit(enemy, dmg, isFinisher);
      }
    }
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
      const isOodama = this.naruto.hasSkill('oodama_rasengan');
      const hitRadius = isOodama ? 4.2 : 2.6;

      for (const enemy of enemiesList) {
        if (enemy.isDead) continue;
        const dist = enemy.position.distanceTo(attackPos);
        if (dist < hitRadius) {
          let dmg = this.naruto.isKyuubiMode ? 240 : 140;
          if (isOodama) dmg = Math.floor(dmg * 1.6);
          if (this.naruto.isSageMode) dmg = Math.floor(dmg * 1.4);

          this.vfx.spawnRasenganExplosion(attackPos);
          sound.playRasenganDetonate();

          const knockbackDir = enemy.position.clone().sub(this.naruto.position).normalize().setY(0.7);
          enemy.takeDamage(dmg, knockbackDir.multiplyScalar(isOodama ? 28 : 22));
          if (onEnemyHit) onEnemyHit(enemy, dmg, true);

          hitSomething = true;
          if (!isOodama) break;
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
          let dmg = s.damage;
          if (this.naruto.hasSkill('razor_edge')) dmg = Math.floor(dmg * 1.35);
          if (this.naruto.isSageMode) dmg = Math.floor(dmg * 1.35);

          enemy.takeDamage(dmg, s.velocity.clone().normalize().multiplyScalar(5));
          this.vfx.spawnHitSparks(s.mesh.position, false);
          sound.playShurikenHit();
          if (onEnemyHit) onEnemyHit(enemy, dmg, false);
          collided = true;
          break;
        }
      }

      if (collided || s.life <= 0) {
        this.scene.remove(s.mesh);
        this.shurikens.splice(i, 1);
      }
    }

    // Update Rasenshurikens
    for (let i = this.rasenshurikens.length - 1; i >= 0; i--) {
      const rs = this.rasenshurikens[i];
      rs.life -= dt;
      rs.mesh.position.addScaledVector(rs.velocity, dt);

      // Fast aerodynamic spinning
      if (rs.mesh.userData.bladeGroup) {
        rs.mesh.userData.bladeGroup.rotation.y += 50 * dt;
      }
      if (rs.mesh.userData.shell) {
        rs.mesh.userData.shell.rotation.y -= 25 * dt;
      }
      if (rs.mesh.userData.halo) {
        rs.mesh.userData.halo.rotation.z += 30 * dt;
      }

      // Wind trail wisps
      this.vfx.spawnChakraAuraWisp(rs.mesh.position, false);

      // Vortex vacuum pulling nearby enemies
      for (const enemy of enemiesList) {
        if (enemy.isDead) continue;
        const dist = enemy.position.distanceTo(rs.mesh.position);
        if (dist < rs.pullRadius) {
          const pullDir = rs.mesh.position.clone().sub(enemy.position).normalize();
          enemy.position.addScaledVector(pullDir, 9.5 * dt);

          // Micro wind cuts
          if (Math.random() < 0.22) {
            enemy.takeDamage(14, new THREE.Vector3(0, 1, 0));
            this.vfx.spawnHitSparks(enemy.position.clone().setY(1.0), false);
            if (onEnemyHit) onEnemyHit(enemy, 14, false);
          }
        }
      }

      // Check detonation trigger (direct hit or timer run out)
      let detonated = false;
      for (const enemy of enemiesList) {
        if (enemy.isDead) continue;
        if (enemy.position.distanceTo(rs.mesh.position) < 2.2) {
          detonated = true;
          break;
        }
      }

      if (detonated || rs.life <= 0) {
        // Massive Rasenshuriken Vortex Detonation!
        this.vfx.spawnRasenshurikenVortex(rs.mesh.position);
        sound.playRasenshurikenDetonate();
        this.vfx.triggerScreenShake(0.65, 0.45);

        for (const enemy of enemiesList) {
          if (enemy.isDead) continue;
          const blastDist = enemy.position.distanceTo(rs.mesh.position);
          if (blastDist < rs.blastRadius) {
            const blastFalloff = Math.max(0.4, 1 - (blastDist / rs.blastRadius) * 0.5);
            const finalDmg = Math.floor(rs.damage * blastFalloff);
            const launchDir = enemy.position.clone().sub(rs.mesh.position).normalize().setY(1.8).normalize();
            enemy.takeDamage(finalDmg, launchDir.multiplyScalar(32));
            if (onEnemyHit) onEnemyHit(enemy, finalDmg, true);
          }
        }

        this.scene.remove(rs.mesh);
        this.rasenshurikens.splice(i, 1);
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

    // Update Kurama Cooldowns
    for (const key in this.kuramaCooldowns) {
      if (this.kuramaCooldowns[key] > 0) {
        this.kuramaCooldowns[key] = Math.max(0, this.kuramaCooldowns[key] - dt);
      }
    }

    // Update Bijuu Damas
    for (let i = this.bijuuDamas.length - 1; i >= 0; i--) {
      const bd = this.bijuuDamas[i];
      bd.life -= dt;
      bd.mesh.position.addScaledVector(bd.velocity, dt);

      if (bd.mesh.userData.shell) bd.mesh.userData.shell.rotation.y += 18 * dt;
      if (bd.mesh.userData.ring1) bd.mesh.userData.ring1.rotation.z += 12 * dt;
      if (bd.mesh.userData.ring2) bd.mesh.userData.ring2.rotation.y -= 15 * dt;

      let explode = false;
      if (bd.mesh.position.y <= 0.8 || bd.life <= 0) {
        explode = true;
      } else {
        for (const enemy of enemiesList) {
          if (enemy.isDead) continue;
          if (enemy.position.distanceTo(bd.mesh.position) < 3.2) {
            explode = true;
            break;
          }
        }
      }

      if (explode) {
        const boomPos = bd.mesh.position.clone();
        if (this.vfx && this.vfx.spawnBijuuDamaExplosion) {
          this.vfx.spawnBijuuDamaExplosion(boomPos);
        }
        sound.playBijuuDamaExplosion();

        for (const enemy of enemiesList) {
          if (enemy.isDead) continue;
          const dist = enemy.position.distanceTo(boomPos);
          if (dist <= bd.blastRadius) {
            const effDmg = Math.floor(bd.damage * Math.max(0.4, 1.0 - dist / (bd.blastRadius * 1.1)));
            const knockback = enemy.position.clone().sub(boomPos).normalize().setY(0.8).multiplyScalar(38);
            enemy.takeDamage(effDmg, knockback);
            if (onEnemyHit) onEnemyHit(enemy, effDmg, true);
          }
        }

        this.scene.remove(bd.mesh);
        this.bijuuDamas.splice(i, 1);
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
