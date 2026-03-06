// Exercise JavaScript
const exercises = {
    beginner: [
        { name: 'Yengil Yurish', nameEnglish: 'Light Walking', duration: '30 daqiqa', calories: '150 kcal', sets: '1 seans', description: 'Har kuni ertalab yoki kechqurun toza havoda yurish' },
        { name: 'Cho\'zish mashqlari', nameEnglish: 'Stretching', duration: '15 daqiqa', calories: '50 kcal', sets: '2 marta/kun', description: 'Tanani cho\'zish va moslashuvchanlikni oshirish' },
        { name: 'Yengil yoga', nameEnglish: 'Light Yoga', duration: '20 daqiqa', calories: '80 kcal', sets: '3 marta/hafta', description: 'Nafas olish va muvozanat mashqlari' }
    ],
    intermediate: [
        { name: 'Yugurish', nameEnglish: 'Jogging', duration: '30 daqiqa', calories: '300 kcal', sets: '4 marta/hafta', description: 'O\'rtacha tezlikda yugurish' },
        { name: 'Tana vazni bilan mashqlar', nameEnglish: 'Bodyweight Exercises', duration: '25 daqiqa', calories: '200 kcal', sets: '3 set x 15 takror', description: 'Push-ups, squats, planks' },
        { name: 'Velosiped', nameEnglish: 'Cycling', duration: '40 daqiqa', calories: '350 kcal', sets: '3 marta/hafta', description: 'Velosipedda sayohat yoki sport' },
        { name: 'Suzish', nameEnglish: 'Swimming', duration: '30 daqiqa', calories: '400 kcal', sets: '2 marta/hafta', description: 'Hovuzda suzish mashqlari' }
    ],
    advanced: [
        { name: 'Yuqori intensivli mashqlar', nameEnglish: 'HIIT Training', duration: '30 daqiqa', calories: '450 kcal', sets: '5 marta/hafta', description: 'Yuqori intensivli interval mashqlar' },
        { name: 'Og\'irlik bilan mashqlar', nameEnglish: 'Weight Training', duration: '45 daqiqa', calories: '350 kcal', sets: '4 set x 10 takror', description: 'Og\'irlik ko\'tarish va kuch mashqlari' },
        { name: 'Tez yugurish', nameEnglish: 'Running', duration: '40 daqiqa', calories: '500 kcal', sets: '4 marta/hafta', description: 'Yuqori tezlikda masofa yugurish' },
        { name: 'Krossfit', nameEnglish: 'CrossFit', duration: '50 daqiqa', calories: '600 kcal', sets: '3 marta/hafta', description: 'Aralash yuqori intensivli mashqlar' }
    ]
};

const levelInfo = {
    beginner: {
        title: 'Boshlang\'ich Daraja',
        color: 'bg-green-500',
        description: 'Asta-sekin boshlang va jadvalga rioya qiling'
    },
    intermediate: {
        title: 'O\'rtacha Daraja',
        color: 'bg-blue-500',
        description: 'Yaxshi tempo va intensivlikni saqlang'
    },
    advanced: {
        title: 'Yuqori Daraja',
        color: 'bg-purple-500',
        description: 'Yuqori intensivli mashqlar va maqsadga intilish'
    }
};

// Initialize
(function initExercise() {
    if (!checkAuth()) return;
    
    const userProfile = getUserProfile();
    if (!userProfile) {
        window.location.href = 'login.html';
        return;
    }
    
    const level = getExerciseLevel(userProfile.activityLevel);
    const recommendedExercises = exercises[level];
    const info = levelInfo[level];
    
    // Set level badge
    const badge = document.getElementById('levelBadge');
    badge.textContent = info.title;
    badge.className = `inline-block px-4 py-1 rounded-full text-white text-base font-medium ${info.color}`;
    
    document.getElementById('levelDescription').textContent = info.description;
    
    // Render exercises
    renderExercises(recommendedExercises);
    
    // Render weekly schedule
    renderWeeklySchedule(recommendedExercises);
})();

function getExerciseLevel(activityLevel) {
    switch (activityLevel) {
        case 'sedentary':
        case 'light':
            return 'beginner';
        case 'moderate':
            return 'intermediate';
        case 'active':
        case 'very_active':
            return 'advanced';
        default:
            return 'beginner';
    }
}

function renderExercises(exercisesList) {
    const container = document.getElementById('exercisesList');
    container.innerHTML = exercisesList.map(exercise => `
        <div class="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-all shadow-lg group p-6">
            <div class="flex items-center gap-2 mb-4">
                <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">${exercise.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${exercise.nameEnglish}</p>
                </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">${exercise.description}</p>
            <div class="grid grid-cols-3 gap-3">
                <div class="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center">
                    <svg class="w-5 h-5 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Davomiyligi</div>
                    <div class="font-semibold text-sm text-gray-900 dark:text-white">${exercise.duration}</div>
                </div>
                <div class="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg text-center">
                    <svg class="w-5 h-5 text-orange-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                    </svg>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Kaloriya</div>
                    <div class="font-semibold text-sm text-gray-900 dark:text-white">${exercise.calories}</div>
                </div>
                <div class="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg text-center">
                    <svg class="w-5 h-5 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                    <div class="text-xs text-gray-600 dark:text-gray-400">Set/Chastota</div>
                    <div class="font-semibold text-sm text-gray-900 dark:text-white">${exercise.sets}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderWeeklySchedule(exercisesList) {
    const weekDays = [
        { day: 'Dushanba', activity: exercisesList[0]?.name || 'Dam olish' },
        { day: 'Seshanba', activity: exercisesList[1]?.name || 'Dam olish' },
        { day: 'Chorshanba', activity: exercisesList[2]?.name || 'Dam olish' },
        { day: 'Payshanba', activity: exercisesList[0]?.name || 'Dam olish' },
        { day: 'Juma', activity: exercisesList[1]?.name || 'Dam olish' },
        { day: 'Shanba', activity: exercisesList[3]?.name || 'Dam olish' },
        { day: 'Yakshanba', activity: 'Dam olish va tiklanish' }
    ];
    
    const container = document.getElementById('weeklySchedule');
    container.innerHTML = weekDays.map(item => `
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span class="font-semibold text-gray-900 dark:text-white">${item.day}</span>
            <span class="px-3 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300">
                ${item.activity}
            </span>
        </div>
    `).join('');
}
