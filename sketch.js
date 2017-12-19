const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const arr = ['I','Z','L','J','S','O','T'];
context.scale(15,15);

let score = 0;
const scoreTag = document.getElementById("score");
scoreTag.innerText = "score :" +score; 

function createPiece(type){
	let matrix;
	if(type == 'T'){
		 matrix =[[0,0,0],
		     	  [1,1,1],
				  [0,1,0]]; 
	}
	else if(type == 'L'){
		matrix =[[1,0,0],
		     	 [1,0,0],
				 [1,1,0]]; 
	}
	else if(type == 'J'){
		matrix =[[0,1,0],
		     	 [0,1,0],
				 [1,1,0]]; 
	}
	else if(type == 'Z'){
		matrix =[[0,0,0],
		     	 [1,1,0],
				 [0,1,1]]; 
	}
	else if(type == 'S'){
		matrix =[[0,0,0],
		     	 [0,1,1],
				 [1,1,0]]; 
	}
	else if(type == 'O'){
		matrix =[[1,1,0],
		     	 [1,1,0],
				 [0,0,0]]; 
	}
	else if(type == 'I'){
		matrix =[[0,1,0,0],
		     	 [0,1,0,0],
				 [0,1,0,0],
				 [0,1,0,0]];
	}
	return matrix;
}

//if the player overlaps with the bottom or any layer then it returns true
function overlap(arena,player){
	[m,off] = [player.matrix,player.pos];
	for(let y = 0 ;y < m.length ; y++){
		for(let x = 0;x < m[y].length ; x++){
			//if some position is the player matrix is 1 and that position in the arena is 
			//also 1 then the player overlaps with somthing then return true
			if(m[y][x] != 0 && (arena[y+off.yCod]
				&& arena[y+off.yCod][x + off.xCod]) != 0){
				return true;
			}
		}
	}
	return false;
}

function createMatrix(width,height){
	h = height;
	w = width;
	let matrix = [];
	for(let i = 0 ;i <h;i++){
		let row = [];
		for(let j = 0 ; j <w;j++){
			row.push(0);
		}
		matrix.push(row);
	}
	return matrix;
}

function draw(matrix,playerPos){

	for (let i = 0; i < matrix.length ; i++) {
		for (var j = 0; j < matrix[0].length; j++) {
			if(matrix[i][j] == 1){
				context.fillStyle = 'white';
				context.fillRect(j + playerPos.xCod,i + playerPos.yCod,1,1);
			}
		}
	}
}

//copies the cord to the matrix u have created
function merge(arena,player){
	[m,off] = [player.matrix,player.pos];
	for(let i = 0;i < m.length ;i++){
		for(let j = 0;j < m[i].length;j++){
			if(m[i][j] == 1){
				arena[off.yCod + i][off.xCod + j] = 1;
			}
		}
	}
}

function playerUpdate(player){
	console.log("playerUpdate");
	console.log(player);
	player.matrix = createPiece(arr[Math.floor(Math.random()*arr.length)]);
	player.pos.xCod = Math.floor(Math.random()*19);
	player.pos.yCod = 0;
	console.log(player);
}

//simplly drops the player one position
function playerDrop(){
	console.log("Drop");
	player.pos.yCod++;
	if(overlap(arena,player)){
		player.pos.yCod--;
		merge(arena,player);
		console.log("OverLapDrop");
		playerUpdate(player);
		rowRemove();
	}
	console.log(player);
	diffUpdate = 0;
}

function rowRemove(){
	for(let i = arena.length - 1 ;i >= 0 ;i--){
		let fill = true;
		for(let j = arena[i].length - 1 ;j >= 0 ;j--){
			if(arena[i][j] != 1){
				fill = false;
			}		
		}
		if(fill){
			score++;
			scoreTag.innerText = "score :" +score; 
			arena.splice(i,1);
			arena.splice(0,0,new Array(19).fill(0));
		}
	}
}

function playerRotate(player,dir){
	//for clockwise rotation
	if(dir == 1){
		//rotate about y
		for(let i = 0;i < player.matrix.length ;i++){
			for(let j = 0;j < player.matrix[i].length;j++){
				if(j >= player.matrix.length/2){
					temp = player.matrix[i][j];
					player.matrix[i][j] = player.matrix[i][player.matrix.length - 1-j];
					player.matrix[i][player.matrix.length - 1-j] = temp;
				}
			}
		}
	}

	//for anti-clockwise rotation
	if(dir == -1){
		//rotate about y
		for(let i = 0;i < player.matrix.length ;i++){
			for(let j = 0;j < player.matrix[i].length;j++){
				if(i >= player.matrix.length/2){
					temp = player.matrix[i][j];
					player.matrix[i][j] = player.matrix[player.matrix.length - 1-i][j];
					player.matrix[player.matrix.length - 1-i][j] = temp;
				}
			}
		}
	}
	
	//if overlaping after rotation then it will move itself to right first then
	//it will again check wheather it is ok or not then it will move 2 to left
	//then again check again move right by 3 and again check....and so on..
	let offset = 1;
	while(overlap(arena,player)){
		player.pos.xCod += offset;
		offset =  -(offset + (offset > 0 ? 1 : -1));
	}
}

function rotate(player,dir){
   	//clockwise = transpose + reverse about x-axis
	//anticlockwise = transpose + reverse about y-axis
	m = player.matrix;
	//transpose of m*m matrix only not for m*n
	for(let i = 0;i < m.length ;i++){
		for(let j = 0;j < m[i].length;j++){
			if(i > j){
				temp = m[i][j];
				m[i][j] = m[j][i];
				m[j][i] = temp;
			}
		}
	}
	playerRotate(player,dir);
}

function update(){
	//update the time
	let currentTime = new Date();
	const diffTime = currentTime - lastTime;
	lastTime = currentTime;
	diffUpdate+=diffTime;
	if(diffUpdate > 1000){
		//playerDrop();
	}
	//erase canvas and redraw again
	context.fillStyle = "#345";
	context.fillRect(0,0,canvas.width,canvas.height);

	for(let i = 0; i < arena.length;i++){
		for(let j = 0 ;j < arena[i].length ;j++){
			if(arena[i][j] == 1){
				context.fillStyle = "red";
				context.fillRect(j,i,1,1);
			}
		}
	}

	//draw the player's matrix at specified position
	draw(player.matrix,player.pos);
	//this is a inbuilt method for looping //or continuously calling the function //as in draw of "p5JS"
	requestAnimationFrame(update);
}

function horizMove(dir){
	player.pos.xCod += dir;
	if(overlap(arena,player)){
		player.pos.xCod -= dir;
	}
}

document.addEventListener("keydown",keyPressed);
function keyPressed(event){
	
	if(event.keyCode == 37){
		horizMove(-1);
	}
	else if(event.keyCode == 39){
		horizMove(1);
	}
	else if(event.keyCode == 40){
		playerDrop();
	}
	else if(event.keyCode == 81){
		rotate(player,1);
	}
	else if(event.keyCode == 87){
		rotate(player,-1);
	}
}

//when u r making object as this then u should use ":" instead of " = "......Keep this in Mind.....
const player = {
	pos : {xCod : 0,yCod : 0} ,
	matrix : createPiece('T')
}

let lastTime = 0;
let diffUpdate = 0;
//matrix of the playing area for the player
let arena = createMatrix(19,34);
//we r starting the loop here
update();

console.log("last");


/*
1 2 3        3 6 9
4 5 6   ==>  2 5 8
7 8 9		 1 4 7

//transpose
1 4 7
2 5 8
3 6 9

//reverse
7 4 1
8 5 2
9 6 3
*/