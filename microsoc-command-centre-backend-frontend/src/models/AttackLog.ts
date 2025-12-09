import mongoose, { Schema, Document } from 'mongoose';

export interface IAttackLog extends Document {
  ip: string;
  path: string;
  method: string;
  status: 'ALLOW' | 'WARN' | 'BLOCK';
  attack_type: string | null;
  severity: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
  reason: string;
  suggestion: string | null;
  is_blocked_now: boolean;
  createdAt: Date;
}

const attackLogSchema = new Schema<IAttackLog>({
  ip: { type: String, required: true, index: true },
  path: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: String, required: true, enum: ['ALLOW', 'WARN', 'BLOCK'] },
  attack_type: { type: String, default: null, index: true },
  severity: { type: String, required: true, enum: ['NORMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
  timestamp: { type: Number, required: true, index: true },
  reason: { type: String, required: true },
  suggestion: { type: String, default: null },
  is_blocked_now: { type: Boolean, default: false }
}, { timestamps: true });

export const AttackLogModel = mongoose.models.AttackLog || mongoose.model('AttackLog', attackLogSchema);

// models/Attack.ts - Aggregated attack data
export interface IAttack extends Document {
  attack_type: string;
  total_count: number;
  blocked_count: number;
  warned_count: number;
  unique_ips: string[];
  first_seen: number;
  last_seen: number;
  severity_distribution: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    NORMAL: number;
  };
}

const attackSchema = new Schema<IAttack>({
  attack_type: { type: String, required: true, unique: true },
  total_count: { type: Number, default: 0 },
  blocked_count: { type: Number, default: 0 },
  warned_count: { type: Number, default: 0 },
  unique_ips: [{ type: String }],
  first_seen: { type: Number, required: true },
  last_seen: { type: Number, required: true },
  severity_distribution: {
    CRITICAL: { type: Number, default: 0 },
    HIGH: { type: Number, default: 0 },
    MEDIUM: { type: Number, default: 0 },
    LOW: { type: Number, default: 0 },
    NORMAL: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const AttackModel = mongoose.models.Attack || mongoose.model('Attack', attackSchema);







// import mongoose, { Schema, Document } from 'mongoose';

// export interface ILog extends Document {
//   timestamp: Date;
//   attackType: 'XSS' | 'SQLi' | 'PortScan' | 'FailedLogin' | 'BruteForce' | 'DNSQuery' | 'ProcessInjection' | 'DataExfiltration';
//   sourceIP: string;
//   targetSystem: string;
//   severity: 'Low' | 'Medium' | 'High' | 'Critical';
//   details: {
//     userAgent?: string;
//     method?: string;
//     payload?: string;
//     processName?: string;
//     attemptCount?: number;
//   };
//   status: 'New' | 'Analyzed' | 'IncidentCreated';
//   createdAt: Date;
// }

// const logSchema = new Schema<ILog>(
//   {
//     timestamp: { type: Date, default: Date.now, index: true },
//     attackType: { 
//       type: String, 
//       enum: ['XSS', 'SQLi', 'PortScan', 'FailedLogin', 'BruteForce', 'DNSQuery', 'ProcessInjection', 'DataExfiltration'],
//       required: true,
//       index: true 
//     },
//     sourceIP: { type: String, required: true, index: true },
//     targetSystem: { type: String, required: true },
//     severity: { 
//       type: String, 
//       enum: ['Low', 'Medium', 'High', 'Critical'],
//       required: true,
//       index: true 
//     },
//     details: {
//       userAgent: String,
//       method: String,
//       payload: String,
//       processName: String,
//       attemptCount: Number,
//     },
//     status: { type: String, enum: ['New', 'Analyzed', 'IncidentCreated'], default: 'New' },
//   },
//   { timestamps: false }
// );

// // Create compound index for efficient querying
// logSchema.index({ timestamp: -1, severity: 1 });
// logSchema.index({ sourceIP: 1, timestamp: -1 });

// export default mongoose.models.Log || mongoose.model<ILog>('Log', logSchema);