import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, TimeSeriesSplit
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.neighbors import KNeighborsRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pickle
import warnings
warnings.filterwarnings('ignore')

# Load the dataset
csv_path = '../frontend/public/data/energy_dataset.csv'
df = pd.read_csv(csv_path)

print('=' * 60)
print('ENHANCED ENERGY PREDICTION MODEL TRAINING')
print('=' * 60)
print(f'Dataset shape: {df.shape}')
print(f'Columns: {df.columns.tolist()}')

# =====================================================
# FEATURE ENGINEERING - Enhanced Features
# =====================================================

# Time-based features
if 'Time' in df.columns:
    df['Hour'] = pd.to_datetime(df['Time'], format='%H:%M').dt.hour
    # Cyclical encoding for hour (captures circular nature of time)
    df['Hour_Sin'] = np.sin(2 * np.pi * df['Hour'] / 24)
    df['Hour_Cos'] = np.cos(2 * np.pi * df['Hour'] / 24)
    # Peak hour indicator (6-9 PM typically)
    df['IsPeakHour'] = ((df['Hour'] >= 18) & (df['Hour'] <= 21)).astype(int)
    # Morning/Afternoon/Evening/Night classification
    df['TimeOfDay'] = pd.cut(df['Hour'], bins=[0, 6, 12, 18, 24], 
                              labels=[0, 1, 2, 3], include_lowest=True).astype(int)

if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df['DayOfWeek'] = df['Date'].dt.dayofweek
    df['Month'] = df['Date'].dt.month
    df['DayOfYear'] = df['Date'].dt.dayofyear
    df['Week'] = df['Date'].dt.isocalendar().week.astype(int)
    df['Quarter'] = df['Date'].dt.quarter
    df['IsWeekend'] = (df['DayOfWeek'] >= 5).astype(int)
    # Cyclical encoding for month (seasonal patterns)
    df['Month_Sin'] = np.sin(2 * np.pi * df['Month'] / 12)
    df['Month_Cos'] = np.cos(2 * np.pi * df['Month'] / 12)
    # Cyclical encoding for day of week
    df['DayOfWeek_Sin'] = np.sin(2 * np.pi * df['DayOfWeek'] / 7)
    df['DayOfWeek_Cos'] = np.cos(2 * np.pi * df['DayOfWeek'] / 7)

# =====================================================
# WEATHER FEATURES - Simulated for enhanced prediction
# =====================================================
# Since the dataset only has temperature, we simulate additional weather features
# based on realistic correlations with temperature and season

np.random.seed(42)

# Humidity (inversely related to temperature in summer, varies by season)
season_humidity_map = {'Winter': 70, 'Spring': 60, 'Summer': 50, 'Fall': 65}
df['Humidity'] = df['Season'].map(season_humidity_map) + np.random.normal(0, 15, len(df))
df['Humidity'] = df['Humidity'].clip(20, 95)

# Wind Speed (m/s) - varies by season and time
season_wind_map = {'Winter': 5.0, 'Spring': 4.5, 'Summer': 3.5, 'Fall': 4.0}
df['WindSpeed'] = df['Season'].map(season_wind_map) + np.random.normal(0, 2, len(df))
df['WindSpeed'] = df['WindSpeed'].clip(0, 15)

# Solar Radiation (W/m²) - depends on hour and season
if 'Hour' in df.columns:
    # Peak solar at noon, zero at night
    hour_solar = np.sin(np.clip((df['Hour'] - 6) * np.pi / 12, 0, np.pi)) * 800
    season_solar_mult = {'Winter': 0.6, 'Spring': 0.85, 'Summer': 1.0, 'Fall': 0.75}
    df['SolarRadiation'] = hour_solar * df['Season'].map(season_solar_mult)
    df['SolarRadiation'] = df['SolarRadiation'].clip(0, 1000) + np.random.normal(0, 50, len(df))
    df['SolarRadiation'] = df['SolarRadiation'].clip(0, 1000)
else:
    df['SolarRadiation'] = 400 + np.random.normal(0, 100, len(df))

# Rainfall probability (mm) - higher in monsoon/winter
season_rain_map = {'Winter': 2.0, 'Spring': 1.5, 'Summer': 3.5, 'Fall': 2.5}
df['Rainfall'] = df['Season'].map(season_rain_map) * np.random.exponential(1, len(df))
df['Rainfall'] = df['Rainfall'].clip(0, 50)

# Cloud Cover (%) - affects solar and temperature
df['CloudCover'] = 30 + df['Rainfall'] * 5 + np.random.normal(0, 15, len(df))
df['CloudCover'] = df['CloudCover'].clip(0, 100)

# =====================================================
# DERIVED WEATHER FEATURES
# =====================================================

