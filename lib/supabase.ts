import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lrqrxyqrmwrbsxgiyuio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycXJ4eXFybXdyYnN4Z2l5dWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDI5MDgsImV4cCI6MjA2OTc3ODkwOH0.2wjV1fNp2oRxzlbHd5pZNVfOzHrNI5Q-s6-Rc3Qdoq4';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Interfaces
export interface Country {
  id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: string;
  country_id: string;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Society {
  id: string;
  state_id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
  states?: {
    name: string;
    code: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  interests: string[];
  address: string;
  society_id?: string;
  state_id?: string;
  society: string;
  flat: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  user_role?: 'super_admin' | 'society_admin' | 'public';
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  society_id?: string;
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

export interface Match {
  id: string;
  title: string;
  description: string;
  host_id: string;
  society_id?: string;
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

export interface MatchParticipant {
  id: string;
  match_id: string;
  user_id: string;
  joined_at: string;
  user_profiles?: {
    name: string;
    avatar?: string;
  };
}

export interface Story {
  id: string;
  user_id: string;
  society_id?: string;
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

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// Country Service
export const countryService = {
  async getAllCountries(): Promise<Country[]> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getCountryById(id: string): Promise<Country | null> {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

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

  async getStatesByCountry(countryId: string): Promise<State[]> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('country_id', countryId)
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
        states(name, code)
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
        states(name, code)
      `)
      .eq('state_id', stateId)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async searchSocieties(query: string, stateId?: string): Promise<Society[]> {
    let queryBuilder = supabase
      .from('societies')
      .select(`
        *,
        states(name, code)
      `)
      .ilike('name', `%${query}%`)
      .order('name');
    
    if (stateId) {
      queryBuilder = queryBuilder.eq('state_id', stateId);
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) throw error;
    return data || [];
  },

  async getSocietyById(id: string): Promise<Society | null> {
    const { data, error } = await supabase
      .from('societies')
      .select(`
        *,
        states(name, code)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSocietyByName(name: string, stateId?: string): Promise<Society | null> {
    let queryBuilder = supabase
      .from('societies')
      .select(`
        *,
        states(name, code)
      `)
      .eq('name', name);
    
    if (stateId) {
      queryBuilder = queryBuilder.eq('state_id', stateId);
    }
    
    const { data, error } = await queryBuilder.single();
    
    if (error) throw error;
    return data;
  },

  async createSociety(society: Omit<Society, 'id' | 'created_at' | 'updated_at'>): Promise<Society> {
    const { data, error } = await supabase
      .from('societies')
      .insert([society])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getOrCreateSociety(name: string, stateId: string): Promise<Society> {
    try {
      const existing = await this.getSocietyByName(name, stateId);
      if (existing) return existing;
    } catch (error) {
      // Society doesn't exist, create it
    }
    
    return await this.createSociety({
      name,
      state_id: stateId
    });
  }
};

// User Service
export const userService = {
  async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
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

  async getUsersBySociety(societyName: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('society', societyName)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async updateUserSociety(userId: string, stateName: string, societyName: string): Promise<UserProfile> {
    try {
      // Get the society ID if it exists
      let societyId = null;
      try {
        const society = await societyService.getSocietyByName(societyName);
        if (society) {
          societyId = society.id;
        }
      } catch (error) {
        // Society doesn't exist, we'll just use the name
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          society: societyName,
          society_id: societyId
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user society:', error);
      throw error;
    }
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
        user_profiles(name, avatar)
      `)
      .eq('society_id', societyId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPostsBySocietyName(societyName: string): Promise<Post[]> {
    try {
      // First try to get posts by society_id if society exists
      const society = await societyService.getSocietyByName(societyName);
      if (society) {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            user_profiles(name, avatar)
          `)
          .eq('society_id', society.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching posts by society_id:', error);
          return [];
        }
        
        return data || [];
      }
      
      // Fallback: Get posts by society name in content
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
      
      // Filter posts that contain the society name in content
      const filteredPosts = (data || []).filter(post => 
        post.content && post.content.toLowerCase().includes(societyName.toLowerCase())
      );
      
      return filteredPosts;
    } catch (error) {
      console.error('Error in getPostsBySocietyName:', error);
      return [];
    }
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user_profiles(name, avatar)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async likePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .insert([{ post_id: postId, user_id: userId }]);
    
    if (error) throw error;
  },

  async unlikePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  async addComment(postId: string, userId: string, content: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: userId, content }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
  },

  async joinMatch(matchId: string, userId: string): Promise<MatchParticipant> {
    const { data, error } = await supabase
      .from('match_participants')
      .insert([{ match_id: matchId, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async leaveMatch(matchId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('match_participants')
      .delete()
      .eq('match_id', matchId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  async getMatchParticipants(matchId: string): Promise<MatchParticipant[]> {
    const { data, error } = await supabase
      .from('match_participants')
      .select(`
        *,
        user_profiles(name, avatar)
      `)
      .eq('match_id', matchId);
    
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
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
  }
}; 