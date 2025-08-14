import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load career path building assets
    this.load.image('backend-building', 'src/assets/backend.svg');
    this.load.image('frontend-building', 'src/assets/frontend.svg');
    this.load.image('datascience-building', 'src/assets/data-science.svg');
    this.load.image('career-background', 'src/assets/background_choose_career.svg');
    
    // Load backend world assets
    this.load.image('backend-bg', 'src/assets/backend/backend_background.png');
    this.load.image('backend-server', 'src/assets/backend/server.svg');
    this.load.image('backend-server2', 'src/assets/backend/server2.svg');
    this.load.image('backend-plant', 'src/assets/backend/plant.svg');
    this.load.image('backend-file', 'src/assets/backend/file.svg');
    this.load.image('backend-vault', 'src/assets/backend/vault.svg');

    // Load frontend world assets  
    this.load.image('frontend-bg', 'src/assets/frontend/frontend_background.png');
    this.load.image('frontend-paintbrush', 'src/assets/frontend/paintbrush.svg');
    this.load.image('frontend-man', 'src/assets/frontend/man.svg');
    this.load.image('frontend-arcade', 'src/assets/frontend/arcade.svg');
    this.load.image('frontend-speaker', 'src/assets/frontend/speaker.svg');
    this.load.image('frontend-plant', 'src/assets/frontend/plant.svg');
    
    // Load basic UI elements
    this.createColorTexture('button-bg', 0x3498db, 200, 50);
    this.createColorTexture('world-portal', 0xe74c3c, 128, 128);
    this.createColorTexture('player', 0xf39c12, 32, 32);
    this.createColorTexture('npc', 0x9b59b6, 32, 32);
    
    // World-specific colors (fallbacks)
    this.createColorTexture('backend-world', 0x2c3e50, 800, 600);
    this.createColorTexture('frontend-world', 0x8e44ad, 800, 600);
    this.createColorTexture('datascience-world', 0x27ae60, 800, 600);
    
    // Loading bar
    this.createLoadingBar();
  }

  private createColorTexture(key: string, color: number, width: number, height: number) {
    this.add.graphics()
      .fillStyle(color)
      .fillRect(0, 0, width, height)
      .generateTexture(key, width, height)
      .destroy();
  }

  private createLoadingBar() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222);
    progressBox.fillRect(540, 320, 200, 50);

    const loadingText = this.add.text(640, 280, 'Loading...', {
      font: '20px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    const percentText = this.add.text(640, 345, '0%', {
      font: '18px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff);
      progressBar.fillRect(550, 330, 180 * value, 30);
      percentText.setText(Math.floor(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }

  create() {
    // Add full-screen background to ensure no gaps
    this.add.rectangle(640, 360, 1280, 720, 0x050669);
    
    // Display game title and intro
    const title = this.add.text(640, 200, 'CAREER QUEST', {
      fontFamily: '"Pixelify Sans"',
      fontSize: '150px',
      fontStyle: 'bold',
      color: '#ecf0f1',
      stroke: '#00808E',
  strokeThickness: 10
    }).setOrigin(0.5);    

    this.add.text(640, 330, 'AI-Powered Tech Career Exploration', {
      font: '24px monospace',
      color: '#ffffffff'
    }).setOrigin(0.5);

    this.add.rectangle(640, 400, 200, 50, 0x3498db)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('WorldMapScene');
      });

    this.add.text(640, 400, 'Start Adventure', {
      font: '20px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Animate title
    this.tweens.add({
      targets: title,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
}
