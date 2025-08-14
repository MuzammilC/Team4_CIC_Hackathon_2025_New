import * as Phaser from 'phaser';

export class ChallengeStation {
  public sprite: Phaser.GameObjects.Container;
  private challenge: any;
  private worldType: string;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, challenge: any, worldType: string) {
    this.scene = scene;
    this.challenge = challenge;
    this.worldType = worldType;

    // Create station container
    this.sprite = scene.add.container(x, y);
    
    // Create station base
    const base = scene.add.rectangle(0, 0, 80, 80, this.getDifficultyColor(challenge.difficulty));
    this.sprite.add(base);

    // Add challenge name
    const nameText = scene.add.text(0, -50, challenge.name, {
      font: '12px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);
    this.sprite.add(nameText);

    // Add difficulty indicator
    const difficultyText = scene.add.text(0, 30, `Level ${challenge.difficulty}`, {
      font: '10px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);
    this.sprite.add(difficultyText);

    // Add interaction prompt
    const promptText = scene.add.text(0, 50, 'Press SPACE', {
      font: '8px monospace',
      color: '#f39c12'
    }).setOrigin(0.5);
    this.sprite.add(promptText);

    // Make interactive
    base.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.startChallenge());

    // Store reference for collision detection
    base.setData('challengeStation', this);

    // Add physics body
    scene.physics.add.existing(base);

    // Animate station
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private getDifficultyColor(difficulty: number): number {
    const colors = [0x2ecc71, 0xf39c12, 0xe67e22, 0xe74c3c, 0x8e44ad];
    return colors[Math.min(difficulty - 1, colors.length - 1)];
  }

  startChallenge() {
    console.log(`Starting challenge: ${this.challenge.name} in ${this.worldType} world`);
    
    // Transition to challenge scene
    this.scene.scene.start('ChallengeScene', {
      challenge: this.challenge,
      worldType: this.worldType
    });
  }
}
