import * as Phaser from 'phaser';
import { Player } from '../entities/Player';

export class WorldMapScene extends Phaser.Scene {
  private player!: Player;
  private worldPortals!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;

  constructor() {
    super({ key: 'WorldMapScene' });
  }

  create() {
    // Create the world map background
    this.add.rectangle(640, 360, 1280, 720, 0x34495e);
    
    // Add title
    this.add.text(640, 50, 'Choose Your Career Path', {
      font: 'bold 32px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    // Create world portals
    this.createWorldPortals();
    
    // Create player
    this.player = new Player(this, 640, 500);
    
    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D');
    
    // Camera follow player
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setLerp(0.1, 0.1);
  }

  private createWorldPortals() {
    this.worldPortals = this.add.group();

    // Backend Development World
    const backendPortal = this.add.rectangle(300, 200, 128, 128, 0x2c3e50)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.enterWorld('backend'));

    this.add.text(300, 280, 'Backend Dev', {
      font: '18px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    this.add.text(300, 300, 'APIs • Databases • Systems', {
      font: '12px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Frontend/UI Development World
    const frontendPortal = this.add.rectangle(640, 200, 128, 128, 0x8e44ad)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.enterWorld('frontend'));

    this.add.text(640, 280, 'Frontend/UI', {
      font: '18px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    this.add.text(640, 300, 'Design • UX • Interfaces', {
      font: '12px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Data Science/ML World
    const datasciencePortal = this.add.rectangle(980, 200, 128, 128, 0x27ae60)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.enterWorld('datascience'));

    this.add.text(980, 280, 'Data Science/ML', {
      font: '18px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    this.add.text(980, 300, 'Analytics • ML • AI', {
      font: '12px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    this.worldPortals.addMultiple([backendPortal, frontendPortal, datasciencePortal]);

    // Add portal animations
    this.worldPortals.children.entries.forEach((portal) => {
      this.tweens.add({
        targets: portal,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  private enterWorld(worldType: string) {
    this.scene.start('CareerWorldScene', { worldType });
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors, this.wasdKeys);
    }
  }
}
