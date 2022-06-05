// imports 
import Grid, { Cell } from './grid';
import Game from './game';

// register imports 
//      note: it will throw an 'illegal constructor' error if you do not do this
//      also names have to have a '-' in them for some reason
window.customElements.define('grid-main', Grid);
window.customElements.define('grid-item', Cell);

const grid = new Grid(40, 20);
document.body.appendChild(grid);
new Game(grid, 60)