import { Challenge, WorldData, Resource } from '../../types';
import worldsData from '../../data/worlds.json';
import challengesData from '../../data/challenges.json';
import learningResourcesData from '../../data/learning-resources.json';

export class DataManager {
  private static instance: DataManager;
  private worlds: Map<string, WorldData> = new Map();
  private challenges: Map<string, Challenge[]> = new Map();
  private learningResources: Map<string, any> = new Map();

  private constructor() {
    this.loadData();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private loadData(): void {
    // Load worlds
    worldsData.worlds.forEach((world: any) => {
      this.worlds.set(world.id, world as WorldData);
    });

    // Load challenges
    Object.entries(challengesData).forEach(([worldType, challenges]) => {
      this.challenges.set(worldType, challenges as Challenge[]);
    });

    // Load learning resources
    Object.entries(learningResourcesData).forEach(([category, resources]) => {
      this.learningResources.set(category, resources);
    });
  }

  getWorld(worldId: string): WorldData | undefined {
    return this.worlds.get(worldId);
  }

  getAllWorlds(): WorldData[] {
    return Array.from(this.worlds.values());
  }

  getChallenges(worldType: string): Challenge[] {
    return this.challenges.get(worldType) || [];
  }

  getChallenge(worldType: string, challengeId: string): Challenge | undefined {
    const challenges = this.getChallenges(worldType);
    return challenges.find(c => c.id === challengeId);
  }

  getChallengesByDifficulty(worldType: string, difficulty: number): Challenge[] {
    const challenges = this.getChallenges(worldType);
    return challenges.filter(c => c.difficulty === difficulty);
  }

  getLearningResources(category: string, difficulty?: string): Resource[] {
    const categoryResources = this.learningResources.get(category);
    if (!categoryResources) return [];

    if (difficulty && categoryResources[difficulty]) {
      return categoryResources[difficulty] as Resource[];
    }

    // Return all resources for the category (values can be arrays of Resource)
    return (Object.values(categoryResources).flat() as Resource[]);
  }

  getPracticeResources(type: string): Resource[] {
    const practiceResources = this.learningResources.get('practice');
    return practiceResources?.[type] || [];
  }

  getRecommendedResources(worldType: string, playerLevel: number): Resource[] {
    const difficulty = playerLevel <= 2 ? 'beginner' : playerLevel <= 4 ? 'intermediate' : 'advanced';
    return this.getLearningResources(worldType, difficulty);
  }

  searchChallenges(query: string): Challenge[] {
    const allChallenges: Challenge[] = [];
    this.challenges.forEach(challenges => allChallenges.push(...challenges));
    
    return allChallenges.filter(challenge => 
      challenge.name.toLowerCase().includes(query.toLowerCase()) ||
      challenge.title.toLowerCase().includes(query.toLowerCase()) ||
      challenge.description.toLowerCase().includes(query.toLowerCase()) ||
      challenge.skillsAssessed.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
  }

  getSkillsForWorld(worldType: string): string[] {
    const challenges = this.getChallenges(worldType);
    const allSkills = new Set<string>();
    
    challenges.forEach(challenge => {
      challenge.skillsAssessed.forEach(skill => allSkills.add(skill));
    });

    return Array.from(allSkills);
  }

  getProgressionPath(worldType: string): Challenge[] {
    const challenges = this.getChallenges(worldType);
    return challenges.sort((a, b) => a.difficulty - b.difficulty);
  }

  getRandomChallenge(worldType: string, difficulty?: number): Challenge | undefined {
    let challenges = this.getChallenges(worldType);
    
    if (difficulty) {
      challenges = challenges.filter(c => c.difficulty === difficulty);
    }

    if (challenges.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  }

  validateChallengePrerequisites(challenge: Challenge, completedChallenges: string[]): boolean {
    // Simple prerequisite system based on difficulty
    const worldChallenges = this.getChallenges(challenge.worldType);
    const easierChallenges = worldChallenges.filter(c => c.difficulty < challenge.difficulty);
    
    // Require at least 50% of easier challenges to be completed
    const requiredCount = Math.ceil(easierChallenges.length * 0.5);
    const completedEasierCount = easierChallenges.filter(c => 
      completedChallenges.includes(c.id)
    ).length;

    return completedEasierCount >= requiredCount;
  }

  exportData(): any {
    return {
      worlds: Array.from(this.worlds.entries()),
      challenges: Array.from(this.challenges.entries()),
      learningResources: Array.from(this.learningResources.entries()),
      timestamp: new Date().toISOString()
    };
  }

  getCompletionStats(): any {
    const stats: any = {};
    
    this.challenges.forEach((challenges, worldType) => {
      stats[worldType] = {
        total: challenges.length,
        byDifficulty: {
          1: challenges.filter(c => c.difficulty === 1).length,
          2: challenges.filter(c => c.difficulty === 2).length,
          3: challenges.filter(c => c.difficulty === 3).length,
          4: challenges.filter(c => c.difficulty === 4).length,
          5: challenges.filter(c => c.difficulty === 5).length
        }
      };
    });

    return stats;
  }
}
