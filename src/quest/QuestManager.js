// Shinobi Quest System: Mission ranks D, C, B, A, S from Quest Giver Kakashi Hatake
import * as THREE from 'three';
import { sound } from '../audio/SoundFX.js';

export class QuestManager {
  constructor() {
    this.activeQuest = null;
    this.currentKills = 0;
    this.isCompleted = false;
    this.completedQuestIds = new Set();

    this.quests = [
      {
        id: 'quest_d',
        rank: 'D',
        title: 'Патруль Южных Ворот',
        desc: 'Шайка ниндзя-отступников замечена около южных ворот деревни. Обезвредь лазутчиков и защити главный вход в Коноху!',
        zoneId: 'south_district',
        zoneName: 'Южные Ворота Конохи',
        zoneCenter: new THREE.Vector3(0, 0, 55),
        zoneRadius: 22,
        enemies: [
          { type: 'rogue', count: 3 }
        ],
        targetCount: 3,
        rewardRyo: 60,
        rewardXp: 140,
        rankColor: '#4caf50'
      },
      {
        id: 'quest_c',
        rank: 'C',
        title: 'Полигон 44 и Святилище Тории',
        desc: 'Мятежные шиноби устроили засаду на тренировочном полигоне в глубине великого леса. Зачисти святилище Тории!',
        zoneId: 'torii_shrine',
        zoneName: 'Святилище Тории в Великом Лесу',
        zoneCenter: new THREE.Vector3(18, 0, 220),
        zoneRadius: 25,
        enemies: [
          { type: 'rogue', count: 5 }
        ],
        targetCount: 5,
        rewardRyo: 120,
        rewardXp: 300,
        rankColor: '#2196f3'
      },
      {
        id: 'quest_b',
        rank: 'B',
        title: 'Засада у Ущелья Водопада',
        desc: 'Шпионы Акацуки объединились с отступниками и заблокировали подвесной мост у водопада. Ликвидируй угрозу!',
        zoneId: 'waterfall_gorge',
        zoneName: 'Ущелье Водопада & Мост',
        zoneCenter: new THREE.Vector3(-95, 0, 205),
        zoneRadius: 24,
        enemies: [
          { type: 'rogue', count: 4 },
          { type: 'akatsuki', count: 2 }
        ],
        targetCount: 6,
        rewardRyo: 220,
        rewardXp: 550,
        rankColor: '#9c27b0'
      },
      {
        id: 'quest_a',
        rank: 'A',
        title: 'Штурм Дозорной Вышки',
        desc: 'Ударный отряд Акацуки захватил дозорную вышку на востоке леса, готовя наступление на Коноху. Выбей врагов с позиции!',
        zoneId: 'watchtower_outpost',
        zoneName: 'Дозорная Вышка в Лесу',
        zoneCenter: new THREE.Vector3(125, 0, 175),
        zoneRadius: 24,
        enemies: [
          { type: 'rogue', count: 4 },
          { type: 'akatsuki', count: 4 }
        ],
        targetCount: 8,
        rewardRyo: 380,
        rewardXp: 900,
        rankColor: '#ff9800'
      },
      {
        id: 'quest_s',
        rank: 'S',
        title: 'Битва на Площади Хокаге',
        desc: 'Опаснейшие командиры Акацуки прорвались в самое сердце деревни прямо к Резиденции Хокаге! Сразись и защити Коноху как истинный Хокаге!',
        zoneId: 'hokage_plaza',
        zoneName: 'Главная Площадь Хокаге',
        zoneCenter: new THREE.Vector3(0, 0, -32),
        zoneRadius: 22,
        enemies: [
          { type: 'akatsuki', count: 6 }
        ],
        targetCount: 6,
        rewardRyo: 600,
        rewardXp: 1500,
        rankColor: '#d50000'
      }
    ];
  }

  getAllQuests() {
    return this.quests;
  }

  getQuest(id) {
    return this.quests.find(q => q.id === id);
  }

  hasActiveQuest() {
    return this.activeQuest !== null;
  }

  startQuest(id, onSpawnEnemies) {
    const quest = this.getQuest(id);
    if (!quest) return null;

    this.activeQuest = quest;
    this.currentKills = 0;
    this.isCompleted = false;

    sound.playHandSeal();

    if (onSpawnEnemies) {
      onSpawnEnemies(quest);
    }

    return quest;
  }

  onEnemyDefeated() {
    if (!this.activeQuest || this.isCompleted) return null;

    this.currentKills++;
    const total = this.activeQuest.targetCount;

    if (this.currentKills >= total) {
      this.isCompleted = true;
      return {
        completed: true,
        quest: this.activeQuest,
        kills: this.currentKills,
        total
      };
    }

    return {
      completed: false,
      quest: this.activeQuest,
      kills: this.currentKills,
      total
    };
  }

  claimReward(naruto, hud) {
    if (!this.activeQuest || !this.isCompleted) return null;

    const quest = this.activeQuest;
    this.completedQuestIds.add(quest.id);

    // Award Ryo and EXP
    naruto.ryo = (naruto.ryo || 0) + quest.rewardRyo;
    const leveledUp = naruto.addXp(quest.rewardXp);

    sound.playLevelUp();

    if (hud) {
      hud.spawnGoldText(naruto.position, quest.rewardRyo);
      hud.spawnXpText(naruto.position.clone().add(new THREE.Vector3(0, 0.4, 0)), quest.rewardXp);
      hud.showAnnouncement(`МИССИЯ ВЫПОЛНЕНА: +${quest.rewardRyo} РЁ, +${quest.rewardXp} EXP!`);
      if (leveledUp) {
        setTimeout(() => hud.showAnnouncement(`LEVEL UP! LVL ${naruto.level} (+1 SP)`), 1600);
      }
      hud.updatePlayerStatus(naruto);
    }

    const finishedQuest = this.activeQuest;
    this.activeQuest = null;
    this.currentKills = 0;
    this.isCompleted = false;

    return finishedQuest;
  }

  cancelQuest() {
    this.activeQuest = null;
    this.currentKills = 0;
    this.isCompleted = false;
  }
}
