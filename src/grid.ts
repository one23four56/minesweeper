
export default class Grid extends HTMLElement {
    constructor(width: number, height: number) {
        super(); // create html element

        // set grid width and height
        this.style.gridTemplateColumns = `repeat(${width}, 1fr)`; 
        this.style.gridTemplateRows = `repeat(${height}, 1fr)`;

        // create cells
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();

                this.appendChild(cell);
            }
        }

        // label cells
        for (let i = 0; i < width * height; i++) {
            const cell = this.children[i] as HTMLElement;
            cell.dataset.number = i.toString();
        }
    }
    
    getCell(col: number, row: number): HTMLElement
    getCell(number: number): HTMLElement
    getCell(colOrNumber: number, row?: number): HTMLElement {
        if (row === undefined) {
            // find using number 
            return document.querySelector(`[data-number="${colOrNumber}"]`) as HTMLElement;
        } else {
            // find using row and col
            return document.querySelector(`[data-col="${colOrNumber}"][data-row="${row}"]`) as HTMLElement;
        }
    }
}