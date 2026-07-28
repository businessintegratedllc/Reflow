export interface CreatorProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl: string;
  niche: string;
  whatsappNumber: string;
  created_at?: string;
  plan?: 'Free' | 'Pro (PayPal)';
  subscriptionStatus?: 'active' | 'pending' | 'expired' | 'free';
}

export interface SocialStat {
  id?: string;
  userId?: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitch';
  handle: string;
  followers: number;
  engagementRate: number;
  avgReach: number;
  connected: boolean;
  lastSynced?: string;
}

export interface PricingPackage {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  deliveryDays: number;
  active: boolean;
}

export interface QuoteRequest {
  id?: string;
  creatorId: string;
  brandName: string;
  contactEmail: string;
  selectedPackages: PricingPackage[];
  totalAmount: number;
  status: 'pending' | 'contacted' | 'completed';
  created_at?: string;
}

export interface Subscriber {
  id: string;
  creatorName: string;
  email: string;
  plan: string;
  amount: number;
  currency: string;
  paypalOrderId: string;
  status: 'active' | 'cancelled';
  date: string;
}
