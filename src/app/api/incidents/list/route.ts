import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import IncidentModel from '@/models/Incident';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');

    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const incidents = await IncidentModel.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        incidents,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch incidents',
        error: error.message,
      },
      { status: 500 }
    );
  }
}


