"""
Energy Consumption Prediction System
=====================================

This module implements regression and machine learning models to predict daily power 
consumption based on temporal factors like time of day and temperature.

Author: AI Assistant
Date: 2025-07-24
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler, PolynomialFeatures
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class EnergyConsumptionPredictor:
    """
    A comprehensive energy consumption prediction system using multiple ML models.
    """
    
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.poly_features = PolynomialFeatures(degree=2, include_bias=False)
        self.feature_importance = {}
        
    def generate_synthetic_data(self, n_samples=10000, start_date='2020-01-01'):
        """
        Generate synthetic energy consumption data with realistic patterns.
        
        Parameters:
        -----------
        n_samples : int
            Number of samples to generate
        start_date : str
            Starting date for the dataset
            
        Returns:
        --------
        pd.DataFrame
            Generated dataset with features and target
        """
        print("Generating synthetic energy consumption data...")
        
        # Create date range
        start = datetime.strptime(start_date, '%Y-%m-%d')
        dates = [start + timedelta(days=i) for i in range(n_samples)]
        
        # Initialize data dictionary
        data = {
            'date': dates,
            'year': [d.year for d in dates],
            'month': [d.month for d in dates],
            'day': [d.day for d in dates],
            'day_of_week': [d.weekday() for d in dates],
            'day_of_year': [d.timetuple().tm_yday for d in dates],
        }
        
        # Generate weather features
        np.random.seed(42)
        
        # Temperature with seasonal patterns
        seasonal_temp = 20 + 15 * np.sin(2 * np.pi * np.array(data['day_of_year']) / 365.25)
        data['temperature'] = seasonal_temp + np.random.normal(0, 5, n_samples)
        
        # Humidity (inversely correlated with temperature)
        data['humidity'] = 70 - 0.5 * (data['temperature'] - 20) + np.random.normal(0, 10, n_samples)
        data['humidity'] = np.clip(data['humidity'], 20, 90)
        
        # Wind speed
        data['wind_speed'] = np.random.exponential(5, n_samples)
        data['wind_speed'] = np.clip(data['wind_speed'], 0, 25)
        
        # Solar radiation (higher in summer, varies with day of year)
        solar_base = 500 + 300 * np.sin(2 * np.pi * np.array(data['day_of_year']) / 365.25)
        data['solar_radiation'] = np.maximum(0, solar_base + np.random.normal(0, 100, n_samples))
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Add derived features first (needed for energy pattern generation)
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        df['season'] = df['month'].apply(self._get_season)
        df['temperature_squared'] = df['temperature'] ** 2
        df['temp_humidity_interaction'] = df['temperature'] * df['humidity']
        
        # Generate energy consumption with realistic patterns
        energy_consumption = self._generate_energy_patterns(df)
        df['energy_consumption'] = energy_consumption
        
        return df
    
    def _generate_energy_patterns(self, df):
        """Generate realistic energy consumption patterns."""
        n_samples = len(df)
        
        # Base consumption
        base_consumption = 1000
        
        # Seasonal patterns (higher in winter and summer due to heating/cooling)
        seasonal_factor = 1 + 0.3 * np.abs(np.sin(2 * np.pi * df['day_of_year'] / 365.25))
        
        # Weekly patterns (lower on weekends)
        weekend_factor = np.where(df['is_weekend'] == 1, 0.8, 1.0)
        
        # Temperature effects (heating and cooling needs)
        temp_effect = 1 + 0.02 * np.abs(df['temperature'] - 22)  # Optimal temp is 22°C
        
        # Humidity effects (dehumidification needs)
        humidity_effect = 1 + 0.01 * np.maximum(0, df['humidity'] - 60)
        
        # Solar radiation effects (less consumption when solar is high)
        solar_effect = 1 - 0.0005 * df['solar_radiation']
        
        # Random noise
        noise = np.random.normal(1, 0.1, n_samples)
        
        # Combine all factors
        consumption = (base_consumption * seasonal_factor * weekend_factor * 
                      temp_effect * humidity_effect * solar_effect * noise)
        
        return np.maximum(100, consumption)  # Minimum consumption of 100 kWh
    
    def _get_season(self, month):
        """Convert month to season."""
        if month in [12, 1, 2]:
            return 'Winter'
        elif month in [3, 4, 5]:
            return 'Spring'
        elif month in [6, 7, 8]:
            return 'Summer'
        else:
            return 'Fall'
    
    def prepare_features(self, df):
        """
        Prepare features for machine learning models.
        
        Parameters:
        -----------
        df : pd.DataFrame
            Input dataframe
            
        Returns:
        --------
        pd.DataFrame
            Processed features
        """
        # Select relevant features
        feature_columns = [
            'temperature', 'humidity', 'wind_speed', 'solar_radiation',
            'day_of_week', 'month', 'day_of_year', 'is_weekend',
            'temperature_squared', 'temp_humidity_interaction'
        ]
        
        # One-hot encode categorical features
        df_processed = df.copy()
        season_dummies = pd.get_dummies(df['season'], prefix='season')
        df_processed = pd.concat([df_processed, season_dummies], axis=1)
        
        # Update feature columns to include season dummies
        feature_columns.extend(season_dummies.columns.tolist())
        
        return df_processed[feature_columns]
    
    def train_models(self, X_train, y_train):
        """
        Train multiple regression models.
        
        Parameters:
        -----------
        X_train : array-like
            Training features
        y_train : array-like
            Training target
        """
        print("Training multiple regression models...")
        
        # Scale features for linear models
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        # Define models
        models_to_train = {
            'Linear Regression': LinearRegression(),
            'Ridge Regression': Ridge(alpha=1.0),
            'Lasso Regression': Lasso(alpha=1.0),
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
        }
        
        # Train each model
        for name, model in models_to_train.items():
            print(f"Training {name}...")
            
            if name in ['Linear Regression', 'Ridge Regression', 'Lasso Regression']:
                model.fit(X_train_scaled, y_train)
            else:
                model.fit(X_train, y_train)
            
            self.models[name] = model
            
            # Store feature importance for tree-based models
            if hasattr(model, 'feature_importances_'):
                self.feature_importance[name] = model.feature_importances_
    
    def evaluate_models(self, X_test, y_test, feature_names):
        """
        Evaluate all trained models.
        
        Parameters:
        -----------
        X_test : array-like
            Test features
        y_test : array-like
            Test target
        feature_names : list
            Names of features
            
        Returns:
        --------
        pd.DataFrame
            Model evaluation results
        """
        print("Evaluating models...")
        
        X_test_scaled = self.scaler.transform(X_test)
        results = []
        
        for name, model in self.models.items():
            # Make predictions
            if name in ['Linear Regression', 'Ridge Regression', 'Lasso Regression']:
                y_pred = model.predict(X_test_scaled)
            else:
                y_pred = model.predict(X_test)
            
            # Calculate metrics
            mse = mean_squared_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            mae = mean_absolute_error(y_test, y_pred)
            r2 = r2_score(y_test, y_pred)
            
            results.append({
                'Model': name,
                'RMSE': rmse,
                'MAE': mae,
                'R²': r2,
                'MSE': mse
            })
        
        return pd.DataFrame(results).sort_values('RMSE')
    
    def plot_feature_importance(self, feature_names, figsize=(12, 8)):
        """Plot feature importance for tree-based models."""
        n_models = len(self.feature_importance)
        if n_models == 0:
            print("No feature importance data available.")
            return
        
        fig, axes = plt.subplots(1, n_models, figsize=figsize)
        if n_models == 1:
            axes = [axes]
        
        for idx, (model_name, importance) in enumerate(self.feature_importance.items()):
            # Create feature importance DataFrame
            feature_df = pd.DataFrame({
                'feature': feature_names,
                'importance': importance
            }).sort_values('importance', ascending=True)
            
            # Plot
            axes[idx].barh(feature_df['feature'], feature_df['importance'])
            axes[idx].set_title(f'{model_name}\nFeature Importance')
            axes[idx].set_xlabel('Importance')
        
        plt.tight_layout()
        plt.show()
    
    def plot_predictions(self, X_test, y_test, model_name='Random Forest'):
        """Plot actual vs predicted values for a specific model."""
        if model_name not in self.models:
            print(f"Model {model_name} not found.")
            return
        
        model = self.models[model_name]
        
        if model_name in ['Linear Regression', 'Ridge Regression', 'Lasso Regression']:
            X_test_processed = self.scaler.transform(X_test)
        else:
            X_test_processed = X_test
        
        y_pred = model.predict(X_test_processed)
        
        plt.figure(figsize=(10, 6))
        plt.scatter(y_test, y_pred, alpha=0.5)
        plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
        plt.xlabel('Actual Energy Consumption')
        plt.ylabel('Predicted Energy Consumption')
        plt.title(f'{model_name}: Actual vs Predicted')
        plt.show()
        
        # Calculate and display metrics
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        print(f"{model_name} Performance:")
        print(f"RMSE: {rmse:.2f}")
        print(f"R²: {r2:.4f}")

def main():
    """Main function to run the energy consumption prediction pipeline."""
    print("=" * 60)
    print("Energy Consumption Prediction System")
    print("=" * 60)
    
    # Initialize predictor
    predictor = EnergyConsumptionPredictor()
    
    # Generate synthetic data
    df = predictor.generate_synthetic_data(n_samples=5000)
    print(f"Generated dataset with {len(df)} samples")
    print(f"Target variable statistics:")
    print(df['energy_consumption'].describe())
    
    # Prepare features
    X = predictor.prepare_features(df)
    y = df['energy_consumption']
    
    print(f"\nFeatures: {list(X.columns)}")
    print(f"Feature matrix shape: {X.shape}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Train models
    predictor.train_models(X_train, y_train)
    
    # Evaluate models
    results = predictor.evaluate_models(X_test, y_test, X.columns.tolist())
    print("\nModel Performance Comparison:")
    print(results.round(4))
    
    # Plot feature importance
    predictor.plot_feature_importance(X.columns.tolist())
    
    # Plot predictions for best model
    best_model = results.iloc[0]['Model']
    print(f"\nBest performing model: {best_model}")
    predictor.plot_predictions(X_test, y_test, best_model)
    
    return predictor, df, results

if __name__ == "__main__":
    predictor, data, results = main()
