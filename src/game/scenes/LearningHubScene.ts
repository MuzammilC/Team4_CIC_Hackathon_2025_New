import * as Phaser from 'phaser';

export class LearningHubScene extends Phaser.Scene {
  private worldType!: string;
  private challenge!: any;
  private performance!: any;

  constructor() {
    super({ key: 'LearningHubScene' });
  }

  init(data: { worldType: string; challenge: any; performance: any }) {
    this.worldType = data.worldType;
    this.challenge = data.challenge;
    this.performance = data.performance;
  }

  create() {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x2c3e50);

    // Header
    this.add.text(640, 50, 'Learning Hub', {
      font: 'bold 32px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    this.add.text(640, 90, `Curated Resources for ${this.worldType.toUpperCase()}`, {
      font: '18px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Create resource sections
    this.createResourceSections();
    this.createBackButton();
  }

  private createResourceSections() {
    const resources = this.getCuratedResources();
    
    // Tutorials section
    this.createResourceSection('Tutorials', resources.tutorials, 200, 0x3498db);
    
    // Documentation section
    this.createResourceSection('Documentation', resources.documentation, 640, 0x27ae60);
    
    // Practice sites section
    this.createResourceSection('Practice', resources.practice, 1080, 0xf39c12);
  }

  private createResourceSection(title: string, resources: any[], x: number, color: number) {
    const container = this.add.container(x, 350);

    // Section background
    const bg = this.add.rectangle(0, 0, 300, 400, 0x34495e);
    bg.setStrokeStyle(2, color);
    container.add(bg);

    // Section title
    const titleText = this.add.text(0, -180, title, {
      font: 'bold 20px monospace',
      color: color.toString(16)
    }).setOrigin(0.5);
    container.add(titleText);

    // Resource items
    resources.forEach((resource, index) => {
      const resourceBg = this.add.rectangle(0, -120 + index * 60, 280, 50, color, 0.2)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.openResource(resource);
        });
      container.add(resourceBg);

      const resourceText = this.add.text(0, -120 + index * 60, resource.name, {
        font: '14px monospace',
        color: '#ecf0f1',
        wordWrap: { width: 260 }
      }).setOrigin(0.5);
      container.add(resourceText);
    });
  }

  private getCuratedResources() {
    const resourcesData = {
      backend: {
        tutorials: [
          { name: 'REST API Design', url: '#', difficulty: 'Beginner' },
          { name: 'Database Optimization', url: '#', difficulty: 'Intermediate' },
          { name: 'Microservices Architecture', url: '#', difficulty: 'Advanced' },
          { name: 'System Design Patterns', url: '#', difficulty: 'Advanced' },
          { name: 'Performance Tuning', url: '#', difficulty: 'Expert' }
        ],
        documentation: [
          { name: 'Node.js Official Docs', url: '#', type: 'Official' },
          { name: 'Express.js Guide', url: '#', type: 'Framework' },
          { name: 'PostgreSQL Manual', url: '#', type: 'Database' },
          { name: 'Redis Documentation', url: '#', type: 'Cache' },
          { name: 'Docker Reference', url: '#', type: 'DevOps' }
        ],
        practice: [
          { name: 'LeetCode System Design', url: '#', type: 'Challenges' },
          { name: 'HackerRank Backend', url: '#', type: 'Practice' },
          { name: 'Codewars API Challenges', url: '#', type: 'Kata' },
          { name: 'Design Gurus', url: '#', type: 'System Design' },
          { name: 'Educative.io Courses', url: '#', type: 'Learning' }
        ]
      },
      frontend: {
        tutorials: [
          { name: 'React Fundamentals', url: '#', difficulty: 'Beginner' },
          { name: 'CSS Grid & Flexbox', url: '#', difficulty: 'Beginner' },
          { name: 'JavaScript ES6+', url: '#', difficulty: 'Intermediate' },
          { name: 'UI/UX Design Principles', url: '#', difficulty: 'Intermediate' },
          { name: 'Advanced React Patterns', url: '#', difficulty: 'Advanced' }
        ],
        documentation: [
          { name: 'MDN Web Docs', url: '#', type: 'Reference' },
          { name: 'React Documentation', url: '#', type: 'Framework' },
          { name: 'CSS-Tricks', url: '#', type: 'Tips' },
          { name: 'Can I Use', url: '#', type: 'Compatibility' },
          { name: 'Web Accessibility Guide', url: '#', type: 'A11y' }
        ],
        practice: [
          { name: 'Frontend Mentor', url: '#', type: 'Challenges' },
          { name: 'CodePen Challenges', url: '#', type: 'Creative' },
          { name: 'CSS Battle', url: '#', type: 'CSS Games' },
          { name: 'JavaScript30', url: '#', type: 'Vanilla JS' },
          { name: 'freeCodeCamp', url: '#', type: 'Curriculum' }
        ]
      },
      datascience: {
        tutorials: [
          { name: 'Python for Data Science', url: '#', difficulty: 'Beginner' },
          { name: 'Pandas Data Manipulation', url: '#', difficulty: 'Beginner' },
          { name: 'Machine Learning Basics', url: '#', difficulty: 'Intermediate' },
          { name: 'Deep Learning with TensorFlow', url: '#', difficulty: 'Advanced' },
          { name: 'MLOps and Deployment', url: '#', difficulty: 'Expert' }
        ],
        documentation: [
          { name: 'Pandas Documentation', url: '#', type: 'Library' },
          { name: 'Scikit-learn User Guide', url: '#', type: 'ML Library' },
          { name: 'TensorFlow Docs', url: '#', type: 'Deep Learning' },
          { name: 'Matplotlib Gallery', url: '#', type: 'Visualization' },
          { name: 'NumPy Reference', url: '#', type: 'Numerical' }
        ],
        practice: [
          { name: 'Kaggle Competitions', url: '#', type: 'Competitions' },
          { name: 'Google Colab', url: '#', type: 'Environment' },
          { name: 'DataCamp Practice', url: '#', type: 'Interactive' },
          { name: 'Papers With Code', url: '#', type: 'Research' },
          { name: 'Towards Data Science', url: '#', type: 'Articles' }
        ]
      }
    };

    return resourcesData[this.worldType as keyof typeof resourcesData] || resourcesData.backend;
  }

  private openResource(resource: any) {
    console.log(`Opening resource: ${resource.name}`);
    // In a real implementation, this would open the resource URL
    // For now, we'll just show a message
    
    const messageOverlay = this.add.container(640, 360);
    
    const overlay = this.add.rectangle(0, 0, 400, 200, 0x34495e, 0.95);
    overlay.setStrokeStyle(2, 0x3498db);
    messageOverlay.add(overlay);

    const messageText = this.add.text(0, -30, `Opening:\n${resource.name}`, {
      font: '16px monospace',
      color: '#ecf0f1',
      align: 'center'
    }).setOrigin(0.5);
    messageOverlay.add(messageText);

    const closeButton = this.add.rectangle(0, 50, 100, 40, 0x3498db)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        messageOverlay.destroy();
      });
    messageOverlay.add(closeButton);

    const closeText = this.add.text(0, 50, 'Close', {
      font: '14px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    messageOverlay.add(closeText);
  }

  private createBackButton() {
    this.add.rectangle(100, 650, 200, 50, 0x95a5a6)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('AnalysisScene', {
          performance: this.performance,
          challenge: this.challenge,
          worldType: this.worldType
        });
      });

    this.add.text(100, 650, '← Back to Analysis', {
      font: '16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}
