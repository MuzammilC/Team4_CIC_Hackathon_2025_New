interface PerformanceData {
  challengeName: string;
  startTime: number;
  endTime?: number;
  completionTime?: number;
  hintsUsed: number;
  attempts: number;
  completed: boolean;
  accuracy: number;
  errors: string[];
  skillsAssessed: string[];
  difficulty: number;
  worldType: string;
}

interface SessionData {
  challenges: PerformanceData[];
  totalTime: number;
  averageAccuracy: number;
  preferredWorldType?: string;
  skillStrengths: string[];
  skillWeaknesses: string[];
}

export class PerformanceTracker {
  private currentChallenge: PerformanceData | null = null;
  private sessionData: SessionData;
  private localStorage: Storage;

  constructor(_scene: Phaser.Scene) {
    this.localStorage = window.localStorage;
    this.sessionData = this.loadSessionData();
  }

  startChallenge(challengeName: string, worldType: string = 'general', difficulty: number = 1): void {
    this.currentChallenge = {
      challengeName,
      startTime: Date.now(),
      hintsUsed: 0,
      attempts: 0,
      completed: false,
      accuracy: 0,
      errors: [],
      skillsAssessed: [],
      difficulty,
      worldType
    };
  }

  recordAttempt(success: boolean, feedback?: string): void {
    if (!this.currentChallenge) return;

    this.currentChallenge.attempts++;
    
    if (!success && feedback) {
      this.currentChallenge.errors.push(feedback);
    }

    this.updateAccuracy();
  }

  recordHintUsage(): void {
    if (!this.currentChallenge) return;
    this.currentChallenge.hintsUsed++;
  }

  completeChallenge(success: boolean): void {
    if (!this.currentChallenge) return;

    this.currentChallenge.endTime = Date.now();
    this.currentChallenge.completionTime = this.currentChallenge.endTime - this.currentChallenge.startTime;
    this.currentChallenge.completed = success;
    
    this.updateAccuracy();
    this.analyzeSkills();
    this.addToSession();
    this.saveSessionData();
  }

  private updateAccuracy(): void {
    if (!this.currentChallenge) return;

    const successfulAttempts = this.currentChallenge.completed ? 1 : 0;
    const totalAttempts = Math.max(this.currentChallenge.attempts, 1);
    this.currentChallenge.accuracy = Math.round((successfulAttempts / totalAttempts) * 100);
  }

  private analyzeSkills(): void {
    if (!this.currentChallenge) return;

    const skillsMap = {
      backend: {
        'API Debugging': ['Problem Solving', 'Error Handling', 'Debugging'],
        'Database Optimization': ['System Design', 'Performance Optimization', 'SQL'],
        'System Architecture': ['System Design', 'Scalability', 'Architecture'],
        'Load Testing': ['Performance Testing', 'System Analysis', 'Optimization'],
        'Microservices': ['Distributed Systems', 'Architecture', 'Scalability']
      },
      frontend: {
        'Component Layout': ['CSS Layout', 'Responsive Design', 'Visual Design'],
        'CSS Positioning': ['CSS Mastery', 'Layout Skills', 'Problem Solving'],
        'User Flow Design': ['UX Design', 'User Empathy', 'Interface Design'],
        'Responsive Design': ['Mobile Development', 'CSS Grid/Flexbox', 'Adaptive Design'],
        'Animation System': ['CSS Animation', 'User Experience', 'Creative Problem Solving']
      },
      datascience: {
        'Data Cleaning': ['Data Preprocessing', 'Attention to Detail', 'Data Quality'],
        'Feature Engineering': ['Feature Selection', 'Domain Knowledge', 'Creative Thinking'],
        'Model Selection': ['Machine Learning', 'Statistical Analysis', 'Model Evaluation'],
        'Results Analysis': ['Data Interpretation', 'Statistical Reasoning', 'Communication'],
        'ML Pipeline': ['MLOps', 'Automation', 'System Design']
      }
    };

    const worldSkills = skillsMap[this.currentChallenge.worldType as keyof typeof skillsMap];
    const challengeSkills = worldSkills?.[this.currentChallenge.challengeName as keyof typeof worldSkills];
    
    if (challengeSkills) {
      this.currentChallenge.skillsAssessed = challengeSkills;
    }
  }

  private addToSession(): void {
    if (!this.currentChallenge) return;

    this.sessionData.challenges.push({ ...this.currentChallenge });
    this.updateSessionAnalytics();
  }