# Heat Index (apparent temperature)
temp = df['Outdoor Temperature (°C)']
humidity = df['Humidity']
df['HeatIndex'] = temp - ((100 - humidity) / 5)

# Cooling Degree Days (need for AC)
df['CoolingDegree'] = np.maximum(0, temp - 22)

# Heating Degree Days (need for heating)
df['HeatingDegree'] = np.maximum(0, 18 - temp)

# Comfort Index
df['ComfortIndex'] = temp - (humidity - 50) * 0.1

# Temperature-Humidity interaction
df['TempHumidityInteraction'] = temp * humidity / 100

# Wind Chill Factor (for cold temperatures)
df['WindChill'] = np.where(temp < 10, 
                           13.12 + 0.6215 * temp - 11.37 * (df['WindSpeed'] ** 0.16) + 
                           0.3965 * temp * (df['WindSpeed'] ** 0.16),
                           temp)

# =====================================================
# ENERGY SOURCE MIX FEATURES (Simulated Grid Data)
# =====================================================

# Simulated energy source percentages based on time and weather
df['SolarContribution'] = (df['SolarRadiation'] / 1000) * 30  # Max 30% solar
df['WindContribution'] = (df['WindSpeed'] / 15) * 20  # Max 20% wind
df['RenewableTotal'] = df['SolarContribution'] + df['WindContribution']
df['FossilFuelContribution'] = 100 - df['RenewableTotal'].clip(0, 50)

# Grid Stress Index (higher during peak hours and extreme weather)
df['GridStressIndex'] = (
    df['IsPeakHour'] * 20 +
    np.abs(temp - 22) * 2 +
    (100 - df['RenewableTotal']) * 0.3
).clip(0, 100)

# =====================================================
# LOAD PATTERN FEATURES
# =====================================================

# Residential vs Industrial load indicator (based on time)
df['ResidentialLoad'] = np.where(
    (df['Hour'] >= 17) & (df['Hour'] <= 23), 0.8,
    np.where((df['Hour'] >= 6) & (df['Hour'] <= 9), 0.6, 0.3)
)

df['IndustrialLoad'] = np.where(
    (df['Hour'] >= 9) & (df['Hour'] <= 17) & (df['IsWeekend'] == 0), 0.9,
    0.2
)

# Population activity index (simulated)
df['PopulationActivityIndex'] = (
    df['ResidentialLoad'] * 0.6 + 
    df['IndustrialLoad'] * 0.4 +
    (1 - df['IsWeekend']) * 0.1
)

# =====================================================
# HISTORICAL PATTERN FEATURES
# =====================================================

# Rolling statistics (simulated based on household patterns)
df['HouseholdBaseLoad'] = df['Household Size'] * 0.5  # Base load per person

# Appliance efficiency factor
appliance_efficiency = {
    'Fridge': 0.95, 'Oven': 0.85, 'Dishwasher': 0.9,
    'Heater': 0.8, 'Microwave': 0.95, 'Air Conditioning': 0.85,
    'Computer': 0.9, 'Washing Machine': 0.88, 'Lights': 0.95, 'TV': 0.92
}
df['ApplianceEfficiency'] = df['Appliance Type'].map(appliance_efficiency).fillna(0.9)

# =====================================================
# ENCODE CATEGORICAL VARIABLES
# =====================================================

le_appliance = LabelEncoder()
le_season = LabelEncoder()

if 'Appliance Type' in df.columns:
    df['Appliance_Encoded'] = le_appliance.fit_transform(df['Appliance Type'])
    
if 'Season' in df.columns:
    df['Season_Encoded'] = le_season.fit_transform(df['Season'])

# =====================================================
# SELECT FEATURES FOR TRAINING
# =====================================================

feature_cols = [
    # Basic features
    'Outdoor Temperature (°C)', 'Household Size',
    # Time features
    'Hour', 'Hour_Sin', 'Hour_Cos', 'IsPeakHour', 'TimeOfDay',
    'DayOfWeek', 'Month', 'IsWeekend', 'Quarter',
    'Month_Sin', 'Month_Cos', 'DayOfWeek_Sin', 'DayOfWeek_Cos',
    # Weather features
    'Humidity', 'WindSpeed', 'SolarRadiation', 'Rainfall', 'CloudCover',
    # Derived weather
    'HeatIndex', 'CoolingDegree', 'HeatingDegree', 'ComfortIndex',
    'TempHumidityInteraction', 'WindChill',
    # Energy source features
    'SolarContribution', 'WindContribution', 'RenewableTotal',
    'FossilFuelContribution', 'GridStressIndex',
    # Load patterns
    'ResidentialLoad', 'IndustrialLoad', 'PopulationActivityIndex',
    'HouseholdBaseLoad', 'ApplianceEfficiency',
    # Encoded categoricals
    'Appliance_Encoded', 'Season_Encoded'
]

