// 打字效果
const text = "亲爱的叶源：\n\n从遇见你的第一天起，\n我的世界就被你点亮。\n\n你的笑容是我生命中最美的风景，\n你的声音是我最爱的旋律。\n\n我想告诉你，\n我深深地爱着你。\n\n愿意和我一起\n书写未来的故事吗？";

let index = 0;
const typewriter = document.getElementById('typewriter');

function type() {
    if (index < text.length) {
        typewriter.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100);
    }
}

// 星空背景
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const count = 100;

for (let i = 0; i < count; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 3
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    
    requestAnimationFrame(drawStars);
}

// 在文件开头添加音效相关变量
const clickSound = document.getElementById('clickSound');
const fireworkSound = document.getElementById('fireworkSound');
const heartSound = document.getElementById('heartSound');

// 创建飘落的小心心
function createHeart() {
    // 播放心形音效
    const heartSoundClone = heartSound.cloneNode(true);
    heartSoundClone.volume = 0.2;
    heartSoundClone.play();
    
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    const size = Math.random() * 20 + 10;
    const duration = Math.random() * 3 + 2;
    const startX = Math.random() * 100;
    
    heart.style.cssText = `
        position: fixed;
        left: ${startX}vw;
        top: -20px;
        font-size: ${size}px;
        color: ${`hsl(${Math.random() * 60 + 330}, 100%, 50%)`};
        filter: drop-shadow(0 0 10px currentColor);
        transform: rotate(${Math.random() * 360}deg);
        animation: fall ${duration}s linear;
    `;
    heart.innerHTML = '❤';
    document.querySelector('.floating-hearts').appendChild(heart);
    
    heart.addEventListener('animationend', () => {
        heart.remove();
    });
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// 音乐控制
const bgMusic = document.getElementById('bgMusic');
const musicControl = document.querySelector('.music-control');

musicControl.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.volume = 0.5; // 设置背景音乐音量
        bgMusic.play();
        musicControl.classList.remove('paused');
    } else {
        bgMusic.pause();
        musicControl.classList.add('paused');
    }
});

// 烟花效果
function createFirework(x, y) {
    // 播放烟花音效
    const fireworkSoundClone = fireworkSound.cloneNode(true);
    fireworkSoundClone.volume = 0.3; // 降低音量
    fireworkSoundClone.play();
    
    const colors = ['#ff0000', '#ff69b4', '#ffd700', '#ff1493', '#ff6b6b'];
    
    for (let i = 0; i < 36; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = x + 'px';
        firework.style.top = y + 'px';
        firework.style.background = colors[Math.floor(Math.random() * colors.length)];
        firework.style.transform = `rotate(${i * 10}deg)`;
        
        document.querySelector('.fireworks').appendChild(firework);
        
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }
}

// 随机烟花
function randomFireworks() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createFirework(x, y);
}

// 3D 效果
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 20;
    mouseY = (e.clientY - window.innerHeight / 2) / 20;
    
    document.querySelector('.heart').style.transform = 
        `translate(-50%, -50%) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
});

// 初始化
window.onload = () => {
    type();
    drawStars();
    setInterval(createHeart, 200);  // 增加心形频率
    setInterval(randomFireworks, 1000);  // 每秒产生烟花
    
    // 设置各个音效的初始音量
    bgMusic.volume = 0.5;
    clickSound.volume = 0.2;
    fireworkSound.volume = 0.3;
    heartSound.volume = 0.2;
    
    // 尝试自动播放背景音乐
    bgMusic.play().catch(() => {
        console.log('需要用户交互才能播放音乐');
    });
};

// 响应式调整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 添加预加载音频函数
function preloadAudio() {
    [bgMusic, clickSound, fireworkSound, heartSound].forEach(audio => {
        audio.load();
    });
}

// 在页面加载时预加载音频
document.addEventListener('DOMContentLoaded', preloadAudio);

// 添加点击效果
document.addEventListener('click', (e) => {
    // 播放点击音效
    const clickSoundClone = clickSound.cloneNode(true);
    clickSoundClone.volume = 0.2;
    clickSoundClone.play();
    
    // 在点击位置创建烟花
    createFirework(e.clientX, e.clientY);
}); 