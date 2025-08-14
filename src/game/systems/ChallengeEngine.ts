export class ChallengeEngine {
  private scene: Phaser.Scene;
  private challengeDatabase: Map<string, any> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializeChallengeDatabase();
  }

  private initializeChallengeDatabase() {
    // Backend challenges
    const backendChallenges = {
      'API Debugging': {
        description: 'Fix the broken API endpoint that\'s returning incorrect data. The endpoint should return user information but is currently throwing errors.',
        startingCode: `
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});`,
        expectedOutput: 'Fixed API endpoint with proper error handling and validation',
        testCases: [
          { input: 'valid user ID', expected: 'User object returned' },
          { input: 'invalid user ID', expected: 'Proper error message' }
        ],
        hints: [
          'Check if the user exists before trying to return it',
          'Add input validation for the user ID',
          'Handle the case when user is not found',
          'Return appropriate HTTP status codes'
        ]
      },
      'Database Optimization': {
        description: 'Optimize this slow database query. The current query takes too long when dealing with large datasets.',
        startingCode: `
SELECT * FROM orders o 
JOIN customers c ON o.customer_id = c.id 
WHERE o.order_date > '2023-01-01' 
AND c.country = 'USA';`,
        expectedOutput: 'Optimized query with proper indexing and selective fields',
        testCases: [
          { input: 'Large dataset', expected: 'Query executes under 100ms' }
        ],
        hints: [
          'Only select the fields you actually need',
          'Consider adding database indexes',
          'Use EXPLAIN to analyze query performance',
          'Filter early to reduce the dataset size'
        ]
      }
    };

    // Frontend challenges
    const frontendChallenges = {
      'Component Layout': {
        description: 'Create a responsive card component layout using CSS Grid and Flexbox. The cards should adapt to different screen sizes.',
        startingCode: `
.card-container {
  /* Add your CSS here */
}

.card {
  /* Style individual cards */
}`,
        expectedOutput: 'Responsive card layout that works on all screen sizes',
        testCases: [
          { input: 'Desktop view', expected: '3 cards per row' },
          { input: 'Tablet view', expected: '2 cards per row' },
          { input: 'Mobile view', expected: '1 card per row' }
        ],
        hints: [
          'Use CSS Grid for the main container layout',
          'Set up responsive breakpoints with media queries',
          'Consider using auto-fit or auto-fill for flexible columns',
          'Add proper spacing and padding for visual appeal'
        ]
      },
      'CSS Positioning': {
        description: 'Fix the layout issues in this navigation bar. Elements are overlapping and not positioned correctly.',
        startingCode: `
.navbar {
  background: #333;
  height: 60px;
}

.nav-item {
  color: white;
  text-decoration: none;
}`,
        expectedOutput: 'Properly positioned navigation bar with aligned items',
        testCases: [
          { input: 'Navigation items', expected: 'Horizontally aligned' },
          { input: 'Logo', expected: 'Left-aligned' },
          { input: 'Menu items', expected: 'Right-aligned' }
        ],
        hints: [
          'Use Flexbox for horizontal alignment',
          'Set justify-content to space-between for logo and menu separation',
          'Add proper padding and margins',
          'Use align-items to center vertically'
        ]
      }
    };

    // Data Science challenges
    const dataScienceChallenges = {
      'Data Cleaning': {
        description: 'Clean this messy dataset by handling missing values, removing duplicates, and fixing data types.',
        startingCode: `
import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('messy_data.csv')

# Your cleaning code here
`,
        expectedOutput: 'Clean dataset ready for analysis',
        testCases: [
          { input: 'Dataset with null values', expected: 'No missing values' },
          { input: 'Duplicate rows', expected: 'No duplicates' },
          { input: 'Wrong data types', expected: 'Correct data types' }
        ],
        hints: [
          'Use df.isnull() to identify missing values',
          'Consider fillna() or dropna() for handling nulls',
          'Use drop_duplicates() to remove duplicate rows',
          'Convert data types with astype() or pd.to_datetime()'
        ]
      },
      'Feature Engineering': {
        description: 'Create meaningful features from the raw data to improve model performance.',
        startingCode: `
# Raw features available:
# - age, income, education_years, location
# - purchase_history (list of purchases)
# - signup_date

# Create new features here
`,
        expectedOutput: 'New engineered features that capture important patterns',
        testCases: [
          { input: 'Categorical variables', expected: 'Properly encoded' },
          { input: 'Date features', expected: 'Extracted time components' },
          { input: 'Text features', expected: 'Numerical representations' }
        ],
        hints: [
          'Create age groups or income brackets for categorical analysis',
          'Extract day, month, year from date fields',
          'Calculate aggregate statistics from purchase history',
          'Use one-hot encoding for categorical variables'
        ]
      }
    };

    // Store in database
    this.challengeDatabase.set('backend', backendChallenges);
    this.challengeDatabase.set('frontend', frontendChallenges);
    this.challengeDatabase.set('datascience', dataScienceChallenges);
  }

  generateChallenge(challenge: any, worldType: string): any {
    const worldChallenges = this.challengeDatabase.get(worldType);
    const challengeData = worldChallenges?.[challenge.name];

    if (!challengeData) {
      // Generate a generic challenge if specific one not found
      return this.generateGenericChallenge(challenge, worldType);
    }

    return challengeData;
  }

  private generateGenericChallenge(challenge: any, worldType: string): any {
    return {
      description: `Complete this ${worldType} challenge: ${challenge.name}. Apply your knowledge to solve this real-world problem.`,
      startingCode: `// ${challenge.name} challenge\n// Your solution here...`,
      expectedOutput: 'Successful completion of the challenge requirements',
      testCases: [
        { input: 'Test case 1', expected: 'Expected output 1' },
        { input: 'Test case 2', expected: 'Expected output 2' }
      ],
      hints: [
        'Break down the problem into smaller steps',
        'Consider the requirements carefully',
        'Test your solution with different inputs',
        'Think about edge cases and error handling'
      ]
    };
  }

  checkSolution(challenge: any, solution: string): { correct: boolean; feedback: string } {
    // Simple solution checking (in a real implementation, this would be more sophisticated)
    const solutionLength = solution.trim().length;
    
    if (solutionLength < 20) {
      return {
        correct: false,
        feedback: 'Your solution seems too short. Please provide a more detailed implementation.'
      };
    }

    if (solution.includes('// Your code here') || solution.includes('// Your solution here')) {
      return {
        correct: false,
        feedback: 'Please replace the placeholder comments with your actual solution.'
      };
    }

    // Check for basic keywords based on challenge type
    const requiredKeywords = this.getRequiredKeywords(challenge);
    const missingKeywords = requiredKeywords.filter(keyword => 
      !solution.toLowerCase().includes(keyword.toLowerCase())
    );

    if (missingKeywords.length > 0) {
      return {
        correct: false,
        feedback: `Your solution is missing some key elements. Consider including: ${missingKeywords.join(', ')}`
      };
    }

    // If basic checks pass, consider it correct
    return {
      correct: true,
      feedback: 'Excellent work! Your solution demonstrates good understanding of the concepts.'
    };
  }

  private getRequiredKeywords(challenge: any): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'debug': ['try', 'catch', 'error', 'validation'],
      'optimization': ['index', 'select', 'where', 'performance'],
      'layout': ['grid', 'flex', 'responsive', 'media'],
      'styling': ['css', 'position', 'align', 'display'],
      'ux': ['user', 'interface', 'accessibility', 'usability'],
      'responsive': ['media', 'query', 'mobile', 'tablet'],
      'animation': ['transition', 'transform', 'keyframes', 'animation'],
      'preprocessing': ['clean', 'null', 'duplicate', 'type'],
      'features': ['feature', 'encode', 'transform', 'aggregate'],
      'modeling': ['model', 'train', 'predict', 'evaluate'],
      'analysis': ['analyze', 'correlation', 'pattern', 'insight'],
      'pipeline': ['pipeline', 'workflow', 'process', 'automation']
    };

    return keywordMap[challenge.type] || ['solution', 'implementation', 'code'];
  }

  getDifficultyMultiplier(difficulty: number): number {
    return Math.max(1, difficulty * 0.5);
  }

  getTimeLimit(challenge: any): number {
    // Time limit in milliseconds based on difficulty
    const baseTime = 300000; // 5 minutes
    return baseTime * this.getDifficultyMultiplier(challenge.difficulty);
  }
}
