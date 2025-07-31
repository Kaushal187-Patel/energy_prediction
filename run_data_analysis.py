import pandas as pd
from data_analysis import analyze_energy_data

# Load your energy dataset
df = pd.read_csv('public/data/energy_dataset.csv')

# Convert date column to datetime
df['Date'] = pd.to_datetime(df['Date'])

# Rename columns to match the analyzer expectations
df_renamed = df.rename(columns={
    'Date': 'date',
    'Energy Consumption (kWh)': 'energy_consumption',
    'Outdoor Temperature (°C)': 'temperature',
    'Season': 'season',
    'Household Size': 'household_size'
})

# Add missing columns with synthetic data for analysis
df_renamed['humidity'] = 50 + (df_renamed['temperature'] - 20) * 2  # Synthetic humidity
df_renamed['wind_speed'] = 5.0  # Constant wind speed
df_renamed['solar_radiation'] = 500  # Constant solar radiation
df_renamed['day_of_week'] = df_renamed['date'].dt.dayofweek
df_renamed['is_weekend'] = (df_renamed['day_of_week'] >= 5).astype(int)

print("Starting energy consumption data analysis...")
print(f"Dataset contains {len(df_renamed)} records")
print(f"Date range: {df_renamed['date'].min()} to {df_renamed['date'].max()}")

# Run the analysis
analyzer = analyze_energy_data(df_renamed)