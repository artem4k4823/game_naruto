// Naruto Shinobi HUD & UI Controller
import * as THREE from 'three';
import { sound } from '../audio/SoundFX.js';

export class HUD {
  constructor(camera) {
    this.camera = camera;

    // Elements
    this.hpFill = document.getElementById('hp-fill');
    this.hpGhost = document.getElementById('hp-ghost');
    this.hpValue = document.getElementById('hp-value');

    this.chakraFill = document.getElementById('chakra-fill');
    this.chakraValue = document.getElementById('chakra-value');

    this.kyuubiStatus = document.getElementById('kyuubi-status');
    this.kyuubiTimer = document.getElementById('kyuubi-timer');

    this.waveTitle = document.getElementById('wave-title');
    this.enemiesCount = document.getElementById('enemies-count');
    this.killCount = document.getElementById('kill-count');
    this.scoreVal = document.getElementById('score-val');

    this.comboContainer = document.getElementById('combo-container');
    this.comboCount = document.getElementById('combo-count');
    this.comboRating = document.getElementById('combo-rating');

    this.announcement = document.getElementById('announcement');
    this.announcementText = document.getElementById('announcement-text');

    this.btnAudio = document.getElementById('btn-audio');
    this.btnHelp = document.getElementById('btn-help');
    this.modalHelp = document.getElementById('modal-overlay');
    this.btnStart = document.getElementById('btn-start');

    this.volumeSlider = document.getElementById('volume-slider');
    this.volumePct = document.getElementById('volume-pct');
    this.modalVolumeSlider = document.getElementById('modal-volume-slider');
    this.modalVolVal = document.getElementById('modal-vol-val');
    this.modalBtnMute = document.getElementById('modal-btn-mute');

    this.gameOverModal = document.getElementById('game-over-modal');
    this.gameOverTitle = document.getElementById('game-over-title');
    this.gameOverDesc = document.getElementById('game-over-desc');
    this.summaryKills = document.getElementById('summary-kills');
    this.summaryScore = document.getElementById('summary-score');
    this.summaryWave = document.getElementById('summary-wave');
    this.btnRestart = document.getElementById('btn-restart');

    // Cooldown elements
    this.cdOverlays = {
      shuriken: document.getElementById('cd-shuriken'),
      clones: document.getElementById('cd-clones'),
      rasengan: document.getElementById('cd-rasengan'),
      kyuubi: document.getElementById('cd-kyuubi')
    };

    this.currentHits = 0;
    this.comboResetTimer = null;
    this.floatingTexts = [];

    this.initListeners();
    this.syncVolumeUI(sound.volume, sound.isMuted);
  }

  syncVolumeUI(vol, isMuted) {
    const pctStr = `${Math.round(vol * 100)}%`;
    let icon = '🔊';
    if (isMuted || vol === 0) {
      icon = '🔇';
    } else if (vol < 0.35) {
      icon = '🔈';
    } else if (vol < 0.7) {
      icon = '🔉';
    }

    if (this.btnAudio) this.btnAudio.textContent = icon;
    if (this.modalBtnMute) this.modalBtnMute.textContent = icon;

    const pauseMute = document.getElementById('pause-btn-mute');
    if (pauseMute) pauseMute.textContent = icon;

    if (this.volumeSlider && !isMuted) this.volumeSlider.value = vol;
    if (this.volumePct) this.volumePct.textContent = pctStr;

    if (this.modalVolumeSlider && !isMuted) this.modalVolumeSlider.value = vol;
    if (this.modalVolVal) this.modalVolVal.textContent = pctStr;

    const pauseSlider = document.getElementById('pause-volume-slider');
    if (pauseSlider && !isMuted) pauseSlider.value = vol;
    const pauseVal = document.getElementById('pause-vol-val');
    if (pauseVal) pauseVal.textContent = pctStr;
  }

  initListeners() {
    const onVolumeInput = (e) => {
      const val = parseFloat(e.target.value);
      sound.init();
      sound.setVolume(val);
      if (sound.isMuted && val > 0) {
        sound.toggleMute();
      }
      this.syncVolumeUI(val, sound.isMuted);
    };

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', onVolumeInput);
    }
    if (this.modalVolumeSlider) {
      this.modalVolumeSlider.addEventListener('input', onVolumeInput);
    }

    if (this.btnAudio) {
      this.btnAudio.addEventListener('click', () => {
        const isSoundOn = sound.toggleMute();
        this.syncVolumeUI(sound.volume, !isSoundOn);
      });
    }
    if (this.modalBtnMute) {
      this.modalBtnMute.addEventListener('click', () => {
        const isSoundOn = sound.toggleMute();
        this.syncVolumeUI(sound.volume, !isSoundOn);
      });
    }

    if (this.btnHelp && this.modalHelp) {
      this.btnHelp.addEventListener('click', () => {
        this.modalHelp.classList.remove('hidden');
      });
    }