# Filter to available columns
available_features = [col for col in feature_cols if col in df.columns]
print(f'\nUsing {len(available_features)} features for training')

# Clean data
df_clean = df.dropna(subset=available_features + ['Energy Consumption (kWh)'])
print(f'Training samples after cleaning: {len(df_clean)}')

X = df_clean[available_features]
y = df_clean['Energy Consumption (kWh)']

# =====================================================
# TRAIN MULTIPLE MODELS
# =====================================================

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features for neural network
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define models
models = {
    'linear_regression': LinearRegression(),
    'ridge_regression': Ridge(alpha=1.0),
    'knn': KNeighborsRegressor(n_neighbors=7, weights='distance'),
    'random_forest': RandomForestRegressor(
        n_estimators=150, 
        max_depth=15,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    ),
    'gradient_boosting': GradientBoostingRegressor(
        n_estimators=150,
        learning_rate=0.1,
        max_depth=8,
        random_state=42
    ),
    'neural_network': MLPRegressor(
        hidden_layer_sizes=(128, 64, 32),
        activation='relu',
        solver='adam',
        max_iter=500,
        early_stopping=True,
        validation_fraction=0.1,
        random_state=42
    )
}

model_scores = {}
feature_importance = {}

print('\n' + '=' * 60)
print('MODEL TRAINING RESULTS')
print('=' * 60)

for name, model in models.items():
    # Use scaled features for neural network
    if name == 'neural_network':
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    
    # Calculate metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    model_scores[name] = r2
    
    print(f'\n{name.upper()}:')
    print(f'  RMSE: {rmse:.4f}')
    print(f'  MAE:  {mae:.4f}')
    print(f'  R²:   {r2:.4f}')
    
    # Save model
    with open(f'{name}_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    # Extract feature importance for tree-based models
    if hasattr(model, 'feature_importances_'):
        importance = dict(zip(available_features, model.feature_importances_))
        feature_importance[name] = importance
        
        # Print top 10 important features
        sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)[:10]
        print(f'  Top 10 Features:')
        for feat, imp in sorted_importance:
            print(f'    {feat}: {imp:.4f}')

# Save scaler
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

# Save encoders, feature columns, and metadata
model_metadata = {
    'feature_cols': available_features,
    'appliance_encoder': le_appliance if 'Appliance Type' in df.columns else None,
    'season_encoder': le_season if 'Season' in df.columns else None,
    'model_scores': model_scores,
    'feature_importance': feature_importance,
    'training_date': pd.Timestamp.now().isoformat(),
    'sample_count': len(X_train),
    'weather_features': ['Humidity', 'WindSpeed', 'SolarRadiation', 'Rainfall', 'CloudCover'],
    'time_features': ['Hour', 'DayOfWeek', 'Month', 'IsWeekend', 'IsPeakHour'],
    'energy_source_features': ['SolarContribution', 'WindContribution', 'RenewableTotal']
}

with open('feature_info.pkl', 'wb') as f:
    pickle.dump(model_metadata, f)

# =====================================================
# TRAIN SPECIALIZED MODELS FOR FORECASTING
# =====================================================

print('\n' + '=' * 60)
print('TRAINING SPECIALIZED FORECASTING MODELS')
print('=' * 60)

# Energy Demand Forecasting Model
demand_model = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.08,
    max_depth=10,
    random_state=42
)
demand_model.fit(X_train, y_train)

# Energy Generation Potential Model (based on renewable features)
generation_features = ['SolarRadiation', 'WindSpeed', 'CloudCover', 'Hour', 'Month', 'Season_Encoded']
X_gen = df_clean[[f for f in generation_features if f in df_clean.columns]]
# Simulate generation capacity based on weather
y_gen = (
    df_clean['SolarContribution'] * 2 +  # Solar panels capacity
    df_clean['WindContribution'] * 1.5 +  # Wind turbine capacity
    np.random.normal(0, 5, len(df_clean))  # Noise
).clip(0, 100)

X_gen_train, X_gen_test, y_gen_train, y_gen_test = train_test_split(X_gen, y_gen, test_size=0.2, random_state=42)

generation_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
generation_model.fit(X_gen_train, y_gen_train)
gen_r2 = r2_score(y_gen_test, generation_model.predict(X_gen_test))
print(f'Energy Generation Model R²: {gen_r2:.4f}')

# Save specialized models
with open('demand_model.pkl', 'wb') as f:
    pickle.dump(demand_model, f)

with open('generation_model.pkl', 'wb') as f:
    pickle.dump(generation_model, f)

print('\n' + '=' * 60)
print('ALL MODELS SAVED SUCCESSFULLY!')
print('=' * 60)
print(f'Total features: {len(available_features)}')
print(f'Best model: {max(model_scores, key=model_scores.get)} (R² = {max(model_scores.values()):.4f})')
