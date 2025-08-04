import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface State {
  id: string;
  name: string;
  code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Society {
  id: string;
  name: string;
  state_id: string;
  description?: string;
  address?: string;
  city?: string;
  pincode?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  interests: string[];
  address: string;
  society: string;
  flat: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  user_role?: 'super_admin' | 'society_admin' | 'public';
  is_active?: boolean;
  state_id?: string;
  society_id?: string;
  state_name?: string;
  society_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SocietyMember {
  id: string;
  society_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  post_type: 'general' | 'match' | 'tournament' | 'announcement';
  is_announcement: boolean;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    name: string;
    avatar?: string;
  };
}

export interface Sport {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Match {
  id: string;
  title: string;
  description: string;
  host_id: string;
  match_type: 'casual' | 'competitive';
  max_participants?: number;
  current_participants: number;
  venue: string;
  scheduled_date: string;
  duration_minutes: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  host_id: string;
  state_id: string;
  society_id: string;
  sport_id: string;
  max_teams: number;
  current_teams: number;
  venue: string;
  start_date: string;
  end_date: string;
  prize_pool?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  user_id: string;
  state_id: string;
  society_id: string;
  content: string;
  media_url?: string;
  expires_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'post' | 'match' | 'tournament' | 'story' | 'general';
  is_read: boolean;
  created_at: string;
}

// State Service
export const stateService = {
  async getAllStates(): Promise<State[]> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getStateById(id: string): Promise<State | null> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStateByName(name: string): Promise<State | null> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('name', name)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Society Service
export const societyService = {
  async getAllSocieties(): Promise<Society[]> {
    const { data, error } = await supabase
      .from('societies')
      .select(`
        *,
        states!inner(name, code)
      `)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getSocietiesByState(stateId: string): Promise<Society[]> {
    const { data, error } = await supabase
      .from('societies')
      .select(`
        *,
        states!inner(name, code)
      `)
      .eq('state_id', stateId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async searchSocieties(query: string, stateId?: string): Promise<Society[]> {
    let supabaseQuery = supabase
      .from('societies')
      .select(`
        *,
        states!inner(name, code)
      `)
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(10);
    
    if (stateId) {
      supabaseQuery = supabaseQuery.eq('state_id', stateId);
    }
    
    const { data, error } = await supabaseQuery;
    
    if (error) throw error;
    return data || [];
  },

  async getSocietyById(id: string): Promise<Society | null> {
    const { data, error } = await supabase
      .from('societies')
      .select(`
        *,
        states!inner(name, code)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSocietyByName(name: string, stateId?: string): Promise<Society | null> {
    let supabaseQuery = supabase
      .from('societies')
      .select(`
        *,
        states!inner(name, code)
      `)
      .eq('name', name);
    
    if (stateId) {
      supabaseQuery = supabaseQuery.eq('state_id', stateId);
    }
    
    const { data, error } = await supabaseQuery.single();
    
    if (error) throw error;
    return data;
  },

  async createSociety(society: Omit<Society, 'id' | 'created_at' | 'updated_at'>): Promise<Society> {
    const { data, error } = await supabase
      .from('societies')
      .insert([society])
      .select(`
        *,
        states!inner(name, code)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getOrCreateSociety(name: string, stateId: string): Promise<Society> {
    // First try to find existing society in the specific state
    const existingSociety = await this.getSocietyByName(name, stateId);
    if (existingSociety) {
      return existingSociety;
    }

    // Create new society if it doesn't exist
    return await this.createSociety({
      name,
      state_id: stateId,
      description: `${name} - Residential Society`,
      address: '',
      city: '',
      pincode: ''
    });
  }
};

// User Service
export const userService = {
  async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{
        ...profile,
        // Don't include is_active and user_role - let database use defaults
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserProfile(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserProfileByPhone(phone: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserSociety(userId: string, stateName: string, societyName: string): Promise<UserProfile> {
    // Get state
    const state = await stateService.getStateByName(stateName);
    if (!state) {
      throw new Error(`State "${stateName}" not found`);
    }

    // Get or create society
    const society = await societyService.getOrCreateSociety(societyName, state.id);
    
    // Update user profile
    return await this.updateUserProfile(userId, {
      society: societyName,
      state_id: state.id,
      society_id: society.id,
      state_name: state.name,
      society_name: society.name
    });
  }
};

// Post Service
export const postService = {
  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert([post])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPostsBySociety(societyId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user_profiles!inner(name, avatar)
      `)
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPostsBySocietyName(stateName: string, societyName: string): Promise<Post[]> {
    try {
      // Since we don't have proper state/society relationships, just return all posts
      // Users can see all posts for now
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles(name, avatar)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getPostsBySocietyName:', error);
      return [];
    }
  }
};

// Match Service
export const matchService = {
  async createMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert([match])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMatchesBySociety(societyId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('society_id', societyId)
      .order('scheduled_date');
    
    if (error) throw error;
    return data || [];
  }
};

// Story Service
export const storyService = {
  async createStory(story: Omit<Story, 'id' | 'created_at'>): Promise<Story> {
    const { data, error } = await supabase
      .from('stories')
      .insert([story])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStoriesBySociety(societyId: string): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('society_id', societyId)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Notification Service
export const notificationService = {
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}; 