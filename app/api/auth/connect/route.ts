import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform');
  const userId = url.searchParams.get('userId') || 'demo-user';

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reflow.me';

  // Production OAuth Redirect URLs based on platform
  if (platform === 'instagram') {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: 'INSTAGRAM_CLIENT_ID not configured in environment variables' }, { status: 400 });
    }
    const redirectUri = `${baseUrl}/api/auth/callback?platform=instagram`;
    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
    return NextResponse.redirect(instagramAuthUrl);
  }

  if (platform === 'tiktok') {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    if (!clientKey) {
      return NextResponse.json({ error: 'TIKTOK_CLIENT_KEY not configured in environment variables' }, { status: 400 });
    }
    const redirectUri = `${baseUrl}/api/auth/callback?platform=tiktok`;
    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(tiktokAuthUrl);
  }

  if (platform === 'youtube') {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: 'YOUTUBE_CLIENT_ID not configured in environment variables' }, { status: 400 });
    }
    const redirectUri = `${baseUrl}/api/auth/callback?platform=youtube`;
    const youtubeAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`;
    return NextResponse.redirect(youtubeAuthUrl);
  }

  return NextResponse.json({ error: 'Invalid platform specified' }, { status: 400 });
}
