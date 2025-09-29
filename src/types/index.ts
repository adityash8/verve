export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface CampaignRepo {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  files: CampaignFile[];
}

export interface CampaignFile {
  id: string;
  repo_id: string;
  name: string;
  path: string;
  content: string;
  type: FileType;
  created_at: string;
  updated_at: string;
}

export type FileType = 'ad-campaign' | 'seo-hub' | 'content-spec' | 'automation' | 'config';

export interface AdCampaign {
  name: string;
  platform: 'google-ads' | 'facebook-ads' | 'linkedin-ads';
  budget: {
    daily: number;
    total?: number;
  };
  targeting: {
    demographics?: any;
    interests?: string[];
    keywords?: string[];
  };
  ads: Ad[];
  bidding: {
    strategy: string;
    target_cpa?: number;
    target_roas?: number;
  };
}

export interface Ad {
  headline: string;
  description: string;
  call_to_action?: string;
  landing_page: string;
  creative?: {
    image_url?: string;
    video_url?: string;
  };
}

export interface Connector {
  id: string;
  name: string;
  type: 'google-ads' | 'google-analytics' | 'webflow' | 'facebook-ads';
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, any>;
  last_sync?: string;
}

export interface AiSuggestion {
  id: string;
  type: 'optimization' | 'debug' | 'copy-variant';
  content: string;
  confidence: number;
  bias_type?: string;
  applied: boolean;
}

export interface AnalyticsData {
  platform: string;
  metrics: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    cost?: number;
    cpa?: number;
    roas?: number;
  };
  timeframe: {
    start: string;
    end: string;
  };
}