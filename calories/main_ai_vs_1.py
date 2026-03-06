import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

MODEL_NAME = "fitness_pro_ai.pkl"

# =====================================================
# 1️⃣ Synthetic dataset generator (improved)
# =====================================================
def generate_data(n=15000):
    np.random.seed(42)
    data = []

    for _ in range(n):
        age = np.random.randint(16, 65)
        weight = np.random.randint(45, 130)
        height = np.random.randint(150, 200)
        gender = np.random.randint(0, 2)
        activity = np.random.uniform(1.2, 1.7)
        calorie = np.random.randint(1400, 4000)

        metabolism = np.random.normal(1.0, 0.08)

        bmr = 10*weight + 6.25*height - 5*age + (5 if gender==1 else -161)
        tdee = bmr * activity

        monthly_change = ((calorie - tdee) / 7700) * 30
        monthly_change *= metabolism

        # Realistic plateau
        if abs(monthly_change) > 3:
            monthly_change *= 0.85

        data.append([age, weight, height, gender, activity, calorie, monthly_change])

    return np.array(data)


# =====================================================
# 2️⃣ Train or Load model
# =====================================================
if os.path.exists(MODEL_NAME):
    models = joblib.load(MODEL_NAME)
    reg_model = models["regressor"]
    anomaly_model = models["anomaly"]
else:
    data = generate_data()
    X = data[:, 0:6]
    y = data[:, 6]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    reg_model = RandomForestRegressor(
        n_estimators=500,
        max_depth=15,
        random_state=42
    )
    reg_model.fit(X_train, y_train)

    preds = reg_model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"Model MAE: {round(mae,3)} kg")

    anomaly_model = IsolationForest(
        contamination=0.02,
        random_state=42
    )
    anomaly_model.fit(X[:, 0:5])

    joblib.dump({
        "regressor": reg_model,
        "anomaly": anomaly_model
    }, MODEL_NAME)

    print("✅ Professional AI o‘qitildi va saqlandi.")


# =====================================================
# 3️⃣ Utility functions
# =====================================================
def calculate_bmi(weight, height):
    return weight / ((height/100)**2)

def bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obese"

def calculate_tdee(age, weight, height, gender, activity):
    bmr = 10*weight + 6.25*height - 5*age + (5 if gender==1 else -161)
    return bmr * activity


# =====================================================
# 4️⃣ AI SIMULATION
# =====================================================
print("\n=== 🤖 FITNESS AI PRO v1 ===")

while True:
    cmd = input("\nBoshlash (exit chiqish): ")
    if cmd.lower() == "exit":
        break

    age = int(input("Yosh: "))
    weight = float(input("Vazn (kg): "))
    height = float(input("Bo‘y (cm): "))
    gender_input = input("Jins (erkak/ayol): ")
    gender = 1 if gender_input.lower() == "erkak" else 0

    print("\nAktivlik darajasi:")
    print("1 - Kam harakat (1.2)")
    print("2 - O‘rtacha (1.4)")
    print("3 - Sportchi (1.6)")
    act_choice = input("Tanlang (1/2/3): ")

    activity_map = {"1":1.2, "2":1.4, "3":1.6}
    activity = activity_map.get(act_choice, 1.4)

    # Anomaly check
    check = anomaly_model.predict([[age, weight, height, gender, activity]])
    if check[0] == -1:
        print("❌ Kiritilgan ma'lumot biologik jihatdan realistik emas.")
        continue

    bmi = calculate_bmi(weight, height)
    print(f"\n📊 BMI: {round(bmi,1)} ({bmi_category(bmi)})")

    tdee = calculate_tdee(age, weight, height, gender, activity)
    print(f"🔥 Kunlik energiya ehtiyoji (TDEE): {round(tdee,1)} kcal")


    goal = float(input("\nNecha kg o‘zgartirmoqchisiz? (+/-): "))



    # Realistik chegaralar
    min_monthly = 0.5
    max_monthly = 4

    min_months = max(abs(goal)/max_monthly, 1)
    max_months = abs(goal)/min_monthly

    print(f"\n📊 Realistik vaqt oralig‘i:")
    print(f"Minimum: {round(min_months,1)} oy")
    print(f"Maximum: {round(max_months,1)} oy")

    months = None
    while months is None:
        try:
            m = float(input("Necha oy ichida erishmoqchisiz?: "))
            if min_months <= m <= max_months:
                months = m
            else:
                print("❌ Tanlangan oy realistik chegaradan tashqarida.")
        except:
            print("❌ Iltimos son kiriting.")






    # months = float(input("Necha oy ichida?: "))

    required_monthly_change = goal / months
    required_daily_diff = (required_monthly_change * 7700) / 30
    recommended_calorie = tdee + required_daily_diff

    # Safety check
    if gender == 1 and recommended_calorie < 1500:
        print("⚠️ Juda past kaloriya (erkak uchun xavfli).")
    if gender == 0 and recommended_calorie < 1200:
        print("⚠️ Juda past kaloriya (ayol uchun xavfli).")

    # Prediction
    predicted = reg_model.predict(
        [[age, weight, height, gender, activity, recommended_calorie]]
    )[0]

    error_margin = abs(predicted - required_monthly_change)
    confidence = max(0, 100 - error_margin*25)

    print("\n===== 🤖 AI NATIJA =====")
    print(f"Tavsiya etilgan kaloriya: {round(recommended_calorie,1)} kcal")
    print(f"AI prognozi: {round(predicted,2)} kg/oy")
    print(f"Ishonchlilik darajasi: {round(confidence,1)}%")

    # Dynamic simulation
    print("\n📈 Progress simulyatsiya:")
    sim_weight = weight
    for m in range(1, int(months)+1):
        monthly_pred = reg_model.predict(
            [[age, sim_weight, height, gender, activity, recommended_calorie]]
        )[0]

        sim_weight += monthly_pred
        print(f"{m}-oy: {round(sim_weight,2)} kg")

    print("=========================")
