import * as Phaser from 'phaser';
import { DataManager } from './data/DataManager';
import { BootScene } from './scenes/BootScene';
import { WorldMapScene } from './scenes/WorldMapScene';
import { CareerWorldScene } from './scenes/CareerWorldScene';
import { ChallengeScene } from './scenes/ChallengeScene';
import { AnalysisScene } from './scenes/AnalysisScene';
import { LearningHubScene } from './scenes/LearningHubScene';

export class Game extends Phaser.Game {
  constructor() {
    // Initialize data manager
    DataManager.getInstance();
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: 'root',
      backgroundColor: '#2c3e50',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        pixelArt: true,
        roundPixels: true,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [
        BootScene,
        WorldMapScene,
        CareerWorldScene,
        ChallengeScene,
        AnalysisScene,
        LearningHubScene,
      ],
    };

    super(config);
  }
}
