import { supabase, isSupabaseConfigured } from './supabase';
import { CreatorProfile, SocialStat, PricingPackage, Subscriber } from '@/types';

// DB Service for ReFlow (Supabase + LocalStorage hybrid sync)

export async function saveCreatorData(userId: string, creator: CreatorProfile, stats: SocialStat[], packages: PricingPackage[]) {
  // 1. Save to localStorage always for instant UI responsiveness
  if (typeof window !== 'undefined') {
    localStorage.setItem('reflow_creator', JSON.stringify(creator));
    localStorage.setItem('reflow_stats', JSON.stringify(stats));
    localStorage.setItem('reflow_packages', JSON.stringify(packages));

    // Update subscribers list in localStorage
    const existingSubs = JSON.parse(localStorage.getItem('reflow_subscribers') || '[]');
    const creatorSub = {
      id: userId,
      creatorName: `${creator.fullName} (@${creator.username})`,
      email: `${creator.username}@reflow.me`,
      plan: creator.plan || 'Free',
      amount: creator.plan === 'Pro (PayPal)' ? 15.00 : 0.00,
      currency: 'USD',
      paypalOrderId: creator.plan === 'Pro (PayPal)' ? 'PAYPAL-PRO-' + Math.floor(Math.random() * 900000 + 100000) : 'FREE-TIER',
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      stats: stats
    };
    const updatedSubs = [creatorSub, ...existingSubs.filter((s: any) => s.id !== userId && s.email !== creatorSub.email)];
    localStorage.setItem('reflow_subscribers', JSON.stringify(updatedSubs));
  }

  // 2. Save to Supabase if configured so it syncs across phone and computer!
  if (isSupabaseConfigured) {
    try {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: userId,
        username: creator.username,
        full_name: creator.fullName,
        bio: creator.bio,
        avatar_url: creator.avatarUrl,
        niche: creator.niche,
        whatsapp_number: creator.whatsappNumber,
        plan: creator.plan || 'Free',
        subscription_status: creator.subscriptionStatus || 'free',
        updated_at: new Date().toISOString()
      });

      // Upsert stats
      for (const st of stats) {
        await supabase.from('social_stats').upsert({
          user_id: userId,
          platform: st.platform,
          handle: st.handle,
          followers: st.followers,
          engagement_rate: st.engagementRate,
          avg_reach: st.avgReach,
          connected: st.connected,
          last_synced: new Date().toISOString()
        }, { onConflict: 'user_id,platform' });
      }

      // Upsert subscription record for Admin panel
      await supabase.from('subscriptions').upsert({
        creator_id: userId,
        creator_name: `${creator.fullName} (@${creator.username})`,
        email: `${creator.username}@reflow.me`,
        plan: creator.plan || 'Free',
        amount: creator.plan === 'Pro (PayPal)' ? 15.00 : 0.00,
        currency: 'USD',
        paypal_order_id: creator.plan === 'Pro (PayPal)' ? 'PAYPAL-PRO-' + userId : 'FREE-TIER',
        status: 'active'
      }, { onConflict: 'paypal_order_id' });

    } catch (err) {
      console.error('Supabase Sync Error (falling back to local):', err);
    }
  }
}

export async function loadCreatorData(username?: string) {
  // Try Supabase first if configured
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('profiles').select('*');
      if (username) {
        query = query.eq('username', username);
      } else {
        query = query.limit(1);
      }
      const { data: profileData, error } = await query.single();

      if (!error && profileData) {
        // Fetch stats
        const { data: statsData } = await supabase.from('social_stats').select('*').eq('user_id', profileData.id);
        const { data: pkgData } = await supabase.from('packages').select('*').eq('user_id', profileData.id);

        const creator: CreatorProfile = {
          id: profileData.id,
          username: profileData.username,
          fullName: profileData.full_name,
          bio: profileData.bio,
          avatarUrl: profileData.avatar_url,
          niche: profileData.niche,
          whatsappNumber: profileData.whatsapp_number,
          plan: profileData.plan,
          subscriptionStatus: profileData.subscription_status
        };

        const stats: SocialStat[] = statsData && statsData.length > 0 ? statsData.map((s: any) => ({
          platform: s.platform,
          handle: s.handle,
          followers: s.followers,
          engagementRate: Number(s.engagement_rate),
          avgReach: s.avg_reach,
          connected: s.connected,
          lastSynced: s.last_synced
        })) : [
          { platform: 'instagram', handle: '@tu_instagram', followers: 0, engagementRate: 0, avgReach: 0, connected: false },
          { platform: 'tiktok', handle: '@tu_tiktok', followers: 0, engagementRate: 0, avgReach: 0, connected: false },
          { platform: 'youtube', handle: '@tu_youtube', followers: 0, engagementRate: 0, avgReach: 0, connected: false }
        ];

        const packages: PricingPackage[] = pkgData ? pkgData.map((p: any) => ({
          id: p.id,
          userId: p.user_id,
          title: p.title,
          description: p.description,
          price: Number(p.price),
          currency: p.currency,
          deliveryDays: p.delivery_days,
          active: p.active
        })) : [];

        return { creator, stats, packages };
      }
    } catch (err) {
      console.error('Supabase Load Error:', err);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const savedCreator = localStorage.getItem('reflow_creator');
    const savedStats = localStorage.getItem('reflow_stats');
    const savedPackages = localStorage.getItem('reflow_packages');

    return {
      creator: savedCreator ? JSON.parse(savedCreator) : null,
      stats: savedStats ? JSON.parse(savedStats) : null,
      packages: savedPackages ? JSON.parse(savedPackages) : null
    };
  }

  return { creator: null, stats: null, packages: null };
}

export async function loadAllSubscribersFromDB() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('subscriptions').select('*');
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.creator_id,
          creatorName: d.creator_name,
          email: d.email,
          plan: d.plan,
          amount: Number(d.amount),
          currency: d.currency,
          paypalOrderId: d.paypal_order_id,
          status: d.status,
          date: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
        }));
      }
    } catch (err) {
      console.error('Supabase Load Subscribers Error:', err);
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const savedSubs = localStorage.getItem('reflow_subscribers');
    if (savedSubs) {
      try { return JSON.parse(savedSubs); } catch (e) {}
    }
  }

  return [];
}
