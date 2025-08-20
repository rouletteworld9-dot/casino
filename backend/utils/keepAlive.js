

const https = require('https');
const http = require('http');

class KeepAliveService {
  constructor(url, intervalMinutes = 10) {
    this.url = url;
    this.interval = intervalMinutes * 60 * 1000; // Convert to milliseconds
    this.timer = null;
  }

  start() {
    console.log(`🔄 Starting keep-alive service for ${this.url}`);
    console.log(`⏰ Pinging every ${this.interval / 60000} minutes`);
    
    // Ping immediately
    this.ping();
    
    // Set up recurring pings
    this.timer = setInterval(() => {
      this.ping();
    }, this.interval);
  }

  ping() {
    const protocol = this.url.startsWith('https') ? https : http;
    const healthUrl = `${this.url}/health`;
    
    console.log(`🏓 Pinging: ${healthUrl}`);
    
    protocol.get(healthUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ Keep-alive ping successful - Instance: ${response.instanceId.slice(-8)}, Uptime: ${Math.round(response.uptime)}s`);
        } catch (e) {
          console.log(`✅ Keep-alive ping successful (raw response)`);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ Keep-alive ping failed: ${err.message}`);
    });
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('🛑 Keep-alive service stopped');
    }
  }
}

// Usage in your server.js:
// const keepAlive = new KeepAliveService(process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000');
// if (process.env.NODE_ENV === 'production') {
//   keepAlive.start();
// }

module.exports = KeepAliveService;