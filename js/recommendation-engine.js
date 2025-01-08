class RecommendationEngine {
    constructor(products, userBehavior, productStats) {
        this.products = products;
        this.userBehavior = userBehavior;
        this.productStats = productStats;
    }

    // 获取个性化推荐
    getPersonalizedRecommendations() {
        return userRecommendations[window.currentUser.id].personalRecs || [];
    }

    // 获取热门推荐
    getHotRecommendations() {
        return this.productStats.hotProducts[window.currentUser.id] || [];
    }

    // 获取相似商品推荐
    getSimilarProducts() {
        return userRecommendations[window.currentUser.id].similarRecs || [];
    }

    getRecommended() {
        return this.productStats.recommended[window.currentUser.id] || [];
    }

    getViewHistory() {
        return userRecommendations[window.currentUser.id].viewHistory || [];
    }
} 