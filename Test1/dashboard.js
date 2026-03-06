// Dashboard JavaScript
let userProfile = null;
let recommendations = null;
let mealPlan = null;
let loggedFoods = [];
let weightChart = null;

// Initialize dashboard
(function initDashboard() {
    if (!checkAuth()) return;
    
    userProfile = getUserProfile();
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }
    
    recommendations = calculateRecommendations(userProfile);
    mealPlan = generateMealPlan(recommendations.dailyCalories);
    
    // Load logged foods
    const saved = localStorage.getItem('dailyFoodLog');
    if (saved) {
        loggedFoods = JSON.parse(saved).map(f => ({
            ...f,
            timestamp: new Date(f.timestamp)
        }));
    }
    
    // Update UI
    updateWelcome();
    updateStats();
    renderMealPlan();
    renderDishSelect();
    renderAllDishes();
    updateFoodLog();
    renderProgress();
    renderProfile();
    
    // Show first tab
    switchTab('meals');
})();

// Update welcome message
function updateWelcome() {
    document.getElementById('welcomeText').textContent = `Xush kelibsiz, ${userProfile.name}! 👋`;
}

// Update stats cards
function updateStats() {
    document.getElementById('dailyCalories').textContent = recommendations.dailyCalories;
    document.getElementById('currentWeight').textContent = `${userProfile.weight} kg`;
    
    if (userProfile.targetWeight) {
        document.getElementById('targetWeightText').textContent = `Maqsad: ${userProfile.targetWeight} kg`;
    }
    
    // Weekly change
    const change = Math.abs(recommendations.weeklyWeightChange);
    document.getElementById('weeklyChange').textContent = `${change} kg`;
    
    const trendIcon = document.getElementById('trendIcon');
    const changeType = document.getElementById('changeType');
    
    if (recommendations.weeklyWeightChange < 0) {
        trendIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>';
        trendIcon.className = 'w-6 h-6 text-green-600';
        changeType.textContent = 'Kamayish';
    } else if (recommendations.weeklyWeightChange > 0) {
        trendIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>';
        trendIcon.className = 'w-6 h-6 text-blue-600';
        changeType.textContent = 'Ortish';
    } else {
        trendIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
        trendIcon.className = 'w-6 h-6 text-yellow-600';
        changeType.textContent = 'Barqaror';
    }
    
    // Goal
    const goalText = userProfile.goal === 'lose' ? 'Vazn Tushirish' : 
                     userProfile.goal === 'gain' ? 'Vazn Olish' : 'Vaznni Saqlab Turish';
    document.getElementById('goalBadge').textContent = goalText;
    
    if (recommendations.estimatedWeeks > 0) {
        document.getElementById('estimatedWeeks').textContent = `~${recommendations.estimatedWeeks} hafta`;
    }
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active', 'bg-emerald-600', 'text-white');
        btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    });
    
    // Show selected tab
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    
    // Add active class to button
    const activeBtn = document.getElementById(`tab-${tabName}`);
    activeBtn.classList.add('tab-active', 'bg-emerald-600', 'text-white');
    activeBtn.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
}

// Render meal plan
function renderMealPlan() {
    document.getElementById('mealsDescription').textContent = 
        `Sizning ${recommendations.dailyCalories} kcal kunlik maqsadingiz uchun`;
    
    renderMealCategory('breakfastMeals', mealPlan.breakfast, 'orange');
    renderMealCategory('lunchMeals', mealPlan.lunch, 'blue');
    renderMealCategory('dinnerMeals', mealPlan.dinner, 'purple');
    
    document.getElementById('totalMealCalories').textContent = `${mealPlan.totalCalories} kcal`;
}

