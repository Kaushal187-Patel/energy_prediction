"""
Complete Energy Consumption Analysis Demo
=========================================

This script runs the complete energy consumption prediction and analysis pipeline.

Usage: python run_analysis.py
"""

from energy_prediction import EnergyConsumptionPredictor
from data_analysis import analyze_energy_data
import matplotlib.pyplot as plt

def main():
    """Run the complete energy consumption analysis."""
    print("=" * 80)
    print("COMPLETE ENERGY CONSUMPTION ANALYSIS DEMO")
    print("=" * 80)
    
    # Step 1: Generate data and train models
    print("\n🔥 STEP 1: Training Machine Learning Models")
    print("-" * 50)
    
    predictor = EnergyConsumptionPredictor()
    data = predictor.generate_synthetic_data(n_samples=3000)
    
    # Prepare features and train models
    X = predictor.prepare_features(data)
    y = data['energy_consumption']
    
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    predictor.train_models(X_train, y_train)
    results = predictor.evaluate_models(X_test, y_test, X.columns.tolist())
    
    print("Model Performance:")
    print(results[['Model', 'RMSE', 'R²']].round(4))
    
    # Step 2: Comprehensive data analysis
    print("\n📊 STEP 2: Comprehensive Data Analysis")
    print("-" * 50)
    
    analyzer = analyze_energy_data(data)
    
    print("\n✅ Analysis Complete!")
    print("\nKey Results:")
    print(f"• Best ML Model: {results.iloc[0]['Model']}")
    print(f"• Model Accuracy (R²): {results.iloc[0]['R²']:.4f}")
    print(f"• Average Daily Consumption: {data['energy_consumption'].mean():.1f} kWh")
    print(f"• Data Points Analyzed: {len(data):,}")
    
    # Step 3: Feature importance visualization
    print("\n📈 STEP 3: Feature Importance Analysis")
    print("-" * 50)
    predictor.plot_feature_importance(X.columns.tolist())
    
    # Step 4: Prediction accuracy visualization
    print("\n🎯 STEP 4: Prediction Accuracy Visualization")
    print("-" * 50)
    best_model = results.iloc[0]['Model']
    predictor.plot_predictions(X_test, y_test, best_model)
    
    return predictor, data, results, analyzer

if __name__ == "__main__":
    predictor, data, results, analyzer = main()
