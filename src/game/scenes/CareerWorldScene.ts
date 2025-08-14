import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ChallengeStation } from '../entities/ChallengeStation';
import { fetchDynamicChallenge, mapWorldTypeToOccupation } from '../../utils/challengeApi';

export class CareerWorldScene extends Phaser.Scene {
  private player!: Player;
  private challengeStations!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: Record<string, Phaser.Input.Keyboard.Key>;
  private worldType!: string;
  private worldData!: {
    name: string;
    color: number;
    description: string;
    challenges: Array<{ name: string; difficulty: number; type: string }>;
  };

  constructor() {
    super({ key: 'CareerWorldScene' });
  }

  init(data: { worldType: string }) {
    this.worldType = data.worldType;
    this.worldData = this.getWorldData(data.worldType);
  }

  create() {
    // Create world background based on type
    this.createWorldEnvironment();
    
    // Set world bounds for worlds with background assets to limit movement to background
    if (this.worldType === 'backend') {
      // Backend world bounds - matches the yellow/brown background area
      this.physics.world.setBounds(50, 150, 1180, 470);
      this.cameras.main.setBounds(0, 0, 1280, 720);
    } else if (this.worldType === 'frontend') {
      // Frontend world bounds - matches the teal/cyan background area  
      this.physics.world.setBounds(50, 150, 1180, 470);
      this.cameras.main.setBounds(0, 0, 1280, 720);
    } else {
      this.physics.world.setBounds(0, 0, 1280, 720);
      this.cameras.main.setBounds(0, 0, 1280, 720);
    }
    
    // Add back button
    this.createBackButton();
    
    // Create challenge stations (or level stations for backend/frontend)
    if (this.worldType === 'backend') {
      this.createBackendLevels();
    } else if (this.worldType === 'frontend') {
      this.createFrontendLevels();
    } else {
      this.createChallengeStations();
    }
    
    // Create player at appropriate starting position
    if (this.worldType === 'backend' || this.worldType === 'frontend') {
      this.player = new Player(this, 150, 400); // Start within background bounds
    } else {
      this.player = new Player(this, 100, 350);
    }
    
    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D') as Record<string, Phaser.Input.Keyboard.Key>;
    
    // Camera follow player with appropriate bounds
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setLerp(0.1, 0.1);
    
    // Set camera deadzone for smoother movement in background worlds
    if (this.worldType === 'backend' || this.worldType === 'frontend') {
      this.cameras.main.setDeadzone(400, 300);
    }
  }

  private getWorldData(worldType: string) {
    const worldsData = {
      backend: {
        name: 'Backend Development Lab',
        color: 0x2c3e50,
        description: 'Master server-side development',
        challenges: [
          { name: 'API Debugging', difficulty: 1, type: 'debug' },
          { name: 'Database Optimization', difficulty: 2, type: 'optimization' },
          { name: 'System Architecture', difficulty: 3, type: 'design' },
          { name: 'Load Testing', difficulty: 2, type: 'testing' },
          { name: 'Microservices', difficulty: 4, type: 'architecture' }
        ]
      },
      frontend: {
        name: 'Frontend Design Studio',
        color: 0x8e44ad,
        description: 'Create amazing user experiences',
        challenges: [
          { name: 'Component Layout', difficulty: 1, type: 'layout' },
          { name: 'CSS Positioning', difficulty: 2, type: 'styling' },
          { name: 'User Flow Design', difficulty: 3, type: 'ux' },
          { name: 'Responsive Design', difficulty: 2, type: 'responsive' },
          { name: 'Animation System', difficulty: 4, type: 'animation' }
        ]
      },
      datascience: {
        name: 'Data Science Laboratory',
        color: 0x27ae60,
        description: 'Unlock insights from data',
        challenges: [
          { name: 'Data Cleaning', difficulty: 1, type: 'preprocessing' },
          { name: 'Feature Engineering', difficulty: 2, type: 'features' },
          { name: 'Model Selection', difficulty: 3, type: 'modeling' },
          { name: 'Results Analysis', difficulty: 2, type: 'analysis' },
          { name: 'ML Pipeline', difficulty: 4, type: 'pipeline' }
        ]
      }
    };
    return worldsData[worldType as keyof typeof worldsData];
  }

