
export default class Grid extends HTMLElement {
    width: number;
    height: number;
    cells: Cell[];

    constructor(width: number, height: number) {
        super(); // create html element

        // set grid width and height
        this.style.gridTemplateColumns = `repeat(${width}, 1fr)`; 
        this.style.gridTemplateRows = `repeat(${height}, 1fr)`;
        this.width = width;
        this.height = height;

        this.cells = [];

        // create cells
        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const cell = new Cell(this)
                cell.classList.add('cell');

                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();
                cell.col = col;
                cell.row = row;

                this.appendChild(cell);
            }
        }

        // label cells
        for (let i = 0; i < width * height; i++) {
            const cell = this.children[i] as Cell;
            cell.dataset.number = i.toString();
            this.cells.push(cell);
        }
    }
    
    getCell(col: number, row: number): Cell
    getCell(number: number): Cell
    getCell(colOrNumber: number, row?: number): Cell {
        if (row === undefined) {
            // find using number 
            return document.querySelector(`[data-number="${colOrNumber}"]`) as Cell;
        } else {
            // find using row and col
            return document.querySelector(`[data-col="${colOrNumber}"][data-row="${row}"]`) as Cell;
        }
    }
}

export class Cell extends HTMLElement {
    col: number = 0;
    row: number = 0;
    grid: Grid;
    type: string = "";

    constructor(grid: Grid) {
        super(); // create html element

        this.grid = grid;
    }

    /**
     * Gets a cell from a given position relative to this cell
     * @param col Column (x) position relative to this cell
     * @param row Row (y) position relative to this cell
     * @returns Cell (if found)
     */
    relativeGet(col: number, row: number): Cell {
        return this.grid.getCell(col + this.col, row + this.row);
    }

    getNeighbors(): Cell[] {
        const neighbors = [];

        for (let col = -1; col <= 1; col++) {
            for (let row = -1; row <= 1; row++) {
                if (col === 0 && row === 0) continue;
                const neighbor = this.relativeGet(col, row);
                if (neighbor) neighbors.push(neighbor);
            }
        }

        return neighbors;
    }
}