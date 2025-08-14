export interface Challenge {
  id: string;
  name: string;
  worldType: 'backend' | 'frontend' | 'datascience';
  type: 'debug' | 'optimization' | 'design' | 'layout' | 'ux' | 'responsive' | 'animation' | 'preprocessing' | 'features' | 'modeling' | 'analysis' | 'pipeline' | 'testing' | 'architecture';
  difficulty: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  startingCode?: string;
  expectedOutput?: any;
  testCases?: TestCase[];
  hints: HintLevel[];
  learningResources: Resource[];
  timeLimit?: number;
  skillsAssessed: string[];
}

export interface HintLevel {
  level: 1 | 2 | 3 | 4;
  type: 'conceptual' | 'specific' | 'code_example' | 'full_solution';
  content: string;
  learningResources?: Resource[];
}

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface Resource {
  name: string;
  url: string;
  type: 'tutorial' | 'documentation' | 'practice' | 'article' | 'video' | 'course';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime?: string;
  tags?: string[];
}

export interface WorldData {
  name: string;
  type: 'backend' | 'frontend' | 'datascience';
  description: string;
  color: number;
  challenges: Challenge[];
  npcs?: NPC[];
  decorations?: Decoration[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  personality: 'mentor' | 'challenger' | 'helper' | 'expert';
  dialogue: string[];
  position: { x: number; y: number };
}

export interface Decoration {
  id: string;
  type: 'terminal' | 'screen' | 'desk' | 'poster' | 'plant' | 'server' | 'chart';
  position: { x: number; y: number };
  interactive?: boolean;
  description?: string;
}

export interface PlayerStats {
  level: number;
  experience: number;
  skillPoints: { [skill: string]: number };
  unlockedWorlds: string[];
  completedChallenges: string[];
  achievements: string[];
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  fullscreen: boolean;
  autoSave: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  aiHelpLevel: 'minimal' | 'moderate' | 'extensive';
}

export interface AIPersonality {
  name: string;
  worldType: 'backend' | 'frontend' | 'datascience';
  style: 'encouraging' | 'challenging' | 'methodical' | 'creative';
  catchphrases: string[];
  specialties: string[];
}