    if (this.btnStart && this.modalHelp) {
      this.btnStart.addEventListener('click', () => {
        this.modalHelp.classList.add('hidden');
        sound.init();
        sound.startBGM();
      });
    }
  }

  updatePlayerStatus(naruto) {
    // HP
    const hpPct = Math.max(0, Math.min(100, (naruto.hp / naruto.maxHp) * 100));
    if (this.hpFill) this.hpFill.style.width = `${hpPct}%`;
    if (this.hpValue) this.hpValue.textContent = `${Math.ceil(naruto.hp)} / ${naruto.maxHp}`;
    if (this.hpGhost) this.hpGhost.style.width = `${hpPct}%`;

    // Chakra
    const chakraPct = Math.max(0, Math.min(100, (naruto.chakra / naruto.maxChakra) * 100));
    if (this.chakraFill) this.chakraFill.style.width = `${chakraPct}%`;
    if (this.chakraValue) this.chakraValue.textContent = `${Math.ceil(naruto.chakra)} / ${naruto.maxChakra}`;

    // Kyuubi Mode Timer
    if (naruto.isKyuubiMode && this.kyuubiTimer) {
      this.kyuubiTimer.textContent = `${Math.ceil(naruto.kyuubiTimeLeft)}s`;
    }
  }

  updateCooldowns(jutsuManager) {
    for (const key in jutsuManager.cooldowns) {
      const overlay = this.cdOverlays[key];
      if (overlay) {
        const maxCd = jutsuManager.maxCooldowns[key];
        const curCd = jutsuManager.cooldowns[key];
        const pct = (curCd / maxCd) * 100;
        overlay.style.height = `${pct}%`;
      }
    }
  }

  updateWave(waveNum, remaining, kills, score) {
    if (this.waveTitle) this.waveTitle.textContent = `WAVE ${waveNum}: SHINOBI INVASION`;
    if (this.enemiesCount) this.enemiesCount.textContent = remaining;
    if (this.killCount) this.killCount.textContent = `${kills} K.O.`;
    if (this.scoreVal) this.scoreVal.textContent = `${score} PTS`;
  }

  registerHit(comboStreak) {
    this.currentHits = comboStreak;

    if (this.comboContainer && this.comboCount && this.comboRating) {
      this.comboContainer.classList.remove('hidden');
      this.comboContainer.classList.remove('pop');
      void this.comboContainer.offsetWidth; // Trigger reflow
      this.comboContainer.classList.add('pop');

      this.comboCount.textContent = this.currentHits;

      if (this.currentHits >= 25) {
        this.comboRating.textContent = 'HOKAGE LEVEL! DATTEBAYO!';
        this.comboRating.style.color = '#ff1744';
      } else if (this.currentHits >= 15) {
        this.comboRating.textContent = 'JONIN RANK! SENSATIONAL!';
        this.comboRating.style.color = '#ff9100';
      } else if (this.currentHits >= 8) {
        this.comboRating.textContent = 'CHUNIN LEVEL! SUGEEE!';
        this.comboRating.style.color = '#00e5ff';
      } else {
        this.comboRating.textContent = 'GREAT STRIKE!';
        this.comboRating.style.color = '#ffea00';
      }

      if (this.comboResetTimer) clearTimeout(this.comboResetTimer);
      this.comboResetTimer = setTimeout(() => {
        if (this.comboContainer) this.comboContainer.classList.add('hidden');
      }, 1600);
    }
  }

  showAnnouncement(text) {
    if (this.announcement && this.announcementText) {
      this.announcementText.textContent = text;
      this.announcement.classList.remove('hidden');
      setTimeout(() => {
        if (this.announcement) this.announcement.classList.add('hidden');
      }, 2000);
    }
  }

  // Floating 3D Damage Numbers
  spawnDamageText(worldPos, damage, isCrit = false) {
    const el = document.createElement('div');
    el.className = `damage-number ${isCrit ? 'crit' : ''}`;
    el.textContent = isCrit ? `CRITICAL! -${Math.ceil(damage)}` : `-${Math.ceil(damage)}`;
    document.body.appendChild(el);

    this.floatingTexts.push({
      element: el,
      worldPos: worldPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.5, 1.2, (Math.random() - 0.5) * 0.5)),
      time: 0.8
    });
  }

  updateFloatingTexts(dt) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const item = this.floatingTexts[i];
      item.time -= dt;

      if (item.time <= 0) {
        if (item.element.parentNode) item.element.parentNode.removeChild(item.element);
        this.floatingTexts.splice(i, 1);
        continue;
      }

      // Project 3D coordinate to 2D screen coordinate
      const screenPos = item.worldPos.clone().project(this.camera);
      const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;

      item.element.style.left = `${x}px`;
      item.element.style.top = `${y}px`;
    }
  }

  showGameOver(isVictory, kills, score, wave, onRestart) {
    if (this.gameOverModal) {
      this.gameOverModal.classList.remove('hidden');
      if (this.gameOverTitle) {
        this.gameOverTitle.textContent = isVictory ? 'MISSION ACCOMPLISHED!' : 'DEFEATED...';
        this.gameOverTitle.style.color = isVictory ? '#c2410c' : '#b71c1c';
      }
      if (this.gameOverDesc) {
        this.gameOverDesc.textContent = isVictory
          ? 'Коноха спасена! Ты доказал, что станешь следующим Хокаге!'
          : 'Не сдавайся! Это твой путь ниндзя — поднимись и сразись снова!';
      }
      if (this.summaryKills) this.summaryKills.textContent = kills;
      if (this.summaryScore) this.summaryScore.textContent = score;
      if (this.summaryWave) this.summaryWave.textContent = wave;

      if (this.btnRestart) {
        this.btnRestart.onclick = () => {
          this.gameOverModal.classList.add('hidden');
          if (onRestart) onRestart();
        };
      }
    }
  }
}
