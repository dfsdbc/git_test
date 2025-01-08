// 图片缓存管理类优化
class ImageCache {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
        this.preloadQueue = [];
        this.maxConcurrent = 4; // 最大并发加载数
        this.loading = 0;
    }

    async preload(url) {
        if (this.cache.has(url)) {
            return this.cache.get(url);
        }

        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url);
        }

        if (this.loading >= this.maxConcurrent) {
            // 加入预加载队列
            await new Promise(resolve => this.preloadQueue.push(resolve));
        }

        this.loading++;
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(url, url);
                this.loadingPromises.delete(url);
                this.loading--;
                this.processQueue();
                resolve(url);
            };
            img.onerror = () => {
                this.loadingPromises.delete(url);
                this.loading--;
                this.processQueue();
                reject(new Error(`Failed to load image: ${url}`));
            };
            img.src = url;
        });

        this.loadingPromises.set(url, promise);
        return promise;
    }

    processQueue() {
        if (this.preloadQueue.length > 0 && this.loading < this.maxConcurrent) {
            const next = this.preloadQueue.shift();
            next();
        }
    }

    // 获取图片URL（如果已缓存）
    get(url) {
        return this.cache.get(url) || url;
    }

    // 预加载多个图片
    preloadMany(urls) {
        return Promise.all(urls.map(url => this.preload(url)));
    }
}

// 创建全局图片缓存实例
window.imageCache = new ImageCache();

// 预定义一些常用的图片URL
const PRODUCT_IMAGES = {
    // 数码游戏
    gaming_laptop: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    gaming_mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    gaming_headset: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
    
    // 时尚美妆
    camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    makeup: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da',
    perfume: 'https://images.unsplash.com/photo-1541643600914-78b084683601',
    
    // 商务办公
    business_laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
};

// 预加载所有图片
Object.values(PRODUCT_IMAGES).forEach(url => {
    window.imageCache.preload(url);
});

// 商品分类数据
const categories = [
    { id: 1, name: '手机数码', icon: 'fas fa-mobile-alt' },
    { id: 2, name: '电脑办公', icon: 'fas fa-laptop' },
    { id: 3, name: '游戏电竞', icon: 'fas fa-gamepad' },
    { id: 4, name: '时尚美妆', icon: 'fas fa-magic' },
    { id: 5, name: '摄影摄像', icon: 'fas fa-camera' },
    { id: 6, name: '运动健康', icon: 'fas fa-running' },
    { id: 7, name: '商务精品', icon: 'fas fa-briefcase' },
    { id: 8, name: '智能穿戴', icon: 'fas fa-watch' }
];

// 商品数据
const products = [
    // 游戏玩家商品
    {
        id: 1,
        name: 'ROG 幻16游戏本',
        category: 3,
        price: 13999,
        originalPrice: 14999,
        image: PRODUCT_IMAGES.gaming_laptop,
        description: '16英寸电竞屏,RTX4070显卡',
        rating: 4.9,
        sales: 1256,
        tags: ['游戏', '新品'],
        specs: ['32GB+1TB', '240Hz'],
        relatedProducts: [2, 3]
    },
    {
        id: 2,
        name: '雷蛇毒蝰V3鼠标',
        category: 3,
        price: 499,
        originalPrice: 599,
        image: PRODUCT_IMAGES.gaming_mouse,
        description: '30K DPI光学传感器',
        rating: 4.8,
        sales: 3421,
        tags: ['游戏外设', '热销'],
        specs: ['黑色', 'RGB'],
        relatedProducts: [1, 3]
    },
    {
        id: 3,
        name: '罗技G733耳机',
        category: 3,
        price: 799,
        originalPrice: 899,
        image: PRODUCT_IMAGES.gaming_headset,
        description: '无线游戏耳机,环绕声',
        rating: 4.7,
        sales: 2341,
        tags: ['游戏外设', '热销'],
        specs: ['白色', 'RGB'],
        relatedProducts: [1, 2]
    },

    // 时尚达人商品
    {
        id: 4,
        name: 'Sony A7M4相机',
        category: 5,
        price: 15999,
        originalPrice: 16999,
        image: PRODUCT_IMAGES.camera,
        description: '3300万像素全画幅',
        rating: 4.9,
        sales: 890,
        tags: ['摄影', '新品'],
        specs: ['黑色', '单机身'],
        relatedProducts: [5, 6]
    },
    {
        id: 5,
        name: 'YSL限定彩妆盘',
        category: 4,
        price: 799,
        originalPrice: 899,
        image: PRODUCT_IMAGES.makeup,
        description: '12色眼影+4色腮红',
        rating: 4.8,
        sales: 5678,
        tags: ['限定', '热销'],
        specs: ['星空系列', '含镜子'],
        relatedProducts: [4, 6]
    },
    {
        id: 6,
        name: 'Chanel N°5香水',
        category: 4,
        price: 999,
        originalPrice: 1299,
        image: PRODUCT_IMAGES.perfume,
        description: '东方花香调,经典款',
        rating: 4.9,
        sales: 4567,
        tags: ['香水', '热销'],
        specs: ['50ml', '金色'],
        relatedProducts: [4, 5]
    },

    // 商务人士商品
    {
        id: 7,
        name: 'ThinkPad X1',
        category: 2,
        price: 12999,
        originalPrice: 13999,
        image: PRODUCT_IMAGES.business_laptop,
        description: '商务旗舰,轻薄长续航',
        rating: 4.9,
        sales: 789,
        tags: ['商务', '轻薄'],
        specs: ['32GB+1TB', '4K触控'],
        relatedProducts: [8, 9]
    },
    {
        id: 8,
        name: 'BOSE NC700',
        category: 1,
        price: 2799,
        originalPrice: 2999,
        image: PRODUCT_IMAGES.headphone,
        description: '顶级降噪耳机',
        rating: 4.8,
        sales: 2345,
        tags: ['降噪', '商务'],
        specs: ['银色', '蓝牙5.0'],
        relatedProducts: [7, 9]
    },
    {
        id: 9,
        name: 'Apple Watch Ultra',
        category: 8,
        price: 6299,
        originalPrice: 6799,
        image: PRODUCT_IMAGES.watch,
        description: '钛金属表壳,运动商务',
        rating: 4.9,
        sales: 1234,
        tags: ['智能', '运动'],
        specs: ['钛金属', '蜂窝版'],
        relatedProducts: [7, 8]
    }
];

