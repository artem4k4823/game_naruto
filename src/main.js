// Naruto: Shinobi Chronicles 3D - Konoha Village, Chakra Wall-Running & Rooftop Parkour
import * as THREE from 'three';
import { KonohaCity } from './world/KonohaCity.js';
import { AnimeVFX } from './vfx/AnimeVFX.js';
import { Naruto } from './character/Naruto.js';
import { JutsuManager } from './jutsu/JutsuManager.js';
import { Enemy, PickupItem } from './character/Enemy.js';
import { HUD } from './ui/HUD.js';
import { sound } from './audio/SoundFX.js';

// Dedicated Shinobi Patrol Zones across Konoha Village and the Great Outer Forest
export const PATROL_ZONES = [
  {
    id: 'hokage_plaza',
    name: 'Площадь Хокаге (Hokage Plaza)',
    center: new THREE.Vector3(0, 0, -32),
    patrolRadius: 22,
    leashRadius: 36
  },
  {
    id: 'south_district',
    name: 'Южный Квартал и Ворота (South District)',
    center: new THREE.Vector3(0, 0, 55),
    patrolRadius: 22,
    leashRadius: 36
  },
  {
    id: 'torii_shrine',
    name: 'Святилище Тории & Полигон 44 (Torii Shrine)',
    center: new THREE.Vector3(18, 0, 220),
    patrolRadius: 25,
    leashRadius: 40
  },
  {
    id: 'waterfall_gorge',
    name: 'Ущелье Водопада & Мост (Waterfall Gorge)',
    center: new THREE.Vector3(-95, 0, 205),
    patrolRadius: 24,
    leashRadius: 38
  },
  {
    id: 'watchtower_outpost',
    name: 'Дозорная Вышка в Лесу (Watchtower Outpost)',
    center: new THREE.Vector3(125, 0, 175),
    patrolRadius: 24,
    leashRadius: 38
  },
  {
    id: 'deep_forest_grove',
    name: 'Тайный Привал в Глуши (Deep Forest Grove)',
    center: new THREE.Vector3(-40, 0, 275),
    patrolRadius: 22,
    leashRadius: 36
  }
];

