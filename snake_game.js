// 游戏常量 - 适配诺基亚风格小屏幕
const CANVAS_SIZE = 240;
const GRID_SIZE = 12;
const CELL_COUNT = CANVAS_SIZE / GRID_SIZE;

// 游戏变量
let canvas, ctx;
let snake = [];
let food = {x: 0, y: 0};
let direction = {x: 1, y: 0};
let nextDirection = {x: 1, y: 0};
let gameLoop = null;
let score = 0;
let level = 1;
let speed = 150;
let isPaused = false;

// 初始化游戏
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // 初始化贪吃蛇
    snake = [
        {x: 5, y: 10},
        {x: 4, y: 10},
        {x: 3, y: 10}
    ];
    
    // 生成初始食物
    generateFood();
    
    // 重置分数和等级
    score = 0;
    level = 1;
    speed = 150;
    
    // 更新显示
    updateScore();
    
    // 隐藏游戏结束提示
    document.getElementById('game-over').style.display = 'none';
    
    // 清除现有的游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    // 绑定键盘事件
    document.addEventListener('keydown', handleKeyPress);
}

// 生成食物
function generateFood() {
    food.x = Math.floor(Math.random() * CELL_COUNT);
    food.y = Math.floor(Math.random() * CELL_COUNT);
    
    // 确保食物不生成在蛇身上
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// 绘制游戏
function drawGame() {
    // 清空画布 - 黑色背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格线 - 淡绿色网格，增加诺基亚风格
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
    }
    
    // 绘制食物 - 红色方块，诺基亚风格
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    
    // 绘制贪吃蛇 - 亮绿色方块，蛇头和蛇身同色，诺基亚风格
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
}

// 更新游戏状态
function updateGame() {
    if (isPaused) return;
    
    // 更新方向
    direction = nextDirection;
    
    // 移动蛇头
    let head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    
    // 检查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // 添加新的蛇头
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        increaseSpeed();
        generateFood();
    } else {
        // 移除蛇尾
        snake.pop();
    }
    
    // 绘制游戏
    drawGame();
}

// 检查碰撞
function checkCollision(head) {
    // 检查边界碰撞
    if (head.x < 0 || head.x >= CELL_COUNT || head.y < 0 || head.y >= CELL_COUNT) {
        return true;
    }
    
    // 检查自身碰撞
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            return true;
        }
    }
    
    return false;
}

// 处理键盘事件
function handleKeyPress(e) {
    // 防止默认行为
    e.preventDefault();
    
    // 根据按键更新方向
    updateDirection(e.key);
}

// 处理按钮点击事件
function handleButtonPress(key) {
    updateDirection(key);
}

// 更新方向的通用函数
function updateDirection(key) {
    switch(key) {
        case 'ArrowUp':
            if (direction.y !== 1) {
                nextDirection = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (direction.y !== -1) {
                nextDirection = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) {
                nextDirection = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (direction.x !== -1) {
                nextDirection = {x: 1, y: 0};
            }
            break;
        case ' ':
            // 空格键暂停/继续
            togglePause();
            break;
    }
}

// 更新分数
function updateScore() {
    document.getElementById('score').textContent = score;
}

// 增加速度
function increaseSpeed() {
    // 每吃10个食物增加一个等级
    if (score % 100 === 0) {
        level++;
        // 速度增加（间隔时间减少）
        speed = Math.max(50, speed - 10);
        
        // 重新设置游戏循环
        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, speed);
    }
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('game-over').style.display = 'block';
}

// 开始游戏
function startGame() {
    initGame();
    isPaused = false;
    gameLoop = setInterval(updateGame, speed);
}

// 暂停游戏
function pauseGame() {
    togglePause();
}

// 切换暂停状态
function togglePause() {
    isPaused = !isPaused;
    if (!isPaused && !gameLoop) {
        gameLoop = setInterval(updateGame, speed);
    }
}

// 页面加载完成后初始化游戏
window.addEventListener('load', initGame);