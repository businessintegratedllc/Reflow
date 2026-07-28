import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform');
  
  // Forzar siempre la URL de producción oficial en Netlify para evitar desajustes con dominios temporales
  const baseUrl = 'https://reflowcr.netlify.app';

  // 1. Instagram / Meta Graph API OAuth
  if (platform === 'instagram') {
    const clientId = '949086474863119';
    const redirectUri = `${baseUrl}/api/auth/callback?platform=instagram`;
    
    // Using Meta Facebook Login for Business / Instagram Login endpoint (v25.0)
    const authUrl = `https://www.facebook.com/v25.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_basic,instagram_manage_insights,pages_show_list&response_type=code`;
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