class Game {
  constructor() {
    this.container = document.getElementById('game-container');

    // Stats
    this.wave = 1;
    this.kills = 0;
    this.score = 0;
    this.comboStreak = 0;
    this.isPaused = false;

    // Entities
    this.enemies = [];
    this.pickups = [];
    this.fireballs = [];

    // Inputs
    this.keys = {
      w: false, a: false, s: false, d: false,
      space: false, shift: false, c: false
    };

    // AAA Camera Orbit
    this.camYaw = Math.PI;
    this.camPitch = 0.28;
    this.camDistance = 6.8;
    this.mouseSensitivity = 0.0035;
    this.lastMouseX = null;
    this.lastMouseY = null;
    this.isPointerLocked = false;

    this.initThree();
    this.initSystems();
    this.initPauseMenu();
    this.initInputs();
    this.startWave(1);

    // Game loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x64b5f6);
    this.scene.fog = new THREE.FogExp2(0xb0bec5, 0.0026); // Extended atmospheric view distance for Konoha + Forest!

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      650
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.container.appendChild(this.renderer.domElement);

    // Vibrant Anime Sunlight for Konoha Village and Great Forest
    const sunLight = new THREE.DirectionalLight(0xfff8e1, 1.95);
    sunLight.position.set(60, 120, 90);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 480;
    sunLight.shadow.camera.left = -160;
    sunLight.shadow.camera.right = 160;
    sunLight.shadow.camera.top = 160;
    sunLight.shadow.camera.bottom = -160;
    this.scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0xb3e5fc, 0.95);
    this.scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0xffd54f, 0.85);
    rimLight.position.set(-35, 30, -50);
    this.scene.add(rimLight);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initSystems() {
    this.vfx = new AnimeVFX(this.scene);
    this.city = new KonohaCity(this.scene);
    this.naruto = new Naruto(this.scene, this.vfx);
    this.jutsu = new JutsuManager(this.scene, this.vfx, this.naruto);
    this.hud = new HUD(this.camera);
  }

  initPauseMenu() {
    this.pauseOverlay = document.createElement('div');
    this.pauseOverlay.id = 'pause-overlay';
    this.pauseOverlay.className = 'modal-overlay hidden';
    this.pauseOverlay.innerHTML = `
      <div class="scroll-modal" style="max-width: 480px;">
        <div class="scroll-content">
          <h1 class="modal-title" style="font-size: 34px;">ПАУЗА (PAUSE)</h1>
          <p class="modal-subtitle">Курсор свободен. Нажмите кнопку или кликните по экрану, чтобы продолжить битву!</p>

          <div class="modal-volume-box" style="margin: 16px 0;">
            <div class="modal-volume-header">
              <span>🎵 Громкость музыки и звуков:</span>
              <span id="pause-vol-val" class="modal-vol-val">60%</span>
            </div>
            <div class="modal-slider-row">
              <button id="pause-btn-mute" class="hud-btn small-btn" title="Звук">🔊</button>
              <input type="range" id="pause-volume-slider" min="0" max="1" step="0.01" value="0.6" class="anime-slider" />
            </div>
          </div>

          <button id="btn-resume" class="btn-action" style="font-size: 22px; padding: 10px 32px;">ПРОДОЛЖИТЬ</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.pauseOverlay);

    const btnResume = document.getElementById('btn-resume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        this.resumeGame();
      });
    }

    const pauseSlider = document.getElementById('pause-volume-slider');
    const pauseMute = document.getElementById('pause-btn-mute');

    if (pauseSlider) {
      pauseSlider.value = sound.volume;
      pauseSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        sound.init();
        sound.setVolume(val);
        if (sound.isMuted && val > 0) sound.toggleMute();
        if (this.hud) this.hud.syncVolumeUI(val, sound.isMuted);
      });
    }

    if (pauseMute) {
      pauseMute.addEventListener('click', () => {
        const isSoundOn = sound.toggleMute();
        if (this.hud) this.hud.syncVolumeUI(sound.volume, !isSoundOn);
      });
    }
  }

  initInputs() {
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === document.body);
    });

    window.addEventListener('keydown', e => {
      sound.init();
      const code = e.code;

      if (code === 'Escape') {
        if (!this.isModalOpen() && !this.isPaused) {
          this.pauseGame();
        } else if (this.isPaused) {
          this.resumeGame();
        }
        return;
      }

      if (this.isPaused) return;

      if (code === 'KeyW') this.keys.w = true;
      if (code === 'KeyA') this.keys.a = true;
      if (code === 'KeyS') this.keys.s = true;
      if (code === 'KeyD') this.keys.d = true;
      if (code === 'Space') this.keys.space = true;
      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        if (!this.keys.shift) {
          this.keys.shift = true;
          this.naruto.triggerSprintDash();
        }
      }
      if (code === 'KeyC') {
        this.keys.c = true;
        this.naruto.isChargingChakra = true;
        this.naruto.state = 'CHARGE_CHAKRA';
      }

      if (code === 'Digit1') this.jutsu.castShuriken();
      if (code === 'Digit2' || code === 'KeyQ') this.jutsu.castShadowClones(this.enemies);
      if (code === 'Digit3' || code === 'KeyE') this.jutsu.castRasengan();
      if (code === 'Digit4' || code === 'KeyR') this.jutsu.castKyuubiMode();
    });

    window.addEventListener('keyup', e => {
      const code = e.code;
      if (code === 'KeyW') this.keys.w = false;
      if (code === 'KeyA') this.keys.a = false;
      if (code === 'KeyS') this.keys.s = false;
      if (code === 'KeyD') this.keys.d = false;
      if (code === 'Space') this.keys.space = false;
      if (code === 'ShiftLeft' || code === 'ShiftRight') this.keys.shift = false;
      if (code === 'KeyC') {
        this.keys.c = false;
        this.naruto.isChargingChakra = false;
        if (this.naruto.state === 'CHARGE_CHAKRA') this.naruto.state = 'IDLE';
      }
    });

    // AAA Direct Mouse Camera Movement
    window.addEventListener('mousemove', e => {
      if (this.isModalOpen() || this.isPaused) return;

      let dx = e.movementX;
      let dy = e.movementY;

      if (dx === undefined || (dx === 0 && dy === 0 && this.lastMouseX !== null)) {
        dx = e.clientX - this.lastMouseX;
        dy = e.clientY - this.lastMouseY;
      }
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (dx === undefined || dy === undefined) return;
      if (Math.abs(dx) > 120 || Math.abs(dy) > 120) return;

      this.camYaw -= dx * this.mouseSensitivity;
      this.camPitch = Math.max(-0.25, Math.min(1.15, this.camPitch + dy * this.mouseSensitivity));
    });

    window.addEventListener('click', e => {
      if (this.isPaused) {
        this.resumeGame();
        return;
      }

      if (!this.isModalOpen() && !e.target.closest('.skill-slot') && !e.target.closest('.hud-btn')) {
        try {
          if (document.body.requestPointerLock) {
            document.body.requestPointerLock();
          }
        } catch (err) {}
      }
    });

    // Mouse Attack Combos
    window.addEventListener('mousedown', e => {
      sound.init();
      if (this.isModalOpen() || this.isPaused || e.target.closest('.skill-slot') || e.target.closest('.hud-btn')) return;

      if (e.button === 0) {
        this.naruto.performAttack((hitCenter, radius, dmg, isFinisher, step) => {
          this.checkMeleeHits(hitCenter, radius, dmg, isFinisher, step);
        }, this.keys);
      } else if (e.button === 2) {
        this.jutsu.castShuriken();
      }
    });

    window.addEventListener('contextmenu', e => e.preventDefault());

    const slots = {
      'slot-shuriken': () => this.jutsu.castShuriken(),
      'slot-clones': () => this.jutsu.castShadowClones(this.enemies),
      'slot-rasengan': () => this.jutsu.castRasengan(),
      'slot-kyuubi': () => this.jutsu.castKyuubiMode()
    };

    for (const [id, fn] of Object.entries(slots)) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    }
  }

  pauseGame() {
    this.isPaused = true;
    if (document.exitPointerLock) {
      try { document.exitPointerLock(); } catch (e) {}
    }
    if (this.hud) this.hud.syncVolumeUI(sound.volume, sound.isMuted);
    if (this.pauseOverlay) this.pauseOverlay.classList.remove('hidden');
  }

  resumeGame() {
    this.isPaused = false;
    if (this.pauseOverlay) this.pauseOverlay.classList.add('hidden');
    try {
      if (document.body.requestPointerLock) {
        document.body.requestPointerLock();
      }
    } catch (e) {}
  }

  isModalOpen() {
    const startModal = document.getElementById('modal-overlay');
    const overModal = document.getElementById('game-over-modal');
    return (startModal && !startModal.classList.contains('hidden')) ||
           (overModal && !overModal.classList.contains('hidden'));
  }

  performDash() {
    if (this.naruto.chakra < 8) return;
    this.naruto.chakra -= 8;

    sound.playDash();
    this.vfx.spawnSmokePoof(this.naruto.position, 14, 0.8);
    this.vfx.setSpeedLines(0.85);
    setTimeout(() => this.vfx.setSpeedLines(0), 180);

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);
    this.naruto.position.addScaledVector(forward, 7.5);
    if (this.city) this.city.clampPosition(this.naruto.position, 0.6);
  }

  checkMeleeHits(hitCenter, radius, dmg, isFinisher, comboStep) {
    let hitAny = false;

    // 1. Training Yard Logs
    if (this.city && this.city.trainingLogs) {
      this.city.trainingLogs.forEach(log => {
        if (log.pos.distanceTo(hitCenter) < radius + log.radius) {
          hitAny = true;
          this.vfx.spawnHitSparks(log.pos, isFinisher);
          this.comboStreak++;
          this.hud.registerHit(this.comboStreak);
          this.hud.spawnDamageText(log.pos, dmg, isFinisher);
        }
      });
    }

    // 2. Enemies
    this.enemies.forEach(enemy => {
      if (enemy.isDead) return;
      const enemyPos = enemy.position.clone().setY(enemy.position.y + 1.0);
      if (enemyPos.distanceTo(hitCenter) < radius + 0.9) {
        hitAny = true;

        let knockPower = 6;
        let liftY = 0.1;
        if (comboStep === 3) { knockPower = 9; liftY = 0.05; }
        if (comboStep === 4) { knockPower = 7; liftY = 0.7; }
        if (comboStep === 5) { knockPower = 20; liftY = 0.8; }
        if (comboStep === 'RUN_1') { knockPower = 9; liftY = 0.12; }
        if (comboStep === 'RUN_2') { knockPower = 18; liftY = 0.50; }
        if (comboStep === 'RUN_3') { knockPower = 16; liftY = 0.35; }

        const knockDir = enemy.position.clone().sub(this.naruto.position).normalize().setY(liftY);
        enemy.takeDamage(dmg, knockDir.multiplyScalar(knockPower));

        this.vfx.spawnHitSparks(enemyPos, isFinisher);
        this.comboStreak++;
        this.hud.registerHit(this.comboStreak);
        this.hud.spawnDamageText(enemyPos, dmg, isFinisher);

        if (enemy.isDead) {
          this.handleEnemyDefeat(enemy);
        }
      }
    });

    if (hitAny) {
      this.vfx.triggerScreenShake(isFinisher ? 0.28 : 0.12, isFinisher ? 0.3 : 0.1);
    }
  }

  handleEnemyDefeat(enemy) {
    this.kills++;
    this.score += enemy.scoreValue;

    const dropRoll = Math.random();
    if (dropRoll < 0.5) {
      this.pickups.push(new PickupItem(this.scene, enemy.position, 'ramen'));
    } else if (dropRoll < 0.85) {
      this.pickups.push(new PickupItem(this.scene, enemy.position, 'scroll'));
    }

    const aliveCount = this.enemies.filter(e => !e.isDead).length;
    if (aliveCount === 0) {
      this.hud.showAnnouncement(`WAVE ${this.wave} CLEARED!`);
      setTimeout(() => {
        this.startWave(this.wave + 1);
      }, 2200);
    }
  }

  startWave(waveNumber) {
    this.wave = waveNumber;
    this.hud.showAnnouncement(`WAVE ${this.wave}: ПАТРУЛИ ШИНОБИ`);

    this.enemies = [];

    // Distribute Rogue Ninjas across all designated patrol zones
    const roguesPerZone = Math.max(1, 1 + Math.floor(waveNumber * 0.45));
    PATROL_ZONES.forEach(zone => {
      for (let i = 0; i < roguesPerZone; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (zone.patrolRadius * 0.75);
        const spawnPos = new THREE.Vector3(
          zone.center.x + Math.cos(angle) * dist,
          0,
          zone.center.z + Math.sin(angle) * dist
        );
        this.city.clampPosition(spawnPos, 0.6);
        this.enemies.push(new Enemy(this.scene, this.vfx, 'rogue', spawnPos, zone));
      }
    });

    // Deploy Akatsuki Enforcers to strategic patrol zones
    const akatsukiZones = [
      PATROL_ZONES[0], // Hokage Plaza
      PATROL_ZONES[2], // Torii Shrine & Training 44
      PATROL_ZONES[4], // Watchtower Outpost
      PATROL_ZONES[3], // Waterfall Gorge
      PATROL_ZONES[5]  // Deep Forest Grove
    ];

    const akatsukiCount = Math.max(1, Math.floor(waveNumber * 0.75));
    for (let i = 0; i < akatsukiCount; i++) {
      const zone = akatsukiZones[i % akatsukiZones.length];
      const spawnPos = new THREE.Vector3(
        zone.center.x + (Math.random() - 0.5) * 8,
        0,
        zone.center.z + (Math.random() - 0.5) * 8
      );
      this.city.clampPosition(spawnPos, 0.6);
      this.enemies.push(new Enemy(this.scene, this.vfx, 'akatsuki', spawnPos, zone));
    }
  }

  spawnFireball(pos, dir) {
    const fireballGeo = new THREE.SphereGeometry(0.6, 14, 14);
    const fireballMat = new THREE.MeshBasicMaterial({ color: 0xff3d00 });
    const mesh = new THREE.Mesh(fireballGeo, fireballMat);
    mesh.position.copy(pos);
    this.scene.add(mesh);

    this.fireballs.push({
      mesh: mesh,
      vel: dir.clone().multiplyScalar(13),
      life: 2.5
    });
  }

  updateCamera(dt = 0.016) {
    // Dynamic FOV for high-speed ninja sprinting
    const targetFov = (this.naruto && this.naruto.isSprinting) ? 68 : 55;
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1.0, 9 * dt);
      this.camera.updateProjectionMatrix();
    }

    // Third-person camera firmly following Naruto across ground and rooftops
    const targetPos = this.naruto.position.clone().add(new THREE.Vector3(0, 1.5, 0));

    const cx = targetPos.x + Math.sin(this.camYaw) * Math.cos(this.camPitch) * this.camDistance;
    const cy = targetPos.y + Math.sin(this.camPitch) * this.camDistance;
    const cz = targetPos.z + Math.cos(this.camYaw) * Math.cos(this.camPitch) * this.camDistance;

    const camPos = new THREE.Vector3(cx, cy, cz);
    if (this.city && this.city.resolveCameraPosition) {
      this.city.resolveCameraPosition(targetPos, camPos, 0.5);
    }

    this.camera.position.copy(camPos);
    this.camera.lookAt(targetPos.clone().add(new THREE.Vector3(0, 0.2, 0)));
  }

  restart() {
    this.wave = 1;
    this.kills = 0;
    this.score = 0;
    this.comboStreak = 0;
    this.isPaused = false;

    this.enemies.forEach(e => this.scene.remove(e.group));
    this.enemies = [];
    this.pickups.forEach(p => this.scene.remove(p.group));
    this.pickups = [];
    this.fireballs.forEach(f => this.scene.remove(f.mesh));
    this.fireballs = [];

    this.naruto.reset();
    this.startWave(1);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    if (this.isPaused) return;

    if (this.naruto.isDead) {
      this.hud.showGameOver(false, this.kills, this.score, this.wave, () => this.restart());
    }

    // Update Player with Konoha City (Chakra Wall Running & Rooftops)
    this.naruto.update(dt, this.keys, this.camYaw, this.city);

    // Update Jutsu
    this.jutsu.update(dt, this.enemies, (enemy, dmg, isCrit) => {
      this.vfx.spawnHitSparks(enemy.position.clone().setY(enemy.position.y + 1.0), isCrit);
      this.comboStreak++;
      this.hud.registerHit(this.comboStreak);
      this.hud.spawnDamageText(enemy.position, dmg, isCrit);
      if (enemy.isDead) this.handleEnemyDefeat(enemy);
    });

    // Update Enemies
    this.enemies.forEach(enemy => {
      enemy.update(
        dt,
        this.naruto,
        this.city,
        this.camera,
        dmg => {
          this.comboStreak = 0;
          this.hud.spawnDamageText(this.naruto.position, dmg, false);
        },
        (firePos, dir) => this.spawnFireball(firePos, dir)
      );
    });

    // Update Fireballs
    for (let i = this.fireballs.length - 1; i >= 0; i--) {
      const f = this.fireballs[i];
      f.life -= dt;
      f.mesh.position.addScaledVector(f.vel, dt);

      if (f.mesh.position.distanceTo(this.naruto.position.clone().setY(this.naruto.position.y + 1.0)) < 1.6) {
        this.vfx.spawnSmokePoof(f.mesh.position, 12, 0.8);
        this.naruto.takeDamage(3);
        this.vfx.spawnHitSparks(this.naruto.position.clone().setY(this.naruto.position.y + 1.0), true);
        this.scene.remove(f.mesh);
        this.fireballs.splice(i, 1);
        continue;
      }

      if (f.life <= 0) {
        this.scene.remove(f.mesh);
        this.fireballs.splice(i, 1);
      }
    }

    // Update Pickups
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.update(dt, this.naruto);
      if (p.isCollected) {
        this.pickups.splice(i, 1);
      }
    }

    // Update City & VFX
    this.city.update(dt);
    this.vfx.update(dt, this.camera);
    this.updateCamera(dt);

    // Hidden Chakra Spring healing & chakra restoration in the forest
    if (this.city && this.city.chakraSpringPos && this.naruto.position.distanceTo(this.city.chakraSpringPos) < 6.8) {
      this.naruto.addChakra(24 * dt);
      if (Math.random() < 0.28) {
        this.vfx.spawnChakraAuraWisp(this.naruto.position, false);
      }
    }

    const aliveEnemies = this.enemies.filter(e => !e.isDead).length;
    this.hud.updatePlayerStatus(this.naruto);
    this.hud.updateCooldowns(this.jutsu);
    this.hud.updateWave(this.wave, aliveEnemies, this.kills, this.score);
    this.hud.updateFloatingTexts(dt);

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
