import * as Phaser from 'phaser';
import { Player } from '../entities/Player';

export class WorldMapScene extends Phaser.Scene {
  private player!: Player;
  private worldPortals!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: Record<string, Phaser.Input.Keyboard.Key>;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private nearBuilding: string | null = null;

  constructor() {
    super({ key: 'WorldMapScene' });
  }

  create() {
    // Use the background asset if available, otherwise create programmatic background
    if (this.textures.exists('career-background')) {
      this.createAssetBackground();
    } else {
      this.createLandscapeBackground();
    }
    
    // Set world bounds to restrict player movement to the background area
    this.physics.world.setBounds(100, 100, 1080, 520);
    
    // Add title with better styling
    this.add.text(640, 80, 'Choose Your Career Path', {
      font: 'bold 36px monospace',
      color: '#2c3e50',
      stroke: '#ffffff',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Create world portals using assets or fallback to programmatic designs
    this.createWorldPortals();
    
    // Create player
    this.player = new Player(this, 640, 500);
    
    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D') as Record<string, Phaser.Input.Keyboard.Key>;
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    // Camera follow player with bounds
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 1280, 720);
  }

  private createLandscapeBackground() {
    // Sky gradient background
    const skyGradient = this.add.graphics();
    skyGradient.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98, 1);
    skyGradient.fillRect(0, 0, 1280, 720);

    // Ground layers
    // Back grass layer (lighter green)
    this.add.rectangle(640, 480, 1280, 280, 0x32CD32);
    
    // Front grass layer (darker green)
    this.add.rectangle(640, 560, 1280, 200, 0x228B22);

    // Water at the bottom (matching Figma design)
    this.add.rectangle(640, 680, 1280, 80, 0x4169E1);
    
    // Water waves effect
    const waves = this.add.graphics();
    waves.lineStyle(2, 0x6495ED);
    for (let i = 0; i < 8; i++) {
      const x = i * 160;
      waves.beginPath();
      waves.arc(x, 640, 20, 0, Math.PI, false);
      waves.strokePath();
      waves.beginPath();
      waves.arc(x + 80, 650, 15, 0, Math.PI, false);
      waves.strokePath();
    }

    // Wooden posts/pillars (taller to reach into water)
    const posts = [300, 640, 980];
    posts.forEach(x => {
      this.add.rectangle(x, 470, 20, 200, 0xDEB887);
      // Post shadow
      this.add.rectangle(x + 10, 470, 8, 200, 0x8B7355, 0.5);
    });
  }

  private createAssetBackground() {
    // Use the SVG background asset
    const background = this.add.image(640, 360, 'career-background');
    background.setDisplaySize(1280, 720);
    background.setOrigin(0.5, 0.5);
  }

  private createWorldPortals() {
    this.worldPortals = this.add.group();

    // Data Science Building (left) - use asset if available
    let dataScienceBuilding: Phaser.GameObjects.GameObject;
    if (this.textures.exists('datascience-building')) {
      dataScienceBuilding = this.add.image(300, 340, 'datascience-building');
      (dataScienceBuilding as Phaser.GameObjects.Image).setScale(0.45); // Reduced size
    } else {
      dataScienceBuilding = this.createDataScienceBuilding(300, 340);
    }
    
    dataScienceBuilding.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.enterWorld('datascience'));
    dataScienceBuilding.setData('worldType', 'datascience');

    // Position text properly above the building
    this.add.text(300, 220, 'Data Science/ML', {
      font: 'bold 18px monospace',
      color: '#2c3e50',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);

    this.add.text(300, 245, 'Analytics • ML • AI', {
      font: '12px monospace',
      color: '#1a5d1a'
    }).setOrigin(0.5);

    // Frontend Building (middle) - use asset if available
    let frontendBuilding: Phaser.GameObjects.GameObject;
    if (this.textures.exists('frontend-building')) {
      frontendBuilding = this.add.image(640, 340, 'frontend-building');
      (frontendBuilding as Phaser.GameObjects.Image).setScale(0.45); // Reduced size
    } else {
      frontendBuilding = this.createFrontendBuilding(640, 340);
    }
    
    frontendBuilding.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.enterWorld('frontend'));
    frontendBuilding.setData('worldType', 'frontend');

    // Position text properly above the building
    this.add.text(640, 220, 'Frontend/UI', {
      font: 'bold 18px monospace',
      color: '#2c3e50',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);

    this.add.text(640, 245, 'Design • UX • Interfaces', {
      font: '12px monospace',
      color: '#1a4d8a'
    }).setOrigin(0.5);

    // Backend Building (right) - use asset if available
    let backendBuilding: Phaser.GameObjects.GameObject;
    if (this.textures.exists('backend-building')) {
      backendBuilding = this.add.image(980, 340, 'backend-building');
      (backendBuilding as Phaser.GameObjects.Image).setScale(0.45); // Reduced size
    } else {
      backendBuilding = this.createBackendBuilding(980, 340);
    }
    
    backendBuilding.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.enterWorld('backend'));
    backendBuilding.setData('worldType', 'backend');

