// Naruto: Shinobi Chronicles 3D - Konoha Village, Chakra Wall-Running & Rooftop Parkour
import * as THREE from 'three';
import { KonohaCity } from './world/KonohaCity.js';
import { AnimeVFX } from './vfx/AnimeVFX.js';
import { Naruto } from './character/Naruto.js';
import { JutsuManager } from './jutsu/JutsuManager.js';
import { Enemy, PickupItem } from './character/Enemy.js';
import { HUD } from './ui/HUD.js';
import { sound } from './audio/SoundFX.js';
import { QuestManager } from './quest/QuestManager.js';
import { Minimap } from './ui/Minimap.js';
import { VillagerManager } from './character/Villager.js';

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

    // AAA Camera Orbit & Mouse Wheel Zoom
    this.camYaw = Math.PI;
    this.camPitch = 0.28;
    this.camDistance = 6.8;
    this.camDistanceTarget = 6.8;
    this.minCamDistance = 3.0;
    this.maxCamDistance = 18.0;
    this.mouseSensitivity = 0.0035;
    this.lastMouseX = null;
    this.lastMouseY = null;
    this.isPointerLocked = false;

    this.initThree();
    this.initSystems();
    this.initPauseMenu();
    this.initInputs();

    // Start in peaceful village exploration mode (missions from Kakashi Hatake)
    this.hud.updateQuestUI(this.questManager);
    this.hud.updateWave(1, 0, this.kills, this.score);

    // Game loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x64b5f6);
    this.scene.fog = new THREE.FogExp2(0x81d4fa, 0.0016); // Seamless anime horizon sky haze

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.25,
      1400
    );

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.container.appendChild(this.renderer.domElement);

    // High-Fidelity Studio Anime Lighting & Shadows
    this.sunLightTarget = new THREE.Object3D();
    this.scene.add(this.sunLightTarget);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.05);
    this.sunLight.position.set(55, 115, 75);
    this.sunLight.target = this.sunLightTarget;
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 380;
    this.sunLight.shadow.camera.left = -68;
    this.sunLight.shadow.camera.right = 68;
    this.sunLight.shadow.camera.top = 68;
    this.sunLight.shadow.camera.bottom = -68;
    this.sunLight.shadow.bias = -0.00035;
    this.sunLight.shadow.normalBias = 0.025;
    this.scene.add(this.sunLight);

    // Natural 2-Tone Bounce Lighting (Sky Cyan from above + Forest Turf Green from below)
    const hemiLight = new THREE.HemisphereLight(0x81d4fa, 0x2e7d32, 0.72);
    this.scene.add(hemiLight);

    // Warm Anime Silhouette Rim Light
    const rimLight = new THREE.DirectionalLight(0xffca28, 0.68);
    rimLight.position.set(-50, 45, -70);
    this.scene.add(rimLight);

    // Soft global ambient fill
    const ambientFill = new THREE.AmbientLight(0xffffff, 0.22);
    this.scene.add(ambientFill);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initSystems() {
    this.vfx = new AnimeVFX(this.scene);
    this.city = new KonohaCity(this.scene, this.vfx);
    this.naruto = new Naruto(this.scene, this.vfx);
    this.jutsu = new JutsuManager(this.scene, this.vfx, this.naruto);
    this.hud = new HUD(this.camera);
    this.questManager = new QuestManager();
    this.minimap = new Minimap('minimap-canvas');
    this.villagers = new VillagerManager(this.scene);
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
        if (this.isQuestModalOpen()) {
          this.closeQuestModal();
          return;
        }
        if (this.isShopModalOpen()) {
          this.hud.closeWeaponShop(() => this.resumeGame());
          return;
        }
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

      if (this.naruto.isKyuubiMode) {
        if (code === 'Digit1' || code === 'KeyC') {
          this.jutsu.castKuramaRoar(this.enemies, (enemy, dmg, isFinisher) => {
            this.handleEnemyHit(enemy, dmg, isFinisher);
          });
          return;
        }
        if (code === 'Digit2' || code === 'KeyQ') {
          this.jutsu.castKuramaTailSweep(this.enemies, (enemy, dmg, isFinisher) => {
            this.handleEnemyHit(enemy, dmg, isFinisher);
          });
          return;
        }
        if (code === 'Digit3' || code === 'KeyE') {
          this.jutsu.castKuramaBijuuDama();
          return;
        }
        if (code === 'Digit4' || code === 'KeyR') {
          this.jutsu.castKuramaRoar(this.enemies, (enemy, dmg, isFinisher) => {
            this.handleEnemyHit(enemy, dmg, isFinisher);
          });
          return;
        }
      }

      if (code === 'Digit1') this.jutsu.castShuriken();
      if (code === 'Digit2' || code === 'KeyQ') this.jutsu.castShadowClones(this.enemies);
      if (code === 'Digit3' || code === 'KeyE') this.jutsu.castRasengan();
      if (code === 'Digit4' || code === 'KeyR') this.jutsu.castKyuubiMode();
      if (code === 'Digit5' || code === 'KeyT') this.jutsu.castRasenshuriken();
      if (code === 'KeyG') this.jutsu.castSageMode();

      if (code === 'KeyK' || code === 'KeyU') {
        this.hud.toggleSkillTree(this.naruto, () => this.pauseGame(), () => this.resumeGame());
      }

      if (code === 'KeyX') {
        if (this.naruto.hasKatana) {
          this.naruto.toggleWeapon();
          this.hud.updateWeaponUI(this.naruto.equippedWeapon, this.naruto.hasKatana);
        } else {
          this.hud.showShopAlert('⚔️ У вас еще нет оружия! Купите Катану Ниндзя у торговца в центре деревни.');
        }
      }

      if (code === 'KeyF') {
        if (this.isNearKakashi()) {
          if (this.isQuestModalOpen()) {
            this.closeQuestModal();
          } else {
            this.openQuestBoard();
          }
        } else if (this.isNearMerchant()) {
          this.openWeaponShop();
        }
      }
    });

    // Mouse Wheel Camera Zoom (Third-Person distance adjustment: 3m - 18m)
    window.addEventListener('wheel', e => {
      if (this.isModalOpen() || this.isPaused) return;
      const zoomSpeed = 0.0065;
      this.camDistanceTarget = Math.max(
        this.minCamDistance,
        Math.min(this.maxCamDistance, this.camDistanceTarget + e.deltaY * zoomSpeed)
      );
    }, { passive: true });

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
      'slot-kyuubi': () => this.jutsu.castKyuubiMode(),
      'slot-rasenshuriken': () => this.jutsu.castRasenshuriken(),
      'slot-sage': () => this.jutsu.castSageMode()
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
    const shopModal = document.getElementById('shop-modal');
    const skillModal = document.getElementById('skill-tree-modal');
    const questModal = document.getElementById('quest-modal');
    return (startModal && !startModal.classList.contains('hidden')) ||
           (overModal && !overModal.classList.contains('hidden')) ||
           (shopModal && !shopModal.classList.contains('hidden')) ||
           (skillModal && !skillModal.classList.contains('hidden')) ||
           (questModal && !questModal.classList.contains('hidden'));
  }

  isNearKakashi() {
    if (!this.city || !this.city.questNpcPos || !this.naruto) return false;
    return this.naruto.position.distanceTo(this.city.questNpcPos) < 5.2;
  }

  isQuestModalOpen() {
    const qm = document.getElementById('quest-modal');
    return qm && !qm.classList.contains('hidden');
  }

  isShopModalOpen() {
    const sm = document.getElementById('shop-modal');
    return sm && !sm.classList.contains('hidden');
  }

  openQuestBoard() {
    if (document.exitPointerLock) {
      try { document.exitPointerLock(); } catch (e) {}
    }
    this.hud.openQuestBoard(
      this.questManager,
      (questId) => this.acceptQuest(questId),
      () => this.cancelCurrentQuest(),
      () => this.pauseGame()
    );
  }

  closeQuestModal() {
    this.hud.closeQuestBoard(() => {
      this.resumeGame();
    });
  }

  acceptQuest(questId) {
    // Clear old enemies before spawning mission targets
    this.enemies.forEach(e => this.scene.remove(e.group));
    this.enemies = [];

    const quest = this.questManager.startQuest(questId, (q) => {
      this.spawnQuestEnemies(q);
    });

    if (quest) {
      this.hud.showQuestAlert(`📜 Миссия "${quest.title}" принята! Направляйся в зону: ${quest.zoneName}`);
      this.hud.updateQuestUI(this.questManager);
      this.hud.showAnnouncement(`МИССИЯ: ${quest.title.toUpperCase()}`);
      sound.playLevelUp();
      this.closeQuestModal();
    }
  }

  cancelCurrentQuest() {
    this.questManager.cancelQuest();
    this.enemies.forEach(e => this.scene.remove(e.group));
    this.enemies = [];
    this.hud.updateQuestUI(this.questManager);
    this.hud.showQuestAlert('Миссия отменена. В деревне снова спокойно.');
  }

  spawnQuestEnemies(quest) {
    this.enemies = [];
    const zoneCenter = quest.zoneCenter.clone();
    const zoneObj = {
      center: zoneCenter,
      patrolRadius: quest.zoneRadius,
      leashRadius: quest.zoneRadius * 1.5
    };

    quest.enemies.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 3 + Math.random() * (quest.zoneRadius * 0.7);
        const spawnPos = new THREE.Vector3(
          zoneCenter.x + Math.cos(angle) * dist,
          0,
          zoneCenter.z + Math.sin(angle) * dist
        );
        this.city.clampPosition(spawnPos, 0.6);
        this.enemies.push(new Enemy(this.scene, this.vfx, group.type, spawnPos, zoneObj));
      }
    });
  }

  isNearMerchant() {
    if (!this.city || !this.city.merchantPos || !this.naruto) return false;
    return this.naruto.position.distanceTo(this.city.merchantPos) < 5.2;
  }

  openWeaponShop() {
    if (document.exitPointerLock) {
      try { document.exitPointerLock(); } catch (e) {}
    }
    this.hud.openWeaponShop(this.naruto, this.jutsu, () => {
      try {
        if (document.body.requestPointerLock) {
          document.body.requestPointerLock();
        }
      } catch (e) {}
    });
  }

  performDash() {
    if (this.naruto.chakra < 8) return;
    this.naruto.chakra -= 8;

    sound.playDash();
    this.vfx.spawnSmokePoof(this.naruto.position, 14, 0.8);
    this.vfx.setSpeedLines(0.85);
    setTimeout(() => this.vfx.setSpeedLines(0), 180);

    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.naruto.rotationY);
    const isKyuubi = this.naruto.isKyuubiMode;
    const dashDist = isKyuubi ? 10.0 : 7.5;
    const charR = isKyuubi ? 1.9 : 0.55;

    // Step through dash in increments to prevent tunneling through building walls
    const steps = 5;
    const stepDist = dashDist / steps;
    for (let s = 0; s < steps; s++) {
      this.naruto.position.addScaledVector(forward, stepDist);
      if (this.city && this.city.resolveCollision) {
        this.city.resolveCollision(this.naruto.position, charR);
      }
    }
    if (this.city) this.city.clampPosition(this.naruto.position, charR);
  }

  checkMeleeHits(hitCenter, radius, dmg, isFinisher, comboStep) {
    let hitAny = false;
    const isKatana = typeof comboStep === 'string' && comboStep.startsWith('KATANA');

    // 1. Training Yard Logs
    if (this.city && this.city.trainingLogs) {
      this.city.trainingLogs.forEach(log => {
        if (log.pos.distanceTo(hitCenter) < radius + log.radius) {
          hitAny = true;
          this.vfx.spawnHitSparks(log.pos, isFinisher);
          if (isKatana) {
            sound.playKatanaHit(isFinisher);
          }
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

        if (comboStep === 'KATANA_1') { knockPower = 8; liftY = 0.08; }
        if (comboStep === 'KATANA_2') { knockPower = 11; liftY = 0.08; }
        if (comboStep === 'KATANA_3') { knockPower = 14; liftY = 0.65; }
        if (comboStep === 'KATANA_4') { knockPower = 26; liftY = 0.85; }
        if (comboStep === 'KATANA_RUN_1') { knockPower = 14; liftY = 0.15; }
        if (comboStep === 'KATANA_RUN_2') { knockPower = 22; liftY = 0.60; }
        if (comboStep === 'KATANA_AIR') { knockPower = 20; liftY = 0.20; }

        const knockDir = enemy.position.clone().sub(this.naruto.position).normalize().setY(liftY);
        enemy.takeDamage(dmg, knockDir.multiplyScalar(knockPower));

        this.vfx.spawnHitSparks(enemyPos, isFinisher);
        if (isKatana) {
          sound.playKatanaHit(isFinisher);
        }
        this.comboStreak++;
        this.hud.registerHit(this.comboStreak);
        this.hud.spawnDamageText(enemyPos, dmg, isFinisher);

        // Sage Mode Vampirism: restore health on strike
        if (this.naruto.isSageMode) {
          this.naruto.heal(15);
        }

        // Uzumaki Rendan Combo Finisher Perk: shockwave AoE + heal
        if (isFinisher && this.naruto.hasSkill('uzumaki_rendan')) {
          this.naruto.heal(20);
          this.vfx.spawnChakraAuraWisp(hitCenter, true);
          this.enemies.forEach(other => {
            if (other === enemy || other.isDead) return;
            if (other.position.distanceTo(hitCenter) < 5.2) {
              other.takeDamage(65, other.position.clone().sub(hitCenter).normalize().setY(0.5).multiplyScalar(16));
              this.vfx.spawnHitSparks(other.position.clone().setY(1.0), false);
              this.hud.spawnDamageText(other.position.clone().setY(1.0), 65, false);
            }
          });
        }

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

    // Experience (XP) reward: Rogue Ninjas = 35 XP, Akatsuki = 80 XP
    const xpReward = enemy.type === 'akatsuki' ? 80 : 35;
    const leveledUp = this.naruto.addXp(xpReward);
    this.hud.spawnXpText(enemy.position, xpReward);

    if (leveledUp) {
      this.hud.showAnnouncement(`LEVEL UP! LVL ${this.naruto.level} (+1 SP)`);
    }
    this.hud.updatePlayerStatus(this.naruto);

    // Drop Ryo Coins (Shiny ancient ninja golden currency)
    // Rogue ninjas drop 15 - 30 Ryo, Akatsuki drop 45 - 80 Ryo!
    const ryoAmount = enemy.type === 'akatsuki'
      ? Math.floor(45 + Math.random() * 35)
      : Math.floor(15 + Math.random() * 16);
    this.pickups.push(new PickupItem(this.scene, enemy.position, 'ryo', ryoAmount));

    // Also chance for Ramen bowl or Chakra scroll
    const dropRoll = Math.random();
    if (dropRoll < 0.35) {
      this.pickups.push(new PickupItem(this.scene, enemy.position.clone().add(new THREE.Vector3(0.5, 0, 0.5)), 'ramen'));
    } else if (dropRoll < 0.65) {
      this.pickups.push(new PickupItem(this.scene, enemy.position.clone().add(new THREE.Vector3(-0.5, 0, -0.5)), 'scroll'));
    }

    // Update Quest Manager
    const questResult = this.questManager.onEnemyDefeated();
    this.hud.updateQuestUI(this.questManager);

    if (questResult && questResult.completed) {
      sound.playLevelUp();
      this.naruto.winTimer = 2.4;
      this.questManager.claimReward(this.naruto, this.hud);
      setTimeout(() => {
        this.hud.updateQuestUI(this.questManager);
        this.hud.showAnnouncement('КОНОХА В БЕЗОПАСНОСТИ! ВОЗЬМИ СЛЕДУЮЩУЮ МИССИЮ У КАКАШИ');
      }, 3500);
    }
  }

  startWave(waveNumber) {
    this.wave = waveNumber;
    this.hud.showAnnouncement(`WAVE ${this.wave}: ПАТРУЛИ ШИНОБИ`);

    // Wave bonus XP
    if (waveNumber > 1) {
      const waveBonus = 100 * waveNumber;
      const leveledUp = this.naruto.addXp(waveBonus);
      this.hud.spawnXpText(this.naruto.position, waveBonus);
      if (leveledUp) {
        setTimeout(() => this.hud.showAnnouncement(`LEVEL UP! LVL ${this.naruto.level} (+1 SP)`), 1500);
      }
      this.hud.updatePlayerStatus(this.naruto);
    }

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
    const isKyuubi = this.naruto && this.naruto.isKyuubiMode;

    // In Kyuubi mode, allow higher max zoom and smoothly adjust default distance for colossal 8.3m Kurama
    this.maxCamDistance = isKyuubi ? 52.0 : 18.0;
    this.minCamDistance = isKyuubi ? 12.0 : 3.0;

    // If Kyuubi is active, smoothly dolly back to at least 26.0m
    if (isKyuubi && this.camDistanceTarget < 26.0) {
      this.camDistanceTarget = 26.0;
    } else if (!isKyuubi && this.camDistanceTarget > 18.0) {
      this.camDistanceTarget = 6.8;
    }

    // Smooth third-person camera zoom (wheel scroll)
    this.camDistance += (this.camDistanceTarget - this.camDistance) * Math.min(1.0, 10 * dt);

    // Dynamic FOV for high-speed ninja sprinting / Kyuubi beast mode
    const targetFov = (this.naruto && this.naruto.isSprinting) ? 72 : (isKyuubi ? 64 : 55);
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1.0, 9 * dt);
      this.camera.updateProjectionMatrix();
    }

    // Third-person camera tracking: raised target height for colossal Kurama (8.3m height)
    const targetHeight = isKyuubi ? 5.2 : 1.5;
    const targetPos = this.naruto.position.clone().add(new THREE.Vector3(0, targetHeight, 0));

    const cx = targetPos.x + Math.sin(this.camYaw) * Math.cos(this.camPitch) * this.camDistance;
    const cy = targetPos.y + Math.sin(this.camPitch) * this.camDistance;
    const cz = targetPos.z + Math.cos(this.camYaw) * Math.cos(this.camPitch) * this.camDistance;

    const camPos = new THREE.Vector3(cx, cy, cz);
    if (this.city && this.city.resolveCameraPosition) {
      this.city.resolveCameraPosition(targetPos, camPos, isKyuubi ? 1.4 : 0.5);
    }

    this.camera.position.copy(camPos);
    this.camera.lookAt(targetPos.clone().add(new THREE.Vector3(0, isKyuubi ? 0.8 : 0.2, 0)));
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

    this.questManager.cancelQuest();
    if (this.villagers) this.villagers.reset();
    this.naruto.reset();
    this.hud.updateQuestUI(this.questManager);
    this.hud.updateWave(1, 0, this.kills, this.score);
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
      p.update(dt, this.naruto, this.vfx, (pos, val) => {
        this.hud.spawnGoldText(pos, val);
      });
      if (p.isCollected) {
        this.pickups.splice(i, 1);
      }
    }

    // Check Kakashi and Merchant Proximity Prompts
    const nearKakashi = this.isNearKakashi();
    this.hud.setQuestPromptVisible(nearKakashi && !this.isModalOpen());

    const nearMerchant = this.isNearMerchant();
    this.hud.setMerchantPromptVisible(nearMerchant && !this.isModalOpen() && !nearKakashi);

    // Update Shinobi Radar Minimap
    if (this.minimap) {
      this.minimap.update(this.naruto, this.enemies, this.city, this.questManager);
    }

    // Dynamically center high-resolution shadow camera around player
    if (this.naruto && this.sunLight && this.sunLightTarget) {
      const np = this.naruto.position;
      this.sunLightTarget.position.set(np.x, 0, np.z);
      this.sunLight.position.set(np.x + 55, 115, np.z + 75);
    }

    // Update City, Villagers & VFX
    this.city.update(dt, this.camera);
    if (this.villagers) this.villagers.update(dt, this.naruto ? this.naruto.position : null);
    this.vfx.update(dt, this.camera, this.naruto ? this.naruto.position : null);
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
