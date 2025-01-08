class Analytics {
    constructor(userBehavior, products) {
        this.userBehavior = userBehavior;
        this.products = products;
        // 绑定方法到实例
        this.clickHandler = this.handleClick.bind(this);
        this.init();
    }

    init() {
        this.renderAnalytics();
        this.setupEventTracking();
    }

    renderAnalytics() {
        const analyticsContainer = document.getElementById('analytics');
        if (!analyticsContainer) return;

        // 计算用户行为统计
        const stats = this.calculateStats();
        
        analyticsContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-xl font-bold mb-4">
                    <i class="fas fa-chart-line text-blue-600"></i>
                    用户行为分析
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- 浏览统计 -->
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="text-blue-600 text-lg font-bold mb-2">
                            浏览行为
                        </div>
                        <div class="space-y-2">
                            <div>总浏览商品：${stats.totalViews} 件</div>
                            <div>最常浏览分类：${stats.mostViewedCategory}</div>
                            <div>平均浏览时长：${stats.avgViewDuration}秒</div>
                        </div>
                    </div>
                    
                    <!-- 购物车统计 -->
                    <div class="bg-green-50 rounded-lg p-4">
                        <div class="text-green-600 text-lg font-bold mb-2">
                            购物车行为
                        </div>
                        <div class="space-y-2">
                            <div>购物车商品：${stats.cartItems} 件</div>
                            <div>购物车总额：¥${stats.cartTotal}</div>
                            <div>加购转化率：${stats.cartConversion}%</div>
                        </div>
                    </div>
                    
                    <!-- 购买统计 -->
                    <div class="bg-red-50 rounded-lg p-4">
                        <div class="text-red-600 text-lg font-bold mb-2">
                            购买行为
                        </div>
                        <div class="space-y-2">
                            <div>已购商品：${stats.purchasedItems} 件</div>
                            <div>总消费额：¥${stats.totalSpent}</div>
                            <div>购买转化率：${stats.purchaseConversion}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    calculateStats() {
        // 确保使用最新的用户行为数据
        const behavior = window.currentUser.behavior;
        
        return {
            totalViews: behavior.views.length,
            mostViewedCategory: this.getMostViewedCategory(),
            avgViewDuration: Math.floor(Math.random() * 60 + 30), // 模拟数据
            cartItems: behavior.cart.reduce((sum, item) => sum + item.quantity, 0),
            cartTotal: this.calculateCartTotal(),
            cartConversion: Math.floor((behavior.cart.length / behavior.views.length) * 100),
            purchasedItems: behavior.purchases.length,
            totalSpent: this.calculateTotalSpent(),
            purchaseConversion: Math.floor((behavior.purchases.length / behavior.views.length) * 100)
        };
    }

    calculateInterests() {
        // 确保使用最新的用户行为数据
        const behavior = window.currentUser.behavior;
        const interests = [];
        const { views, purchases, favorites } = behavior;
        
        // 合并所有行为的商品
        const allProducts = [...views, ...purchases.map(p => p.productId), ...favorites];
        
        // 统计分类频率
        const categoryFreq = {};
        allProducts.forEach(productId => {
            const product = this.products.find(p => p.id === productId);
            if (product) {
                categoryFreq[product.category] = (categoryFreq[product.category] || 0) + 1;
            }
        });

        // 转换为兴趣标签
        Object.entries(categoryFreq)
            .sort((a, b) => b[1] - a[1])
            .forEach(([categoryId, freq]) => {
                const category = categories.find(c => c.id === parseInt(categoryId));
                if (category) {
                    interests.push({
                        name: category.name,
                        weight: freq
                    });
                }
            });

        return interests;
    }

    renderInterestTags(interests) {
        return interests.map(interest => `
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">
                ${interest.name}
                <span class="ml-1 text-xs text-gray-500">${interest.weight}</span>
            </span>
        `).join('');
    }

    renderTimeline() {
        // 合并所有行为并按时间排序
        const events = [
            ...this.userBehavior.views.map(id => ({
                type: 'view',
                productId: id,
                time: new Date(Date.now() - Math.random() * 86400000)
            })),
            ...this.userBehavior.purchases.map(p => ({
                type: 'purchase',
                productId: p.productId,
                time: new Date(p.date)
            })),
            ...this.userBehavior.cart.map(c => ({
                type: 'cart',
                productId: c.productId,
                time: new Date(Date.now() - Math.random() * 86400000)
            }))
        ].sort((a, b) => b.time - a.time);

        return events.slice(0, 5).map(event => {
            const product = this.products.find(p => p.id === event.productId);
            if (!product) return '';

            const icon = {
                view: 'fas fa-eye text-blue-500',
                purchase: 'fas fa-shopping-bag text-green-500',
                cart: 'fas fa-cart-plus text-yellow-500'
            }[event.type];

            const action = {
                view: '浏览了',
                purchase: '购买了',
                cart: '加购了'
            }[event.type];

            return `
                <div class="flex items-center space-x-3">
                    <i class="${icon}"></i>
                    <div class="flex-1">
                        <span class="text-gray-600">${action}</span>
                        <span class="font-medium">${product.name}</span>
                    </div>
                    <span class="text-sm text-gray-500">
                        ${this.formatTime(event.time)}
                    </span>
                </div>
            `;
        }).join('');
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        return `${days}天前`;
    }

    setupEventTracking() {
        // 使用绑定的处理函数
        document.addEventListener('click', this.clickHandler);
    }

    handleClick(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = parseInt(productCard.dataset.productId);
            this.trackEvent('view', productId);
        }

        const cartBtn = e.target.closest('.cart-btn');
        if (cartBtn) {
            const productId = parseInt(cartBtn.dataset.productId);
            this.trackEvent('cart', productId);
        }
    }

    trackEvent(type, productId) {
        // 记录事件
        console.log(`Tracked ${type} event for product ${productId}`);
        // 更新统计
        this.renderAnalytics();
    }

    // 新增：刷新方法
    refresh() {
        try {
            // 移除旧的事件监听器
            document.removeEventListener('click', this.clickHandler);
            
            // 确保使用最新的用户行为数据
            this.userBehavior = window.currentUser.behavior;
            
            // 重新初始化事件处理器
            this.clickHandler = this.handleClick.bind(this);
            
            // 重新渲染和绑定
            this.init();
        } catch (error) {
            console.error('Error during analytics refresh:', error);
            // 如果刷新失败，重新初始化
            this.init();
        }
    }

    // 修改获取最常浏览分类的方法
    getMostViewedCategory() {
        // 确保使用最新的用户行为数据
        const behavior = window.currentUser.behavior;
        
        // 获取所有浏览过的商品
        const viewedProducts = behavior.views
            .map(id => this.products.find(p => p.id === id))
            .filter(Boolean);

        // 统计每个分类的浏览次数
        const categoryCount = {};
        viewedProducts.forEach(product => {
            categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
        });

        // 找出浏览次数最多的分类
        const mostViewedCategoryId = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        // 返回分类名称
        const categoryName = categories.find(c => c.id === parseInt(mostViewedCategoryId))?.name;
        return categoryName || '暂无数据';
    }

    // 修改计算购物车总额的方法
    calculateCartTotal() {
        // 确保使用最新的用户行为数据
        const behavior = window.currentUser.behavior;
        
        return behavior.cart.reduce((total, item) => {
            const product = this.products.find(p => p.id === item.productId);
            return total + (product?.price || 0) * item.quantity;
        }, 0);
    }

    // 修改计算总消费的方法
    calculateTotalSpent() {
        // 确保使用最新的用户行为数据
        const behavior = window.currentUser.behavior;
        
        return behavior.purchases.reduce((total, purchase) => {
            const product = this.products.find(p => p.id === purchase.productId);
            return total + (product?.price || 0);
        }, 0);
    }
} 