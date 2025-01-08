const products = [
    {
        id: 1,
        name: '无线耳机',
        category: '电子产品',
        price: 299,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        description: '高品质无线耳机，音质出众'
    },
    {
        id: 2,
        name: '智能手表',
        category: '电子产品',
        price: 999,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
        description: '多功能智能手表，支持运动监测'
    },
    {
        id: 3,
        name: '运动鞋',
        category: '服饰',
        price: 499,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        description: '舒适透气运动鞋'
    },
    {
        id: 4,
        name: '相机',
        category: '电子产品',
        price: 3999,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        description: '专业级数码相机'
    },
    {
        id: 5,
        name: '背包',
        category: '配件',
        price: 199,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        description: '时尚实用双肩包'
    }
];

const userBehavior = {
    views: [1, 2, 4], // 用户浏览过的商品ID
    purchases: [1], // 用户购买过的商品ID
}; 