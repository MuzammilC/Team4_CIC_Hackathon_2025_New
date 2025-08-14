import * as Phaser from 'phaser';
import { ChallengeEngine } from '../systems/ChallengeEngine';
import { AIHintSystem } from '../systems/AIHintSystem';
import { PerformanceTracker } from '../systems/PerformanceTracker';
import { RemoteChallenge } from '../../utils/challengeApi';

export class ChallengeScene extends Phaser.Scene {
  private challenge!: any;
  private worldType!: string;
  private challengeEngine!: ChallengeEngine;
  private aiHintSystem!: AIHintSystem;
  private performanceTracker!: PerformanceTracker;
  private challengeContainer!: Phaser.GameObjects.Container;
  private hintPanel!: Phaser.GameObjects.Container;
  private dynamicChallenge: RemoteChallenge | null = null;

  constructor() {
    super({ key: 'ChallengeScene' });
  }

  init(data: { challenge: any; worldType: string; dynamicChallenge?: RemoteChallenge | null }) {
    this.challenge = data.challenge;
    this.worldType = data.worldType;
    this.dynamicChallenge = data.dynamicChallenge || null;
  }

  create() {
    // Initialize systems
    this.challengeEngine = new ChallengeEngine(this);
    this.aiHintSystem = new AIHintSystem(this);
    this.performanceTracker = new PerformanceTracker(this);

    // Create UI
    this.createChallengeUI();
    this.createHintPanel();
    this.createChallengeContent();

  // Start performance tracking with worldType & difficulty
  this.performanceTracker.startChallenge(this.challenge.name, this.worldType, this.challenge.difficulty || 1);
  }

