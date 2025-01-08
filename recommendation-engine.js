class RecommendationEngine {
    constructor(products, userBehavior, productStats) {
        this.products = products;
        this.userBehavior = userBehavior;
        this.productStats = productStats;
    }

    // 获取个性化推荐
    getPersonalizedRecommendations() {
        const recommendations = [];
        
        // 1. 基于用户浏览历史的推荐
        const viewBasedRecs = this.getViewBasedRecommendations();
        recommendations.push(...viewBasedRecs);

        // 2. 基于用户购买历史的推荐
        const purchaseBasedRecs = this.getPurchaseBasedRecommendations();
        recommendations.push(...purchaseBasedRecs);

        // 3. 基于用户偏好的推荐
        const preferenceBasedRecs = this.getPreferenceBasedRecommendations();
        recommendations.push(...preferenceBasedRecs);

        // 去重并限制数量
        return [...new Set(recommendations)].slice(0, 8);
    }

    // 基于浏览历史的推荐
    getViewBasedRecommendations() {
        const viewedCategories = new Set(
            this.userBehavior.views
                .map(id => this.products.find(p => p.id === id)?.category)
        );

        return this.products
            .filter(p => viewedCategories.has(p.category))
            .filter(p => !this.userBehavior.views.includes(p.id))
            .map(p => p.id);
    }

    // 基于购买历史的推荐
    getPurchaseBasedRecommendations() {
        const purchasedProducts = this.userBehavior.purchases.map(p => p.productId);
        const relatedProducts = new Set();

        purchasedProducts.forEach(id => {
            const product = this.products.find(p => p.id === id);
            if (product?.relatedProducts) {
                product.relatedProducts.forEach(relatedId => {
                    relatedProducts.add(relatedId);
                });
            }
        });

        return [...relatedProducts];
    }

    // 基于用户偏好的推荐
    getPreferenceBasedRecommendations() {
        const { categories, priceRange } = this.userBehavior.preferences;

        return this.products
            .filter(p => categories.includes(p.category))
            .filter(p => p.price >= priceRange.min && p.price <= priceRange.max)
            .map(p => p.id);
    }

    // 获取热门推荐
    getHotRecommendations() {
        return this.productStats.hotProducts;
    }

    // 获取相似商品推荐
    getSimilarProducts(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return [];

        return this.products
            .filter(p => p.category === product.category && p.id !== product.id)
            .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
            .slice(0, 5)
            .map(p => p.id);
    }

    // 计算商品相似度得分
    calculateSimilarityScore(product1, product2) {
        let score = 0;
        
        // 类别相同
        if (product1.category === product2.category) score += 3;
        
        // 价格区间接近
        const priceDiff = Math.abs(product1.price - product2.price);
        if (priceDiff < product1.price * 0.1) score += 2;
        else if (priceDiff < product1.price * 0.3) score += 1;

        // 标签重叠
        const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
        score += commonTags.length;

        return score;
    }
} 