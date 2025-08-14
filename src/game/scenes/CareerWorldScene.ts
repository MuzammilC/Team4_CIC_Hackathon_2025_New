import * as Phaser from 'phaser';
import { Player } from '../entities/Player';
import { ChallengeStation } from '../entities/ChallengeStation';

export class CareerWorldScene extends Phaser.Scene {
  private player!: Player;
  private challengeStations!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private worldType!: string;
  private worldData!: any;

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
    
    // Add back button
    this.createBackButton();
    
    // Create challenge stations
    this.createChallengeStations();
    
    // Create player
    this.player = new Player(this, 100, 350);
    
    // Set up controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = this.input.keyboard!.addKeys('W,S,A,D');
    
    // Camera follow player
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setLerp(0.1, 0.1);
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
    // Create background
    this.add.rectangle(640, 360, 1280, 720, this.worldData.color);
    
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
        // Server terminals
        for (let i = 0; i < 3; i++) {
          this.add.rectangle(200 + i * 300, 150, 80, 60, 0x34495e);
          this.add.text(200 + i * 300, 150, 'SERVER', {
            font: '10px monospace',
            color: '#2ecc71'
          }).setOrigin(0.5);
        }
        break;
      case 'frontend':
        // Design tools
        this.add.rectangle(150, 150, 100, 80, 0xe74c3c);
        this.add.text(150, 150, 'DESIGN\nTOOLS', {
          font: '10px monospace',
          color: '#ffffff'
        }).setOrigin(0.5);
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

  private createBackButton() {
    const backButton = this.add.rectangle(100, 50, 120, 40, 0x95a5a6)
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

    this.worldData.challenges.forEach((challenge: any, index: number) => {
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
    if (this.player) {
      this.player.update(this.cursors, this.wasdKeys);
      
      // Check for challenge station interactions
      this.physics.overlap(this.player.sprite, this.challengeStations, (player, station) => {
        const stationObject = station.getData('challengeStation') as ChallengeStation;
        if (stationObject && this.input.keyboard!.checkDown(this.input.keyboard!.addKey('SPACE'), 250)) {
          stationObject.startChallenge();
        }
      });
    }
  }
}