  private createChallengeUI() {
    // Background
    this.add.rectangle(640, 360, 1280, 720, 0x2c3e50);

    // Header
    const header = this.add.container(640, 60);
    
    const headerBg = this.add.rectangle(0, 0, 1200, 80, 0x34495e);
    header.add(headerBg);

    const title = this.add.text(0, -10, this.challenge.name, {
      font: 'bold 24px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);
    header.add(title);

    const subtitle = this.add.text(0, 15, `${this.worldType.toUpperCase()} • Level ${this.challenge.difficulty}`, {
      font: '14px monospace',
      color: '#bdc3c7'
    }).setOrigin(0.5);
    header.add(subtitle);

    // Progress indicators
    this.createProgressIndicators();
  }

  private createProgressIndicators() {
    const progressContainer = this.add.container(1100, 60);

    // Timer
    const timerBg = this.add.rectangle(0, -20, 150, 30, 0x34495e);
    progressContainer.add(timerBg);
    
    const timerText = this.add.text(0, -20, 'Time: 00:00', {
      font: '12px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);
    progressContainer.add(timerText);

    // Hint counter
    const hintBg = this.add.rectangle(0, 20, 150, 30, 0x34495e);
    progressContainer.add(hintBg);
    
    const hintText = this.add.text(0, 20, 'Hints: 0/4', {
      font: '12px monospace',
      color: '#ecf0f1'
    }).setOrigin(0.5);
    progressContainer.add(hintText);

    // Store references for updating
    timerText.setData('isTimer', true);
    hintText.setData('isHintCounter', true);
  }

  private createHintPanel() {
    this.hintPanel = this.add.container(1000, 300);

    // Panel background
    const panelBg = this.add.rectangle(0, 0, 250, 400, 0x34495e);
    panelBg.setStrokeStyle(2, 0x3498db);
    this.hintPanel.add(panelBg);

    // Panel title
    const panelTitle = this.add.text(0, -180, 'AI Assistant', {
      font: 'bold 16px monospace',
      color: '#3498db'
    }).setOrigin(0.5);
    this.hintPanel.add(panelTitle);

    // Hint button
    const hintButton = this.add.rectangle(0, -140, 200, 40, 0x3498db)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.requestHint();
      });
    this.hintPanel.add(hintButton);

    const hintButtonText = this.add.text(0, -140, 'Get Hint', {
      font: '14px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.hintPanel.add(hintButtonText);

    // Hint content area
    const hintContent = this.add.text(0, -40, 'Click "Get Hint" when you need help!\n\nI\'m here to guide you through\nthis challenge step by step.', {
      font: '12px monospace',
      color: '#bdc3c7',
      align: 'center',
      wordWrap: { width: 220 }
    }).setOrigin(0.5);
    this.hintPanel.add(hintContent);
    
    // Store reference for updating
    hintContent.setData('isHintContent', true);

    // Submit button
    const submitButton = this.add.rectangle(0, 160, 200, 40, 0x27ae60)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.submitSolution();
      });
    this.hintPanel.add(submitButton);

    const submitButtonText = this.add.text(0, 160, 'Submit Solution', {
      font: '14px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.hintPanel.add(submitButtonText);
  }

  private createChallengeContent() {
    if (this.dynamicChallenge) { this.createDynamicChallengeContent(this.dynamicChallenge); return; }
    this.challengeContainer = this.add.container(400, 350);

    // Create challenge-specific content based on type
    const challengeData = this.challengeEngine.generateChallenge(this.challenge, this.worldType);
    
    // Challenge description
    const descBg = this.add.rectangle(0, -200, 700, 120, 0x34495e);
    this.challengeContainer.add(descBg);

    const description = this.add.text(0, -200, challengeData.description, {
      font: '14px monospace',
      color: '#ecf0f1',
      align: 'center',
      wordWrap: { width: 680 }
    }).setOrigin(0.5);
    this.challengeContainer.add(description);

    // Create interactive area based on challenge type
    this.createInteractiveArea(challengeData);
  }

  private createInteractiveArea(challengeData: any) {
    switch (this.challenge.type) {
      case 'debug':
      case 'optimization':
        this.createCodeEditor(challengeData); break;
      case 'design':
      case 'layout':
      case 'ux':
        this.createDesignCanvas(); break;
      case 'analysis':
      case 'preprocessing':
        this.createDataAnalysisArea(); break;
      default:
        this.createGenericWorkspace();
    }
  }

  private createDynamicChallengeContent(remote: RemoteChallenge) {
    this.challengeContainer = this.add.container(400, 350);
  // Removed background box behind question per request
  // Plain Phaser text (no DOM div) centered within the background
  const questionStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    font: '14px monospace',
    color: '#ecf0f1',
    align: 'center',
    wordWrap: { width: 660 }
  };
  const questionText = this.add.text(0, -40, remote.question, questionStyle).setOrigin(0.5);
  this.challengeContainer.add(questionText);

    // Input area background
  const answerBg = this.add.rectangle(0, 210, 700, 120, 0x2c3e50); // moved farther down & smaller height
  answerBg.setStrokeStyle(2, 0xf39c12);
  this.challengeContainer.add(answerBg);
  const prompt = this.add.text(0, 160, 'Enter your answer below and press Submit:', { font: '12px monospace', color: '#f1c40f' }).setOrigin(0.5);
  this.challengeContainer.add(prompt);

    // HTML input (DOM Element)
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.maxLength = 120;
    inputEl.placeholder = 'Your answer (e.g., A, B, C, D or text)';
  inputEl.style.width = '300px';
    inputEl.style.padding = '8px';
    inputEl.style.fontFamily = 'monospace';
    inputEl.style.fontSize = '14px';
    inputEl.style.border = '2px solid #f39c12';
    inputEl.style.background = '#1e2b36';
    inputEl.style.color = '#ecf0f1';
  const domInput = this.add.dom(0, 200, inputEl); // align with new answer box position
    domInput.setData('isSolutionInput', true);
    this.challengeContainer.add(domInput);

    // Keep a hidden text object for compatibility with existing solution logic
  const hiddenSolution = this.add.text(0, 250, '', { font: '1px monospace', color: '#2c3e50' }).setOrigin(0.5);
    hiddenSolution.setData('isSolutionArea', true);
    hiddenSolution.setVisible(false);
    this.challengeContainer.add(hiddenSolution);

    // Update hidden solution text on input
    inputEl.addEventListener('input', () => { hiddenSolution.setText(inputEl.value); });
    // Allow all character keys (including WASD) to be typed without Phaser intercepting them
    inputEl.addEventListener('keydown', (e) => {
      // Stop Phaser's global keyboard handlers (which may be using WASD for movement) from consuming the event
      e.stopPropagation();
      // Submit on Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        this.submitSolution();
      }
    });
    // While focused, disable Phaser keyboard plugin so movement keys don't interfere
    inputEl.addEventListener('focus', () => {
      if (this.input && this.input.keyboard) {
        this.input.keyboard.enabled = false;
      }
    });
    inputEl.addEventListener('blur', () => {
      if (this.input && this.input.keyboard) {
        this.input.keyboard.enabled = true;
      }
    });
    // Auto focus shortly after creation to ensure DOM mounted
    setTimeout(() => inputEl.focus(), 50);
  }

  private createCodeEditor(challengeData: any) {
    this.challengeContainer = this.challengeContainer || this.add.container(400, 350);

    // Create a simple code input area (in real implementation, this would be a proper code editor)
    const editorBg = this.add.rectangle(0, 50, 700, 300, 0x2c3e50);
    editorBg.setStrokeStyle(2, 0xf39c12);
    this.challengeContainer.add(editorBg);

    // Starting code
    const startingCode = this.add.text(0, 50, challengeData.startingCode || '// Your code here...', {
      font: '12px monospace',
      color: '#f39c12',
      align: 'left',
      wordWrap: { width: 680 }
    }).setOrigin(0.5);
    this.challengeContainer.add(startingCode);

    // Store reference for solution checking
    startingCode.setData('isSolutionArea', true);
  }

  private createDesignCanvas() {
    this.challengeContainer = this.challengeContainer || this.add.container(400, 350);

    const canvasBg = this.add.rectangle(0, 50, 700, 300, 0xecf0f1);
    canvasBg.setStrokeStyle(2, 0x8e44ad);
    this.challengeContainer.add(canvasBg);

    const canvasText = this.add.text(0, 50, 'Design Canvas\n\nDrag and drop elements to create your design', {
      font: '14px monospace',
      color: '#2c3e50',
      align: 'center'
    }).setOrigin(0.5);
    this.challengeContainer.add(canvasText);
  }

  private createDataAnalysisArea() {
    this.challengeContainer = this.challengeContainer || this.add.container(400, 350);

    const analysisBg = this.add.rectangle(0, 50, 700, 300, 0x34495e);
    analysisBg.setStrokeStyle(2, 0x27ae60);
    this.challengeContainer.add(analysisBg);

    const analysisText = this.add.text(0, 50, 'Data Analysis Workspace\n\nUse the tools below to analyze the dataset', {
      font: '14px monospace',
      color: '#ecf0f1',
      align: 'center'
    }).setOrigin(0.5);
    this.challengeContainer.add(analysisText);
  }

  private createGenericWorkspace() {
    this.challengeContainer = this.challengeContainer || this.add.container(400, 350);

    const workspaceBg = this.add.rectangle(0, 50, 700, 300, 0x34495e);
    this.challengeContainer.add(workspaceBg);

    const workspaceText = this.add.text(0, 50, 'Challenge Workspace\n\nComplete the task using the tools provided', {
      font: '14px monospace',
      color: '#ecf0f1',
      align: 'center'
    }).setOrigin(0.5);
    this.challengeContainer.add(workspaceText);
  }

  private async requestHint() {
    let hint: string;
    if (this.dynamicChallenge && this.dynamicChallenge.hint) {
      if (!this.performanceTracker.getHintCount()) { hint = this.dynamicChallenge.hint; }
      else { hint = await this.aiHintSystem.generateHint(this.challenge, this.performanceTracker.getCurrentProgress()); }
    } else { hint = await this.aiHintSystem.generateHint(this.challenge, this.performanceTracker.getCurrentProgress()); }
    const hintContent = this.hintPanel.list.find(child => child.getData('isHintContent')) as Phaser.GameObjects.Text; if (hintContent) hintContent.setText(hint);
    const hintCounter = this.children.list.find(child => child.getData('isHintCounter')) as Phaser.GameObjects.Text; if (hintCounter) { const currentHints = this.performanceTracker.getHintCount(); hintCounter.setText(`Hints: ${currentHints}/4`); }
  }

  private submitSolution() {
    // Prefer DOM input if present
    const domInput = this.challengeContainer.list.find(child => child.getData('isSolutionInput')) as Phaser.GameObjects.DOMElement;
    if (domInput) {
      const el = domInput.node as HTMLInputElement;
      const existingHidden = this.challengeContainer.list.find(child => child.getData('isSolutionArea')) as Phaser.GameObjects.Text;
      if (existingHidden) existingHidden.setText(el.value.trim());
    }
    const solutionArea = this.challengeContainer.list.find(child => child.getData('isSolutionArea')) as Phaser.GameObjects.Text;
    const solution = solutionArea ? solutionArea.text.trim() : '';
    let result: { correct: boolean; feedback: string };
    if (this.dynamicChallenge && this.dynamicChallenge.answer) {
      let expected = this.dynamicChallenge.answer.trim().toUpperCase();
      let user = solution.toUpperCase();
      // Normalize if expected is a single letter (multiple choice). Take first alphanumeric char from user.
      if (/^[A-Z]$/.test(expected)) {
        const match = user.match(/[A-Z]/);
        if (match) user = match[0];
      }
      const correct = user === expected;
      // Do not reveal the correct answer when incorrect
      result = { correct, feedback: correct ? 'Correct answer!' : 'Incorrect. Review the question and try again.' };
    } else { result = this.challengeEngine.checkSolution(this.challenge, solution); }
    if (result.correct) { this.performanceTracker.completeChallenge(true); this.showSuccessMessage(); } else { this.performanceTracker.recordAttempt(false); this.showErrorMessage(result.feedback); }
  }

  private showSuccessMessage() {
    const successOverlay = this.add.container(640, 360);
    
    const overlay = this.add.rectangle(0, 0, 600, 300, 0x27ae60, 0.9);
    successOverlay.add(overlay);

    const successText = this.add.text(0, -50, '🎉 Challenge Complete!', {
      font: 'bold 32px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    successOverlay.add(successText);

    const continueButton = this.add.rectangle(0, 50, 200, 50, 0x2ecc71)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('AnalysisScene', {
          performance: this.performanceTracker.getPerformanceData(),
          challenge: this.challenge,
          worldType: this.worldType
        });
      });
    successOverlay.add(continueButton);

    const continueText = this.add.text(0, 50, 'View Analysis', {
      font: '16px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    successOverlay.add(continueText);
  }

  private showErrorMessage(feedback: string) {
    const errorOverlay = this.add.container(640, 360);
    
    const overlay = this.add.rectangle(0, 0, 500, 200, 0xe74c3c, 0.9);
    errorOverlay.add(overlay);

    const errorText = this.add.text(0, -30, 'Not quite right...', {
      font: 'bold 20px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    errorOverlay.add(errorText);

    const feedbackText = this.add.text(0, 10, feedback, {
      font: '14px monospace',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 450 }
    }).setOrigin(0.5);
    errorOverlay.add(feedbackText);

    const tryAgainButton = this.add.rectangle(0, 60, 150, 40, 0xc0392b)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        errorOverlay.destroy();
      });
    errorOverlay.add(tryAgainButton);

    const tryAgainText = this.add.text(0, 60, 'Try Again', {
      font: '14px monospace',
      color: '#ffffff'
    }).setOrigin(0.5);
    errorOverlay.add(tryAgainText);
  }

  returnToWorld() { this.scene.start('CareerWorldScene', { worldType: this.worldType }); }

  update() {
    // Update timer
    const timerText = this.children.list.find(child => child.getData('isTimer')) as Phaser.GameObjects.Text;
    if (timerText) {
      const elapsed = this.performanceTracker.getElapsedTime();
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      timerText.setText(`Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  }
}
