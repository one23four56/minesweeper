(function () {
    'use strict';

    class Grid extends HTMLElement {
        width;
        height;
        cells;
        constructor(width, height) {
            super();
            this.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
            this.style.gridTemplateRows = `repeat(${height}, 1fr)`;
            this.width = width;
            this.height = height;
            this.cells = [];
            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const cell = new Cell(this);
                    cell.classList.add('cell');
                    cell.dataset.row = row.toString();
                    cell.dataset.col = col.toString();
                    cell.col = col;
                    cell.row = row;
                    this.appendChild(cell);
                }
            }
            for (let i = 0; i < width * height; i++) {
                const cell = this.children[i];
                cell.dataset.number = i.toString();
                this.cells.push(cell);
            }
        }
        getCell(colOrNumber, row) {
            if (row === undefined) {
                return document.querySelector(`[data-number="${colOrNumber}"]`);
            }
            else {
                return document.querySelector(`[data-col="${colOrNumber}"][data-row="${row}"]`);
            }
        }
    }
    class Cell extends HTMLElement {
        col = 0;
        row = 0;
        grid;
        type = "";
        constructor(grid) {
            super();
            this.grid = grid;
        }
        relativeGet(col, row) {
            return this.grid.getCell(col + this.col, row + this.row);
        }
        getNeighbors() {
            const neighbors = [];
            for (let col = -1; col <= 1; col++) {
                for (let row = -1; row <= 1; row++) {
                    if (col === 0 && row === 0)
                        continue;
                    const neighbor = this.relativeGet(col, row);
                    if (neighbor)
                        neighbors.push(neighbor);
                }
            }
            return neighbors;
        }
    }

    class Game {
        correctFlags = 0;
        totalFlags = 0;
        constructor(grid, bombs = 10) {
            for (let i = 0; i < bombs; i++) {
                (function place() {
                    const cell = grid.getCell(Math.floor(Math.random() * grid.width * grid.height));
                    if (cell.dataset.bomb === "yes" || cell.type === "safe")
                        place();
                    cell.dataset.bomb = "yes";
                })();
            }
            for (const cell of grid.cells) {
                cell.type = "unknown";
                cell.addEventListener('mouseenter', () => {
                    if (cell.type === "unknown")
                        cell.className = "hover";
                    else if (cell.type === "safe")
                        cell.getNeighbors().forEach(neighbor => {
                            if (neighbor.type === "unknown")
                                neighbor.className = "hover";
                        });
                });
                cell.addEventListener('mouseleave', () => {
                    if (cell.type === "unknown")
                        cell.className = "unknown";
                    else if (cell.type === "safe")
                        cell.getNeighbors().forEach(neighbor => {
                            if (neighbor.type === "unknown")
                                neighbor.className = "unknown";
                        });
                });
                cell.addEventListener('click', () => {
                    if (cell.dataset.bomb === "yes" && cell.type !== "flag") {
                        cell.className = "mine";
                        grid.cells.forEach(cell => {
                            if (cell.dataset.bomb === "yes") {
                                cell.className = "mine";
                                cell.type = "bomb";
                            }
                        });
                        this.doLoseAction();
                    }
                    else if (cell.type === "unknown") {
                        cell.className = "safe";
                        cell.type = "safe";
                        const nearby = GameUtilities.getNearbyBombs(cell);
                        if (nearby === 0)
                            GameUtilities.recursivelyCheckForNearbyBombs(cell);
                        else
                            cell.innerText = (nearby - GameUtilities.getNearbyFlags(cell)).toString();
                    }
                    else if (cell.type === "safe") {
                        if (GameUtilities.getNearbyBombs(cell) === GameUtilities.getNearbyFlags(cell))
                            cell.getNeighbors().forEach(neighbor => {
                                if (neighbor.type === "unknown")
                                    neighbor.click();
                            });
                    }
                });
                cell.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    if (cell.type === "unknown") {
                        if (this.totalFlags === bombs)
                            return;
                        cell.className = "flag";
                        cell.type = "flag";
                        if (cell.dataset.bomb === "yes")
                            this.correctFlags++;
                        this.totalFlags++;
                        cell.getNeighbors().forEach(neighbor => {
                            if (neighbor.type === "safe" && neighbor.innerText !== "") {
                                neighbor.innerText = (GameUtilities.getNearbyBombs(neighbor) - GameUtilities.getNearbyFlags(neighbor)).toString();
                            }
                        });
                        if (this.correctFlags === bombs)
                            this.doWinAction();
                    }
                    else if (cell.type === "flag") {
                        cell.className = "unknown";
                        cell.type = "unknown";
                        if (cell.dataset.bomb === "yes")
                            this.correctFlags--;
                        cell.getNeighbors().forEach(neighbor => {
                            if (neighbor.type === "safe" && neighbor.innerText !== "") {
                                neighbor.innerText = (GameUtilities.getNearbyBombs(neighbor) - GameUtilities.getNearbyFlags(neighbor)).toString();
                            }
                        });
                        this.totalFlags--;
                    }
                });
            }
            for (const cell of grid.cells) {
                if (GameUtilities.getNearbyBombs(cell) === 0 && cell.dataset.bomb !== "yes") {
                    cell.click();
                    return;
                }
            }
        }
        doWinAction() {
            const holder = document.createElement("div");
            holder.className = "holder";
            const text = document.createElement("h1");
            text.innerText = "You Win!";
            const button = document.createElement("button");
            button.innerText = "Play Again";
            button.onclick = () => location.reload();
            holder.appendChild(text);
            holder.appendChild(button);
            document.body.appendChild(holder);
        }
        doLoseAction() {
            const holder = document.createElement("div");
            holder.className = "holder";
            const text = document.createElement("h1");
            text.innerText = "You Lose!";
            const button = document.createElement("button");
            button.innerText = "Play Again";
            button.onclick = () => location.reload();
            holder.appendChild(text);
            holder.appendChild(button);
            document.body.appendChild(holder);
        }
    }
    class GameUtilities {
        static getNearbyBombs(cell) {
            let output = 0;
            cell.getNeighbors().forEach(neighbor => {
                if (neighbor.dataset.bomb === "yes")
                    output++;
            });
            return output;
        }
        static recursivelyCheckForNearbyBombs(cell) {
            cell.getNeighbors().forEach(neighbor => {
                if (neighbor.type === "unknown") {
                    neighbor.type = "safe";
                    neighbor.className = "safe";
                    const nearby = GameUtilities.getNearbyBombs(neighbor);
                    if (nearby === 0)
                        GameUtilities.recursivelyCheckForNearbyBombs(neighbor);
                    else
                        neighbor.innerText = (nearby - GameUtilities.getNearbyFlags(neighbor)).toString();
                }
            });
        }
        static getNearbyFlags(cell) {
            let output = 0;
            cell.getNeighbors().forEach(neighbor => {
                if (neighbor.type === "flag")
                    output++;
            });
            return output;
        }
    }

    window.customElements.define('grid-main', Grid);
    window.customElements.define('grid-item', Cell);
    document.querySelector("form")?.addEventListener("submit", event => {
        event.preventDefault();
        if ((document.querySelector("#mines")?.valueAsNumber ?? 10)
            >
                ((document.querySelector("#cols")?.valueAsNumber ?? 10)
                    *
                        (document.querySelector("#rows")?.valueAsNumber ?? 10)) - 1) {
            document.querySelector("#mines")?.setCustomValidity("Too many mines!");
            return;
        }
        const grid = new Grid(document.querySelector("#cols")?.valueAsNumber ?? 10, document.querySelector("#rows")?.valueAsNumber ?? 10);
        document.body.appendChild(grid);
        new Game(grid, document.querySelector("#mines")?.valueAsNumber ?? 10);
        document.querySelector("form")?.remove();
    });

})();
