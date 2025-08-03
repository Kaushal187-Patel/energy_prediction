import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import numpy as np

# Load the dataset
csv_path = '../frontend/public/data/energy_dataset.csv'
df = pd.read_csv(csv_path)

print('Dataset shape:', df.shape)
print('Columns:', df.columns.tolist())

# Feature engineering
if 'Time' in df.columns:
    df['Hour'] = pd.to_datetime(df['Time'], format='%H:%M').dt.hour

if 'Date' in df.columns:
    df['Date'] = pd.to_datetime(df['Date'])
    df['DayOfWeek'] = df['Date'].dt.dayofweek
    df['Month'] = df['Date'].dt.month
    df['IsWeekend'] = (df['DayOfWeek'] >= 5).astype(int)

# Encode categorical variables
le_appliance = LabelEncoder()
le_season = LabelEncoder()

if 'Appliance Type' in df.columns:
    df['Appliance_Encoded'] = le_appliance.fit_transform(df['Appliance Type'])
    
if 'Season' in df.columns:
    df['Season_Encoded'] = le_season.fit_transform(df['Season'])

# Select features
feature_cols = ['Outdoor Temperature (°C)', 'Household Size']
if 'Hour' in df.columns:
    feature_cols.append('Hour')
if 'Appliance_Encoded' in df.columns:
    feature_cols.append('Appliance_Encoded')
if 'Season_Encoded' in df.columns:
    feature_cols.append('Season_Encoded')
if 'IsWeekend' in df.columns:
    feature_cols.append('IsWeekend')

# Clean data
df = df.dropna(subset=feature_cols + ['Energy Consumption (kWh)'])

X = df[feature_cols]
y = df['Energy Consumption (kWh)']

print(f'Features used: {feature_cols}')
print(f'Training samples: {len(X)}')

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train models
models = {
    'linear_regression': LinearRegression(),
    'knn': KNeighborsRegressor(n_neighbors=5),
    'random_forest': RandomForestRegressor(n_estimators=100, random_state=42)
}

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f'{name}: RMSE={rmse:.3f}, R²={r2:.3f}')
    
    # Save model
    with open(f'{name}_model.pkl', 'wb') as f:
        pickle.dump(model, f)

# Save encoders and feature columns
with open('feature_info.pkl', 'wb') as f:
    pickle.dump({
        'feature_cols': feature_cols,
        'appliance_encoder': le_appliance if 'Appliance Type' in df.columns else None,
        'season_encoder': le_season if 'Season' in df.columns else None
    }, f)

print('Models and feature info saved successfully!')