
export default class Grid extends HTMLElement {
    constructor(width: number, height: number) {
        super(); // create html element

        // set grid width and height
        this.style.gridTemplateColumns = `repeat(${width}, 1fr)`; 
        this.style.gridTemplateRows = `repeat(${height}, 1fr)`;

        // create cells
        for (let i = 0; i < width * height; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            this.appendChild(cell);
        }
    }
}