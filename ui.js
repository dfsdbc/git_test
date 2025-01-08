class UI {
    constructor() {
        this.eventListeners = new Map();
        this.renderAll();
    }

    renderAll() {
        this.cleanup();
        this.renderCategories();
        this.renderUserContent();
        this.setupEventListeners();
    }

    renderUserContent() {
        if (!window.recommendationEngine) return;

        // 使用推荐引擎获取各类推荐
        const personalRecs = window.recommendationEngine.getPersonalizedRecommendations();
        const hotRecs = window.recommendationEngine.getHotRecommendations();
        const similarRecs = window.recommendationEngine.getSimilarProducts(currentUser.behavior.views[0]);
        
        // 获取用户的浏览历史
        const viewHistory = currentUser.behavior.views;
        
        // 渲染各个区域
        this.renderPersonalizedSection(personalRecs);
        this.renderViewHistory(viewHistory);
        this.renderHotSection(hotRecs);
        this.renderSimilarSection(similarRecs);

        // 获取最近浏览和特别推荐
        const recentlyViewed = currentUser.behavior.views.slice(-4);
        const recommended = window.recommendationEngine.getPreferenceBasedRecommendations();

        this.renderRecentlyViewed(recentlyViewed);
        this.renderRecommended(recommended);
    }

    renderPersonalizedSection(recommendedIds) {
        const container = document.getElementById('personalRecommendations');
        if (!container) return;
        
        const recommendedProducts = recommendedIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = recommendedProducts
            .map(product => this.renderProductCard(product))
            .join('');
    }

    renderHotSection(hotProductIds) {
        const container = document.getElementById('hotRecommendations');
        if (!container) return;
        
        const hotProducts = hotProductIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = hotProducts.map(product => {
            const imageUrl = window.imageCache ? window.imageCache.get(product.image) : product.image;
            return `
                <div class="flex items-center space-x-3 mb-4 last:mb-0">
                    <div class="w-16 h-16 relative flex-shrink-0">
                        <img src="${imageUrl}" 
                            alt="${product.name}" 
                            class="w-full h-full object-cover rounded"
                            loading="lazy"
                            onerror="this.src='https://via.placeholder.com/64x64?text=Image+Not+Found'">
                    </div>
                    <div>
                        <h4 class="font-medium">${product.name}</h4>
                        <p class="text-red-600">¥${product.price}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderSimilarSection(similarProductIds) {
        const container = document.getElementById('similarProducts');
        if (!container) return;
        
        const similarProducts = similarProductIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = similarProducts
            .map(product => this.renderProductCard(product))
            .join('');
    }

    renderViewHistory(viewHistoryIds) {
        const container = document.getElementById('viewHistory');
        if (!container) return;

        const viewedProducts = viewHistoryIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = `
            <div class="flex space-x-4 overflow-x-auto pb-2">
                ${viewedProducts.map(product => {
                    const imageUrl = window.imageCache ? window.imageCache.get(product.image) : product.image;
                    return `
                        <div class="flex-shrink-0 w-32">
                            <div class="relative pb-[100%] mb-2">
                                <img src="${imageUrl}" 
                                    alt="${product.name}" 
                                    class="absolute inset-0 w-full h-full object-cover rounded-lg"
                                    loading="lazy"
                                    onerror="this.src='https://via.placeholder.com/150x150?text=Image+Not+Found'">
                            </div>
                            <p class="text-sm font-medium truncate">${product.name}</p>
                            <p class="text-red-600">¥${product.price}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderRecentlyViewed(recentlyViewedIds) {
        const container = document.getElementById('recentlyViewed');
        if (!container) return;

        const recentProducts = recentlyViewedIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = recentProducts
            .map(product => this.renderProductCard(product))
            .join('');
    }

    renderRecommended(recommendedIds) {
        const container = document.getElementById('recommended');
        if (!container) return;

        const recommendedProducts = recommendedIds
            .map(id => products.find(p => p.id === id))
            .filter(Boolean);

        container.innerHTML = recommendedProducts
            .map(product => this.renderProductCard(product))
            .join('');
    }

    // 提供一个公共的刷新方法
    refresh() {
        this.renderAll();
    }

    cleanup() {
        // 清理所有事件监听器
        this.eventListeners.forEach((handler, element) => {
            element.removeEventListener('click', handler);
        });
        this.eventListeners.clear();
    }

    // 渲染分类导航
    renderCategories() {
        const categoriesContainer = document.getElementById('categories');
        categoriesContainer.innerHTML = categories.map(category => `
            <a href="#" class="flex items-center space-x-2 px-4 py-2 rounded-full 
                hover:bg-red-50 hover:text-red-600 transition-colors">
                <i class="${category.icon}"></i>
                <span>${category.name}</span>
            </a>
        `).join('');
    }

    // 渲染商品卡片
    renderProductCard(product) {
        const imageUrl = window.imageCache ? window.imageCache.get(product.image) : product.image;
        return `
            <div class="product-card bg-white rounded-lg shadow-sm p-4 relative" 
                data-product-id="${product.id}">
                ${this.renderProductBadges(product)}
                <div class="relative pb-[100%] mb-4">
                    <img src="${imageUrl}" 
                        alt="${product.name}" 
                        class="absolute inset-0 w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/300x300?text=Image+Not+Found'">
                </div>
                <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-2">${product.description}</p>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-red-600 text-xl font-bold">¥${product.price}</span>
                        ${product.originalPrice ? `
                            <span class="price-original ml-2">¥${product.originalPrice}</span>
                        ` : ''}
                    </div>
                    <div class="rating-stars">
                        ${this.renderRatingStars(product.rating)}
                    </div>
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-gray-500 text-sm">销量 ${product.sales}</span>
                    <div class="space-x-2">
                        <button class="favorite-btn p-2 rounded-full hover:bg-red-50 
                            transition-colors" data-product-id="${product.id}">
                            <i class="${userBehavior.favorites.includes(product.id) ? 
                                'fas fa-heart text-red-600' : 'far fa-heart'}"></i>
                        </button>
                        <button class="cart-btn p-2 rounded-full hover:bg-blue-50 
                            transition-colors" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 渲染商品标签
    renderProductBadges(product) {
        return product.tags.map(tag => `
            <span class="badge ${tag === '热销' ? 'badge-hot' : 'badge-new'}">
                ${tag}
            </span>
        `).join('');
    }

    // 渲染评分星星
    renderRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 收藏按钮点击事件
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const handler = (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.toggleFavorite(productId, e.currentTarget);
            };
            btn.addEventListener('click', handler);
            this.eventListeners.set(btn, handler);
        });

        // 加入购物车按钮点击事件
        document.querySelectorAll('.cart-btn').forEach(btn => {
            const handler = (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.addToCart(productId);
            };
            btn.addEventListener('click', handler);
            this.eventListeners.set(btn, handler);
        });

        // 商品卡片点击事件
        document.querySelectorAll('.product-card').forEach(card => {
            const handler = (e) => {
                if (!e.target.closest('button')) {
                    const productId = parseInt(card.dataset.productId);
                    this.showProductModal(productId);
                }
            };
            card.addEventListener('click', handler);
            this.eventListeners.set(card, handler);
        });
    }

    // 切换收藏状态
    toggleFavorite(productId, button) {
        const isFavorite = userBehavior.favorites.includes(productId);
        if (isFavorite) {
            userBehavior.favorites = userBehavior.favorites.filter(id => id !== productId);
            button.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            userBehavior.favorites.push(productId);
            button.innerHTML = '<i class="fas fa-heart text-red-600"></i>';
        }
    }

    // 添加到购物车
    addToCart(productId) {
        const existingItem = userBehavior.cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            userBehavior.cart.push({ productId, quantity: 1 });
        }
        this.showToast('已添加到购物车');
    }

    // 显示商品详情模态框
    showProductModal(productId) {
        const product = products.find(p => p.id === productId);
        const modal = document.getElementById('productModal');
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                <div class="flex">
                    <img src="${product.image}" alt="${product.name}" 
                        class="w-1/2 object-cover rounded-lg">
                    <div class="ml-6">
                        <h2 class="text-2xl font-bold mb-2">${product.name}</h2>
                        <p class="text-gray-600 mb-4">${product.description}</p>
                        <div class="mb-4">
                            <span class="text-red-600 text-2xl font-bold">¥${product.price}</span>
                            ${product.originalPrice ? `
                                <span class="price-original ml-2">¥${product.originalPrice}</span>
                            ` : ''}
                        </div>
                        <div class="mb-4">
                            <span class="text-gray-600">规格：</span>
                            ${product.specs.map(spec => `
                                <span class="inline-block px-3 py-1 bg-gray-100 
                                    rounded-full mr-2">${spec}</span>
                            `).join('')}
                        </div>
                        <button class="bg-red-600 text-white px-6 py-2 rounded-full 
                            hover:bg-red-700 transition-colors">
                            立即购买
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // 显示提示消息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 
            bg-black bg-opacity-75 text-white px-4 py-2 rounded-full 
            animate-fade-in`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    // 添加新的初始化方法
    init() {
        this.eventListeners = new Map();
        this.renderAll();
    }
} 