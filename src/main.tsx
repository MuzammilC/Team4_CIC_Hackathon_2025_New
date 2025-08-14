import './index.css';
import { Game } from './game/Game.js';

// Initialize the game when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});