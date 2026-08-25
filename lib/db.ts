import { supabase, isSupabaseConfigured } from './supabase';
import { CreatorProfile, SocialStat, PricingPackage, Subscriber } from '@/types';

// Helper to generate a valid UUID v4 in browser & Node
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function saveCreatorData(userId: string, creator: CreatorProfile, stats: SocialStat[], packages: PricingPackage[]) {
  // Ensure userId is a valid UUID, otherwise generate one
  const cleanId = (userId && userId.length === 36 && userId.includes('-')) ? userId : generateUUID();
  const cleanUsername = (creator.username || 'tuusuario').toLowerCase().replace(/[^a-z0-9_]/g, '');

  // 1. Save to localStorage
  if (typeof window !== 'undefined') {
    const creatorToSave = { ...creator, id: cleanId, username: cleanUsername };
    localStorage.setItem('reflow_creator', JSON.stringify(creatorToSave));
    localStorage.setItem('reflow_stats', JSON.stringify(stats));
    localStorage.setItem('reflow_packages', JSON.stringify(packages));
    localStorage.setItem('reflow_creator_username', cleanUsername);

    const existingSubs = JSON.parse(localStorage.getItem('reflow_subscribers') || '[]');
    const creatorSub = {
      id: cleanId,
      creatorName: `${creator.fullName} (@${cleanUsername})`,
      email: `${cleanUsername}@reflow.me`,
      plan: creator.plan || 'Free',
      amount: creator.plan === 'Pro (PayPal)' ? 15.00 : 0.00,
      currency: 'USD',
      paypalOrderId: creator.plan === 'Pro (PayPal)' ? 'PAYPAL-PRO-' + cleanId : 'FREE-TIER-' + cleanId,
      status: 'active',
      date: new Date().toISOString().split('T')[0],
      stats: stats
    };
    const updatedSubs = [creatorSub, ...existingSubs.filter((s: any) => s.id !== cleanId)];
    localStorage.setItem('reflow_subscribers', JSON.stringify(updatedSubs));
  }

  // 2. Save to Supabase (Cloud Sync by username)
  if (isSupabaseConfigured) {
    try {
      // Check if profile exists by username
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .maybeSingle();

      const profileId = existingProfile ? existingProfile.id : cleanId;

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: profileId,
        username: cleanUsername,
        full_name: creator.fullName,
        bio: creator.bio,
        avatar_url: creator.avatarUrl,
        niche: creator.niche,
        whatsapp_number: creator.whatsappNumber,
        plan: creator.plan || 'Free',
        subscription_status: creator.subscriptionStatus || 'free',
        updated_at: new Date().toISOString()
      }, { onConflict: 'username' });

      if (profileError) {
        console.error('Supabase Profile Upsert Error:', profileError);
      }

      for (const st of stats) {
        await supabase.from('social_stats').upsert({
          user_id: profileId,
          platform: st.platform,
          handle: st.handle,
          followers: st.followers,
          engagement_rate: st.engagementRate,
          avg_reach: st.avgReach,
          connected: st.connected,
          last_synced: new Date().toISOString()
        }, { onConflict: 'user_id,platform' });
      }

      await supabase.from('subscriptions').upsert({
        creator_id: profileId,
        creator_name: `${creator.fullName} (@${cleanUsername})`,
        email: `${cleanUsername}@reflow.me`,
        plan: creator.plan || 'Free',
        amount: creator.plan === 'Pro (PayPal)' ? 15.00 : 0.00,
        currency: 'USD',
        paypal_order_id: creator.plan === 'Pro (PayPal)' ? 'PAYPAL-PRO-' + profileId : 'FREE-TIER-' + profileId,
        status: 'active'
      }, { onConflict: 'paypal_order_id' });

    } catch (err) {
      console.error('Supabase Cloud Sync Exception:', err);
    }
  }
}

export async function loadCreatorData(usernameKey?: string) {
  let lookupUsername = usernameKey;

  if (typeof window !== 'undefined' && !usernameKey) {
    lookupUsername = localStorage.getItem('reflow_creator_username') || undefined;
    if (!lookupUsername) {
      const localCreator = localStorage.getItem('reflow_creator');
      if (localCreator) {
        try {
          const parsed = JSON.parse(localCreator);
          if (parsed.username) lookupUsername = parsed.username;
        } catch (e) {}
      }
    }
  }

  // Try Supabase first if configured
  if (isSupabaseConfigured && lookupUsername && lookupUsername !== 'tuusuario') {
    try {
      const cleanLookup = lookupUsername.toLowerCase().replace(/[^a-z0-9_]/g, '');
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', cleanLookup)
        .maybeSingle();

      if (!error && profileData) {
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

        // Cache locally
        if (typeof window !== 'undefined') {
          localStorage.setItem('reflow_creator', JSON.stringify(creator));
          localStorage.setItem('reflow_stats', JSON.stringify(stats));
          localStorage.setItem('reflow_packages', JSON.stringify(packages));
          localStorage.setItem('reflow_creator_username', creator.username);
        }

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

    if (savedCreator) {
      return {
        creator: JSON.parse(savedCreator),
        stats: savedStats ? JSON.parse(savedStats) : null,
        packages: savedPackages ? JSON.parse(savedPackages) : null
      };
    }
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

  if (typeof window !== 'undefined') {
    const savedSubs = localStorage.getItem('reflow_subscribers');
    if (savedSubs) {
      try { return JSON.parse(savedSubs); } catch (e) {}
    }
  }

  return [];
}
