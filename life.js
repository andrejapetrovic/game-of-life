window.addEventListener('load', () => {
	const c = document.getElementById("canvas");
	const ctx = c.getContext("2d");
	ctx.fillStyle = 'blue';
	ctx.strokeStyle = 'gray';
	const size = 15
	const rows = Math.floor(c.width / size)
	const cols = Math.floor(c.height / size)

	drawRect = (x, y, s = size) => {
		ctx.beginPath();
		ctx.fillRect(x * s, y * s, s - 1, s - 1);
		ctx.stroke();
	}

	clearRect = (x, y, s = size) => {
		ctx.clearRect(x * s, y * s, s - 1, s - 1)
		ctx.strokeRect(x * s, y * s, s, s)
	}

	drawAll = (new_cells) => {
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (new_cells[i][j] == 1)
					drawRect(i, j)
				else
					clearRect(i, j)
			}
		}
	}

	setIteration = () => {
		let iteration = 0;
		return (count) => {
			let node = document.getElementById("iter");
			count == 0 ? iteration = 0 : iteration += count;
			node.innerText = `Iteration: ${iteration}`
		}
	}
	
	init = () => {
		cells = new Array(rows)
		for (let i = 0; i < rows; i++) {
			cells[i] = new Array(cols)
			for (let j = 0; j < cols; j++) {
				cells[i][j] = 0
			}
		}

		cells[15][10] = 1
		cells[16][10] = 1
		cells[17][10] = 1
		cells[17][9] = 1
		cells[16][8] = 1
		drawAll(cells)
		changeIteration = setIteration()

		next = () => {
			cells = nextGen(cells)
			changeIteration(1)
			drawAll(cells)
		}

		reset = () => {
			changeIteration(0);
			drawAll(cells);
			init();
		}

		play = () => {
			interval = setInterval(() => {
				next();
			}, 250)

			stop = () => {
				clearInterval(interval)
			}
		}

		add = (event) => {
			let rx = event.offsetX % size
			let xMin = event.offsetX - rx
			x = xMin / size

			let ry = event.offsetY % size
			let yMin = event.offsetY - ry
			y = yMin / size

			if (cells[x][y] == 1) {
				cells[x][y] = 0;
				clearRect(x, y);
			} else {
				cells[x][y] = 1;
				drawRect(x, y)
			}
		}
	}

	init();

	nextGen = (cells) => {
		next_cells = new Array(rows)
		for (let i = 0; i < rows; i++) {
			next_cells[i] = new Array(cols)
			for (let j = 0; j < cols; j++) {
				sum = cells[i][j] 
				sum += checkNeighbours(i, j + 1);
				sum += checkNeighbours(i, j - 1);
				sum += checkNeighbours(i + 1, j);
				sum += checkNeighbours(i - 1, j);
				sum += checkNeighbours(i - 1, j + 1);
				sum += checkNeighbours(i - 1, j - 1);
				sum += checkNeighbours(i + 1, j + 1);
				sum += checkNeighbours(i + 1, j - 1);
				if (sum > 4 || sum < 3)
					next_cells[i][j] = 0;
				else if (sum === 3)
					next_cells[i][j] = 1;
				else
					next_cells[i][j] = cells[i][j];
			}
		}
		return next_cells;
	}

	checkNeighbours = (i, j) => {
		if (i === -1 || j === -1 || i === rows || j === cols)
			return 0;
		if (cells[i][j] === 0)
			return 0
		else
			return 1;
	}

})

