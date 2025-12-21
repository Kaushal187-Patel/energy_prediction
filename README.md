# Energy Consumption Prediction Project

A comprehensive machine learning system for predicting energy consumption based on temporal factors, weather conditions, and household characteristics. This project helps users optimize energy usage, reduce costs, and manage resources more sustainably.

## 🎯 Project Overview

This project implements regression and machine learning models to predict daily power consumption using:

- **Temporal factors**: time of day, day of week, seasonal patterns
- **Weather data**: temperature, humidity, wind speed, solar radiation
- **Household data**: household size, appliance types, usage patterns
- **Multiple ML algorithms**: Linear Regression, Random Forest, K-Nearest Neighbors

## 📁 Project Structure

```
energy-prediction/
├── frontend/          # React + TypeScript + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── about/        # About page components
│   │   │   ├── ui/           # UI components (shadcn/ui)
│   │   │   ├── AdvancedAnalytics.tsx
│   │   │   ├── CostOptimization.tsx
│   │   │   ├── RealTimeMonitoring.tsx
│   │   │   └── Navigation.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Predict.tsx
│   │   │   ├── About.tsx
│   │   │   └── Team.tsx
│   │   └── ...
│   ├── public/
│   │   ├── data/
│   │   │   └── energy_dataset.csv
│   │   └── TeamImage/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── server.js
│   │   └── services/
│   │       ├── analyticsService.js
│   │       ├── alertService.js
│   │       └── weatherService.js
│   ├── package.json
│   ├── database_schema.sql
│   └── .env
├── ml-model/          # ML model code
│   ├── *.pkl         # Trained models
│   ├── predict_api.py
│   ├── train_models.py
│   ├── advanced_models.py
│   └── requirements.txt
├── mobile-app/        # React Native app (optional)
│   └── ...
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **PostgreSQL**: 12+ (for database)
- **npm** or **yarn** (package manager)

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd "energy pridiction"

# Install Frontend Dependencies
cd frontend
npm install

# Install Backend Dependencies
cd ../backend
npm install

# Install ML Model Dependencies
cd ../ml-model
pip install -r requirements.txt
```

### 2. Database Setup

1. Install PostgreSQL and create a database:

```sql
CREATE DATABASE energyai;
```

2. Update backend `.env` file with your database credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/energyai
JWT_SECRET=your_jwt_secret_key
WEATHER_API_KEY=your_openweather_api_key
```

3. Run the database schema:

```bash
cd backend
psql -U postgres -d energyai -f database_schema.sql
```

### 3. Start All Services

**Terminal 1 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

**Terminal 2 - Backend:**

```bash
cd backend
npm start
```

Backend will run on `http://localhost:3001`

**Terminal 3 - ML Model API:**

```bash
cd ml-model
python predict_api.py
```

ML API will run on `http://localhost:5000`

## 📊 Features

### 🤖 Machine Learning Models

- **Linear Regression**: Baseline model with 85.2% accuracy
- **Random Forest**: Ensemble model with 87.6% accuracy
- **K-Nearest Neighbors**: Non-parametric model for pattern recognition
- **Feature Engineering**: Automatic feature extraction from temporal and weather data

### 📱 Web Application Features

- **Interactive Dashboard**: Real-time energy consumption monitoring with charts
- **Prediction Interface**: User-friendly form to input parameters and get predictions
- **Real-Time Monitoring**: Live updates of energy consumption data
- **Advanced Analytics**: Detailed insights and pattern analysis
- **Cost Optimization**: Time-of-use analysis and savings recommendations
- **Weather Integration**: Real-time weather data for accurate predictions
- **User Authentication**: Secure login and profile management

### 📈 Analytics & Visualization

- **Weekly Consumption Charts**: Bar charts showing daily energy usage
- **Monthly Trends**: Prediction vs actual consumption comparison
- **Appliance Breakdown**: Pie charts showing energy usage by appliance
- **Cost Analysis**: Daily costs and savings visualization
- **Efficiency Scoring**: Performance benchmarking metrics

### 🌍 Sustainability Features

- **Carbon Footprint Tracking**: CO2 emissions calculation
- **Energy Savings Tips**: Personalized recommendations
- **Peak Hours Analysis**: Optimal usage time suggestions

## 📈 Model Performance

The system achieves the following accuracy metrics:

- **Random Forest R²**: ~0.876 (87.6% accuracy)
- **Linear Regression R²**: ~0.852 (85.2% accuracy)
- **KNN Model**: Comparable performance for pattern recognition

