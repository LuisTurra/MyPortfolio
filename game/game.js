const gridSize = 5;
const cellSize = 32; 
let cubePos = { x: 0, y: 0 }; 
let endPos = { x: 4, y: 4 }; 
let commands = [];
let correctPath = [];
let currentPathCoords = [];


const paths = [
 {
 coords: [
 { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
 { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }
 ],
 commands: ['right', 'right', 'right', 'down', 'right', 'down', 'down', 'down']
 },
 {
 coords: [
 { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 },
 { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }
 ],
 commands: ['down', 'right', 'down', 'down', 'right', 'right', 'down', 'right']
 },
 {
 coords: [
 { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
 { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 2 }, { x: 2, y: 1 },
 { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 },
 { x: 4, y: 3 }, { x: 4, y: 4 }
 ],
 commands: ['down', 'down', 'down', 'down', 'right', 'right', 'up', 'up', 'up', 'up', 'right', 'right', 'down', 'down', 'down', 'down']
 }
];


function initGame() {
 const selectedPath = paths[Math.floor(Math.random() * paths.length)];
 correctPath = selectedPath.commands;
 currentPathCoords = selectedPath.coords;
 endPos = selectedPath.coords[selectedPath.coords.length - 1];

 
 const grid = document.getElementById('grid');
 grid.innerHTML = '';


 for (let y = 0; y < gridSize; y++) {
 for (let x = 0; x < gridSize; x++) {
 const cell = document.createElement('div');
 cell.className = 'grid-cell';
 cell.dataset.x = x;
 cell.dataset.y = y;
 grid.appendChild(cell);
 }
 }


 currentPathCoords.forEach(({ x, y }) => {
 const cell = document.querySelector(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
 cell.classList.add('path');
 });

 
 document.getElementById('cube').style.left = `${cubePos.x * cellSize + 2}px`;
 document.getElementById('cube').style.top = `${cubePos.y * cellSize + 2}px`;
 document.getElementById('start-point').style.left = `${cubePos.x * cellSize + 2}px`;
 document.getElementById('start-point').style.top = `${cubePos.y * cellSize + 2}px`;
 document.getElementById('end-point').style.left = `${endPos.x * cellSize + 2}px`;
 document.getElementById('end-point').style.top = `${endPos.y * cellSize + 2}px`;
 document.getElementById('command-list').innerText = 'Comandos: []';
 commands = [];
}


function addCommand(direction) {
 commands.push(direction);
 document.getElementById('command-list').innerText = `Comandos: [${commands.join(', ')}]`;
}


function startGame() {
 let tempPos = { x: 0, y: 0 };
 let currentStep = 0; 

 function moveCube() {
 if (currentStep >= commands.length || currentStep >= correctPath.length) {
 checkResult(tempPos);
 return;
 }

 const command = commands[currentStep];
 const expectedCommand = correctPath[currentStep];
 const nextCoord = currentPathCoords[currentStep + 1];

 if (!nextCoord) {
 checkResult(tempPos);
 return;
 }

 let validMove = false;
 let nextPos = { x: tempPos.x, y: tempPos.y };


 if (command === 'up' && tempPos.y > 0) {
 nextPos.y--;
 } else if (command === 'down' && tempPos.y < gridSize - 1) {
 nextPos.y++;
 } else if (command === 'left' && tempPos.x > 0) {
 nextPos.x--;
 } else if (command === 'right' && tempPos.x < gridSize - 1) {
 nextPos.x++;
 }

 
 if (nextPos.x === nextCoord.x && nextPos.y === nextCoord.y && command === expectedCommand) {
 tempPos = nextPos;
 validMove = true;
 currentStep++;
 }

 document.getElementById('cube').style.left = `${tempPos.x * cellSize + 2}px`;
 document.getElementById('cube').style.top = `${tempPos.y * cellSize + 2}px`;

 setTimeout(moveCube, 300);
 }

 moveCube();
}


function checkResult(pos) {
 const modal = document.getElementById('result-modal');
 const message = document.getElementById('result-message');
 const isAtEnd = pos.x === endPos.x && pos.y === endPos.y;
 const isCorrectSequence = commands.length === correctPath.length &&
 commands.every((cmd, i) => cmd === correctPath[i]);

 if (isAtEnd && isCorrectSequence) {
 message.innerHTML = 'Sucesso! Você alcançou o objetivo! <a href="../index.html#projects">Ver meus projetos</a>';
 } else {
 message.innerText = 'Ops! Caminho errado. Tente novamente!';
 }
 modal.style.display = 'block';
}


function resetGame() {
 commands = [];
 cubePos = { x: 0, y: 0 };
 initGame();
}


function closeModal() {
 document.getElementById('result-modal').style.display = 'none';
 resetGame();
}


initGame();