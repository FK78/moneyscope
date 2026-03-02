import { NextResponse } from 'next/server';
import { buildAuthLink } from '@/lib/truelayer';

export async function GET() {
  const authUrl = buildAuthLink();
  return NextResponse.redirect(authUrl);
}
