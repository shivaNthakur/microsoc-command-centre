import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  attackType: 'XSS' | 'SQLi' | 'PortScan' | 'FailedLogin' | 'BruteForce' | 'DNSQuery' | 'ProcessInjection' | 'DataExfiltration';
  sourceIP: string;
  targetSystem: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  details: {
    userAgent?: string;
    method?: string;
    payload?: string;
    processName?: string;
    attemptCount?: number;
  };
  status: 'New' | 'Analyzed' | 'IncidentCreated';
  createdAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    attackType: { 
      type: String, 
      enum: ['XSS', 'SQLi', 'PortScan', 'FailedLogin', 'BruteForce', 'DNSQuery', 'ProcessInjection', 'DataExfiltration'],
      required: true,
      index: true 
    },
    sourceIP: { type: String, required: true, index: true },
    targetSystem: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
      index: true 
    },
    details: {
      userAgent: String,
      method: String,
      payload: String,
      processName: String,
      attemptCount: Number,
    },
    status: { type: String, enum: ['New', 'Analyzed', 'IncidentCreated'], default: 'New' },
  },
  { timestamps: false }
);

// Create compound index for efficient querying
logSchema.index({ timestamp: -1, severity: 1 });
logSchema.index({ sourceIP: 1, timestamp: -1 });

export default mongoose.models.Log || mongoose.model<ILog>('Log', logSchema);