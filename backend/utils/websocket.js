const WebSocket = require('ws');
const { getLiveActivityFeed } = require('../middleware/activityTracker');

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    console.log('Admin connected to activity feed');

    // Send initial activity feed
    getLiveActivityFeed(20).then(activities => {
      ws.send(JSON.stringify({
        type: 'initial_feed',
        data: activities
      }));
    });

    ws.on('close', () => {
      console.log('Admin disconnected from activity feed');
    });
  });

  // Send live updates every 30 seconds
  setInterval(async () => {
    if (wss.clients.size > 0) {
      const activities = await getLiveActivityFeed(10);
      
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'live_update',
            data: activities
          }));
        }
      });
    }
  }, 30000);
};

const broadcastActivity = (activity) => {
  if (wss && wss.clients.size > 0) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'new_activity',
          data: activity
        }));
      }
    });
  }
};

module.exports = {
  initializeWebSocket,
  broadcastActivity
};