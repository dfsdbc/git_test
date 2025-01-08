// 图片缓存管理类
class ImageCache {
    constructor() {
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    // 预加载图片
    preload(url) {
        if (this.cache.has(url)) {
            return Promise.resolve(this.cache.get(url));
        }

        if (this.loadingPromises.has(url)) {
            return this.loadingPromises.get(url);
        }

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cache.set(url, url);
                this.loadingPromises.delete(url);
                resolve(url);
            };
            img.onerror = () => {
                this.loadingPromises.delete(url);
                reject(new Error(`Failed to load image: ${url}`));
            };
            img.src = url;
        });

        this.loadingPromises.set(url, promise);
        return promise;
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

// 预加载所有商品图片
function preloadAllProductImages() {
    const imageUrls = [
        // 用户头像
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c',
        // 商品图片
        ...products.map(product => product.image)
    ];
    
    return window.imageCache.preloadMany(imageUrls);
}

// 在页面加载时预加载所有图片
window.addEventListener('load', () => {
    preloadAllProductImages().then(() => {
        console.log('All images preloaded successfully');
    }).catch(error => {
        console.error('Error preloading images:', error);
    });
});

// 商品分类数据
const categories = [
    { id: 1, name: '手机数码', icon: 'fas fa-mobile-alt' },
    { id: 2, name: '电脑办公', icon: 'fas fa-laptop' },
    { id: 3, name: '家用电器', icon: 'fas fa-tv' },
    { id: 4, name: '服装鞋包', icon: 'fas fa-tshirt' },
    { id: 5, name: '美妆护肤', icon: 'fas fa-pump-soap' },
    { id: 6, name: '运动户外', icon: 'fas fa-running' },
    { id: 7, name: '图书音像', icon: 'fas fa-book' },
    { id: 8, name: '食品生鲜', icon: 'fas fa-apple-alt' }
];