  private updateSessionAnalytics(): void {
    const challenges = this.sessionData.challenges;
    
    // Calculate total time
    this.sessionData.totalTime = challenges.reduce((total, challenge) => 
      total + (challenge.completionTime || 0), 0);

    // Calculate average accuracy
    const accuracySum = challenges.reduce((sum, challenge) => sum + challenge.accuracy, 0);
    this.sessionData.averageAccuracy = challenges.length > 0 ? accuracySum / challenges.length : 0;

    // Identify preferred world type
    const worldTypeCount = challenges.reduce((count, challenge) => {
      count[challenge.worldType] = (count[challenge.worldType] || 0) + 1;
      return count;
    }, {} as { [key: string]: number });

    this.sessionData.preferredWorldType = Object.keys(worldTypeCount).reduce((a, b) => 
      worldTypeCount[a] > worldTypeCount[b] ? a : b, 'general');

    // Analyze skill strengths and weaknesses
    this.analyzeSkillTrends();
  }

  private analyzeSkillTrends(): void {
    const skillPerformance: { [skill: string]: { total: number; success: number; avgTime: number } } = {};

    this.sessionData.challenges.forEach(challenge => {
      challenge.skillsAssessed.forEach(skill => {
        if (!skillPerformance[skill]) {
          skillPerformance[skill] = { total: 0, success: 0, avgTime: 0 };
        }
        
        skillPerformance[skill].total++;
        if (challenge.completed) {
          skillPerformance[skill].success++;
        }
        skillPerformance[skill].avgTime += challenge.completionTime || 0;
      });
    });

    // Calculate averages and determine strengths/weaknesses
    const skillAnalysis = Object.entries(skillPerformance).map(([skill, data]) => ({
      skill,
      successRate: data.success / data.total,
      avgTime: data.avgTime / data.total,
      score: (data.success / data.total) * (1 / Math.max(data.avgTime / 300000, 1)) // Factor in speed
    }));

    skillAnalysis.sort((a, b) => b.score - a.score);

    this.sessionData.skillStrengths = skillAnalysis.slice(0, 3).map(s => s.skill);
    this.sessionData.skillWeaknesses = skillAnalysis.slice(-3).map(s => s.skill);
  }

  getCurrentProgress(): any {
    if (!this.currentChallenge) return {};

    return {
      timeSpent: Date.now() - this.currentChallenge.startTime,
      attempts: this.currentChallenge.attempts,
      hintsUsed: this.currentChallenge.hintsUsed,
      errors: this.currentChallenge.errors,
      accuracy: this.currentChallenge.accuracy
    };
  }

  getPerformanceData(): PerformanceData | null {
    return this.currentChallenge ? { ...this.currentChallenge } : null;
  }

  getSessionData(): SessionData {
    return { ...this.sessionData };
  }

  getElapsedTime(): number {
    if (!this.currentChallenge) return 0;
    return Date.now() - this.currentChallenge.startTime;
  }

  getHintCount(): number {
    return this.currentChallenge?.hintsUsed || 0;
  }

  getWorldTypePerformance(worldType: string): any {
    const worldChallenges = this.sessionData.challenges.filter(c => c.worldType === worldType);
    
    if (worldChallenges.length === 0) {
      return null;
    }

    const totalTime = worldChallenges.reduce((sum, c) => sum + (c.completionTime || 0), 0);
    const successfulChallenges = worldChallenges.filter(c => c.completed).length;
    const totalHints = worldChallenges.reduce((sum, c) => sum + c.hintsUsed, 0);

    return {
      averageTime: totalTime / worldChallenges.length,
      successRate: (successfulChallenges / worldChallenges.length) * 100,
      averageHints: totalHints / worldChallenges.length,
      challengesCompleted: worldChallenges.length,
      preferredTypes: this.getPreferredChallengeTypes(worldChallenges)
    };
  }

  private getPreferredChallengeTypes(challenges: PerformanceData[]): string[] {
    const typePerformance: { [type: string]: number } = {};

    challenges.forEach(challenge => {
      // Extract challenge type from name (simplified)
      const type = challenge.challengeName.toLowerCase();
      if (challenge.completed) {
        typePerformance[type] = (typePerformance[type] || 0) + 1;
      }
    });

    return Object.entries(typePerformance)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);
  }

  exportPerformanceReport(): string {
    const report = {
      sessionSummary: this.sessionData,
      currentChallenge: this.currentChallenge,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  private loadSessionData(): SessionData {
    try {
      const saved = this.localStorage.getItem('careerquest_session');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }

    return {
      challenges: [],
      totalTime: 0,
      averageAccuracy: 0,
      skillStrengths: [],
      skillWeaknesses: []
    };
  }

  private saveSessionData(): void {
    try {
      this.localStorage.setItem('careerquest_session', JSON.stringify(this.sessionData));
    } catch (error) {
      console.error('Error saving session data:', error);
    }
  }

  clearSessionData(): void {
    this.sessionData = {
      challenges: [],
      totalTime: 0,
      averageAccuracy: 0,
      skillStrengths: [],
      skillWeaknesses: []
    };
    this.localStorage.removeItem('careerquest_session');
  }
}
