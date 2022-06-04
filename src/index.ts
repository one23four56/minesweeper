// imports 
import Grid from './grid';

// register imports 
//      note: it will throw an 'illegal constructor' error if you do not do this
//      also names have to have a '-' in them for some reason
window.customElements.define('grid-main', Grid);

document.body.appendChild(new Grid(20, 10));