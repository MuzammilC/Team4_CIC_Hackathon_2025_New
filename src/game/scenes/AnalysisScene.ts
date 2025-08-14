import * as Phaser from 'phaser';

export class AnalysisScene extends Phaser.Scene {
  private performance!: any;
  private challenge!: any;
  private worldType!: string;

  constructor() {
    super({ key: 'AnalysisScene' });
  }

  init(data: { performance: any; challenge: any; worldType: string }) {
    this.performance = data.performance;
    this.challenge = data.challenge;
    this.worldType = data.worldType;
  }

  create() {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x2c3e50);

    // Header
    this.add.text(640, 50, 'Performance Analysis', {
      font: 'bold 32px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);

    this.add.text(640, 90, `${this.challenge.name} - ${this.worldType.toUpperCase()}`, {
      font: '18px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);

    // Create analysis panels
    this.createPerformanceMetrics();
    this.createSkillsAssessment();
    this.createRecommendations();
    this.createNavigationButtons();
  }

  private createPerformanceMetrics() {
    const metricsContainer = this.add.container(300, 250);

    // Panel background
    const panelBg = this.add.rectangle(0, 0, 500, 300, 0x34495e);
    panelBg.setStrokeStyle(2, 0x3498db);
    metricsContainer.add(panelBg);

    // Panel title
    const title = this.add.text(0, -130, 'Performance Metrics', {
      font: 'bold 20px monospace',
      color: '#3498db'
    }).setOrigin(0.5);
    metricsContainer.add(title);

    // Metrics
    const metrics = [
      `Completion Time: ${this.formatTime(this.performance.completionTime)}`,
      `Hints Used: ${this.performance.hintsUsed}/4`,
      `Attempts: ${this.performance.attempts}`,
      `Accuracy: ${this.performance.accuracy}%`
    ];

    metrics.forEach((metric, index) => {
      const metricText = this.add.text(0, -80 + index * 30, metric, {
        font: '16px monospace',
        color: '#ecf0f1'
      }).setOrigin(0.5);
      metricsContainer.add(metricText);
    });

    // Performance grade
    const grade = this.calculateGrade();
    const gradeText = this.add.text(0, 50, `Grade: ${grade}`, {
      font: 'bold 24px monospace',
      color: this.getGradeColor(grade)
    }).setOrigin(0.5);
    metricsContainer.add(gradeText);
  }

  private createSkillsAssessment() {
    const skillsContainer = this.add.container(980, 250);

    // Panel background
    const panelBg = this.add.rectangle(0, 0, 500, 300, 0x34495e);
    panelBg.setStrokeStyle(2, 0x27ae60);
    skillsContainer.add(panelBg);

    // Panel title
    const title = this.add.text(0, -130, 'Skills Assessment', {
      font: 'bold 20px monospace',
      color: '#27ae60'
    }).setOrigin(0.5);
    skillsContainer.add(title);

    // Skills analysis
    const skills = this.analyzeSkills();
    skills.forEach((skill, index) => {
      const skillText = this.add.text(0, -80 + index * 25, `${skill.name}: ${skill.level}`, {
        font: '14px monospace',
        color: skill.color
      }).setOrigin(0.5);
      skillsContainer.add(skillText);
    });
  }

  private createRecommendations() {
    const recommendationsContainer = this.add.container(640, 550);

    // Panel background
    const panelBg = this.add.rectangle(0, 0, 1000, 200, 0x34495e);
    panelBg.setStrokeStyle(2, 0xf39c12);
    recommendationsContainer.add(panelBg);

    // Panel title
    const title = this.add.text(0, -80, 'AI Recommendations', {
      font: 'bold 20px monospace',
      color: '#f39c12'
    }).setOrigin(0.5);
    recommendationsContainer.add(title);

    // Recommendations text
    const recommendations = this.generateRecommendations();
    const recommendationsText = this.add.text(0, -20, recommendations, {
      font: '14px monospace',
      color: '#ecf0f1',
      align: 'center',
      wordWrap: { width: 950 }
    }).setOrigin(0.5);
    recommendationsContainer.add(recommendationsText);
  }

  private createNavigationButtons() {
    // Back to world button
    this.add.rectangle(200, 650, 200, 50, 0x95a5a6)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('ChallengeScene', {
          challenge: this.challenge,
          worldType: this.worldType
        });
      });

    this.add.text(200, 650, '← Back to World', {
      font: '16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Learning resources button
    this.add.rectangle(640, 650, 200, 50, 0x3498db)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.openResources();
      });

    this.add.text(640, 650, 'Learning Resources', {
      font: '16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Next challenge button
    this.add.rectangle(1080, 650, 200, 50, 0x27ae60)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('CareerWorldScene', { worldType: this.worldType });
      });

    this.add.text(1080, 650, 'Next Challenge →', {
      font: '16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
  }

  private formatTime(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private calculateGrade(): string {
    const timeBonus = this.performance.completionTime < 300000 ? 10 : 0; // 5 minute bonus
    const hintPenalty = this.performance.hintsUsed * 5;
    const attemptPenalty = (this.performance.attempts - 1) * 10;
    
    let score = 100 + timeBonus - hintPenalty - attemptPenalty;
    score = Math.max(0, Math.min(100, score));

    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    return 'D';
  }

  private getGradeColor(grade: string): string {
    if (grade.startsWith('A')) return '#2ecc71';
    if (grade.startsWith('B')) return '#f39c12';
    if (grade.startsWith('C')) return '#e67e22';
    return '#e74c3c';
  }

  private analyzeSkills() {
    const baseSkills = {
      backend: ['Problem Solving', 'System Design', 'Debugging', 'Optimization'],
      frontend: ['Visual Design', 'User Experience', 'Layout Skills', 'Creativity'],
      datascience: ['Analytical Thinking', 'Pattern Recognition', 'Statistical Reasoning', 'Data Intuition']
    };

    const skills = baseSkills[this.worldType as keyof typeof baseSkills] || [];
    
    return skills.map(skill => {
      const level = this.calculateSkillLevel();
      return {
        name: skill,
        level: level,
        color: this.getSkillColor(level)
      };
    });
  }

  private calculateSkillLevel(): string {
    const score = Math.random() * 100; // In real implementation, this would be based on actual performance
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Average';
    return 'Needs Work';
  }

  private getSkillColor(level: string): string {
    switch (level) {
      case 'Excellent': return '#2ecc71';
      case 'Good': return '#f39c12';
      case 'Average': return '#e67e22';
      default: return '#e74c3c';
    }
  }

  private generateRecommendations(): string {
    const recommendations = [
      `Based on your performance in ${this.challenge.name}, you show strong aptitude for ${this.worldType} development.`,
      `Your completion time suggests ${this.performance.completionTime < 300000 ? 'excellent' : 'good'} problem-solving speed.`,
      `Consider focusing on advanced ${this.worldType} concepts to further develop your skills.`,
      `Try the next level challenges to continue your learning journey.`
    ];

    return recommendations.join(' ');
  }

  private openResources() {
    // Placeholder: in future could navigate to a resources scene or open external links
    console.log('Learning resources button clicked');
  }
}
