// imports 
import Grid from './grid';

// register imports 
//      note: it will throw an 'illegal constructor' error if you do not do this
//      also names have to have a '-' in them for some reason
window.customElements.define('grid-main', Grid);

const grid = new Grid(30, 10);
document.body.appendChild(grid);
grid.getCell(10, 9).style.backgroundColor = 'red';
grid.getCell(50).style.backgroundColor = 'white';