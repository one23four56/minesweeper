// imports 
import Grid, { Cell } from './grid';
import Game from './game';

// register imports 
//      note: it will throw an 'illegal constructor' error if you do not do this
//      also names have to have a '-' in them for some reason
window.customElements.define('grid-main', Grid);
window.customElements.define('grid-item', Cell);


document.querySelector<HTMLFormElement>("form")?.addEventListener("submit", event => {
    event.preventDefault();

    const grid = new Grid(
        document.querySelector<HTMLInputElement>("#cols")?.valueAsNumber ?? 10,
        document.querySelector<HTMLInputElement>("#rows")?.valueAsNumber ?? 10
    )

    document.body.appendChild(grid);

    new Game(grid, document.querySelector<HTMLInputElement>("#mines")?.valueAsNumber ?? 10);

    document.querySelector<HTMLFormElement>("form")?.remove();
})