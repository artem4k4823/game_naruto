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

    // XP & Level Progression Elements
    this.xpFill = document.getElementById('xp-fill');
    this.xpValue = document.getElementById('xp-value');
    this.playerLvlTag = document.getElementById('player-lvl-tag');
    this.playerRankTag = document.getElementById('player-rank-tag');

    this.kyuubiStatus = document.getElementById('kyuubi-status');
    this.kyuubiTimer = document.getElementById('kyuubi-timer');
    this.sageStatus = document.getElementById('sage-status');
    this.sageTimer = document.getElementById('sage-timer');

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

    // Skill Tree Elements
    this.btnSkills = document.getElementById('btn-skills');
    this.spBadge = document.getElementById('sp-badge');
    this.skillTreeModal = document.getElementById('skill-tree-modal');
    this.skillTreeLvlVal = document.getElementById('skill-tree-lvl-val');
    this.skillTreeRankVal = document.getElementById('skill-tree-rank-val');
    this.skillTreeSpVal = document.getElementById('skill-tree-sp-val');
    this.skillAlert = document.getElementById('skill-alert');
    this.btnCloseSkills = document.getElementById('btn-close-skills');

    this.slotRasenshuriken = document.getElementById('slot-rasenshuriken');
    this.slotSage = document.getElementById('slot-sage');

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

    // Ryo Currency & Weapon Elements
    this.ryoVal = document.getElementById('ryo-val');
    this.weaponSlot = document.getElementById('slot-weapon');
    this.weaponIcon = document.getElementById('weapon-icon');
    this.weaponStatusTag = document.getElementById('weapon-status-tag');
    this.weaponName = document.getElementById('weapon-name');

    // Merchant Prompt & Shop Modal
    this.merchantPrompt = document.getElementById('merchant-prompt');
    this.shopModal = document.getElementById('shop-modal');
    this.shopBalanceVal = document.getElementById('shop-balance-val');
    this.shopAlert = document.getElementById('shop-alert');
    this.btnBuyKatana = document.getElementById('btn-buy-katana');
    this.btnBuySharpener = document.getElementById('btn-buy-sharpener');
    this.btnBuyKunai = document.getElementById('btn-buy-kunai');
    this.btnBuyElixir = document.getElementById('btn-buy-elixir');
    this.btnCloseShop = document.getElementById('btn-close-shop');

    // Mission & Quest Elements
    this.questPrompt = document.getElementById('quest-prompt');
    this.questModal = document.getElementById('quest-modal');
    this.btnCloseQuest = document.getElementById('btn-close-quest');
    this.activeQuestRibbon = document.getElementById('active-quest-ribbon');
    this.activeQuestTitleDisplay = document.getElementById('active-quest-title-display');
    this.activeQuestCounterDisplay = document.getElementById('active-quest-counter-display');
    this.btnCancelMission = document.getElementById('btn-cancel-mission');
    this.questAlert = document.getElementById('quest-alert');
    this.objectiveLabel = document.getElementById('objective-label');
    this.missionBanner = document.getElementById('mission-banner');

    // Cooldown elements
    this.cdOverlays = {
      shuriken: document.getElementById('cd-shuriken'),
      clones: document.getElementById('cd-clones'),
      rasengan: document.getElementById('cd-rasengan'),
      kyuubi: document.getElementById('cd-kyuubi'),
      rasenshuriken: document.getElementById('cd-rasenshuriken'),
      sage: document.getElementById('cd-sage')
    };

    // Skill Tree Metadata
    this.skillTreeData = [
      { id: 'chakra_focus', name: 'Концентрация Чакры', req: null, reqName: '' },
      { id: 'oodama_rasengan', name: 'Оодама Расенган', req: 'chakra_focus', reqName: 'Концентрация Чакры' },
      { id: 'rasenshuriken', name: 'Футон: Рассенсюрикен', req: 'oodama_rasengan', reqName: 'Оодама Расенган' },
      { id: 'razor_edge', name: 'Острое Лезвие', req: null, reqName: '' },
      { id: 'tajuu_clones', name: 'Таджу Каге Буншин', req: 'razor_edge', reqName: 'Острое Лезвие' },
      { id: 'uzumaki_rendan', name: 'Комбо Узумаки Рендан', req: 'tajuu_clones', reqName: 'Таджу Каге Буншин' },
      { id: 'uzumaki_body', name: 'Тело Клана Узумаки', req: null, reqName: '' },
      { id: 'kyuubi_mantle_2', name: 'Мантия Девятихвостого II', req: 'uzumaki_body', reqName: 'Тело Клана Узумаки' },
      { id: 'sage_mode', name: 'Режим Мудреца (Сеннин)', req: 'kyuubi_mantle_2', reqName: 'Мантия Девятихвостого II' }
    ];

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

    if (this.weaponSlot) {
      this.weaponSlot.addEventListener('click', () => {
        if (window.game && window.game.naruto) {
          window.game.naruto.toggleWeapon();
          this.updateWeaponUI(window.game.naruto.equippedWeapon, window.game.naruto.hasKatana);
        }
      });
    }

    if (this.merchantPrompt) {
      this.merchantPrompt.addEventListener('click', () => {
        if (window.game) {
          window.game.openWeaponShop();
        }
      });
    }

    if (this.questPrompt) {
      this.questPrompt.addEventListener('click', () => {
        if (window.game && window.game.openQuestBoard) {
          window.game.openQuestBoard();
        }
      });
    }

    if (this.btnCloseQuest) {
      this.btnCloseQuest.addEventListener('click', () => {
        this.closeQuestBoard(() => {
          if (window.game && window.game.resumeGame) window.game.resumeGame();
        });
      });
    }

    if (this.btnSkills) {
      this.btnSkills.addEventListener('click', () => {
        if (window.game && window.game.naruto) {
          this.openSkillTree(window.game.naruto, () => window.game.pauseGame());
        }
      });
    }

    if (this.btnCloseSkills) {
      this.btnCloseSkills.addEventListener('click', () => {
        this.closeSkillTree(() => {
          if (window.game) window.game.resumeGame();
        });
      });
    }

    // Connect skill unlock buttons
    const unlockButtons = document.querySelectorAll('.btn-unlock-skill');
    unlockButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const skillId = e.currentTarget.dataset.skillId;
        if (!skillId || !window.game || !window.game.naruto) return;
        const naruto = window.game.naruto;

        if (naruto.unlockSkill(skillId)) {
          this.renderSkillTree(naruto);
          this.updatePlayerStatus(naruto);
          const skillItem = this.skillTreeData.find(s => s.id === skillId);
          this.showSkillAlert(`✨ Техника "${skillItem ? skillItem.name : skillId}" успешно изучена!`);
        } else {
          if (naruto.skillPoints < 1) {
            this.showSkillAlert('⚠️ Недостаточно Очков Навыков (нужно 1 SP)! Побеждай врагов и повышай уровень!');
          } else {
            this.showSkillAlert('⚠️ Сначала изучи предшествующую технику в этой ветке!');
          }
        }
      });
    });

    if (this.slotRasenshuriken) {
      this.slotRasenshuriken.addEventListener('click', () => {
        if (window.game && window.game.jutsu) {
          window.game.jutsu.castRasenshuriken();
        }
      });
    }

    if (this.slotSage) {
      this.slotSage.addEventListener('click', () => {
        if (window.game && window.game.jutsu) {
          window.game.jutsu.castSageMode();
        }
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

    // XP & Level Progression
    const xpPct = Math.max(0, Math.min(100, (naruto.currentXp / naruto.xpToNextLevel) * 100));
    if (this.xpFill) this.xpFill.style.width = `${xpPct}%`;
    if (this.xpValue) this.xpValue.textContent = `${naruto.currentXp} / ${naruto.xpToNextLevel} XP`;
    if (this.playerLvlTag) this.playerLvlTag.textContent = `LVL ${naruto.level}`;
    if (this.playerRankTag) this.playerRankTag.textContent = naruto.getNinjaRank();

    // Skill Points (SP) Badge Notification
    if (this.spBadge) {
      if (naruto.skillPoints > 0) {
        this.spBadge.textContent = `${naruto.skillPoints} SP`;
        this.spBadge.classList.remove('hidden');
      } else {
        this.spBadge.classList.add('hidden');
      }
    }

    // Ryo Currency
    if (this.ryoVal) {
      this.ryoVal.textContent = `${naruto.ryo || 0} РЁ`;
    }

    // Weapon UI status
    this.updateWeaponUI(naruto.equippedWeapon, naruto.hasKatana);

    // Kyuubi Mode Timer & Kurama Skills Bar
    const kuramaBar = document.getElementById('kurama-hud-bar');
    if (naruto.isKyuubiMode) {
      if (this.kyuubiTimer) this.kyuubiTimer.textContent = `${Math.ceil(naruto.kyuubiTimeLeft)}s`;
      if (kuramaBar) kuramaBar.classList.remove('hidden');
    } else {
      if (kuramaBar) kuramaBar.classList.add('hidden');
    }

    // Sage Mode Timer
    if (naruto.isSageMode && this.sageTimer) {
      this.sageTimer.textContent = `${Math.ceil(naruto.sageTimeLeft)}s`;
    }

    // Skill dock locked states
    if (this.slotRasenshuriken) {
      this.slotRasenshuriken.classList.toggle('locked-skill', !naruto.hasSkill('rasenshuriken'));
    }
    if (this.slotSage) {
      this.slotSage.classList.toggle('locked-skill', !naruto.hasSkill('sage_mode'));
    }
  }

  updateWeaponUI(equippedWeapon, hasKatana) {
    if (!this.weaponSlot) return;
    if (equippedWeapon === 'KATANA') {
      if (this.weaponIcon) this.weaponIcon.textContent = '🗡️';
      if (this.weaponStatusTag) this.weaponStatusTag.textContent = 'КАТАНА';
      if (this.weaponName) this.weaponName.textContent = 'КЭНДЗЮЦУ';
      this.weaponSlot.classList.add('katana-active');
    } else {
      if (this.weaponIcon) this.weaponIcon.textContent = '👊';
      if (this.weaponStatusTag) this.weaponStatusTag.textContent = hasKatana ? 'КУЛАКИ [X]' : 'КУЛАКИ';
      if (this.weaponName) this.weaponName.textContent = 'ТАЙДЗЮЦУ';
      this.weaponSlot.classList.remove('katana-active');
    }
  }

  setMerchantPromptVisible(visible) {
    if (this.merchantPrompt) {
      this.merchantPrompt.classList.toggle('hidden', !visible);
    }
  }

  showShopAlert(msg) {
    if (!this.shopAlert) return;
    this.shopAlert.textContent = msg;
    this.shopAlert.classList.remove('hidden');
    if (this.shopAlertTimer) clearTimeout(this.shopAlertTimer);
    this.shopAlertTimer = setTimeout(() => {
      if (this.shopAlert) this.shopAlert.classList.add('hidden');
    }, 2800);
  }

  updateShopCards(naruto) {
    if (this.shopBalanceVal) {
      this.shopBalanceVal.textContent = naruto.ryo || 0;
    }

    if (this.btnBuyKatana) {
      if (!naruto.hasKatana) {
        this.btnBuyKatana.textContent = 'КУПИТЬ (60 РЁ)';
        this.btnBuyKatana.className = 'shop-btn-buy';
      } else if (naruto.equippedWeapon === 'KATANA') {
        this.btnBuyKatana.textContent = 'ЭКИПИРОВАНО [X]';
        this.btnBuyKatana.className = 'shop-btn-buy equipped';
      } else {
        this.btnBuyKatana.textContent = 'НАДЕТЬ КАТАНУ [X]';
        this.btnBuyKatana.className = 'shop-btn-buy';
      }
    }

    if (this.btnBuySharpener) {
      if (naruto.katanaDamageBonus > 1.0) {
        this.btnBuySharpener.textContent = 'ПРИМЕНЕНО (+35%)';
        this.btnBuySharpener.className = 'shop-btn-buy purchased';
      } else {
        this.btnBuySharpener.textContent = 'КУПИТЬ (120 РЁ)';
        this.btnBuySharpener.className = 'shop-btn-buy';
      }
    }

    if (this.btnBuyKunai) {
      if (naruto.hasExplosiveKunai) {
        this.btnBuyKunai.textContent = 'АКТИВИРОВАНО (+50%)';
        this.btnBuyKunai.className = 'shop-btn-buy purchased';
      } else {
        this.btnBuyKunai.textContent = 'КУПИТЬ (80 РЁ)';
        this.btnBuyKunai.className = 'shop-btn-buy';
      }
    }
  }

  openWeaponShop(naruto, jutsuManager, onResume) {
    if (!this.shopModal) return;
    this.shopModal.classList.remove('hidden');
    this.updateShopCards(naruto);

    if (this.btnBuyKatana) {
      this.btnBuyKatana.onclick = () => {
        if (!naruto.hasKatana) {
          if (naruto.ryo >= 60) {
            naruto.ryo -= 60;
            naruto.buyKatana();
            this.updatePlayerStatus(naruto);
            this.updateShopCards(naruto);
            this.showShopAlert('🎉 Катана Ниндзя приобретена! Нажмите [X] в любой момент для смены оружия.');
          } else {
            this.showShopAlert('⚠️ Недостаточно Рё! Побеждай врагов на улицах Конохи, чтобы получить монеты.');
          }
        } else {
          naruto.toggleWeapon();
          this.updatePlayerStatus(naruto);
          this.updateShopCards(naruto);
        }
      };
    }

    if (this.btnBuySharpener) {
      this.btnBuySharpener.onclick = () => {
        if (naruto.katanaDamageBonus > 1.0) {
          this.showShopAlert('✨ Руническая заточка уже нанесена на клинок (+35% урона)!');
          return;
        }
        if (naruto.ryo >= 120) {
          naruto.ryo -= 120;
          naruto.katanaDamageBonus = 1.35;
          sound.playCoinPickup();
          this.updatePlayerStatus(naruto);
          this.updateShopCards(naruto);
          this.showShopAlert('⚔️ Лезвие Катаны заточено древними рунами! Урон увеличен на +35%!');
        } else {
          this.showShopAlert('⚠️ Недостаточно Рё для заточки клинка (нужно 120 Рё)!');
        }
      };
    }

    if (this.btnBuyKunai) {
      this.btnBuyKunai.onclick = () => {
        if (naruto.hasExplosiveKunai) {
          this.showShopAlert('💣 Взрывные свитки уже привязаны к сюрикенам (+50% урона)!');
          return;
        }
        if (naruto.ryo >= 80) {
          naruto.ryo -= 80;
          naruto.hasExplosiveKunai = true;
          if (jutsuManager) jutsuManager.shurikenDamageMult = 1.5;
          sound.playCoinPickup();
          this.updatePlayerStatus(naruto);
          this.updateShopCards(naruto);
          this.showShopAlert('💥 Взрывные свитки прикреплены! Урон сюрикенов увеличен на +50%!');
        } else {
          this.showShopAlert('⚠️ Недостаточно Рё для покупки свитков (нужно 80 Рё)!');
        }
      };
    }

    if (this.btnBuyElixir) {
      this.btnBuyElixir.onclick = () => {
        if (naruto.ryo >= 40) {
          naruto.ryo -= 40;
          naruto.hp = naruto.maxHp;
          naruto.chakra = naruto.maxChakra;
          sound.playPickup();
          this.updatePlayerStatus(naruto);
          this.updateShopCards(naruto);
          this.showShopAlert('🧪 Эликсир выпит! Здоровье (500 HP) и Чакра (150 CH) полностью восстановлены!');
        } else {
          this.showShopAlert('⚠️ Недостаточно Рё для покупки эликсира (нужно 40 Рё)!');
        }
      };
    }

    if (this.btnCloseShop) {
      this.btnCloseShop.onclick = () => {
        this.closeWeaponShop(onResume);
      };
    }
  }

  closeWeaponShop(onResume) {
    if (this.shopModal) {
      this.shopModal.classList.add('hidden');
    }
    if (onResume) onResume();
  }

  setQuestPromptVisible(visible) {
    if (this.questPrompt) {
      this.questPrompt.classList.toggle('hidden', !visible);
    }
  }

  showQuestAlert(msg) {
    if (!this.questAlert) return;
    this.questAlert.textContent = msg;
    this.questAlert.classList.remove('hidden');
    if (this.questAlertTimer) clearTimeout(this.questAlertTimer);
    this.questAlertTimer = setTimeout(() => {
      if (this.questAlert) this.questAlert.classList.add('hidden');
    }, 2800);
  }

  updateQuestUI(questManager) {
    if (!questManager) return;
    const quest = questManager.activeQuest;

    if (quest) {
      if (this.waveTitle) this.waveTitle.textContent = quest.title.toUpperCase();
      if (this.objectiveLabel) this.objectiveLabel.textContent = quest.zoneName.toUpperCase();
      if (this.enemiesCount) this.enemiesCount.textContent = `[${questManager.currentKills} / ${quest.targetCount}]`;

      if (this.activeQuestRibbon) this.activeQuestRibbon.classList.remove('hidden');
      if (this.activeQuestTitleDisplay) this.activeQuestTitleDisplay.textContent = quest.title;
      if (this.activeQuestCounterDisplay) {
        this.activeQuestCounterDisplay.textContent = `Повержено: ${questManager.currentKills} / ${quest.targetCount}`;
      }
    } else {
      if (this.waveTitle) this.waveTitle.textContent = 'МИРНЫЙ ПАТРУЛЬ КОНОХИ';
      if (this.objectiveLabel) this.objectiveLabel.textContent = 'ВОЗЬМИТЕ МИССИЮ У КАКАШИ [F]';
      if (this.enemiesCount) this.enemiesCount.textContent = '';

      if (this.activeQuestRibbon) this.activeQuestRibbon.classList.add('hidden');
    }

    // Update buttons in Quest Board modal
    const acceptBtns = document.querySelectorAll('.btn-accept-mission');
    acceptBtns.forEach(btn => {
      const qId = btn.dataset.questId;
      if (quest && quest.id === qId) {
        btn.textContent = 'ТЕКУЩАЯ МИССИЯ';
        btn.classList.add('active-mission');
      } else if (questManager.completedQuestIds && questManager.completedQuestIds.has(qId)) {
        btn.textContent = 'ПОВТОРИТЬ МИССИЮ';
        btn.classList.remove('active-mission');
      } else {
        btn.textContent = 'ПРИНЯТЬ МИССИЮ';
        btn.classList.remove('active-mission');
      }
    });
  }

  openQuestBoard(questManager, onAccept, onCancel, onPause) {
    if (!this.questModal) return;
    this.updateQuestUI(questManager);
    this.questModal.classList.remove('hidden');

    const acceptBtns = document.querySelectorAll('.btn-accept-mission');
    acceptBtns.forEach(btn => {
      btn.onclick = (e) => {
        const qId = e.currentTarget.dataset.questId;
        if (onAccept) onAccept(qId);
      };
    });

    if (this.btnCancelMission) {
      this.btnCancelMission.onclick = () => {
        if (onCancel) onCancel();
      };
    }

    if (this.btnCloseQuest) {
      this.btnCloseQuest.onclick = () => {
        this.closeQuestBoard(() => {
          if (window.game && window.game.resumeGame) window.game.resumeGame();
        });
      };
    }

    if (onPause) onPause();
  }

  closeQuestBoard(onResume) {
    if (this.questModal) {
      this.questModal.classList.add('hidden');
    }
    if (onResume) onResume();
  }

  toggleQuestBoard(questManager, onAccept, onCancel, onPause, onResume) {
    if (this.questModal && !this.questModal.classList.contains('hidden')) {
      this.closeQuestBoard(onResume);
    } else {
      this.openQuestBoard(questManager, onAccept, onCancel, onPause);
    }
  }

  openSkillTree(naruto, onPause) {
    if (!this.skillTreeModal) return;
    this.renderSkillTree(naruto);
    this.skillTreeModal.classList.remove('hidden');
    if (onPause) onPause();
  }

  closeSkillTree(onResume) {
    if (this.skillTreeModal) {
      this.skillTreeModal.classList.add('hidden');
    }
    if (onResume) onResume();
  }

  toggleSkillTree(naruto, onPause, onResume) {
    if (this.skillTreeModal && !this.skillTreeModal.classList.contains('hidden')) {
      this.closeSkillTree(onResume);
    } else {
      this.openSkillTree(naruto, onPause);
    }
  }

  showSkillAlert(msg) {
    if (!this.skillAlert) return;
    this.skillAlert.textContent = msg;
    this.skillAlert.classList.remove('hidden');
    if (this.skillAlertTimer) clearTimeout(this.skillAlertTimer);
    this.skillAlertTimer = setTimeout(() => {
      if (this.skillAlert) this.skillAlert.classList.add('hidden');
    }, 2800);
  }

  renderSkillTree(naruto) {
    if (this.skillTreeLvlVal) this.skillTreeLvlVal.textContent = `LVL ${naruto.level}`;
    if (this.skillTreeRankVal) this.skillTreeRankVal.textContent = naruto.getNinjaRank();
    if (this.skillTreeSpVal) this.skillTreeSpVal.textContent = `${naruto.skillPoints} SP`;

    this.skillTreeData.forEach(item => {
      const card = document.getElementById(`node-${item.id}`);
      if (!card) return;

      const btn = card.querySelector('.btn-unlock-skill');
      const statusText = card.querySelector('.node-status-text');

      card.classList.remove('unlocked', 'available', 'locked');

      if (naruto.hasSkill(item.id)) {
        card.classList.add('unlocked');
        if (btn) {
          btn.textContent = 'ИЗУЧЕНО ✓';
          btn.disabled = true;
          btn.classList.add('learned');
        }
        if (statusText) {
          statusText.textContent = 'Техника изучена';
          statusText.classList.remove('req-text');
        }
      } else {
        const prereqMet = !item.req || naruto.hasSkill(item.req);
        if (btn) btn.classList.remove('learned');

        if (prereqMet) {
          card.classList.add('available');
          if (btn) {
            if (naruto.skillPoints >= 1) {
              btn.textContent = 'ИЗУЧИТЬ (1 SP)';
              btn.disabled = false;
            } else {
              btn.textContent = 'НУЖНО 1 SP';
              btn.disabled = true;
            }
          }
          if (statusText) {
            statusText.textContent = 'Доступно для изучения';
            statusText.classList.remove('req-text');
          }
        } else {
          card.classList.add('locked');
          if (btn) {
            btn.textContent = 'ЗАБЛОКИРОВАНО';
            btn.disabled = true;
          }
          if (statusText) {
            statusText.textContent = `Требует: ${item.reqName}`;
            statusText.classList.add('req-text');
          }
        }
      }
    });
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

  // Floating 3D Gold Ryo Pickup Indicator
  spawnGoldText(worldPos, amount) {
    const el = document.createElement('div');
    el.className = 'damage-number crit';
    el.style.color = '#ffd700';
    el.style.textShadow = '0 0 10px #ff9800, 2px 2px 0 #000';
    el.textContent = `+${amount} РЁ! 🪙`;
    document.body.appendChild(el);

    this.floatingTexts.push({
      element: el,
      worldPos: worldPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 1.4, (Math.random() - 0.5) * 0.4)),
      time: 1.1
    });
  }

  // Floating 3D Experience (XP) Indicator
  spawnXpText(worldPos, amount) {
    const el = document.createElement('div');
    el.className = 'damage-number';
    el.style.color = '#ffd600';
    el.style.textShadow = '0 0 12px #ff9100, 2px 2px 0 #000';
    el.textContent = `+${amount} EXP! ⭐`;
    document.body.appendChild(el);

    this.floatingTexts.push({
      element: el,
      worldPos: worldPos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 1.8, (Math.random() - 0.5) * 0.4)),
      time: 1.2
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
