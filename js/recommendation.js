// 获取推荐商品
function getRecommendations() {
    // 1. 基于用户浏览历史推荐同类别商品
    const viewedCategories = products
        .filter(p => userBehavior.views.includes(p.id))
        .map(p => p.category);
    
    // 2. 基于已购买商品推荐相似价格区间的商品
    const purchasedPriceRanges = products
        .filter(p => userBehavior.purchases.includes(p.id))
        .map(p => ({
            min: p.price * 0.7,
            max: p.price * 1.3
        }));

    // 3. 生成推荐列表
    return products.filter(product => {
        // 排除已购买的商品
        if (userBehavior.purchases.includes(product.id)) return false;
        
        // 类别匹配
        const categoryMatch = viewedCategories.includes(product.category);
        
        // 价格区间匹配
        const priceMatch = purchasedPriceRanges.some(range => 
            product.price >= range.min && product.price <= range.max
        );

        return categoryMatch || priceMatch;
    });
}

// 渲染推荐商品
function renderRecommendations() {
    const recommendations = getRecommendations();
    const recommendationsContainer = document.getElementById('recommendations');
    
    recommendationsContainer.innerHTML = recommendations.map(product => `
        <div class="border rounded-lg p-4">
            <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="w-full h-48 object-cover rounded-lg"
            />
            <h3 class="text-lg font-semibold mt-2">${product.name}</h3>
            <p class="text-gray-600">${product.description}</p>
            <p class="text-red-600 font-bold mt-2">¥${product.price}</p>
        </div>
    `).join('');
}

// 渲染浏览记录
function renderViewHistory() {
    const viewHistoryContainer = document.getElementById('viewHistory');
    const viewedProducts = products.filter(p => userBehavior.views.includes(p.id));
    
    viewHistoryContainer.innerHTML = viewedProducts.map(product => `
        <div class="w-24">
            <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="w-full h-24 object-cover rounded"
            />
        </div>
    `).join('');
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    renderRecommendations();
    renderViewHistory();
}); 