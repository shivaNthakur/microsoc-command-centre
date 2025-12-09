import { dbConnect } from '@/lib/dbConnect';
import IncidentModel from '@/models/Incident';
import { AttackLogModel } from '@/models/AttackLog';
import { createClient } from 'redis';

// Redis client for publishing incidents
let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    await redisClient.connect();
  }
  return redisClient;
}

// Incident detection rules (similar to attack branch rules)
interface IncidentRule {
  name: string;
  condition: (logs: any[], currentLog: any) => boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  attackType: string;
}

const INCIDENT_RULES: IncidentRule[] = [
  // Brute Force: 5+ failed login attempts from same IP
  {
    name: 'Brute Force Login Attempt',
    condition: (logs, currentLog) => {
      if (currentLog.attack_type !== 'brute_force') return false;
      const sameIPLogs = logs.filter(l => 
        l.ip === currentLog.ip && 
        l.attack_type === 'brute_force' &&
        l.timestamp >= currentLog.timestamp - 300 // Last 5 minutes
      );
      return sameIPLogs.length >= 5;
    },
    severity: 'High',
    attackType: 'brute_force'
  },
  
  // SQL Injection: Immediate incident
  {
    name: 'SQL Injection Attempt',
    condition: (logs, currentLog) => currentLog.attack_type === 'sql_injection',
    severity: 'High',
    attackType: 'sql_injection'
  },
  
  // XSS Attempt: Immediate incident
  {
    name: 'XSS Attack Attempt',
    condition: (logs, currentLog) => currentLog.attack_type === 'xss_attempt',
    severity: 'Medium',
    attackType: 'xss_attempt'
  },
  
  // Sensitive Path Access: Immediate incident
  {
    name: 'Sensitive Path Probing',
    condition: (logs, currentLog) => currentLog.attack_type === 'sensitive_path_access',
    severity: 'High',
    attackType: 'sensitive_path_access'
  },
  
  // Directory Scan: 10+ scans from same IP
  {
    name: 'Directory Enumeration Attack',
    condition: (logs, currentLog) => {
      if (currentLog.attack_type !== 'directory_scan') return false;
      const sameIPLogs = logs.filter(l => 
        l.ip === currentLog.ip && 
        l.attack_type === 'directory_scan' &&
        l.timestamp >= currentLog.timestamp - 600 // Last 10 minutes
      );
      return sameIPLogs.length >= 10;
    },
    severity: 'Medium',
    attackType: 'directory_scan'
  },
  
  // DoS Attack: 100+ requests in short time
  {
    name: 'DoS Attack Detected',
    condition: (logs, currentLog) => {
      if (currentLog.attack_type !== 'dns_attack') return false;
      const recentLogs = logs.filter(l => 
        l.timestamp >= currentLog.timestamp - 60 // Last minute
      );
      return recentLogs.length >= 100;
    },
    severity: 'Critical',
    attackType: 'dns_attack'
  },
  
  // Bot Traffic: 20+ bot requests
  {
    name: 'Bot Traffic Spike',
    condition: (logs, currentLog) => {
      if (currentLog.attack_type !== 'bot_detection') return false;
      const botLogs = logs.filter(l => 
        l.attack_type === 'bot_detection' &&
        l.timestamp >= currentLog.timestamp - 300 // Last 5 minutes
      );
      return botLogs.length >= 20;
    },
    severity: 'Medium',
    attackType: 'bot_detection'
  },
  
  // Critical severity attacks
  {
    name: 'Critical Security Threat',
    condition: (logs, currentLog) => currentLog.severity === 'CRITICAL',
    severity: 'Critical',
    attackType: 'unknown'
  }
];

/**
 * Check if an incident should be created for a new log
 */
export async function checkAndCreateIncident(logId: string, logData: any): Promise<void> {
  try {
    await dbConnect();
    
    // Get recent logs for pattern detection (last hour)
    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;
    const recentLogs = await AttackLogModel.find({
      timestamp: { $gte: oneHourAgo }
    }).lean();
    
    // Check each rule
    for (const rule of INCIDENT_RULES) {
      try {
        // Check if condition matches
        const matches = rule.condition(recentLogs, logData);
        
        if (matches) {
          // Determine attack type
          const attackType = rule.attackType === 'unknown' && logData.severity === 'CRITICAL'
            ? (logData.attack_type || 'unknown')
            : rule.attackType;
          
          // Check if incident already exists for this IP and attack type
          const existingIncident = await IncidentModel.findOne({
            sourceIP: logData.ip,
            attackType: attackType,
            status: { $in: ['Open', 'In Progress'] }
          });
          
          if (existingIncident) {
            // Update existing incident with new log
            if (!existingIncident.logIds.includes(logId as any)) {
              existingIncident.logIds.push(logId as any);
              await existingIncident.save();
            }
            
            // Publish update
            await publishIncidentToRedis({
              type: 'update',
              incident: existingIncident
            });
            
            console.log(`📝 Updated incident ${existingIncident.incidentID} with new log`);
            return; // Don't create duplicate
          }
          
          // Create new incident
          const incidentID = `INC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const newIncident = await IncidentModel.create({
            incidentID,
            logIds: [logId],
            attackType: attackType,
            severity: rule.severity,
            status: 'Open',
            sourceIP: logData.ip,
            description: `${rule.name} detected from IP ${logData.ip}. ${logData.reason || ''}`,
            remediationSuggestions: logData.suggestion ? [logData.suggestion] : []
          });
          
          // Link log to incident
          await AttackLogModel.findByIdAndUpdate(logId, {
            incident_id: newIncident._id
          });
          
          // Publish to Redis
          await publishIncidentToRedis({
            type: 'create',
            incident: newIncident
          });
          
          console.log(`🔥 INCIDENT CREATED: ${rule.name} - ${incidentID}`);
          return; // Only create one incident per log
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in incident detection:', error);
  }
}

/**
 * Publish incident to Redis for real-time updates
 */
async function publishIncidentToRedis(data: { type: 'create' | 'update'; incident: any }): Promise<void> {
  try {
    const redis = await getRedisClient();
    const incidentData = {
      ...data.incident.toObject ? data.incident.toObject() : data.incident,
      _id: data.incident._id?.toString() || data.incident._id,
      logIds: data.incident.logIds?.map((id: any) => id.toString()) || []
    };
    
    await redis.publish('soc:incidents', JSON.stringify(incidentData));
    console.log(`📤 Published incident to Redis: ${data.incident.incidentID}`);
  } catch (error) {
    console.error('Error publishing incident to Redis:', error);
  }
}

