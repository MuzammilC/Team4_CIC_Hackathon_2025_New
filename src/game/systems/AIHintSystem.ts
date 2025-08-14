import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class AIHintSystem {
  private scene: Phaser.Scene;
  private bedrockClient: BedrockRuntimeClient;
  private hintLevel: number = 0;
  private maxHints: number = 4;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.bedrockClient = new BedrockRuntimeClient({
      region: 'us-east-1',
      // Credentials will be handled by AWS SDK automatically
      // In production, you'd configure this properly with IAM roles
    });
  }

  async generateHint(challenge: any, progress: any): Promise<string> {
    this.hintLevel++;
    
    if (this.hintLevel > this.maxHints) {
      return 'You\'ve reached the maximum number of hints. Try working through the problem step by step!';
    }

    try {
      const hintPrompt = this.buildHintPrompt(challenge, progress, this.hintLevel);
      const response = await this.callBedrock(hintPrompt);
      return this.formatHint(response, this.hintLevel);
    } catch (error) {
      console.error('Error generating AI hint:', error);
      return this.getFallbackHint(challenge, this.hintLevel);
    }
  }

  private buildHintPrompt(challenge: any, progress: any, level: number): string {
    const basePrompt = `
You are an AI mentor helping a student learn ${challenge.worldType} development. 
The student is working on: "${challenge.name}"

Challenge Details:
- Type: ${challenge.type}
- Difficulty: ${challenge.difficulty}/5
- Description: ${challenge.description}

Student Progress:
- Time spent: ${progress.timeSpent || 0}ms
- Attempts made: ${progress.attempts || 0}
- Previous errors: ${progress.errors?.join(', ') || 'None'}

Hint Level: ${level}/4

Based on the hint level, provide appropriate guidance:
Level 1: Conceptual hint - point them in the right direction
Level 2: Specific hint - mention key concepts or methods to use
Level 3: Code example - provide a small code snippet or structure
Level 4: Detailed solution - give step-by-step instructions

Keep the hint encouraging, educational, and appropriate for the level. 
Limit response to 2-3 sentences maximum.
`;

    return basePrompt;
  }

  private async callBedrock(prompt: string): Promise<string> {
    try {
      const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';
      
      const requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      };

      const command = new InvokeModelCommand({
        modelId: modelId,
        body: JSON.stringify(requestBody),
        contentType: 'application/json',
        accept: 'application/json'
      });

      const response = await this.bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody.content[0].text || 'Unable to generate hint at this time.';
    } catch (error) {
      console.error('Bedrock API call failed:', error);
      throw error;
    }
  }

  private formatHint(response: string, level: number): string {
    const hintTypes = ['💡 Concept', '🎯 Specific', '📝 Example', '✅ Solution'];
    const hintType = hintTypes[Math.min(level - 1, hintTypes.length - 1)];
    
    return `${hintType} Hint ${level}/4:\n\n${response}`;
  }

  private getFallbackHint(challenge: any, level: number): string {
    const fallbackHints = {
      1: {
        backend: 'Consider the data flow - what happens when a request comes in? Think about validation and error handling.',
        frontend: 'Think about the user experience - how should the interface respond to different screen sizes?',
        datascience: 'Start by exploring the data - what patterns or issues do you notice in the dataset?'
      },
      2: {
        backend: 'Look into using try-catch blocks, input validation, and proper HTTP status codes for robust APIs.',
        frontend: 'Consider using CSS Grid or Flexbox for layout, and media queries for responsive design.',
        datascience: 'Use pandas methods like .info(), .describe(), and .isnull() to understand your data better.'
      },
      3: {
        backend: 'Here\'s a pattern: if (!user) { return res.status(404).json({ error: "User not found" }); }',
        frontend: 'Try: .container { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }',
        datascience: 'Example: df = df.dropna().drop_duplicates().reset_index(drop=True)'
      },
      4: {
        backend: 'Step 1: Validate input, Step 2: Check if resource exists, Step 3: Handle errors properly, Step 4: Return appropriate responses',
        frontend: 'Step 1: Set up grid container, Step 2: Add responsive breakpoints, Step 3: Style individual items, Step 4: Test on different devices',
        datascience: 'Step 1: Identify missing data, Step 2: Choose cleaning strategy, Step 3: Remove duplicates, Step 4: Verify data quality'
      }
    };

    const worldType = challenge.worldType || 'backend';
    const hints = fallbackHints[level as keyof typeof fallbackHints];
    const hint = hints[worldType as keyof typeof hints] || hints.backend;

    return this.formatHint(hint, level);
  }

  getHintCount(): number {
    return this.hintLevel;
  }

  resetHints(): void {
    this.hintLevel = 0;
  }

  async generatePerformanceAnalysis(performance: any, challenge: any): Promise<string> {
    try {
      const analysisPrompt = this.buildAnalysisPrompt(performance, challenge);
      const response = await this.callBedrock(analysisPrompt);
      return response;
    } catch (error) {
      console.error('Error generating performance analysis:', error);
      return this.getFallbackAnalysis(performance, challenge);
    }
  }

  private buildAnalysisPrompt(performance: any, challenge: any): string {
    return `
Analyze this student's performance on a ${challenge.worldType} challenge:

Challenge: ${challenge.name} (Level ${challenge.difficulty})
Performance Data:
- Completion Time: ${performance.completionTime}ms
- Hints Used: ${performance.hintsUsed}/4
- Attempts: ${performance.attempts}
- Final Success: ${performance.completed ? 'Yes' : 'No'}

Provide a brief analysis covering:
1. Strengths demonstrated
2. Areas for improvement
3. Specific next steps
4. Career aptitude insights

Keep it encouraging and actionable. Limit to 3-4 sentences.
`;
  }

  private getFallbackAnalysis(performance: any, challenge: any): string {
    const timePerformance = performance.completionTime < 300000 ? 'excellent' : 'good';
    const hintUsage = performance.hintsUsed <= 2 ? 'minimal guidance' : 'some assistance';
    
    return `You showed ${timePerformance} problem-solving speed and completed the challenge with ${hintUsage}. Your approach to ${challenge.name} demonstrates growing ${challenge.worldType} skills. Focus on practicing similar challenges to build confidence, and consider exploring more advanced concepts in this area.`;
  }

  async generateCareerRecommendation(worldType: string, overallPerformance: any): Promise<string> {
    try {
      const recommendationPrompt = `
Based on performance across ${worldType} challenges:
- Average completion time: ${overallPerformance.avgTime}ms
- Success rate: ${overallPerformance.successRate}%
- Hint dependency: ${overallPerformance.avgHints}/4
- Preferred challenge types: ${overallPerformance.preferredTypes?.join(', ') || 'Various'}

Provide career guidance for ${worldType} development, including:
1. Specific role recommendations
2. Skills to focus on developing
3. Next learning steps

Be specific and actionable. Limit to 4-5 sentences.
`;

      const response = await this.callBedrock(recommendationPrompt);
      return response;
    } catch (error) {
      return this.getFallbackCareerRecommendation(worldType, overallPerformance);
    }
  }

  private getFallbackCareerRecommendation(worldType: string, performance: any): string {
    const recommendations = {
      backend: 'Consider roles like Backend Developer, API Engineer, or DevOps Engineer. Focus on mastering databases, system design, and cloud technologies. Next steps: build REST APIs, learn containerization, and practice system architecture.',
      frontend: 'Explore positions like Frontend Developer, UI Engineer, or UX Developer. Develop expertise in modern frameworks, design systems, and user experience. Next steps: master React/Vue, learn design principles, and build responsive applications.',
      datascience: 'Look into Data Scientist, ML Engineer, or Data Analyst roles. Strengthen your statistics, machine learning, and data visualization skills. Next steps: work with real datasets, learn advanced ML algorithms, and practice storytelling with data.'
    };

    return recommendations[worldType as keyof typeof recommendations] || recommendations.backend;
  }
}
