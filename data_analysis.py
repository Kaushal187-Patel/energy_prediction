"""
Energy Consumption Data Analysis Module
======================================

This module provides comprehensive data analysis and visualization capabilities
for energy consumption data, helping to understand patterns and relationships.

Author: AI Assistant
Date: 2025-07-24
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

class EnergyDataAnalyzer:
    """
    Comprehensive energy consumption data analyzer with visualization capabilities.
    """
    
    def __init__(self, data):
        """
        Initialize the analyzer with energy consumption data.
        
        Parameters:
        -----------
        data : pd.DataFrame
            Energy consumption dataset
        """
        self.data = data.copy()
        self.setup_plotting()
    
    def setup_plotting(self):
        """Setup plotting parameters for consistent visualizations."""
        plt.style.use('seaborn-v0_8')
        sns.set_palette("husl")
        
        # Set default figure parameters
        plt.rcParams['figure.figsize'] = (12, 8)
        plt.rcParams['font.size'] = 10
        plt.rcParams['axes.titlesize'] = 14
        plt.rcParams['axes.labelsize'] = 12
    
    def basic_statistics(self):
        """Generate basic statistical summary of the data."""
        print("=" * 60)
        print("BASIC STATISTICAL SUMMARY")
        print("=" * 60)
        
        # Dataset overview
        print(f"Dataset Shape: {self.data.shape}")
        print(f"Date Range: {self.data['date'].min()} to {self.data['date'].max()}")
        print(f"Total Days: {len(self.data)}")
        
        # Energy consumption statistics
        energy_stats = self.data['energy_consumption'].describe()
        print(f"\nEnergy Consumption Statistics:")
        print(energy_stats)
        
        # Missing values
        missing_values = self.data.isnull().sum()
        print(f"\nMissing Values:")
        print(missing_values[missing_values > 0])
        
        # Correlation analysis
        numeric_columns = self.data.select_dtypes(include=[np.number]).columns
        correlation_matrix = self.data[numeric_columns].corr()
        
        print(f"\nTop Correlations with Energy Consumption:")
        energy_corr = correlation_matrix['energy_consumption'].sort_values(
            ascending=False, key=abs
        )[1:]  # Exclude self-correlation
        print(energy_corr.head(10))
        
        return energy_stats, correlation_matrix
    
    def plot_time_series(self):
        """Plot time series of energy consumption."""
        fig, axes = plt.subplots(2, 2, figsize=(16, 12))
        
        # Daily consumption
        axes[0, 0].plot(self.data['date'], self.data['energy_consumption'], 
                       alpha=0.7, linewidth=0.8)
        axes[0, 0].set_title('Daily Energy Consumption')
        axes[0, 0].set_xlabel('Date')
        axes[0, 0].set_ylabel('Energy Consumption (kWh)')
        axes[0, 0].tick_params(axis='x', rotation=45)
        
        # Monthly average
        monthly_avg = self.data.groupby(self.data['date'].dt.to_period('M'))['energy_consumption'].mean()
        axes[0, 1].plot(monthly_avg.index.astype(str), monthly_avg.values, 
                       marker='o', linewidth=2)
        axes[0, 1].set_title('Monthly Average Energy Consumption')
        axes[0, 1].set_xlabel('Month')
        axes[0, 1].set_ylabel('Average Energy Consumption (kWh)')
        axes[0, 1].tick_params(axis='x', rotation=45)
        
        # Weekly pattern
        weekly_pattern = self.data.groupby('day_of_week')['energy_consumption'].mean()
        day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        axes[1, 0].bar(day_names, weekly_pattern.values)
        axes[1, 0].set_title('Average Energy Consumption by Day of Week')
        axes[1, 0].set_xlabel('Day of Week')
        axes[1, 0].set_ylabel('Average Energy Consumption (kWh)')
        
        # Seasonal pattern
        seasonal_pattern = self.data.groupby('season')['energy_consumption'].mean()
        axes[1, 1].bar(seasonal_pattern.index, seasonal_pattern.values)
        axes[1, 1].set_title('Average Energy Consumption by Season')
        axes[1, 1].set_xlabel('Season')
        axes[1, 1].set_ylabel('Average Energy Consumption (kWh)')
        
        plt.tight_layout()
        plt.show()
    
    def plot_weather_relationships(self):
        """Plot relationships between weather variables and energy consumption."""
        fig, axes = plt.subplots(2, 2, figsize=(16, 12))
        
        # Temperature vs Energy
        axes[0, 0].scatter(self.data['temperature'], self.data['energy_consumption'], 
                          alpha=0.5, s=20)
        z = np.polyfit(self.data['temperature'], self.data['energy_consumption'], 2)
        p = np.poly1d(z)
        temp_range = np.linspace(self.data['temperature'].min(), 
                                self.data['temperature'].max(), 100)
        axes[0, 0].plot(temp_range, p(temp_range), "r--", alpha=0.8, linewidth=2)
        axes[0, 0].set_title('Temperature vs Energy Consumption')
        axes[0, 0].set_xlabel('Temperature (°C)')
        axes[0, 0].set_ylabel('Energy Consumption (kWh)')
        
        # Humidity vs Energy
        axes[0, 1].scatter(self.data['humidity'], self.data['energy_consumption'], 
                          alpha=0.5, s=20)
        z = np.polyfit(self.data['humidity'], self.data['energy_consumption'], 1)
        p = np.poly1d(z)
        humidity_range = np.linspace(self.data['humidity'].min(), 
                                   self.data['humidity'].max(), 100)
        axes[0, 1].plot(humidity_range, p(humidity_range), "r--", alpha=0.8, linewidth=2)
        axes[0, 1].set_title('Humidity vs Energy Consumption')
        axes[0, 1].set_xlabel('Humidity (%)')
        axes[0, 1].set_ylabel('Energy Consumption (kWh)')
        
        # Solar Radiation vs Energy
        axes[1, 0].scatter(self.data['solar_radiation'], self.data['energy_consumption'], 
                          alpha=0.5, s=20)
        z = np.polyfit(self.data['solar_radiation'], self.data['energy_consumption'], 1)
        p = np.poly1d(z)
        solar_range = np.linspace(self.data['solar_radiation'].min(), 
                                 self.data['solar_radiation'].max(), 100)
        axes[1, 0].plot(solar_range, p(solar_range), "r--", alpha=0.8, linewidth=2)
        axes[1, 0].set_title('Solar Radiation vs Energy Consumption')
        axes[1, 0].set_xlabel('Solar Radiation (W/m²)')
        axes[1, 0].set_ylabel('Energy Consumption (kWh)')
        
        # Wind Speed vs Energy
        axes[1, 1].scatter(self.data['wind_speed'], self.data['energy_consumption'], 
                          alpha=0.5, s=20)
        z = np.polyfit(self.data['wind_speed'], self.data['energy_consumption'], 1)
        p = np.poly1d(z)
        wind_range = np.linspace(self.data['wind_speed'].min(), 
                                self.data['wind_speed'].max(), 100)
        axes[1, 1].plot(wind_range, p(wind_range), "r--", alpha=0.8, linewidth=2)
        axes[1, 1].set_title('Wind Speed vs Energy Consumption')
        axes[1, 1].set_xlabel('Wind Speed (m/s)')
        axes[1, 1].set_ylabel('Energy Consumption (kWh)')
        
        plt.tight_layout()
        plt.show()
    
    def plot_correlation_heatmap(self):
        """Plot correlation heatmap of all numeric variables."""
        # Select numeric columns only
        numeric_data = self.data.select_dtypes(include=[np.number])
        
        # Calculate correlation matrix
        correlation_matrix = numeric_data.corr()
        
        # Create heatmap
        plt.figure(figsize=(14, 10))
        mask = np.triu(np.ones_like(correlation_matrix, dtype=bool))
        sns.heatmap(correlation_matrix, mask=mask, annot=True, cmap='coolwarm', 
                   center=0, square=True, fmt='.2f', cbar_kws={"shrink": .8})
        plt.title('Correlation Heatmap of Energy Consumption Variables')
        plt.tight_layout()
        plt.show()
    
    def plot_distribution_analysis(self):
        """Analyze and plot distributions of key variables."""
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        
        # Energy consumption distribution
        axes[0, 0].hist(self.data['energy_consumption'], bins=50, alpha=0.7, edgecolor='black')
        axes[0, 0].set_title('Energy Consumption Distribution')
        axes[0, 0].set_xlabel('Energy Consumption (kWh)')
        axes[0, 0].set_ylabel('Frequency')
        
        # Temperature distribution
        axes[0, 1].hist(self.data['temperature'], bins=50, alpha=0.7, edgecolor='black')
        axes[0, 1].set_title('Temperature Distribution')
        axes[0, 1].set_xlabel('Temperature (°C)')
        axes[0, 1].set_ylabel('Frequency')
        
        # Humidity distribution
        axes[0, 2].hist(self.data['humidity'], bins=50, alpha=0.7, edgecolor='black')
        axes[0, 2].set_title('Humidity Distribution')
        axes[0, 2].set_xlabel('Humidity (%)')
        axes[0, 2].set_ylabel('Frequency')
        
        # Box plots for seasonal comparison
        self.data.boxplot(column='energy_consumption', by='season', ax=axes[1, 0])
        axes[1, 0].set_title('Energy Consumption by Season')
        axes[1, 0].set_xlabel('Season')
        axes[1, 0].set_ylabel('Energy Consumption (kWh)')
        
        # Weekend vs weekday comparison
        weekend_data = [
            self.data[self.data['is_weekend'] == 0]['energy_consumption'],
            self.data[self.data['is_weekend'] == 1]['energy_consumption']
        ]
        axes[1, 1].boxplot(weekend_data, labels=['Weekday', 'Weekend'])
        axes[1, 1].set_title('Energy Consumption: Weekday vs Weekend')
        axes[1, 1].set_ylabel('Energy Consumption (kWh)')
        
        # Q-Q plot for normality check
        stats.probplot(self.data['energy_consumption'], dist="norm", plot=axes[1, 2])
        axes[1, 2].set_title('Q-Q Plot: Energy Consumption Normality')
        
        plt.tight_layout()
        plt.show()
    
    def plot_interactive_dashboard(self):
        """Create an interactive dashboard using Plotly."""
        # Create subplots
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Energy Consumption Over Time', 
                          'Temperature vs Energy Consumption',
                          'Monthly Average Consumption', 
                          'Seasonal Patterns'),
            specs=[[{"secondary_y": True}, {"type": "scatter"}],
                   [{"type": "bar"}, {"type": "bar"}]]
        )
        
        # Time series plot
        fig.add_trace(
            go.Scatter(
                x=self.data['date'], 
                y=self.data['energy_consumption'],
                mode='lines',
                name='Energy Consumption',
                line=dict(color='blue', width=1)
            ),
            row=1, col=1
        )
        
        # Temperature overlay
        fig.add_trace(
            go.Scatter(
                x=self.data['date'], 
                y=self.data['temperature'],
                mode='lines',
                name='Temperature',
                line=dict(color='red', width=1),
                yaxis='y2'
            ),
            row=1, col=1, secondary_y=True
        )
        
        # Temperature vs Energy scatter
        fig.add_trace(
            go.Scatter(
                x=self.data['temperature'], 
                y=self.data['energy_consumption'],
                mode='markers',
                name='Temp vs Energy',
                marker=dict(size=4, opacity=0.6)
            ),
            row=1, col=2
        )
        
        # Monthly averages
        monthly_avg = self.data.groupby(self.data['date'].dt.month)['energy_consumption'].mean()
        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        fig.add_trace(
            go.Bar(
                x=month_names, 
                y=monthly_avg.values,
                name='Monthly Average',
                marker_color='lightblue'
            ),
            row=2, col=1
        )
        
        # Seasonal patterns
        seasonal_avg = self.data.groupby('season')['energy_consumption'].mean()
        fig.add_trace(
            go.Bar(
                x=seasonal_avg.index, 
                y=seasonal_avg.values,
                name='Seasonal Average',
                marker_color='lightgreen'
            ),
            row=2, col=2
        )
        
        # Update layout
        fig.update_layout(
            height=800,
            title_text="Energy Consumption Interactive Dashboard",
            showlegend=True
        )
        
        # Update y-axis titles
        fig.update_yaxes(title_text="Energy Consumption (kWh)", row=1, col=1)
        fig.update_yaxes(title_text="Temperature (°C)", secondary_y=True, row=1, col=1)
        
        fig.show()
    
    def generate_insights(self):
        """Generate data-driven insights about energy consumption patterns."""
        print("=" * 60)
        print("DATA-DRIVEN INSIGHTS")
        print("=" * 60)
        
        insights = []
        
        # Seasonal analysis
        seasonal_avg = self.data.groupby('season')['energy_consumption'].mean()
        max_season = seasonal_avg.idxmax()
        min_season = seasonal_avg.idxmin()
        seasonal_diff = seasonal_avg.max() - seasonal_avg.min()
        
        insights.append(f"• Highest energy consumption occurs in {max_season} "
                       f"({seasonal_avg[max_season]:.1f} kWh)")
        insights.append(f"• Lowest energy consumption occurs in {min_season} "
                       f"({seasonal_avg[min_season]:.1f} kWh)")
        insights.append(f"• Seasonal variation: {seasonal_diff:.1f} kWh difference")
        
        # Weekend vs weekday analysis
        weekday_avg = self.data[self.data['is_weekend'] == 0]['energy_consumption'].mean()
        weekend_avg = self.data[self.data['is_weekend'] == 1]['energy_consumption'].mean()
        weekend_diff = ((weekend_avg - weekday_avg) / weekday_avg) * 100
        
        if weekend_diff > 0:
            insights.append(f"• Weekend consumption is {abs(weekend_diff):.1f}% higher than weekdays")
        else:
            insights.append(f"• Weekend consumption is {abs(weekend_diff):.1f}% lower than weekdays")
        
        # Temperature correlation
        temp_corr = self.data['temperature'].corr(self.data['energy_consumption'])
        if abs(temp_corr) > 0.5:
            direction = "positive" if temp_corr > 0 else "negative"
            insights.append(f"• Strong {direction} correlation with temperature (r={temp_corr:.3f})")
        
        # Optimal temperature range
        temp_bins = pd.cut(self.data['temperature'], bins=10)
        temp_consumption = self.data.groupby(temp_bins)['energy_consumption'].mean()
        optimal_temp_range = temp_consumption.idxmin()
        insights.append(f"• Lowest energy consumption at temperature range: {optimal_temp_range}")
        
        # Peak consumption analysis
        peak_consumption = self.data['energy_consumption'].quantile(0.95)
        peak_days = self.data[self.data['energy_consumption'] >= peak_consumption]
        peak_season = peak_days['season'].mode().iloc[0]
        insights.append(f"• 95th percentile consumption: {peak_consumption:.1f} kWh")
        insights.append(f"• Most high-consumption days occur in {peak_season}")
        
        # Print insights
        for insight in insights:
            print(insight)
        
        return insights
    
    def energy_efficiency_analysis(self):
        """Analyze energy efficiency patterns and opportunities."""
        print("\n" + "=" * 60)
        print("ENERGY EFFICIENCY ANALYSIS")
        print("=" * 60)
        
        # Calculate efficiency metrics
        daily_avg = self.data['energy_consumption'].mean()
        daily_std = self.data['energy_consumption'].std()
        
        # Identify high and low consumption days
        high_consumption_threshold = daily_avg + daily_std
        low_consumption_threshold = daily_avg - daily_std
        
        high_days = self.data[self.data['energy_consumption'] > high_consumption_threshold]
        low_days = self.data[self.data['energy_consumption'] < low_consumption_threshold]
        
        print(f"Average daily consumption: {daily_avg:.1f} kWh")
        print(f"High consumption days (>{high_consumption_threshold:.1f} kWh): {len(high_days)} days")
        print(f"Low consumption days (<{low_consumption_threshold:.1f} kWh): {len(low_days)} days")
        
        # Analyze conditions during high/low consumption
        print(f"\nHigh consumption days characteristics:")
        print(f"  Average temperature: {high_days['temperature'].mean():.1f}°C")
        print(f"  Average humidity: {high_days['humidity'].mean():.1f}%")
        print(f"  Most common season: {high_days['season'].mode().iloc[0]}")
        
        print(f"\nLow consumption days characteristics:")
        print(f"  Average temperature: {low_days['temperature'].mean():.1f}°C")
        print(f"  Average humidity: {low_days['humidity'].mean():.1f}%")
        print(f"  Most common season: {low_days['season'].mode().iloc[0]}")
        
        # Potential savings calculation
        potential_savings = (high_days['energy_consumption'].mean() - daily_avg) * len(high_days)
        print(f"\nPotential annual savings if high-consumption days matched average: {potential_savings:.0f} kWh")
        print(f"This represents {(potential_savings / self.data['energy_consumption'].sum()) * 100:.1f}% of total consumption")

def analyze_energy_data(data):
    """
    Main function to perform comprehensive energy data analysis.
    
    Parameters:
    -----------
    data : pd.DataFrame
        Energy consumption dataset
    """
    analyzer = EnergyDataAnalyzer(data)
    
    # Perform all analyses
    analyzer.basic_statistics()
    analyzer.plot_time_series()
    analyzer.plot_weather_relationships()
    analyzer.plot_correlation_heatmap()
    analyzer.plot_distribution_analysis()
    analyzer.generate_insights()
    analyzer.energy_efficiency_analysis()
    
    # Try to create interactive dashboard (requires plotly)
    try:
        analyzer.plot_interactive_dashboard()
    except ImportError:
        print("\nNote: Install plotly for interactive dashboard: pip install plotly")
    
    return analyzer

if __name__ == "__main__":
    # This would normally be run with actual data
    print("This module is designed to be imported and used with energy consumption data.")
    print("Usage: analyzer = analyze_energy_data(your_dataframe)")
