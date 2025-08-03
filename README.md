# Energy Consumption Prediction Project

A comprehensive machine learning system for predicting energy consumption based on temporal factors and weather conditions. This project helps utilities and businesses optimize energy usage, reduce costs, and manage resources more sustainably.

## 🎯 Project Overview

This project implements regression and machine learning models to predict daily power consumption using:
- **Temporal factors**: time of day, day of week, seasonal patterns
- **Weather data**: temperature, humidity, wind speed, solar radiation
- **Multiple ML algorithms**: Linear Regression, Ridge, Lasso, Random Forest, Gradient Boosting

## 📁 Project Structure

```
energyAI/
├── frontend/          # Next.js React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...other frontend files
├── backend/           # Node.js Express API
│   ├── src/
│   │   └── server.js
│   ├── package.json
│   ├── database.db
│   └── database_schema.sql
├── ml-model/          # ML model code
│   ├── *.pkl         # Trained models
│   ├── predict_api.py
│   ├── train_models.py
│   └── requirements.txt
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend (Next.js)
cd frontend
npm install

# Backend (Node.js)
cd ../backend
npm install

# ML Model (Python)
cd ../ml-model
pip install -r requirements.txt
```

### 2. Run All Services (Single Command)

```bash
# Option 1: Using npm (install concurrently first)
npm install
npm start

# Option 2: Using batch file (Windows)
start.bat
```

### 3. Run Individual Services

```bash
# Start Frontend (in frontend directory)
npm run dev

# Start Backend (in backend directory)
npm start

# Run ML predictions (in ml-model directory)
python predict_api.py
```

### 3. Development Mode

```bash
# Frontend development server
cd frontend && npm run dev

# Backend development server
cd backend && npm run dev
```

## 📊 Features

### Machine Learning Models
- **Linear Regression**: Baseline linear model
- **Ridge Regression**: L2 regularized linear model
- **Lasso Regression**: L1 regularized with feature selection
- **Random Forest**: Ensemble of decision trees
- **Gradient Boosting**: Advanced ensemble method

### Data Analysis
- **Time Series Analysis**: Daily, weekly, monthly, and seasonal patterns
- **Weather Correlations**: Relationship between weather and energy consumption
- **Statistical Insights**: Automated pattern discovery
- **Energy Efficiency Analysis**: Identification of optimization opportunities
- **Interactive Visualizations**: Dynamic charts and dashboards

### Generated Features
- Temperature effects (heating/cooling needs)
- Seasonal patterns (winter/summer peaks)
- Weekend vs weekday differences
- Humidity and solar radiation impacts
- Interaction terms (temperature × humidity)

## 📈 Expected Results

The system typically achieves:
- **Gradient Boosting R²**: ~0.886 (88.6% accuracy)
- **Random Forest R²**: ~0.876 (87.6% accuracy)
- **Linear Models R²**: ~0.852 (85.2% accuracy)
- **RMSE**: 120-150 kWh for synthetic data

## 🔧 Usage Examples

### Basic Prediction

```python
from energy_prediction import EnergyConsumptionPredictor

# Initialize predictor
predictor = EnergyConsumptionPredictor()

# Generate synthetic data (or load your own)
data = predictor.generate_synthetic_data(n_samples=1000)

# Prepare features and train models
X = predictor.prepare_features(data)
y = data['energy_consumption']

# Train all models
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
predictor.train_models(X_train, y_train)

# Evaluate and compare models
results = predictor.evaluate_models(X_test, y_test, X.columns.tolist())
print(results)
```

### Data Analysis

```python
from data_analysis import analyze_energy_data

# Perform comprehensive analysis
analyzer = analyze_energy_data(data)
```

## 📋 System Requirements

- **Python**: 3.8 or higher
- **Memory**: 2GB RAM minimum
- **Storage**: 100MB for dependencies
- **OS**: Windows, macOS, or Linux

## 🔬 Data Schema

The system expects/generates data with these columns:

| Column | Type | Description |
|--------|------|-------------|
| `date` | datetime | Date of measurement |
| `temperature` | float | Temperature in Celsius |
| `humidity` | float | Humidity percentage (0-100) |
| `wind_speed` | float | Wind speed in m/s |
| `solar_radiation` | float | Solar radiation in W/m² |
| `energy_consumption` | float | Daily energy consumption in kWh |
| `is_weekend` | int | 1 if weekend, 0 if weekday |
| `season` | string | Winter/Spring/Summer/Fall |

## 🎛️ Configuration Options

### Model Parameters
- Adjust `n_estimators` for Random Forest/Gradient Boosting
- Modify `alpha` values for Ridge/Lasso regularization
- Change `random_state` for reproducible results

### Data Generation
- Modify `n_samples` for dataset size
- Adjust `start_date` for different time periods
- Customize weather patterns in `_generate_energy_patterns()`

## 📊 Visualization Outputs

The system generates multiple visualizations:
1. **Time Series Plots**: Daily consumption patterns
2. **Correlation Heatmaps**: Feature relationships
3. **Feature Importance**: Model interpretability
4. **Prediction Accuracy**: Actual vs predicted scatter plots
5. **Distribution Analysis**: Statistical distributions
6. **Interactive Dashboards**: Dynamic exploration (with Plotly)

## 🚨 Troubleshooting

### Common Issues

1. **ImportError for seaborn-v0_8**: 
   ```bash
   pip install seaborn==0.11.2
   ```

2. **Matplotlib display issues**:
   ```bash
   # For headless systems
   import matplotlib
   matplotlib.use('Agg')
   ```

3. **Memory issues with large datasets**:
   - Reduce `n_samples` parameter
   - Use batch processing for very large datasets

## 🔮 Future Enhancements

- [ ] Real-time data ingestion
- [ ] Advanced time series models (ARIMA, LSTM)
- [ ] Automated hyperparameter tuning
- [ ] Integration with IoT sensors
- [ ] Web dashboard interface
- [ ] API endpoints for predictions
- [ ] Database integration
- [ ] Model deployment with Docker

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
- Check the troubleshooting section
- Review the code comments
- Create an issue with detailed error messages

---

**Happy Energy Predicting! 🔋⚡**
