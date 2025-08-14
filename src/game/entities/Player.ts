import * as Phaser from 'phaser';

export class Player {
  public sprite: Phaser.GameObjects.Container;
  private speed: number = 200;
  private jumpSpeed: number = 400;
  private isJumping: boolean = false;
  private character: Phaser.GameObjects.Rectangle;
  private hat: Phaser.GameObjects.Rectangle;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    
    // Create a container to hold all the character parts
    this.sprite = scene.add.container(x, y);
    
    // Create Mario-like character using simple shapes
    // Body (red shirt)
    this.character = scene.add.rectangle(0, 0, 20, 24, 0xe74c3c);
    
    // Head (flesh tone)
    const head = scene.add.rectangle(0, -16, 16, 12, 0xfdbcb4);
    
    // Hat (red)
    this.hat = scene.add.rectangle(0, -20, 18, 6, 0xc0392b);
    
    // Overalls (blue)
    const overalls = scene.add.rectangle(0, 4, 16, 12, 0x3498db);
    
    // Mustache (brown)
    const mustache = scene.add.rectangle(0, -12, 8, 3, 0x8b4513);
    
    // Add all parts to container
    this.sprite.add([this.character, head, this.hat, overalls, mustache]);
    
    // Add physics to the container
    scene.physics.add.existing(this.sprite);
    
    // Cast to physics body to access velocity and properties
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setSize(20, 24); // Set physics body size
    
    // Store scene reference for later use
    // Gravity will be handled per-scene in their create() methods
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasdKeys: any) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    
    // Apply gravity manually for better control
    if (!body.blocked.down && !body.touching.down) {
      body.setVelocityY(body.velocity.y + 25); // Gravity effect
      this.isJumping = true;
    } else {
      this.isJumping = false;
    }
    
    // Horizontal movement
    let velocityX = 0;
    if (cursors.left.isDown || wasdKeys.A.isDown) {
      velocityX = -this.speed;
      this.sprite.setScale(-1, 1); // Flip sprite to face left
      this.addWalkAnimation();
    } else if (cursors.right.isDown || wasdKeys.D.isDown) {
      velocityX = this.speed;
      this.sprite.setScale(1, 1); // Face right
      this.addWalkAnimation();
    } else {
      this.stopWalkAnimation();
    }
    
    body.setVelocityX(velocityX);
    
    // Jumping (Mario-style)
    if ((cursors.up.isDown || wasdKeys.W.isDown || cursors.space.isDown) && !this.isJumping) {
      body.setVelocityY(-this.jumpSpeed);
      this.isJumping = true;
      this.addJumpAnimation();
    }
    
    // Vertical movement for non-physics worlds (like world map)
    if (this.scene.physics.world.gravity.y === 0) {
      // In worlds without gravity, use old movement system
      if (cursors.up.isDown || wasdKeys.W.isDown) {
        body.setVelocityY(-this.speed);
      } else if (cursors.down.isDown || wasdKeys.S.isDown) {
        body.setVelocityY(this.speed);
      } else {
        body.setVelocityY(0);
      }
    }
  }
  
  private addWalkAnimation() {
    // Simple walk animation by slightly moving the hat
    if (!this.hat.getData('walkTween')) {
      const walkTween = this.scene.tweens.add({
        targets: this.hat,
        y: -22,
        duration: 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
      this.hat.setData('walkTween', walkTween);
    }
  }
  
  private stopWalkAnimation() {
    const walkTween = this.hat.getData('walkTween');
    if (walkTween) {
      walkTween.destroy();
      this.hat.setData('walkTween', null);
      this.hat.y = -20; // Reset to default position
    }
  }
  
  private addJumpAnimation() {
    // Squash and stretch effect for jumping
    this.scene.tweens.add({
      targets: this.character,
      scaleY: 1.2,
      scaleX: 0.8,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
  }
}
