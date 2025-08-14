# Career Quest - AI-Powered Tech Career Exploration Game

## 🎮 Game Overview

Career Quest is a 2D pixel-art career exploration game that helps players discover and develop their interests in tech careers through hands-on challenges and AI-powered mentorship. Players explore three specialized worlds (Backend Development, Frontend/UI, and Data Science/ML) and complete real-world tasks while receiving personalized guidance.

## 🚀 Technology Stack

- **Game Engine**: Phaser 3 with TypeScript
- **Build Tool**: Vite for fast development and hot reload
- **AI Integration**: AWS Bedrock (Claude) for intelligent hints and performance analysis
- **Styling**: Pixel-perfect rendering with custom CSS
- **Data Management**: JSON-based content system
- **State Management**: Local storage for progress tracking

## 🏗️ Architecture

### Scene Flow

```
BootScene → WorldMapScene → CareerWorldScene → ChallengeScene → AnalysisScene → LearningHubScene
```

### Core Systems

1. **ChallengeEngine**: Generates and validates challenges across all career domains
2. **AIHintSystem**: Provides intelligent, contextual hints using AWS Bedrock
3. **PerformanceTracker**: Comprehensive analytics and skill assessment
4. **DataManager**: Centralized content and resource management

## 🌟 Key Features

### 🤖 AI-Powered Learning

- **Intelligent Hint System**: 4-level progressive hint system with AI-generated content
- **Performance Analysis**: Real-time skill assessment and personalized feedback
- **Career Recommendations**: AI-driven guidance based on player performance patterns

### 🎯 Three Career Worlds

#### Backend Development Lab

- Server room aesthetic with glowing terminals
- Challenges: API debugging, database optimization, system architecture
- Skills: Problem-solving, system design, performance optimization

#### Frontend Design Studio

- Creative studio environment with design tools
- Challenges: Component layouts, CSS positioning, user experience design
- Skills: Visual design, user empathy, responsive development

#### Data Science Laboratory

- Laboratory setting with data visualization displays
- Challenges: Data cleaning, feature engineering, model selection
- Skills: Analytical thinking, pattern recognition, statistical reasoning

### 📊 Comprehensive Analytics

- **Real-time Performance Tracking**: Completion time, hint usage, accuracy rates
- **Skill Assessment**: Multi-dimensional skill evaluation
- **Progress Visualization**: Detailed analytics and growth tracking
- **Learning Path Optimization**: Personalized challenge recommendations

### 📚 Learning Resource Integration

- **Curated Resource Library**: Links to tutorials, documentation, practice sites
- **Contextual Recommendations**: Resources suggested based on struggle areas
- **Progressive Difficulty**: Content matched to player skill level

## 🎨 Game Design Philosophy

### Visual Style

- **Retro Pixel Art**: 16x16 and 32x32 sprite aesthetic
- **Pokémon-Inspired**: Nostalgic exploration with modern tech themes
- **Smooth Animations**: Polished transitions and interactive feedback

### User Experience

- **Progressive Disclosure**: Start simple, gradually introduce complexity
- **Patient AI Mentorship**: Adapts to individual learning pace and style
- **Achievement System**: Celebrate progress and maintain motivation
- **Accessibility**: Keyboard navigation and colorblind-friendly design

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ with npm
- AWS account with Bedrock access (for AI features)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd Team4_CIC_Hackathon_2025_New

# Switch to game development branch
git checkout parth/game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

1. Set up AWS credentials for Bedrock access
2. Configure environment variables for AI integration
3. Customize game settings in `src/game/Game.ts`

## 📁 Project Structure

```
src/
├── game/
│   ├── Game.ts                 # Main game configuration
│   ├── scenes/                 # All game scenes
│   │   ├── BootScene.ts       # Initial loading and setup
│   │   ├── WorldMapScene.ts   # Main world selection
│   │   ├── CareerWorldScene.ts # Individual career worlds
│   │   ├── ChallengeScene.ts  # Challenge gameplay
│   │   ├── AnalysisScene.ts   # Performance analysis
│   │   └── LearningHubScene.ts # Learning resources
│   ├── entities/              # Game objects
│   │   ├── Player.ts          # Player character
│   │   └── ChallengeStation.ts # Interactive challenge points
│   ├── systems/               # Core game systems
│   │   ├── ChallengeEngine.ts # Challenge generation/validation
│   │   ├── AIHintSystem.ts    # AI-powered assistance
│   │   └── PerformanceTracker.ts # Analytics and tracking
│   └── data/
│       └── DataManager.ts     # Content management
├── data/                      # Game content
│   ├── worlds.json           # World definitions
│   ├── challenges.json       # Challenge database
│   ├── learning-resources.json # Curated learning content
│   └── ai-personalities.json # AI mentor personalities
└── types/                    # TypeScript definitions
    └── index.ts              # Game type definitions
```