function renderMealCategory(containerId, meals, color) {
    const container = document.getElementById(containerId);
    container.innerHTML = meals.map(dish => `
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-lg text-gray-900 dark:text-white">${dish.nameUzbek}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${dish.name}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">${dish.description}</p>
                </div>
                <div class="flex flex-wrap gap-2 ml-4">
                    <span class="px-3 py-1 bg-${color}-500 text-white rounded-full text-sm font-medium">${dish.calories} kcal</span>
                    <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs">P: ${dish.protein}g</span>
                    <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs">C: ${dish.carbs}g</span>
                    <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs">F: ${dish.fat}g</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Refresh meal plan
function refreshMealPlan() {
    mealPlan = generateMealPlan(recommendations.dailyCalories);
    renderMealPlan();
    showToast('Yangi ovqatlanish rejasi yaratildi! 🍽️', 'success');
}

// Render dish select
function renderDishSelect() {
    const select = document.getElementById('dishSelect');
    select.innerHTML = '<option value="">Taom tanlang / Select a dish</option>' +
        uzbekDishes.map(dish => `
            <option value="${dish.id}">${dish.nameUzbek} (${dish.name}) - ${dish.calories} kcal</option>
        `).join('');
}

// Add food
function addFood() {
    const select = document.getElementById('dishSelect');
    const dishId = parseInt(select.value);
    
    if (!dishId) {
        showToast('Iltimos taom tanlang', 'error');
        return;
    }
    
    const dish = uzbekDishes.find(d => d.id === dishId);
    if (dish) {
        const newFood = {
            id: Date.now().toString(),
            dish: dish,
            timestamp: new Date()
        };
        loggedFoods.push(newFood);
        localStorage.setItem('dailyFoodLog', JSON.stringify(loggedFoods));
        
        updateFoodLog();
        select.value = '';
        showToast(`${dish.nameUzbek} qo'shildi! ✓`, 'success');
    }
}

// Remove food
function removeFood(id) {
    loggedFoods = loggedFoods.filter(f => f.id !== id);
    localStorage.setItem('dailyFoodLog', JSON.stringify(loggedFoods));
    updateFoodLog();
    showToast('O\'chirildi', 'success');
}

// Clear all foods
function clearAllFoods() {
    if (confirm('Barcha yozuvlarni o\'chirmoqchimisiz?')) {
        loggedFoods = [];
        localStorage.removeItem('dailyFoodLog');
        updateFoodLog();
        showToast('Barcha yozuvlar o\'chirildi', 'success');
    }
}

