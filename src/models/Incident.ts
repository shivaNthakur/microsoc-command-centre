import mongoose, { Schema, Document } from 'mongoose';

export type AttackType = 
  | 'sql_injection'
  | 'xss_attempt'
  | 'brute_force'
  | 'directory_scan'
  | 'dns_attack'
  | 'bot_detection'
  | 'sensitive_path_access'
  | 'threat_intelligence'
  | null;

export type SeverityLevel = 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type LogStatus = 'ALLOW' | 'WARN' | 'BLOCK';

export interface IAttackLog extends Document {
  ip: string;
  path: string;
  method: string;
  status: LogStatus;
  attack_type: AttackType;
  severity: SeverityLevel;
  timestamp: number; // Unix timestamp from Python
  reason: string;
  suggestion: string | null;
  is_blocked_now: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Additional fields for SOC tracking
  incident_id?: mongoose.Types.ObjectId;
  assigned_to?: mongoose.Types.ObjectId;
  resolved?: boolean;
}

const attackLogSchema = new Schema<IAttackLog>(
  {
    ip: { type: String, required: true, index: true },
    path: { type: String, required: true },
    method: { type: String, required: true, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] },
    status: { type: String, required: true, enum: ['ALLOW', 'WARN', 'BLOCK'], index: true },
    attack_type: { 
      type: String, 
      enum: [
        'sql_injection',
        'xss_attempt', 
        'brute_force',
        'directory_scan',
        'dns_attack',
        'bot_detection',
        'sensitive_path_access',
        'threat_intelligence',
        null
      ],
      default: null,
      index: true
    },
    severity: { 
      type: String, 
      required: true, 
      enum: ['NORMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      index: true
    },
    timestamp: { type: Number, required: true, index: true },
    reason: { type: String, required: true },
    suggestion: { type: String, default: null },
    is_blocked_now: { type: Boolean, default: false },
    
    // SOC fields
    incident_id: { type: Schema.Types.ObjectId, ref: 'Incident' },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
    resolved: { type: Boolean, default: false }
  },
  { 
    timestamps: true,
    // Optimize for real-time queries
    collection: 'attack_logs'
  }
);

// Indexes for dashboard queries
attackLogSchema.index({ timestamp: -1 }); // Latest first
attackLogSchema.index({ attack_type: 1, timestamp: -1 }); // Attack type trends
attackLogSchema.index({ ip: 1, timestamp: -1 }); // Per-IP analysis
attackLogSchema.index({ severity: 1, resolved: 1 }); // Unresolved critical alerts

const AttackLogModel = 
  (mongoose.models.AttackLog as mongoose.Model<IAttackLog>) || 
  mongoose.model<IAttackLog>('AttackLog', attackLogSchema);

export default AttackLogModel;


 









//import mongoose, { Schema, Document } from 'mongoose';

// export interface IIncident extends Document {
//   incidentID: string;
//   logIds: mongoose.Types.ObjectId[];
//   attackType: string;
//   severity: 'Low' | 'Medium' | 'High' | 'Critical';
//   status: 'Open' | 'In Progress' | 'Resolved';
//   assignedTo?: mongoose.Types.ObjectId;
//   assignedBy?: mongoose.Types.ObjectId;
//   sourceIP: string;
//   description: string;
//   notes: Array<{ analyst: mongoose.Types.ObjectId; note: string; timestamp: Date }>;
//   remediationSuggestions: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   resolvedAt?: Date;
// }

// const incidentSchema = new Schema<IIncident>(
//   {
//     incidentID: { type: String, unique: true, required: true, index: true },
//     logIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
//     attackType: { type: String, required: true },
//     severity: { 
//       type: String, 
//       enum: ['Low', 'Medium', 'High', 'Critical'],
//       required: true,
//       index: true 
//     },
//     status: { 
//       type: String, 
//       enum: ['Open', 'In Progress', 'Resolved'],
//       default: 'Open',
//       index: true 
//     },
//     assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     sourceIP: { type: String, required: true },
//     description: { type: String },
//     notes: [
//       {
//         analyst: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         note: String,
//         timestamp: { type: Date, default: Date.now },
//       },
//     ],
//     remediationSuggestions: [String],
//     resolvedAt: { type: Date },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Incident || mongoose.model<IIncident>('Incident', incidentSchema);