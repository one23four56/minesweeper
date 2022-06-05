import Grid, { Cell } from "./grid";

export default class Game {

    private correctFlags = 0;
    private totalFlags = 0;

    constructor(grid: Grid, bombs: number = 10) {

        // place bombs 
        for (let i = 0; i < bombs; i++) {
            (function place() {
                const cell = grid.getCell(Math.floor(Math.random() * grid.width * grid.height));
                
                if (cell.dataset.bomb === "yes" || cell.type === "safe") place()

                cell.dataset.bomb = "yes";
            })();
        }

        for (const cell of grid.cells) {
            
            cell.type = "unknown";

            cell.addEventListener('mouseenter', () => {
                if (cell.type === "unknown")
                    cell.style.backgroundColor = "gray";
                else if (cell.type === "safe")
                    cell.getNeighbors().forEach(neighbor => {
                        if (neighbor.type === "unknown")
                            neighbor.style.backgroundColor = "gray";
                    });
            })

            cell.addEventListener('mouseleave', () => {
                if (cell.type === "unknown")
                    cell.style.backgroundColor = "#f0f0f0";
                else if (cell.type === "safe")
                    cell.getNeighbors().forEach(neighbor => {
                        if (neighbor.type === "unknown")
                            neighbor.style.backgroundColor = "#f0f0f0";
                    })
            })

            cell.addEventListener('click', () => {
                if (cell.dataset.bomb === "yes" && cell.type !== "flag") {
                    cell.style.backgroundColor = "red";
                    grid.cells.forEach(cell => {
                        if (cell.dataset.bomb === "yes") {
                            cell.style.backgroundColor = "red";
                            cell.type = "bomb"
                        } 
                    })
                    this.doLoseAction();
                } else if (cell.type === "unknown") {
                    cell.style.backgroundColor = "green";
                    cell.type = "safe"

                    const nearby = GameUtilities.getNearbyBombs(cell)
                    if (nearby === 0) 
                        GameUtilities.recursivelyCheckForNearbyBombs(cell);
                    else
                        cell.innerText = (nearby - GameUtilities.getNearbyFlags(cell)).toString();

                } else if (cell.type === "safe") {
                    if (GameUtilities.getNearbyBombs(cell) === GameUtilities.getNearbyFlags(cell))
                        cell.getNeighbors().forEach(neighbor => {
                            if (neighbor.type === "unknown")
                                neighbor.click()
                        });
                }
            })

            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();

                if (cell.type === "unknown") {
                    if (this.totalFlags === bombs)
                        return;
                    
                    cell.style.backgroundColor = "blue";
                    cell.type = "flag";

                    if (cell.dataset.bomb === "yes")
                        this.correctFlags++;
                    
                    this.totalFlags++;

                    cell.getNeighbors().forEach(neighbor => {
                        if (neighbor.type === "safe" && neighbor.innerText !== "") {
                            neighbor.innerText = (GameUtilities.getNearbyBombs(neighbor) - GameUtilities.getNearbyFlags(neighbor)).toString();
                        }
                    })

                    if (this.correctFlags === bombs)
                        this.doWinAction();

                } else if (cell.type === "flag") {
                    cell.style.backgroundColor = "#f0f0f0";
                    cell.type = "unknown";

                    if (cell.dataset.bomb === "yes")
                        this.correctFlags--;

                    cell.getNeighbors().forEach(neighbor => {
                        if (neighbor.type === "safe" && neighbor.innerText !== "") {
                            neighbor.innerText = (GameUtilities.getNearbyBombs(neighbor) - GameUtilities.getNearbyFlags(neighbor)).toString();
                        }
                    })

                    this.totalFlags--;
                }
            })
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
        holder.className = "holder"

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
        holder.className = "holder"

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
    static getNearbyBombs(cell: Cell): number {
        let output = 0;

        cell.getNeighbors().forEach(neighbor => {
            if (neighbor.dataset.bomb === "yes") output++;
        })

        return output;
    }

    static recursivelyCheckForNearbyBombs(cell: Cell) {
        cell.getNeighbors().forEach(neighbor => {
            if (neighbor.type === "unknown") {
                neighbor.type = "safe";
                neighbor.style.backgroundColor = "green";

                const nearby = GameUtilities.getNearbyBombs(neighbor);
                if (nearby === 0)
                    GameUtilities.recursivelyCheckForNearbyBombs(neighbor);
                else 
                    neighbor.innerText = (nearby - GameUtilities.getNearbyFlags(neighbor)).toString();
            }
        })
    }

    static getNearbyFlags(cell: Cell): number {
        let output = 0;

        cell.getNeighbors().forEach(neighbor => {
            if (neighbor.type === "flag") output++;
        })

        return output;
    }
}