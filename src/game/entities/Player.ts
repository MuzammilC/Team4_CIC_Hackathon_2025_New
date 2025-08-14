import * as Phaser from 'phaser';

export class Player {
  public sprite: Phaser.GameObjects.Rectangle;
  private speed: number = 200;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.rectangle(x, y, 32, 32, 0xf39c12);
    scene.physics.add.existing(this.sprite);
    
    // Cast to physics body to access velocity
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    
    // Make player slightly smaller for better movement feel
    body.setSize(28, 28);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasdKeys: any) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    
    // Reset velocity
    body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown || wasdKeys.A.isDown) {
      body.setVelocityX(-this.speed);
    } else if (cursors.right.isDown || wasdKeys.D.isDown) {
      body.setVelocityX(this.speed);
    }

    // Vertical movement
    if (cursors.up.isDown || wasdKeys.W.isDown) {
      body.setVelocityY(-this.speed);
    } else if (cursors.down.isDown || wasdKeys.S.isDown) {
      body.setVelocityY(this.speed);
    }

    // Normalize diagonal movement
    if (body.velocity.x !== 0 && body.velocity.y !== 0) {
      body.setVelocity(body.velocity.x * 0.707, body.velocity.y * 0.707);
    }
  }
}
