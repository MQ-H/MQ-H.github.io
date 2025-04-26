const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏参数
const gravity = 0.5;
const friction = 0.98;
const ballRadius = 15;
const groundY = canvas.height - 20;

// 小球对象
class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = groundY;
        this.vx = 0;
        this.vy = 0;
        this.color = '#ff6b6b';
    }

    update() {
        this.vy += gravity;
        this.y += this.vy;
        this.x += this.vx;

        // 碰撞检测（地面）
        if (this.y + ballRadius > groundY) {
            this.y = groundY - ballRadius;
            this.vy *= -0.7; // 反弹时损失能量
            this.vx *= friction;
        }

        // 边界检测（左右）
        if (this.x - ballRadius < 0) this.x = ballRadius;
        if (this.x + ballRadius > canvas.width) this.x = canvas.width - ballRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// 障碍物数组
let obstacles = [];

// 初始化
let ball = new Ball();

// 游戏循环
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制地面
    ctx.fillStyle = '#333';
    ctx.fillRect(0, groundY, canvas.width, 20);

    // 绘制障碍物
    obstacles.forEach(obstacle => {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // 碰撞检测（障碍物）
    obstacles.forEach(obstacle => {
        if (
            ball.y + ballRadius > obstacle.y &&
            ball.y - ballRadius < obstacle.y + obstacle.height &&
            ball.x + ballRadius > obstacle.x &&
            ball.x - ballRadius < obstacle.x + obstacle.width
        ) {
            // 碰到障碍物时反弹
            ball.vy *= -0.7;
            ball.vx *= friction;
        }
    });

    ball.update();
    ball.draw();
    requestAnimationFrame(gameLoop);
}

// 鼠标点击生成障碍物
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    obstacles.push({
        x: x - 50,
        y: groundY - 20,
        width: 100,
        height: 20
    });
});

// 启动游戏
gameLoop();