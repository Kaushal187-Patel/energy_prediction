"""
Simple Energy Consumption Prediction Example
===========================================

This script demonstrates basic usage of the energy consumption prediction system.
"""

from energy_prediction import EnergyConsumptionPredictor
from sklearn.model_selection import train_test_split

def main():
    """Simple example of energy consumption prediction."""
    print("🔋 Energy Consumption Prediction Example")
    print("=" * 50)
    
    # Initialize and generate data
    predictor = EnergyConsumptionPredictor()
    data = predictor.generate_synthetic_data(n_samples=1000)
    
    print(f"✅ Generated {len(data)} days of energy data")
    print(f"📊 Average consumption: {data['energy_consumption'].mean():.1f} kWh/day")
    print(f"📈 Range: {data['energy_consumption'].min():.1f} - {data['energy_consumption'].max():.1f} kWh")
    
    # Prepare features and train
    X = predictor.prepare_features(data)
    y = data['energy_consumption']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"\n🚀 Training models on {len(X_train)} samples...")
    predictor.train_models(X_train, y_train)
    
    # Evaluate
    results = predictor.evaluate_models(X_test, y_test, X.columns.tolist())
    
    print("\n📋 Model Results:")
    print("-" * 30)
    for _, row in results.iterrows():
        print(f"{row['Model']:<18}: R² = {row['R²']:.4f}, RMSE = {row['RMSE']:.1f} kWh")
    
    best_model = results.iloc[0]['Model']
    best_r2 = results.iloc[0]['R²']
    
    print(f"\n🏆 Best Model: {best_model}")
    print(f"🎯 Accuracy: {best_r2:.1%} ({best_r2:.4f} R²)")
    
    # Show some key insights
    print(f"\n🔍 Key Insights:")
    print(f"• Temperature correlation: {data['temperature'].corr(data['energy_consumption']):.3f}")
    print(f"• Weekend vs weekday difference: {((data[data['is_weekend']==1]['energy_consumption'].mean() - data[data['is_weekend']==0]['energy_consumption'].mean()) / data[data['is_weekend']==0]['energy_consumption'].mean() * 100):+.1f}%")
    
    seasonal_avg = data.groupby('season')['energy_consumption'].mean()
    print(f"• Highest consumption season: {seasonal_avg.idxmax()} ({seasonal_avg.max():.0f} kWh)")
    print(f"• Lowest consumption season: {seasonal_avg.idxmin()} ({seasonal_avg.min():.0f} kWh)")

if __name__ == "__main__":
    main()
