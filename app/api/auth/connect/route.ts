import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform');
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  // 1. Instagram / Meta Graph API OAuth
  if (platform === 'instagram') {
    const clientId = process.env.INSTAGRAM_CLIENT_ID || '949086474863119';
    const redirectUri = `${baseUrl}/api/auth/callback?platform=instagram`;
    
    // Using Meta Facebook Login for Business / Instagram Login endpoint
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,instagram_manage_insights,pages_show_list&response_type=code`;
    return NextResponse.redirect(authUrl);
  }

  // 2. TikTok OAuth API
  if (platform === 'tiktok') {
    const clientKey = process.env.TIKTOK_CLIENT_KEY || 'dummy-tiktok-key';
    const redirectUri = `${baseUrl}/api/auth/callback?platform=tiktok`;
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(authUrl);
  }

  // 3. YouTube / Google OAuth API
  if (platform === 'youtube') {
    const clientId = process.env.YOUTUBE_CLIENT_ID || 'dummy-youtube-id';
    const redirectUri = `${baseUrl}/api/auth/callback?platform=youtube`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline&prompt=consent`;
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.redirect(new URL('/dashboard?error=invalid_platform', request.url));
}
