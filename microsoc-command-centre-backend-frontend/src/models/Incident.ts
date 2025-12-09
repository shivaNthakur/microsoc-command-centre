

import mongoose, { Schema, Document } from 'mongoose';

export interface IIncident extends Document {
  incidentID: string;
  logIds: mongoose.Types.ObjectId[];
  attackType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: mongoose.Types.ObjectId;
  assignedBy?: mongoose.Types.ObjectId;
  sourceIP: string;
  description: string;
  notes: Array<{ analyst: mongoose.Types.ObjectId; note: string; timestamp: Date }>;
  remediationSuggestions: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const incidentSchema = new Schema<IIncident>(
  {
    incidentID: { type: String, unique: true, required: true, index: true },
    logIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AttackLog' }],
    attackType: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
      index: true 
    },
    status: { 
      type: String, 
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
      index: true 
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sourceIP: { type: String, required: true },
    description: { type: String },
    notes: [
      {
        analyst: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    remediationSuggestions: [String],
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

const IncidentModel = mongoose.models.Incident || mongoose.model<IIncident>('Incident', incidentSchema);

export default IncidentModel;