// Update food log
function updateFoodLog() {
    const count = loggedFoods.length;
    document.getElementById('logCount').textContent = `Siz bugun ${count} ta taom yeganingizni kiritdingiz`;
    
    // Toggle totals card
    const totalsCard = document.getElementById('foodTotalsCard');
    const clearBtn = document.getElementById('clearAllBtn');
    
    if (count > 0) {
        totalsCard.classList.remove('hidden');
        clearBtn.classList.remove('hidden');
        
        // Calculate totals
        const totalCal = loggedFoods.reduce((sum, f) => sum + f.dish.calories, 0);
        const totalPro = loggedFoods.reduce((sum, f) => sum + f.dish.protein, 0);
        const totalCarb = loggedFoods.reduce((sum, f) => sum + f.dish.carbs, 0);
        const totalFt = loggedFoods.reduce((sum, f) => sum + f.dish.fat, 0);
        
        document.getElementById('totalCalories').textContent = totalCal;
        document.getElementById('totalProtein').textContent = `${totalPro}g`;
        document.getElementById('totalCarbs').textContent = `${totalCarb}g`;
        document.getElementById('totalFat').textContent = `${totalFt}g`;
        
        // Render list
        const list = document.getElementById('loggedFoodsList');
        list.innerHTML = loggedFoods.map(food => `
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mb-3">
                <div class="flex-1">
                    <h4 class="font-semibold text-lg text-gray-900 dark:text-white">${food.dish.nameUzbek}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${food.dish.name}</p>
                    <div class="flex gap-3 mt-2 flex-wrap">
                        <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                            ${food.dish.calories} kcal
                        </span>
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                            P: ${food.dish.protein}g
                        </span>
                        <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                            C: ${food.dish.carbs}g
                        </span>
                        <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-xs">
                            F: ${food.dish.fat}g
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">${formatTime(food.timestamp)}</p>
                </div>
                <button onclick="removeFood('${food.id}')" class="ml-4 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    } else {
        totalsCard.classList.add('hidden');
        clearBtn.classList.add('hidden');
        
        document.getElementById('loggedFoodsList').innerHTML = `
            <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                <svg class="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <p class="text-lg">Hali taom qo'shilmagan</p>
                <p class="text-sm mt-2">Yuqoridan taom tanlang va qo'shing</p>
            </div>
        `;
    }
}

// Render all dishes
function renderAllDishes() {
    const container = document.getElementById('allDishesList');
    container.innerHTML = uzbekDishes.map(dish => `
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors mb-3">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white">${dish.nameUzbek}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${dish.name}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">${dish.description}</p>
                </div>
                <div class="flex flex-wrap gap-2 ml-4">
                    <span class="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium">${dish.calories} kcal</span>
                    <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs">P: ${dish.protein}g</span>
                    <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs">C: ${dish.carbs}g</span>
                    <span class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs">F: ${dish.fat}g</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render progress
function renderProgress() {
    document.getElementById('chartDescription').textContent = 
        `Kunlik ${recommendations.dailyCalories} kcal iste'mol qilish asosida`;
    
    // Weight chart
    const weightData = generateWeightData(userProfile, recommendations);
    const ctx = document.getElementById('weightChart').getContext('2d');
    
    if (weightChart) {
        weightChart.destroy();
    }
    
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weightData.map(d => d.week),
            datasets: [{
                label: 'Vazn (kg)',
                data: weightData.map(d => d.weight),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // Macros
    const macrosHtml = `
        <div>
            <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Oqsil (Protein)</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">${recommendations.proteinGrams}g/kun</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div class="bg-blue-600 h-3 rounded-full" style="width: 30%"></div>
            </div>
        </div>
        <div>
            <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Uglevod (Carbs)</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">${recommendations.carbsGrams}g/kun</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div class="bg-purple-600 h-3 rounded-full" style="width: 40%"></div>
            </div>
        </div>
        <div>
            <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Yog' (Fat)</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">${recommendations.fatGrams}g/kun</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div class="bg-yellow-600 h-3 rounded-full" style="width: 30%"></div>
            </div>
        </div>
    `;
    document.getElementById('macrosList').innerHTML = macrosHtml;
    
    // BMR & TDEE
    document.getElementById('bmrValue').textContent = `${recommendations.bmr} kcal`;
    document.getElementById('tdeeValue').textContent = `${recommendations.dailyCalories} kcal`;
}

// Render profile
function renderProfile() {
    const goalText = userProfile.goal === 'lose' ? 'Vazn Tushirish' : 
                     userProfile.goal === 'gain' ? 'Vazn Olish' : 'Vaznni Saqlab Turish';
    
    const html = `
        <div class="space-y-4">
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Ism</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">${userProfile.name}</div>
            </div>
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Yosh</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">${userProfile.age} yosh</div>
            </div>
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Jins</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                    ${userProfile.gender === 'male' ? 'Erkak' : 'Ayol'}
                </div>
            </div>
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Bo'y</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">${userProfile.height} cm</div>
            </div>
        </div>
        <div class="space-y-4">
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Hozirgi Vazn</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">${userProfile.weight} kg</div>
            </div>
            ${userProfile.targetWeight ? `
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Maqsadli Vazn</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">${userProfile.targetWeight} kg</div>
            </div>
            ` : ''}
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Maqsad</div>
                <span class="inline-block px-3 py-1 bg-emerald-600 text-white rounded-full text-base font-medium">${goalText}</span>
            </div>
            <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Faollik Darajasi</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    ${userProfile.activityLevel.replace('_', ' ')}
                </div>
            </div>
        </div>
    `;
    document.getElementById('profileInfo').innerHTML = html;
}
