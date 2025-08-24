import nodemailer from 'nodemailer';

class AlertService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendAlert(email, type, data) {
    const templates = {
      high_consumption: {
        subject: '⚡ High Energy Consumption Alert',
        html: `
          <h2>Energy Consumption Alert</h2>
          <p>Your predicted energy consumption is <strong>${data.consumption} kWh</strong>, which is ${data.percentage}% above normal.</p>
          <p>Recommendations:</p>
          <ul>
            <li>Check AC temperature settings</li>
            <li>Turn off unused devices</li>
            <li>Consider peak hour usage</li>
          </ul>
        `
      },
      anomaly_detected: {
        subject: '🔍 Energy Usage Anomaly Detected',
        html: `
          <h2>Unusual Energy Pattern Detected</h2>
          <p>We detected an unusual energy consumption pattern on ${data.date}.</p>
          <p>Consumption: <strong>${data.consumption} kWh</strong></p>
          <p>Expected: <strong>${data.expected} kWh</strong></p>
        `
      },
      cost_threshold: {
        subject: '💰 Energy Cost Threshold Exceeded',
        html: `
          <h2>Cost Alert</h2>
          <p>Your estimated energy cost for today is <strong>$${data.cost}</strong>.</p>
          <p>This exceeds your threshold of $${data.threshold}.</p>
        `
      }
    };

    const template = templates[type];
    if (!template) return false;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: template.subject,
        html: template.html
      });
      return true;
    } catch (error) {
      console.error('Email send error:', error);
      return false;
    }
  }

  checkThresholds(prediction, userSettings) {
    const alerts = [];
    
    if (prediction.consumption > userSettings.highConsumptionThreshold) {
      alerts.push({
        type: 'high_consumption',
        data: {
          consumption: prediction.consumption,
          percentage: Math.round(((prediction.consumption - userSettings.normalConsumption) / userSettings.normalConsumption) * 100)
        }
      });
    }

    if (prediction.cost > userSettings.costThreshold) {
      alerts.push({
        type: 'cost_threshold',
        data: {
          cost: prediction.cost,
          threshold: userSettings.costThreshold
        }
      });
    }

    return alerts;
  }
}

export default new AlertService();