    // Position text properly above the building
    this.add.text(980, 220, 'Backend Dev', {
      font: 'bold 18px monospace',
      color: '#2c3e50',
      stroke: '#ffffff',
      strokeThickness: 1
    }).setOrigin(0.5);

    this.add.text(980, 245, 'APIs • Databases • Systems', {
      font: '12px monospace',
      color: '#8B4513'
    }).setOrigin(0.5);

    this.worldPortals.addMultiple([dataScienceBuilding, frontendBuilding, backendBuilding]);

    // Add gentle floating animation to buildings
    this.worldPortals.children.entries.forEach((building, index) => {
      const gameObject = building as Phaser.GameObjects.GameObject & { y: number };
      this.tweens.add({
        targets: gameObject,
        y: gameObject.y - 5,
        duration: 2000 + (index * 300),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  private createDataScienceBuilding(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Main building structure (green with dark green roof)
    const building = this.add.rectangle(0, 0, 140, 120, 0x228B22);
    building.setStrokeStyle(3, 0x0F4F0F);
    container.add(building);

    // Brown roof
    const roof = this.add.rectangle(0, -65, 150, 25, 0x8B4513);
    roof.setStrokeStyle(2, 0x654321);
    container.add(roof);

    // Header sign
    const headerBg = this.add.rectangle(0, -65, 140, 20, 0x654321);
    container.add(headerBg);
    
    const headerText = this.add.text(0, -65, 'DATA SCIENCE CENTRE', {
      font: 'bold 8px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    container.add(headerText);

    // Interior display window
    const displayWindow = this.add.rectangle(0, 10, 110, 80, 0xF0F8FF);
    displayWindow.setStrokeStyle(2, 0x654321);
    container.add(displayWindow);

    // Data visualizations inside
    // Line chart (red trending up)
    const chartPoints = [
      { x: -40, y: 40 }, { x: -20, y: 30 }, { x: 0, y: 20 }, 
      { x: 20, y: 10 }, { x: 40, y: -10 }
    ];
    
    const lineChart = this.add.graphics();
    lineChart.lineStyle(3, 0xFF0000);
    lineChart.beginPath();
    lineChart.moveTo(chartPoints[0].x, chartPoints[0].y);
    chartPoints.forEach((point, i) => {
      if (i > 0) lineChart.lineTo(point.x, point.y);
    });
    lineChart.strokePath();
    container.add(lineChart);

    // Bar chart (multi-colored)
    const barColors = [0x4169E1, 0x32CD32, 0xFFD700, 0xFF4500];
    for (let i = 0; i < 4; i++) {
      const barHeight = 15 + (i * 8);
      const bar = this.add.rectangle(-25 + (i * 15), 25 - (barHeight / 2), 10, barHeight, barColors[i]);
      container.add(bar);
    }

    // Pie chart
    const pieChart = this.add.graphics();
    const pieX = 25, pieY = 35, radius = 12;
    
    // Blue slice (largest)
    pieChart.fillStyle(0x4169E1);
    pieChart.slice(pieX, pieY, radius, 0, Math.PI, false);
    pieChart.fillPath();
    
    // Red slice
    pieChart.fillStyle(0xFF0000);
    pieChart.slice(pieX, pieY, radius, Math.PI, Math.PI * 1.5, false);
    pieChart.fillPath();
    
    // Yellow slice
    pieChart.fillStyle(0xFFD700);
    pieChart.slice(pieX, pieY, radius, Math.PI * 1.5, Math.PI * 2, false);
    pieChart.fillPath();
    
    container.add(pieChart);

    // Door
    const door = this.add.rectangle(0, 45, 20, 30, 0x654321);
    container.add(door);

    return container;
  }

  private createFrontendBuilding(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Main building structure (blue)
    const building = this.add.rectangle(0, 0, 140, 120, 0x4169E1);
    building.setStrokeStyle(3, 0x1E3A8A);
    container.add(building);

    // URL header bar
    const urlBar = this.add.rectangle(0, -65, 140, 20, 0xD2691E);
    container.add(urlBar);
    
    const urlText = this.add.text(0, -65, 'http://frontend.com', {
      font: 'bold 8px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    container.add(urlText);

    // Windows (browser-like)
    const windowPositions = [
      { x: -35, y: -20 }, { x: 5, y: -20 },
      { x: -35, y: 20 }, { x: 5, y: 20 }
    ];

    windowPositions.forEach(pos => {
      const window = this.add.rectangle(pos.x, pos.y, 25, 20, 0xF0F8FF);
      window.setStrokeStyle(2, 0x8B4513);
      container.add(window);
    });

    // Door (darker blue)
    const door = this.add.rectangle(35, 25, 20, 35, 0x1E3A8A);
    door.setStrokeStyle(2, 0x0F1F5A);
    container.add(door);

    // Decorative flowers (left side)
    this.createFlowerCluster(container, -70, 40, 0xFF69B4); // Pink flowers
    
    // Decorative flowers (right side) 
    this.createFlowerCluster(container, 70, 40, 0x9370DB); // Purple flowers

    return container;
  }

  private createBackendBuilding(x: number, y: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Main building structure (yellow/orange)
    const building = this.add.rectangle(0, 10, 140, 100, 0xFFD700);
    building.setStrokeStyle(3, 0xFFA500);
    container.add(building);

    // Blue header with code brackets
    const header = this.add.rectangle(0, -65, 140, 30, 0x4169E1);
    header.setStrokeStyle(2, 0x1E3A8A);
    container.add(header);

    const codeSymbol = this.add.text(0, -65, '</>', {
      font: 'bold 16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    container.add(codeSymbol);

    // Grid of blue rectangles (representing code/terminal windows)
    const gridPositions = [
      { x: -35, y: -10 }, { x: -5, y: -10 }, { x: 25, y: -10 },
      { x: -35, y: 15 }, { x: -5, y: 15 }, { x: 25, y: 15 }
    ];

    gridPositions.forEach(pos => {
      const codeWindow = this.add.rectangle(pos.x, pos.y, 20, 15, 0x4169E1);
      codeWindow.setStrokeStyle(1, 0x1E3A8A);
      container.add(codeWindow);
    });

    // Door
    const door = this.add.rectangle(0, 45, 20, 30, 0x8B4513);
    container.add(door);

    return container;
  }

  private createFlowerCluster(container: Phaser.GameObjects.Container, x: number, y: number, color: number) {
    // Create a small cluster of pixelated flowers
    const flowers = [
      { x: x, y: y },
      { x: x - 8, y: y + 8 },
      { x: x + 8, y: y + 8 }
    ];

    flowers.forEach(pos => {
      // Flower petals (small squares arranged in + pattern)
      const petals = [
        { x: pos.x, y: pos.y - 3 }, // top
        { x: pos.x, y: pos.y + 3 }, // bottom  
        { x: pos.x - 3, y: pos.y }, // left
        { x: pos.x + 3, y: pos.y }, // right
        { x: pos.x, y: pos.y }      // center
      ];

      petals.forEach(petal => {
        const petalSquare = this.add.rectangle(petal.x, petal.y, 3, 3, color);
        container.add(petalSquare);
      });

      // Green stem
      const stem = this.add.rectangle(pos.x, pos.y + 8, 2, 8, 0x228B22);
      container.add(stem);
    });
  }

  private enterWorld(worldType: string) {
    this.scene.start('CareerWorldScene', { worldType });
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors, this.wasdKeys);
      
      // Check proximity to buildings for space key interaction
      this.checkBuildingProximity();
      
      // Handle space key press
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.nearBuilding) {
        this.enterWorld(this.nearBuilding);
      }
    }
  }

  private checkBuildingProximity() {
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;
    const interactionDistance = 120; // Slightly larger for better UX with assets
    
    // Reset near building
    this.nearBuilding = null;
    
    // Check distance to each building (updated positions)
    const buildings = [
      { x: 300, y: 340, type: 'datascience' },
      { x: 640, y: 340, type: 'frontend' },
      { x: 980, y: 340, type: 'backend' }
    ];
    
    buildings.forEach(building => {
      const distance = Phaser.Math.Distance.Between(playerX, playerY, building.x, building.y);
      if (distance < interactionDistance) {
        this.nearBuilding = building.type;
        
        // Show interaction prompt with better styling
        if (!this.children.getByName('interactionPrompt')) {
          const prompt = this.add.text(playerX, playerY - 50, 'Press SPACE to enter', {
            font: 'bold 16px monospace',
            color: '#ffffff',
            backgroundColor: '#2c3e50',
            padding: { x: 12, y: 6 }
          }).setOrigin(0.5).setName('interactionPrompt');
          
          // Enhanced prompt animation
          this.tweens.add({
            targets: prompt,
            alpha: 0.9,
            scaleX: 1.05,
            scaleY: 1.05,
            y: playerY - 55,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }
    });
    
    // Remove interaction prompt if not near any building
    if (!this.nearBuilding) {
      const prompt = this.children.getByName('interactionPrompt');
      if (prompt) {
        this.tweens.killTweensOf(prompt);
        prompt.destroy();
      }
    } else {
      // Update prompt position to follow player
      const prompt = this.children.getByName('interactionPrompt') as Phaser.GameObjects.Text;
      if (prompt) {
        prompt.setPosition(playerX, playerY - 50);
      }
    }
  }
}