// 商品数据
const products = [
    {
        id: 1,
        name: 'iPhone 14 Pro',
        category: 1,
        price: 7999,
        originalPrice: 8999,
        image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb',
        description: '超视网膜XDR显示屏，A16仿生芯片',
        rating: 4.9,
        sales: 10245,
        tags: ['新品', '热销'],
        specs: ['256GB', '暗夜紫色'],
        relatedProducts: [2, 3, 4]
    },
    {
        id: 2,
        name: 'MacBook Pro 14',
        category: 2,
        price: 14999,
        originalPrice: 15999,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        description: 'M2 Pro芯片，16GB统一内存',
        rating: 4.8,
        sales: 5621,
        tags: ['热销'],
        specs: ['512GB', '深空灰色'],
        relatedProducts: [1, 5, 6]
    },
    {
        id: 3,
        name: 'Sony WH-1000XM4',
        category: 1,
        price: 2299,
        originalPrice: 2699,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb',
        description: '顶级降噪耳机，30小时续航',
        rating: 4.7,
        sales: 8934,
        tags: ['热销'],
        specs: ['黑色', '蓝牙5.0'],
        relatedProducts: [1, 4, 5]
    },
    {
        id: 4,
        name: 'iPad Air',
        category: 1,
        price: 4799,
        originalPrice: 5099,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
        description: 'M1芯片，10.9英寸全面屏',
        rating: 4.6,
        sales: 6543,
        tags: ['新品'],
        specs: ['64GB', '天蓝色'],
        relatedProducts: [1, 2, 3]
    },
    {
        id: 5,
        name: '华为 MateBook X Pro',
        category: 2,
        price: 9999,
        originalPrice: 10999,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
        description: '3K触控全面屏，12代酷睿',
        rating: 4.5,
        sales: 4321,
        tags: ['新品'],
        specs: ['16GB+512GB', '灰色'],
        relatedProducts: [2, 6, 7]
    },
    {
        id: 6,
        name: 'Nintendo Switch OLED',
        category: 1,
        price: 2299,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e',
        description: '7英寸OLED屏幕，续航持久',
        rating: 4.7,
        sales: 3456,
        tags: ['热销'],
        specs: ['白色', '64GB'],
        relatedProducts: [1, 3, 4]
    },
    {
        id: 7,
        name: 'Samsung Galaxy S23',
        category: 1,
        price: 6999,
        originalPrice: 7499,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
        description: '骁龙8 Gen2，超强相机系统',
        rating: 4.6,
        sales: 2789,
        tags: ['新品'],
        specs: ['256GB', '幻影黑'],
        relatedProducts: [1, 4, 5]
    },
    {
        id: 8,
        name: 'Dell XPS 13',
        category: 2,
        price: 8999,
        originalPrice: 9499,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
        description: '13.4英寸4K触控屏，12代酷睿',
        rating: 4.8,
        sales: 1890,
        tags: ['新品', '热销'],
        specs: ['16GB+512GB', '银色'],
        relatedProducts: [2, 5, 6]
    },
    {
        id: 9,
        name: 'AirPods Pro 2',
        category: 1,
        price: 1799,
        originalPrice: 1999,
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434',
        description: '主动降噪，空间音频',
        rating: 4.9,
        sales: 5678,
        tags: ['热销'],
        specs: ['白色', 'USB-C'],
        relatedProducts: [1, 3, 7]
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
            views: [1, 2, 4, 7, 9, 6, 8],
            favorites: [1, 3, 9, 6],
            cart: [
                { productId: 2, quantity: 1 },
                { productId: 5, quantity: 2 },
                { productId: 9, quantity: 1 }
            ],
            purchases: [
                { productId: 1, date: '2024-01-05' },
                { productId: 3, date: '2024-01-01' },
                { productId: 6, date: '2023-12-28' },
                { productId: 9, date: '2023-12-25' }
            ],
            preferences: {
                categories: [1, 2],
                priceRange: { min: 1000, max: 15000 },
                brands: ['Apple', 'Samsung', 'Sony']
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
            views: [3, 4, 5, 7, 9, 1, 2],
            favorites: [4, 5, 7, 9],
            cart: [
                { productId: 3, quantity: 1 },
                { productId: 7, quantity: 1 },
                { productId: 9, quantity: 1 }
            ],
            purchases: [
                { productId: 4, date: '2024-01-03' },
                { productId: 5, date: '2023-12-25' },
                { productId: 7, date: '2023-12-20' },
                { productId: 1, date: '2023-12-15' }
            ],
            preferences: {
                categories: [1, 4],
                priceRange: { min: 500, max: 8000 },
                brands: ['Apple', 'Samsung', 'Sony']
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
            views: [2, 5, 8, 1, 4, 9, 3],
            favorites: [2, 5, 8, 1],
            cart: [
                { productId: 1, quantity: 1 },
                { productId: 4, quantity: 1 },
                { productId: 8, quantity: 1 }
            ],
            purchases: [
                { productId: 2, date: '2024-01-02' },
                { productId: 5, date: '2023-12-28' },
                { productId: 8, date: '2023-12-20' },
                { productId: 3, date: '2023-12-5' }
            ],
            preferences: {
                categories: [2, 1],
                priceRange: { min: 2000, max: 20000 },
                brands: ['Apple', 'Dell', 'Huawei']
            }
        }
    }
];

// 修改当前用户变量
let currentUser = users[0];
let userBehavior = currentUser.behavior;

// 商品统计数据
const productStats = {
    hotProducts: [1, 2, 5, 8, 9, 3, 7], // 热门商品ID
    newArrivals: [1, 4, 6, 7, 8, 9], // 新品ID
    bestSellers: [2, 3, 7, 1, 5, 9], // 畅销商品ID
    trending: [1, 5, 9, 7, 8, 2] // 趋势商品ID
};

// 每个用户的预定义推荐内容 - 完全差异化的推荐
const userRecommendations = {
    'user123': {  // 张小明的推荐（科技达人、游戏玩家、数码发烧友）
        personalRecs: [2, 4, 5, 1, 9, 6],  // 高端数码产品为主
        hotRecs: [1, 3, 8, 7, 9],         // 最新数码产品
        similarRecs: [2, 5, 8, 1, 7],      // 高性能电脑和手机
        viewHistory: [1, 2, 4, 7, 9, 6],   // 浏览过的游戏和数码产品
        recentlyViewed: [9, 6, 8, 7],      // 最近浏览
        recommended: [3, 8, 5, 2]          // 特别推荐
    },
    'user456': {  // 李小红的推荐（时尚达人、美妆控、摄影爱好者）
        personalRecs: [7, 4, 1, 9, 3, 6],  // 轻便时尚产品为主
        hotRecs: [9, 7, 4, 1, 3],         // 便携数码产品
        similarRecs: [7, 3, 9, 4, 1],      // 摄影和音频设备
        viewHistory: [3, 4, 5, 7, 9],      // 浏览过的时尚数码
        recentlyViewed: [7, 9, 1, 2],      // 最近浏览
        recommended: [4, 1, 9, 3]          // 特别推荐
    },
    'user789': {  // 王大力的推荐（商务精英、品质生活、运动健身）
        personalRecs: [8, 2, 5, 1, 9, 3],  // 商务办公产品为主
        hotRecs: [8, 2, 5, 4, 1],         // 高端商务产品
        similarRecs: [8, 5, 2, 1, 4],      // 商务本和平板
        viewHistory: [2, 5, 8, 1, 4],      // 浏览过的商务产品
        recentlyViewed: [8, 1, 4, 9],      // 最近浏览
        recommended: [2, 5, 8, 1]          // 特别推荐
    }
}; 