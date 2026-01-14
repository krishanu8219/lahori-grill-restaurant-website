import { NextResponse } from 'next/server';
import { getDeliveryFeeFromAddress } from '@/lib/distance';

export async function POST(request) {
  try {
    const { address } = await request.json();
    
    if (!address || typeof address !== 'string' || address.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      );
    }
    
    const result = await getDeliveryFeeFromAddress(address.trim());
    
    return NextResponse.json({
      success: true,
      distance: result.distance,
      deliveryFee: result.fee,
      error: result.error || null,
    });
  } catch (error) {
    console.error('Error calculating delivery fee:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate delivery fee',
        deliveryFee: 1.00, // Default fee on error
      },
      { status: 200 } // Return 200 with default fee instead of error
    );
  }
}