// 用户数据
const users = [
    {
        id: 'user123',
        name: '张小明',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        age: 28,
        gender: '男',
        occupation: '程序员',
        location: '上海',
        tags: ['科技达人', '游戏玩家', '数码发烧友'],
        memberLevel: '金牌会员',
        registerDate: '2023-01-15',
        behavior: {
            views: [1, 2, 3],
            favorites: [1, 2],
            cart: [
                { productId: 2, quantity: 1 },
                { productId: 3, quantity: 1 }
            ],
            purchases: [
                { productId: 1, date: '2024-01-05' },
                { productId: 2, date: '2024-01-01' }
            ],
            preferences: {
                categories: [3],
                priceRange: { min: 1000, max: 15000 },
                brands: ['ROG', 'Razer', 'Logitech']
            }
        }
    },
    {
        id: 'user456',
        name: '李小红',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        age: 25,
        gender: '女',
        occupation: '设计师',
        location: '北京',
        tags: ['时尚达人', '美妆控', '摄影爱好者'],
        memberLevel: '白金会员',
        registerDate: '2023-03-20',
        behavior: {
            views: [4, 5, 6],
            favorites: [4, 5],
            cart: [
                { productId: 5, quantity: 1 },
                { productId: 6, quantity: 1 }
            ],
            purchases: [
                { productId: 4, date: '2024-01-03' },
                { productId: 5, date: '2023-12-25' }
            ],
            preferences: {
                categories: [4, 5],
                priceRange: { min: 500, max: 20000 },
                brands: ['Sony', 'YSL', 'Chanel']
            }
        }
    },
    {
        id: 'user789',
        name: '王大力',
        avatar: 'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c',
        age: 35,
        gender: '男',
        occupation: '企业经理',
        location: '广州',
        tags: ['商务精英', '品质生活', '运动健身'],
        memberLevel: '钻石会员',
        registerDate: '2022-12-01',
        behavior: {
            views: [7, 8, 9],
            favorites: [7, 8],
            cart: [
                { productId: 8, quantity: 1 },
                { productId: 9, quantity: 1 }
            ],
            purchases: [
                { productId: 7, date: '2024-01-02' },
                { productId: 8, date: '2023-12-28' }
            ],
            preferences: {
                categories: [2, 7],
                priceRange: { min: 2000, max: 20000 },
                brands: ['ThinkPad', 'BOSE', 'Apple']
            }
        }
    }
];

// 修改当前用户变量
let currentUser = users[0];
let userBehavior = currentUser.behavior;

// 用户推荐配置
const userRecommendations = {
    'user123': {
        personalRecs: [1, 2, 3],     // 游戏玩家商品
        hotRecs: [2, 3, 1],         
        similarRecs: [3, 2, 1],      
        viewHistory: [1, 2, 3],      // 这里的浏览记录是写死的
        recommended: [2, 1, 3]
    },
    'user456': {  // 李小红(时尚达人)
        personalRecs: [4, 5, 6],     // 相机、美妆
        hotRecs: [5, 6, 4],         // 热门美妆
        similarRecs: [6, 4, 5],      // 相似产品
        viewHistory: [4, 5, 6],      // 浏览记录
        recommended: [5, 4, 6]       // 特别推荐
    },
    'user789': {  // 王大力(商务人士)
        personalRecs: [7, 8, 9],     // 商务本、配件
        hotRecs: [8, 9, 7],         // 热门商务
        similarRecs: [9, 7, 8],      // 相似商务
        viewHistory: [7, 8, 9],      // 浏览记录
        recommended: [8, 7, 9]       // 特别推荐
    }
};

// 商品统计数据
const productStats = {
    hotProducts: {
        'user123': [2, 3, 1],    // 游戏玩家热门
        'user456': [5, 6, 4],    // 时尚达人热门
        'user789': [8, 9, 7]     // 商务人士热门
    },
    newArrivals: {
        'user123': [1, 2, 3],    // 游戏新品
        'user456': [4, 5, 6],    // 时尚新品
        'user789': [7, 8, 9]     // 商务新品
    },
    recommended: {
        'user123': [3, 1, 2],    // 游戏推荐
        'user456': [6, 4, 5],    // 时尚推荐
        'user789': [9, 7, 8]     // 商务推荐
    }
}; 