  private createWorldEnvironment() {
    // Create world-specific background
    if (this.worldType === 'backend' && this.textures.exists('backend-bg')) {
      // Use the backend background asset
      const background = this.add.image(640, 360, 'backend-bg');
      background.setDisplaySize(1280, 720);
      background.setOrigin(0.5, 0.5);
    } else if (this.worldType === 'frontend' && this.textures.exists('frontend-bg')) {
      // Use the frontend background asset
      const background = this.add.image(640, 360, 'frontend-bg');
      background.setDisplaySize(1280, 720);
      background.setOrigin(0.5, 0.5);
    } else {
      // Create fallback background
      this.add.rectangle(640, 360, 1280, 720, this.worldData.color);
    }
    
    // Add world title
    this.add.text(640, 50, this.worldData.name, {
      font: 'bold 32px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    this.add.text(640, 85, this.worldData.description, {
      font: '18px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Add decorative elements based on world type
    this.createWorldDecorations();
  }

  private createWorldDecorations() {
    switch (this.worldType) {
      case 'backend':
        this.createBackendEnvironment();
        break;
      case 'frontend':
        this.createFrontendEnvironment();
        break;
      case 'datascience':
        // Data visualizations
        for (let i = 0; i < 4; i++) {
          this.add.rectangle(200 + i * 200, 150, 60, 40, 0x3498db);
          this.add.text(200 + i * 200, 150, 'CHART', {
            font: '8px monospace',
            color: '#ffffff'
          }).setOrigin(0.5);
        }
        break;
    }
  }

  private createBackendEnvironment() {
    // Add some atmospheric elements
    this.createBackendAtmosphere();
  }

  private createFrontendEnvironment() {
    // Add some atmospheric elements for the frontend design studio
    this.createFrontendAtmosphere();
  }

  private createBackendAtmosphere() {
    // Add subtle grid pattern for tech feel (only within movement bounds)
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x34495e, 0.15);
    
    // Vertical lines (within movement bounds)
    for (let x = 80; x < 1200; x += 40) {
      grid.moveTo(x, 180);
      grid.lineTo(x, 580);
    }
    
    // Horizontal lines (within movement bounds)
    for (let y = 180; y < 580; y += 40) {
      grid.moveTo(80, y);
      grid.lineTo(1200, y);
    }
    
    grid.strokePath();
  }

  private createFrontendAtmosphere() {
    // Add subtle creative design pattern for frontend feel (only within movement bounds)
    const designGrid = this.add.graphics();
    designGrid.lineStyle(1, 0x9b59b6, 0.12); // Purple tint for design studio
    
    // Create diagonal lines for a more creative feel (within movement bounds)
    for (let x = 80; x < 1200; x += 60) {
      designGrid.moveTo(x, 180);
      designGrid.lineTo(x + 30, 580);
    }
    
    for (let x = 110; x < 1200; x += 60) {
      designGrid.moveTo(x, 180);
      designGrid.lineTo(x - 30, 580);
    }
    
    designGrid.strokePath();
  }

  private createFrontendLevels() {
    // Level definitions matching the desired frontend studio layout
    const levels = [
      { asset: 'frontend-paintbrush', name: 'Design Tools', level: 1, x: 200, y: 260, scale: 0.5 },        // Top level, left (design tools area)
      { asset: 'frontend-man', name: 'Component Layout', level: 2, x: 750, y: 200, scale: 0.5 },          // Top level, center-right  
      { asset: 'frontend-arcade', name: 'Interactive Systems', level: 3, x: 200, y: 550, scale: 0.6 },    // Bottom level, left
      { asset: 'frontend-speaker', name: 'Audio/Visual Design', level: 4, x: 650, y: 600, scale: 0.5 },   // Bottom level, center
      { asset: 'frontend-plant', name: 'Environment Setup', level: 5, x: 950, y: 600, scale: 0.5 }        // Bottom level, right (with computer)
    ];

    levels.forEach(levelData => {
      if (this.textures.exists(levelData.asset)) {
        // Create the level asset
        const levelAsset = this.add.image(levelData.x, levelData.y, levelData.asset);
        levelAsset.setScale(levelData.scale);
        levelAsset.setInteractive({ useHandCursor: true });
        
        // Add click handler to enter level
        levelAsset.on('pointerdown', async () => {
          await this.enterFrontendLevel(levelData.level, levelData.name);
        });

        // Add level indicator background
        const indicatorBg = this.add.rectangle(levelData.x, levelData.y - 60, 80, 25, 0x2c3e50, 0.8);
        indicatorBg.setStrokeStyle(2, 0x9b59b6); // Purple theme for frontend

        // Add level number and name (store references for animation)
        const levelNumberText = this.add.text(levelData.x, levelData.y - 68, `Level ${levelData.level}`, {
          font: 'bold 10px monospace',
          color: '#9b59b6'
        }).setOrigin(0.5);

        const levelNameText = this.add.text(levelData.x, levelData.y - 55, levelData.name, {
          font: '8px monospace',
          color: '#ecf0f1'
        }).setOrigin(0.5);

        // Add interaction prompt on hover
        levelAsset.on('pointerover', () => {
          const prompt = this.add.text(levelData.x, levelData.y + 40, 'Click to enter', {
            font: 'bold 10px monospace',
            color: '#e74c3c',
            backgroundColor: '#2c3e50',
            padding: { x: 6, y: 3 }
          }).setOrigin(0.5).setName(`prompt-${levelData.level}`);

          this.tweens.add({
            targets: prompt,
            alpha: 0.8,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 400,
            yoyo: true,
            repeat: -1
          });
        });

        levelAsset.on('pointerout', () => {
          const prompt = this.children.getByName(`prompt-${levelData.level}`);
          if (prompt) {
            prompt.destroy();
          }
        });

        // Add gentle floating animation for all elements together
        this.tweens.add({
          targets: [levelAsset, indicatorBg, levelNumberText, levelNameText],
          y: '-=1.5', // Subtle floating - move up by 1.5 pixels
          duration: 2500 + (levelData.level * 300), // Slightly longer, different timing per level
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  private async enterFrontendLevel(level: number, name: string) {
    console.log(`Entering Frontend Level ${level}: ${name}`);
    
    // Show loading indicator
    const loadingText = this.add.text(640, 360, 'Loading challenge...', {
      font: 'bold 24px monospace',
      color: '#9b59b6'
    }).setOrigin(0.5);

    try {
      // Fetch dynamic challenge from API
      const occupation = mapWorldTypeToOccupation(this.worldType);
      const dynamicChallenge = await fetchDynamicChallenge(occupation, level);

      // Create a challenge based on the level
      const challenge = {
        id: `frontend-level-${level}`,
        name: name,
        difficulty: level,
        type: this.getFrontendLevelType(level),
        worldType: 'frontend'
      };

      // Remove loading indicator
      loadingText.destroy();

      // Transition to challenge scene with API-fetched challenge
      this.scene.start('ChallengeScene', {
        challenge: challenge,
        worldType: this.worldType,
        dynamicChallenge: dynamicChallenge
      });
    } catch (error) {
      console.error('Failed to load challenge:', error);
      loadingText.setText('Failed to load challenge. Click to retry.');
      loadingText.setInteractive({ useHandCursor: true })
        .on('pointerdown', async () => {
          loadingText.destroy();
          await this.enterFrontendLevel(level, name);
        });
    }
  }

  private getFrontendLevelType(level: number): string {
    const levelTypes = {
      1: 'design',        // Design tools and prototyping
      2: 'components',    // Component layout and structure
      3: 'interactive',   // Interactive systems and user experience
      4: 'multimedia',    // Audio/visual design and responsive design
      5: 'environment'    // Development environment and optimization
    };
    return levelTypes[level as keyof typeof levelTypes] || 'general';
  }

  private createBackendLevels() {
    // Level definitions matching the desired layout from first image
    const levels = [
      { asset: 'backend-plant', name: 'Plant Care', level: 1, x: 250, y: 260, scale: 0.5 },          // Top shelf, left (with computer)
      { asset: 'backend-server', name: 'Server Management', level: 2, x: 700, y: 240, scale: 0.6 },  // Top shelf, middle-right
      { asset: 'backend-server2', name: 'Advanced Servers', level: 3, x: 950, y: 240, scale: 0.6 }, // Top shelf, far right
      { asset: 'backend-file', name: 'File Systems', level: 4, x: 400, y: 500, scale: 0.7 },        // Bottom shelf, left
      { asset: 'backend-vault', name: 'Security Vault', level: 5, x: 900, y: 520, scale: 0.6 }      // Bottom shelf, right
    ];

    levels.forEach(levelData => {
      if (this.textures.exists(levelData.asset)) {
        // Create the level asset
        const levelAsset = this.add.image(levelData.x, levelData.y, levelData.asset);
        levelAsset.setScale(levelData.scale);
        levelAsset.setInteractive({ useHandCursor: true });
        
        // Add click handler to enter level
        levelAsset.on('pointerdown', async () => {
          await this.enterLevel(levelData.level, levelData.name);
        });

        // Add level indicator background
        const indicatorBg = this.add.rectangle(levelData.x, levelData.y - 60, 80, 25, 0x2c3e50, 0.8);
        indicatorBg.setStrokeStyle(2, 0x3498db);

        // Add level number and name (store references for animation)
        const levelNumberText = this.add.text(levelData.x, levelData.y - 68, `Level ${levelData.level}`, {
          font: 'bold 10px monospace',
          color: '#3498db'
        }).setOrigin(0.5);

        const levelNameText = this.add.text(levelData.x, levelData.y - 55, levelData.name, {
          font: '8px monospace',
          color: '#ecf0f1'
        }).setOrigin(0.5);

        // Add interaction prompt on hover
        levelAsset.on('pointerover', () => {
          const prompt = this.add.text(levelData.x, levelData.y + 40, 'Click to enter', {
            font: 'bold 10px monospace',
            color: '#f39c12',
            backgroundColor: '#2c3e50',
            padding: { x: 6, y: 3 }
          }).setOrigin(0.5).setName(`prompt-${levelData.level}`);

          this.tweens.add({
            targets: prompt,
            alpha: 0.8,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 400,
            yoyo: true,
            repeat: -1
          });
        });

        levelAsset.on('pointerout', () => {
          const prompt = this.children.getByName(`prompt-${levelData.level}`);
          if (prompt) {
            prompt.destroy();
          }
        });

        // Add gentle floating animation for all elements together
        this.tweens.add({
          targets: [levelAsset, indicatorBg, levelNumberText, levelNameText],
          y: '-=1.5', // Subtle floating - move up by 1.5 pixels
          duration: 2500 + (levelData.level * 300), // Slightly longer, different timing per level
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  private async enterLevel(level: number, name: string) {
    console.log(`Entering Level ${level}: ${name}`);
    
    // Show loading indicator
    const loadingText = this.add.text(640, 360, 'Loading challenge...', {
      font: 'bold 24px monospace',
      color: '#3498db'
    }).setOrigin(0.5);

    try {
      // Fetch dynamic challenge from API
      const occupation = mapWorldTypeToOccupation(this.worldType);
      const dynamicChallenge = await fetchDynamicChallenge(occupation, level);

      // Create a challenge based on the level
      const challenge = {
        id: `backend-level-${level}`,
        name: name,
        difficulty: level,
        type: this.getLevelType(level),
        worldType: 'backend'
      };

      // Remove loading indicator
      loadingText.destroy();

      // Transition to challenge scene with API-fetched challenge
      this.scene.start('ChallengeScene', {
        challenge: challenge,
        worldType: this.worldType,
        dynamicChallenge: dynamicChallenge
      });
    } catch (error) {
      console.error('Failed to load challenge:', error);
      loadingText.setText('Failed to load challenge. Click to retry.');
      loadingText.setInteractive({ useHandCursor: true })
        .on('pointerdown', async () => {
          loadingText.destroy();
          await this.enterLevel(level, name);
        });
    }
  }

  private getLevelType(level: number): string {
    const levelTypes = {
      1: 'environment',    // Plant care - environment setup
      2: 'server',         // Server management
      3: 'architecture',   // Advanced server architecture
      4: 'filesystem',     // File system management
      5: 'security'        // Security and vault management
    };
    return levelTypes[level as keyof typeof levelTypes] || 'general';
  }

  private createBackButton() {
    this.add.rectangle(100, 50, 120, 40, 0x95a5a6)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('WorldMapScene');
      });

    this.add.text(100, 50, '← Back', {
      font: '16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private createChallengeStations() {
    this.challengeStations = this.add.group();

    this.worldData.challenges.forEach((challenge: { name: string; difficulty: number; type: string }, index: number) => {
      const station = new ChallengeStation(
        this,
        300 + (index % 3) * 250,
        250 + Math.floor(index / 3) * 200,
        challenge,
        this.worldType
      );
      this.challengeStations.add(station.sprite);
    });
  }

  update() {
    if (this.player && this.cursors && this.wasdKeys) {
      this.player.update(this.cursors, this.wasdKeys);
      
      // Check for challenge station interactions
      this.physics.overlap(this.player.sprite, this.challengeStations, (_player, stationObj) => {
        const station = stationObj as Phaser.GameObjects.GameObject & { getData?: (key: string) => ChallengeStation };
        if (station && typeof station.getData === 'function') {
          const challengeStation = station.getData('challengeStation');
          if (challengeStation && this.input.keyboard!.checkDown(this.input.keyboard!.addKey('SPACE'), 250)) {
            challengeStation.startChallenge();
          }
        }
      });
    }
  }
}
