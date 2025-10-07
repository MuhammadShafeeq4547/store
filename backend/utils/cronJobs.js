const cron = require('node-cron');
const { cleanupOldActivities } = require('../middleware/activityTracker');
const { UserSession } = require('../models/UserActivity');

// Clean up old activities every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily cleanup of old activities...');
  const deletedCount = await cleanupOldActivities(365); // Keep 1 year
  console.log(`Cleaned up ${deletedCount} old activities`);
});

// Clean up inactive sessions every hour
cron.schedule('0 * * * *', async () => {
  console.log('Cleaning up inactive sessions...');
  
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const result = await UserSession.updateMany(
      {
        isActive: true,
        lastActivity: { $lt: oneHourAgo }
      },
      {
        isActive: false,
        logoutTime: new Date()
      }
    );
    
    console.log(`Deactivated ${result.modifiedCount} inactive sessions`);
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
});