## 🎯 Challenge System

### Challenge Types

- **Backend**: `debug`, `optimization`, `architecture`, `testing`
- **Frontend**: `layout`, `styling`, `ux`, `responsive`, `animation`
- **Data Science**: `preprocessing`, `features`, `modeling`, `analysis`, `pipeline`

### Difficulty Progression

1. **Beginner**: Basic concepts and syntax
2. **Intermediate**: Real-world problem solving
3. **Advanced**: Complex, multi-step projects
4. **Expert**: Industry-level challenges
5. **Master**: Cutting-edge techniques

### AI Hint Levels

1. **Conceptual**: Point in the right direction
2. **Specific**: Mention key concepts or methods
3. **Code Example**: Provide snippets or structure
4. **Full Solution**: Step-by-step instructions

## 📈 Performance Metrics

### Tracked Metrics

- **Completion Time**: Speed of problem-solving
- **Hint Usage**: Independence and learning efficiency
- **Accuracy Rate**: Success rate across attempts
- **Skill Growth**: Multi-dimensional skill development
- **Learning Patterns**: Preferred challenge types and strategies

### Analytics Features

- **Real-time Dashboard**: Live performance indicators
- **Skill Radar Chart**: Visual skill assessment
- **Progress Timeline**: Growth tracking over time
- **Comparative Analysis**: Benchmarking against similar learners

## 🤖 AI Integration Details

### AWS Bedrock Integration

- **Model**: Claude Sonnet for natural, educational responses
- **Hint Generation**: Context-aware assistance based on challenge progress
- **Performance Analysis**: Detailed skill assessment and career guidance
- **Personalization**: Adaptive learning recommendations

### AI Personalities

- **Alex Debug** (Backend): Methodical, systematic problem-solving approach
- **Maya Pixel** (Frontend): Creative, user-focused design thinking
- **Dr. Ana Lytics** (Data Science): Encouraging, hypothesis-driven analysis

## 🎮 Gameplay Features

### Core Mechanics

- **WASD Movement**: Smooth character control with physics
- **Interactive Stations**: Click or press SPACE to start challenges
- **Real-time Feedback**: Immediate response to player actions
- **Progress Persistence**: Automatic save/load of player progress

### Social Features

- **Achievement Sharing**: Celebrate milestones and completions
- **Leaderboards**: Optional competitive elements
- **Mentor Matching**: Connect with industry professionals
- **Study Groups**: Collaborative learning opportunities

## 🔮 Future Enhancements

### Planned Features

- **Additional Career Worlds**: DevOps, Mobile Development, Cybersecurity
- **Multiplayer Challenges**: Collaborative problem-solving
- **Industry Partnerships**: Real company challenges and internships
- **VR Integration**: Immersive career exploration experiences

### Technical Roadmap

- **Mobile Optimization**: Touch controls and responsive design
- **Offline Mode**: Core functionality without internet
- **Advanced Analytics**: Machine learning for learning optimization
- **Custom Challenge Creator**: User-generated content system

## 📝 Contributing

This project demonstrates modern game development with educational technology integration. Key areas for contribution:

1. **Challenge Content**: Create new, industry-relevant challenges
2. **AI Enhancements**: Improve hint generation and performance analysis
3. **Visual Assets**: Develop pixel art sprites and animations
4. **Accessibility**: Enhance inclusive design features
5. **Performance**: Optimize for various devices and browsers

## 🏆 Educational Impact

Career Quest bridges the gap between theoretical learning and practical application by:

- **Hands-on Experience**: Real coding and design tasks
- **Immediate Feedback**: AI-powered guidance and correction
- **Skill Discovery**: Help students find their natural aptitudes
- **Industry Relevance**: Challenges based on actual job requirements
- **Personalized Learning**: Adaptive content based on individual progress

## 📊 Success Metrics

### Player Engagement

- Average session duration: 25+ minutes
- Challenge completion rate: 75%+
- Return player rate: 60%+ within 7 days

### Educational Effectiveness

- Skill improvement through pre/post assessments
- Career decision confidence increase
- Learning resource engagement rates
- Real-world skill application success

---

_Career Quest represents a new paradigm in career education, combining the engagement of gaming with the power of AI to create personalized, effective learning experiences that prepare students for successful tech careers._
