class UserProfile {
    constructor(users) {
        this.users = users;
        this.currentUser = users[0];
        this.switchHandler = null;
        
        // 初始化时更新全局状态
        window.currentUser = this.currentUser;
        window.userBehavior = this.currentUser.behavior;
        
        this.init();
    }

    init() {
        this.renderUserProfile();
        this.setupUserSwitch();
    }

    renderUserProfile() {
        const profileContainer = document.getElementById('userProfile');
        if (!profileContainer) return;

        profileContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
                <div class="flex items-start justify-between">
                    <!-- 用户基本信息 -->
                    <div class="flex items-start space-x-4">
                        <img src="${this.currentUser.avatar}" 
                            alt="${this.currentUser.name}" 
                            class="w-20 h-20 rounded-full object-cover">
                        <div>
                            <div class="flex items-center space-x-2">
                                <h2 class="text-xl font-bold">${this.currentUser.name}</h2>
                                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    ${this.currentUser.memberLevel}
                                </span>
                            </div>
                            <p class="text-gray-600 mt-1">
                                ${this.currentUser.age}岁 · ${this.currentUser.gender} · ${this.currentUser.occupation}
                            </p>
                            <p class="text-gray-600">
                                <i class="fas fa-map-marker-alt"></i> ${this.currentUser.location}
                            </p>
                            <div class="flex flex-wrap gap-2 mt-2">
                                ${this.currentUser.tags.map(tag => `
                                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        ${tag}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- 用户切换 -->
                    <div class="flex items-center space-x-2">
                        <span class="text-gray-600">切换用户：</span>
                        <select id="userSwitch" class="border rounded-lg px-3 py-1">
                            ${this.users.map(user => `
                                <option value="${user.id}" ${user.id === this.currentUser.id ? 'selected' : ''}>
                                    ${user.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- 会员信息 -->
                <div class="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                    <div class="text-center">
                        <div class="text-lg font-bold text-gray-800">
                            ${this.calculateMembershipDays()}天
                        </div>
                        <div class="text-sm text-gray-600">会员时长</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-gray-800">
                            ${this.currentUser.behavior.purchases.length}
                        </div>
                        <div class="text-sm text-gray-600">购买次数</div>
                    </div>
                    <div class="text-center">
                        <div class="text-lg font-bold text-gray-800">
                            ${this.calculateTotalSpent()}
                        </div>
                        <div class="text-sm text-gray-600">消费总额</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupUserSwitch() {
        const userSwitch = document.getElementById('userSwitch');
        if (!userSwitch) return;

        if (this.switchHandler) {
            userSwitch.removeEventListener('change', this.switchHandler);
        }

        this.switchHandler = (e) => {
            const selectedUserId = e.target.value;
            this.switchUser(selectedUserId);
        };

        userSwitch.addEventListener('change', this.switchHandler);
    }

    switchUser(userId) {
        const newUser = this.users.find(user => user.id === userId);
        if (!newUser) return;

        // 更新当前用户和相关数据
        this.currentUser = newUser;
        window.currentUser = newUser;
        window.userBehavior = newUser.behavior;

        // 重新初始化推荐引擎
        if (window.recommendationEngine) {
            window.recommendationEngine = new RecommendationEngine(
                products, 
                newUser.behavior, 
                productStats
            );
        }

        // 重新初始化分析实例
        if (window.analyticsInstance) {
            window.analyticsInstance = new Analytics(newUser.behavior, products);
            window.analyticsInstance.refresh();
        }

        // 重新渲染用户资料
        this.renderUserProfile();
        
        // 触发自定义事件
        const event = new CustomEvent('userChanged', { 
            detail: { 
                user: newUser,
                behavior: newUser.behavior,
                timestamp: new Date().getTime()
            }
        });
        window.dispatchEvent(event);

        // 重新设置事件监听器
        this.setupUserSwitch();

        // 更新UI显示
        if (window.uiInstance) {
            window.uiInstance.cleanup(); // 清理旧的事件监听器
            window.uiInstance = new UI();
            window.uiInstance.renderAll(); // 重新渲染所有UI组件
        }
    }

    notifyUserChange() {
        // 更新全局状态
        window.currentUser = this.currentUser;
        window.userBehavior = this.currentUser.behavior;
        
        // 触发自定义事件
        const event = new CustomEvent('userChanged', { 
            detail: { 
                user: this.currentUser,
                behavior: this.currentUser.behavior
            }
        });
        window.dispatchEvent(event);
        
        // 重新初始化和更新所有实例
        if (window.analyticsInstance) {
            window.analyticsInstance = new Analytics(this.currentUser.behavior, products);
        }
        
        if (window.uiInstance) {
            window.uiInstance = new UI();
            window.uiInstance.renderAll();
        }
    }

    calculateMembershipDays() {
        const registerDate = new Date(this.currentUser.registerDate);
        const today = new Date();
        const diffTime = Math.abs(today - registerDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calculateTotalSpent() {
        return this.currentUser.behavior.purchases
            .map(p => products.find(product => product.id === p.productId)?.price || 0)
            .reduce((sum, price) => sum + price, 0);
    }
} 