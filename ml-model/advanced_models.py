import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import TimeSeriesSplit
import pickle
from datetime import datetime, timedelta

class AdvancedEnergyPredictor:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_importance = {}
        
    def create_time_features(self, df):
        """Create advanced time-based features"""
        df['hour'] = pd.to_datetime(df['date']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['date']).dt.dayofweek
        df['month'] = pd.to_datetime(df['date']).dt.month
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
        df['is_peak_hour'] = ((df['hour'] >= 17) & (df['hour'] <= 21)).astype(int)
        
        # Cyclical encoding
        df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
        
        return df
    
    def create_weather_features(self, df):
        """Create weather interaction features"""
        df['temp_humidity'] = df['temperature'] * df['humidity'] / 100
        df['cooling_degree'] = np.maximum(0, df['temperature'] - 18)
        df['heating_degree'] = np.maximum(0, 18 - df['temperature'])
        df['comfort_index'] = df['temperature'] - (df['humidity'] - 50) * 0.1
        
        return df
    
    def train_advanced_models(self, X, y):
        """Train advanced ML models"""
        # Gradient Boosting
        gb_model = GradientBoostingRegressor(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        
        # Neural Network
        nn_model = MLPRegressor(
            hidden_layer_sizes=(100, 50, 25),
            activation='relu',
            solver='adam',
            max_iter=500,
            random_state=42
        )
        
        # Scale features for neural network
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Time series cross-validation
        tscv = TimeSeriesSplit(n_splits=5)
        
        # Train models
        gb_model.fit(X, y)
        nn_model.fit(X_scaled, y)
        
        self.models['gradient_boosting'] = gb_model
        self.models['neural_network'] = nn_model
        self.scalers['neural_network'] = scaler
        
        # Feature importance
        self.feature_importance['gradient_boosting'] = dict(zip(
            X.columns, gb_model.feature_importances_
        ))
        
        return self.models
    
    def predict_multi_horizon(self, features, horizons=[1, 7, 30]):
        """Multi-horizon forecasting"""
        predictions = {}
        
        for horizon in horizons:
            # Adjust features for different horizons
            horizon_features = features.copy()
            
            # Simple horizon adjustment (in practice, use more sophisticated methods)
            if horizon > 1:
                horizon_features['temperature'] *= (1 + np.random.normal(0, 0.1))
                horizon_features['humidity'] *= (1 + np.random.normal(0, 0.05))
            
            gb_pred = self.models['gradient_boosting'].predict([horizon_features])[0]
            
            # Scale features for neural network
            features_scaled = self.scalers['neural_network'].transform([horizon_features])
            nn_pred = self.models['neural_network'].predict(features_scaled)[0]
            
            # Ensemble prediction
            ensemble_pred = (gb_pred * 0.6 + nn_pred * 0.4)
            
            predictions[f'{horizon}_day'] = {
                'gradient_boosting': float(gb_pred),
                'neural_network': float(nn_pred),
                'ensemble': float(ensemble_pred),
                'confidence': self._calculate_confidence(gb_pred, nn_pred)
            }
        
        return predictions
    
    def _calculate_confidence(self, pred1, pred2):
        """Calculate prediction confidence based on model agreement"""
        agreement = 1 - abs(pred1 - pred2) / max(pred1, pred2, 1)
        return min(0.95, max(0.5, agreement))
    
    def detect_anomalies(self, predictions, threshold=2.0):
        """Detect anomalous predictions"""
        if len(predictions) < 5:
            return []
        
        values = [p['ensemble'] for p in predictions]
        mean_val = np.mean(values)
        std_val = np.std(values)
        
        anomalies = []
        for i, val in enumerate(values):
            z_score = abs(val - mean_val) / std_val if std_val > 0 else 0
            if z_score > threshold:
                anomalies.append({
                    'index': i,
                    'value': val,
                    'z_score': z_score,
                    'severity': 'high' if z_score > 3 else 'medium'
                })
        
        return anomalies
    
    def save_models(self, filepath='advanced_models.pkl'):
        """Save trained models"""
        model_data = {
            'models': self.models,
            'scalers': self.scalers,
            'feature_importance': self.feature_importance,
            'timestamp': datetime.now()
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
    
    def load_models(self, filepath='advanced_models.pkl'):
        """Load trained models"""
        try:
            with open(filepath, 'rb') as f:
                model_data = pickle.load(f)
            
            self.models = model_data['models']
            self.scalers = model_data['scalers']
            self.feature_importance = model_data['feature_importance']
            
            return True
        except FileNotFoundError:
            return False

# Usage example
if __name__ == "__main__":
    predictor = AdvancedEnergyPredictor()
    
    # Generate sample data
    dates = pd.date_range('2024-01-01', periods=1000, freq='D')
    data = pd.DataFrame({
        'date': dates,
        'temperature': 20 + 10 * np.sin(2 * np.pi * np.arange(1000) / 365) + np.random.normal(0, 2, 1000),
        'humidity': 50 + 20 * np.random.random(1000),
        'energy_consumption': 100 + 50 * np.sin(2 * np.pi * np.arange(1000) / 365) + np.random.normal(0, 10, 1000)
    })
    
    # Create features
    data = predictor.create_time_features(data)
    data = predictor.create_weather_features(data)
    
    # Prepare training data
    feature_cols = ['temperature', 'humidity', 'hour', 'day_of_week', 'month', 
                   'is_weekend', 'is_peak_hour', 'hour_sin', 'hour_cos', 
                   'month_sin', 'month_cos', 'temp_humidity', 'cooling_degree', 
                   'heating_degree', 'comfort_index']
    
    X = data[feature_cols]
    y = data['energy_consumption']
    
    # Train models
    predictor.train_advanced_models(X, y)
    
    # Save models
    predictor.save_models()
    
    print("Advanced models trained and saved successfully!")