## 🔧 Technology Stack

### Frontend

- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **React Router**: Client-side routing
- **shadcn/ui**: High-quality UI components
- **Socket.io Client**: Real-time data updates

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **Socket.io**: WebSocket for real-time communication
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Nodemailer**: Email notifications

### Machine Learning

- **Python 3.8+**: Programming language
- **Scikit-learn**: ML algorithms (Linear Regression, Random Forest, KNN)
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Flask**: ML model API server
- **Pickle**: Model serialization

### Data

- **Kaggle Datasets**: Real-world energy consumption data
- **CSV Processing**: Data import and feature engineering
- **Weather API**: OpenWeatherMap integration

## 📋 Dataset Information

The project uses real-world energy consumption data from Kaggle:

- **Source**: Household Power Consumption Dataset
- **Features**:
  - Date and Time
  - Outdoor Temperature
  - Household Size
  - Appliance Type
  - Season
  - Energy Consumption (kWh)
- **Format**: CSV
- **Processing**: Real-time feature engineering and preprocessing

## 🎛️ Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/energyai
JWT_SECRET=your_jwt_secret_key

# Weather API
WEATHER_API_KEY=your_openweather_api_key

# Email (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### ML Model Configuration

Models are trained using:

- **Train/Test Split**: 80/20
- **Feature Engineering**: Automatic temporal and categorical encoding
- **Model Persistence**: Saved as `.pkl` files for fast loading

## 📱 Pages & Routes

- **Home** (`/`): Landing page with features and stats
- **Dashboard** (`/dashboard`): Main analytics dashboard
- **Predict** (`/predict`): Energy consumption prediction interface
- **About** (`/about`): Project information and methodology
- **Team** (`/team`): Team members information
- **Profile** (`/profile`): User profile management

## 👥 Team

- **Kaushal**: Lead Developer - ML Engineering & Full Stack Development
- **Bansi**: Data Scientist - Energy Analytics & Predictive Modeling
- **Drashti**: ML Engineer - Model Optimization & Deployment
- **Hasti**: Business Analyst - Energy Domain & Strategy

## 🔬 API Endpoints

### Backend API (Port 3001)

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/analytics` - Analytics data
- `GET /api/weather` - Weather data
- `POST /api/predictions` - Save predictions
- WebSocket: Real-time data updates

### ML Model API (Port 5000)

- `POST /predict` - Get energy consumption prediction
- `GET /health` - ML API health check

## 🚨 Troubleshooting

### Installation Issues

1. **Node.js version conflicts**:

   ```bash
   nvm install 18
   nvm use 18
   ```

2. **Python dependency conflicts**:

   ```bash
   python -m venv energy_ai_env
   energy_ai_env\Scripts\activate  # Windows
   source energy_ai_env/bin/activate  # Linux/Mac
   pip install -r requirements.txt
   ```

3. **PostgreSQL connection issues**:
   - Ensure PostgreSQL is running
   - Check database credentials in `.env` file
   - Verify firewall settings

### Runtime Issues

4. **CORS errors**:

   - Check CORS settings in `backend/src/server.js`
   - Verify frontend URL in allowed origins

5. **ML model loading errors**:

   ```bash
   cd ml-model
   python train_models.py
   ```

6. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check connection string in `.env`
   - Ensure database exists

## ✅ Implemented Features

- [x] **User Authentication**: Registration and login system
- [x] **Energy Prediction**: ML-based consumption forecasting
- [x] **Real-time Dashboard**: Live monitoring with charts
- [x] **Advanced Analytics**: Pattern analysis and insights
- [x] **Cost Optimization**: Savings recommendations
- [x] **Weather Integration**: Real-time weather data
- [x] **Interactive Visualizations**: Charts and graphs
- [x] **Responsive Design**: Mobile-friendly interface
- [x] **Dark Mode**: Theme switching support
- [x] **Team Page**: Team member information
- [x] **About Page**: Project documentation

## 🔮 Future Enhancements

- [ ] **Mobile App**: Full React Native implementation
- [ ] **Advanced ML Models**: Neural networks, LSTM, Prophet
- [ ] **Export Functionality**: PDF/CSV report generation
- [ ] **Email Notifications**: Automated alerts
- [ ] **Multi-tenant Support**: Organization-level management
- [ ] **IoT Integration**: Smart meter connectivity
- [ ] **Edge Computing**: Local processing capabilities

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or contributions:

- Create a GitHub issue
- Contact the development team
- Check the documentation in the codebase

---

**Happy Energy Predicting! 🔋⚡**
