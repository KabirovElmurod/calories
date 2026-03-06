// Theme Management
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
}

// Initialize theme on page load
(function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
})();

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 toast-show';
    
    if (type === 'success') {
        toast.classList.add('bg-emerald-600', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-red-600', 'text-white');
    }
    
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
    }, 2700);
}

// Uzbek Dishes Database
const uzbekDishes = [
    // Breakfast
    { id: 1, name: 'Non with Butter and Honey', nameUzbek: 'Non va asal', calories: 280, protein: 8, carbs: 45, fat: 9, category: 'breakfast', description: 'Traditional Uzbek bread with butter and honey' },
    { id: 2, name: 'Fried Eggs with Vegetables', nameUzbek: 'Sabzavotli tuxum', calories: 220, protein: 14, carbs: 12, fat: 14, category: 'breakfast', description: 'Eggs fried with tomatoes, peppers, and onions' },
    { id: 3, name: 'Katlama', nameUzbek: 'Katlama', calories: 320, protein: 10, carbs: 42, fat: 13, category: 'breakfast', description: 'Layered flatbread with butter' },
    
    // Main Dishes
    { id: 4, name: 'Plov (Osh)', nameUzbek: 'Osh', calories: 450, protein: 25, carbs: 55, fat: 18, category: 'lunch', description: 'Traditional rice dish with meat, carrots, and onions' },
    { id: 5, name: 'Manti', nameUzbek: 'Manti', calories: 380, protein: 22, carbs: 48, fat: 12, category: 'lunch', description: 'Steamed dumplings filled with meat and onions' },
    { id: 6, name: "Lag'mon", nameUzbek: "Lag'mon", calories: 420, protein: 20, carbs: 58, fat: 12, category: 'lunch', description: 'Hand-pulled noodles with meat and vegetable sauce' },
    { id: 7, name: 'Shurpa', nameUzbek: 'Shurpa', calories: 280, protein: 18, carbs: 25, fat: 10, category: 'lunch', description: 'Hearty soup with meat and vegetables' },
    { id: 8, name: 'Somsa', nameUzbek: 'Somsa', calories: 320, protein: 16, carbs: 38, fat: 12, category: 'lunch', description: 'Baked pastry filled with meat and onions' },
    { id: 9, name: 'Dimlama', nameUzbek: 'Dimlama', calories: 350, protein: 24, carbs: 32, fat: 14, category: 'dinner', description: 'Stewed meat with vegetables' },
    { id: 10, name: 'Chuchvara', nameUzbek: 'Chuchvara', calories: 310, protein: 18, carbs: 40, fat: 9, category: 'dinner', description: 'Small dumplings in broth' },
    
    // Sides and Salads
    { id: 11, name: 'Achichuk Salad', nameUzbek: 'Achichuk', calories: 85, protein: 2, carbs: 12, fat: 4, category: 'snack', description: 'Fresh tomato and onion salad' },
    { id: 12, name: 'Non (Bread)', nameUzbek: 'Non', calories: 180, protein: 6, carbs: 35, fat: 2, category: 'snack', description: 'Traditional Uzbek flatbread' },
    { id: 13, name: "Kovurma Lag'mon", nameUzbek: "Kovurma Lag'mon", calories: 480, protein: 24, carbs: 62, fat: 16, category: 'lunch', description: 'Fried noodles with meat and vegetables' },
    { id: 14, name: 'Mastava', nameUzbek: 'Mastava', calories: 290, protein: 16, carbs: 38, fat: 8, category: 'lunch', description: 'Rice soup with meat and vegetables' },
    { id: 15, name: 'Norin', nameUzbek: 'Norin', calories: 340, protein: 20, carbs: 42, fat: 10, category: 'lunch', description: 'Cold noodles with horse meat' },
    { id: 16, name: 'Shivit Oshi', nameUzbek: 'Shivit Oshi', calories: 360, protein: 18, carbs: 48, fat: 11, category: 'lunch', description: 'Green noodles with meat sauce' },
    { id: 17, name: 'Tandir Kabob', nameUzbek: 'Tandir Kabob', calories: 380, protein: 32, carbs: 8, fat: 25, category: 'dinner', description: 'Lamb cooked in tandoor oven' },
    { id: 18, name: 'Jizzik', nameUzbek: 'Jizzik', calories: 420, protein: 28, carbs: 12, fat: 30, category: 'dinner', description: 'Fried lamb ribs' },
    { id: 19, name: 'Green Tea', nameUzbek: 'Kok choy', calories: 0, protein: 0, carbs: 0, fat: 0, category: 'snack', description: 'Traditional green tea' },
    { id: 20, name: 'Black Tea with Sweets', nameUzbek: 'Qora choy', calories: 120, protein: 1, carbs: 28, fat: 1, category: 'snack', description: 'Black tea served with traditional sweets' }
];

