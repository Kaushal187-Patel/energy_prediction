import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

interface EnergyData {
  consumption: number;
  cost: number;
  efficiency: number;
  carbonFootprint: number;
}

const DashboardScreen: React.FC = () => {
  const [data, setData] = useState<EnergyData>({
    consumption: 0,
    cost: 0,
    efficiency: 0,
    carbonFootprint: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [12.5, 15.2, 11.8, 14.6, 16.3, 18.7, 17.2],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#1F2937',
    backgroundGradientFrom: '#1F2937',
    backgroundGradientTo: '#374151',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10B981',
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Simulate API call
    setTimeout(() => {
      setData({
        consumption: 268,
        cost: 32.15,
        efficiency: 87,
        carbonFootprint: 145,
      });
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Energy Dashboard</Text>
        <Text style={styles.subtitle}>Monitor your energy consumption</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.consumption} kWh</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${data.cost}</Text>
          <Text style={styles.statLabel}>Cost Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.efficiency}%</Text>
          <Text style={styles.statLabel}>Efficiency</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{data.carbonFootprint} lbs</Text>
          <Text style={styles.statLabel}>CO₂ Reduced</Text>
        </View>
      </View>

      {/* Weekly Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Consumption</Text>
        <LineChart
          data={weeklyData}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>Predict Usage</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionText}>View Insights</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: '1%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  chartContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DashboardScreen;