// BMR Calculation (Mifflin-St Jeor Equation)
function calculateBMR(profile) {
    const { weight, height, age, gender } = profile;
    
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

// Activity multipliers
const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
};

// Calculate Recommendations
function calculateRecommendations(profile) {
    const bmr = calculateBMR(profile);
    const tdee = bmr * activityMultipliers[profile.activityLevel];
    
    let dailyCalories = tdee;
    let weeklyWeightChange = 0;
    let estimatedWeeks = 0;
    
    if (profile.goal === 'lose') {
        dailyCalories = tdee - 500;
        weeklyWeightChange = -0.5;
        if (profile.targetWeight) {
            const totalWeightChange = Math.abs(profile.weight - profile.targetWeight);
            estimatedWeeks = Math.ceil(totalWeightChange / 0.5);
        }
    } else if (profile.goal === 'gain') {
        dailyCalories = tdee + 500;
        weeklyWeightChange = 0.5;
        if (profile.targetWeight) {
            const totalWeightChange = Math.abs(profile.targetWeight - profile.weight);
            estimatedWeeks = Math.ceil(totalWeightChange / 0.5);
        }
    } else {
        dailyCalories = tdee;
        weeklyWeightChange = 0;
    }
    
    const proteinGrams = Math.round((dailyCalories * 0.3) / 4);
    const carbsGrams = Math.round((dailyCalories * 0.4) / 4);
    const fatGrams = Math.round((dailyCalories * 0.3) / 9);
    
    return {
        bmr: Math.round(bmr),
        dailyCalories: Math.round(dailyCalories),
        proteinGrams,
        carbsGrams,
        fatGrams,
        weeklyWeightChange,
        estimatedWeeks
    };
}

// Generate Meal Plan
function generateMealPlan(targetCalories) {
    const breakfastCal = targetCalories * 0.25;
    const lunchCal = targetCalories * 0.40;
    const dinnerCal = targetCalories * 0.35;
    
    const breakfastDishes = uzbekDishes.filter(d => d.category === 'breakfast');
    const lunchDishes = uzbekDishes.filter(d => d.category === 'lunch');
    const dinnerDishes = uzbekDishes.filter(d => d.category === 'dinner');
    const snacks = uzbekDishes.filter(d => d.category === 'snack');
    
    const breakfast = selectMeals(breakfastDishes, snacks, breakfastCal);
    const lunch = selectMeals(lunchDishes, snacks, lunchCal);
    const dinner = selectMeals(dinnerDishes, snacks, dinnerCal);
    
    const totalCalories = 
        breakfast.reduce((sum, d) => sum + d.calories, 0) +
        lunch.reduce((sum, d) => sum + d.calories, 0) +
        dinner.reduce((sum, d) => sum + d.calories, 0);
    
    return { breakfast, lunch, dinner, totalCalories };
}

function selectMeals(mainDishes, snacks, targetCalories) {
    const meals = [];
    let currentCalories = 0;
    
    const mainDish = mainDishes[Math.floor(Math.random() * mainDishes.length)];
    meals.push(mainDish);
    currentCalories += mainDish.calories;
    
    while (currentCalories < targetCalories - 100 && meals.length < 3) {
        const remainingCals = targetCalories - currentCalories;
        const suitableSnacks = snacks.filter(s => s.calories <= remainingCals + 50);
        
        if (suitableSnacks.length === 0) break;
        
        const snack = suitableSnacks[Math.floor(Math.random() * suitableSnacks.length)];
        if (!meals.some(m => m.id === snack.id)) {
            meals.push(snack);
            currentCalories += snack.calories;
        } else {
            break;
        }
    }
    
    return meals;
}

// Generate Weight Prediction Data
function generateWeightData(profile, recommendations) {
    const data = [];
    let currentWeight = profile.weight;
    const weeks = Math.min(recommendations.estimatedWeeks, 12) || 12;
    
    for (let i = 0; i <= weeks; i++) {
        data.push({
            week: i === 0 ? 'Hozir' : `${i} hafta`,
            weight: Math.round(currentWeight * 10) / 10
        });
        currentWeight += recommendations.weeklyWeightChange;
    }
    return data;
}

// Format date for display
function formatTime(date) {
    return new Date(date).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get user profile
function getUserProfile() {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
        return JSON.parse(profileData);
    }
    return null;
}

// Logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    showToast('Xayr! 👋', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
