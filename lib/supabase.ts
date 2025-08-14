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

export interface Tournament {
  id: string;
  title: string;
  sport: string;
  description: string;
  max_participants: number;
  current_participants: number;
  date: string;
  time: string;
  location: string;
  status: 'Registration Open' | 'Registration Closed' | 'Ongoing' | 'Completed' | 'Cancelled';
  prize_pool: string;
  society_id: string;
  host_id: string;
  created_at: string;
  updated_at: string;
  host_profile?: {
    name: string;
    avatar?: string;
  };
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  max_participants: number;
  current_participants: number;
  date: string;
  time: string;
  location: string;
  status: 'Registration Open' | 'Registration Closed' | 'Ongoing' | 'Completed' | 'Cancelled';
  highlights: string[];
  society_id: string;
  host_id: string;
  created_at: string;
  updated_at: string;
  host_profile?: {
    name: string;
    avatar?: string;
  };
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id: string;
  joined_at: string;
  user_profile?: {
    name: string;
    avatar?: string;
  };
}

export interface CommunityEventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
  user_profile?: {
    name: string;
    avatar?: string;
  };
}

// Groups Interfaces
export interface Group {
  id: string;
  name: string;
  description?: string;
  society_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  max_members: number;
  member_count?: number;
  is_member?: boolean;
  user_role?: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  user_profile?: {
    name: string;
    avatar?: string;
  };
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  invited_user_id: string;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  expires_at: string;
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
        
        // If we found posts by society_id, return them
        if (data && data.length > 0) {
          return data;
        }
      }
      
      // Fallback: Get posts by society name in content or by user's society
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          user_profiles(name, avatar, society)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
      
      // Filter posts by users who are in the same society
      const filteredPosts = (data || []).filter(post => {
        // Check if post content contains society name
        const contentMatch = post.content && post.content.toLowerCase().includes(societyName.toLowerCase());
        
        // Check if the post author is in the same society
        const authorSocietyMatch = post.user_profiles?.society === societyName;
        
        return contentMatch || authorSocietyMatch;
      });
      
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

// Tournament Service
export const tournamentService = {
  async getTournamentsBySociety(societyId: string): Promise<Tournament[]> {
    const { data, error } = await supabase
      .from('tournaments')
      .select(`
        *,
        host_profile:user_profiles(name, avatar)
      `)
      .eq('society_id', societyId)
      .eq('status', 'Registration Open')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getTournamentsBySocietyName(societyName: string): Promise<Tournament[]> {
    try {
      // First try to get tournaments by society_id if society exists
      const society = await societyService.getSocietyByName(societyName);
      if (society) {
        const { data, error } = await supabase
          .from('tournaments')
          .select(`
            *,
            host_profile:user_profiles(name, avatar)
          `)
          .eq('society_id', society.id)
          .eq('status', 'Registration Open')
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Error fetching tournaments by society_id:', error);
          return [];
        }
        
        return data || [];
      }
      
      // Fallback: return empty array if society not found
      return [];
    } catch (error) {
      console.error('Error in getTournamentsBySocietyName:', error);
      return [];
    }
  },

  async joinTournament(tournamentId: string, userId: string): Promise<TournamentParticipant> {
    const { data, error } = await supabase
      .from('tournament_participants')
      .insert([{ tournament_id: tournamentId, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update current participants count
    await updateTournamentParticipantsCount(tournamentId);
    
    return data;
  },

  async leaveTournament(tournamentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('tournament_participants')
      .delete()
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Update current participants count
    await updateTournamentParticipantsCount(tournamentId);
  },

  async getTournamentParticipants(tournamentId: string): Promise<TournamentParticipant[]> {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select(`
        *,
        user_profile:user_profiles(name, avatar)
      `)
      .eq('tournament_id', tournamentId);
    
    if (error) throw error;
    return data || [];
  }
};

// Helper function for updating tournament participants count
async function updateTournamentParticipantsCount(tournamentId: string): Promise<void> {
  const { data: participants } = await supabase
    .from('tournament_participants')
    .select('id')
    .eq('tournament_id', tournamentId);
  
  const count = participants?.length || 0;
  
  const { error } = await supabase
    .from('tournaments')
    .update({ current_participants: count })
    .eq('id', tournamentId);
  
  if (error) {
    console.error('Error updating tournament participants count:', error);
  }
}

// Community Event Service
export const communityEventService = {
  async getEventsBySociety(societyId: string): Promise<CommunityEvent[]> {
    const { data, error } = await supabase
      .from('community_events')
      .select(`
        *,
        host_profile:user_profiles(name, avatar)
      `)
      .eq('society_id', societyId)
      .eq('status', 'Registration Open')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getEventsBySocietyName(societyName: string): Promise<CommunityEvent[]> {
    try {
      // First try to get events by society_id if society exists
      const society = await societyService.getSocietyByName(societyName);
      if (society) {
        const { data, error } = await supabase
          .from('community_events')
          .select(`
            *,
            host_profile:user_profiles(name, avatar)
          `)
          .eq('society_id', society.id)
          .eq('status', 'Registration Open')
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Error fetching events by society_id:', error);
          return [];
        }
        
        return data || [];
      }
      
      // Fallback: return empty array if society not found
      return [];
    } catch (error) {
      console.error('Error in getEventsBySocietyName:', error);
      return [];
    }
  },

  async joinEvent(eventId: string, userId: string): Promise<CommunityEventParticipant> {
    const { data, error } = await supabase
      .from('community_event_participants')
      .insert([{ event_id: eventId, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update current participants count
    await updateEventParticipantsCount(eventId);
    
    return data;
  },

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('community_event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Update current participants count
    await updateEventParticipantsCount(eventId);
  },

  async getEventParticipants(eventId: string): Promise<CommunityEventParticipant[]> {
    const { data, error } = await supabase
      .from('community_event_participants')
      .select(`
        *,
        user_profile:user_profiles(name, avatar)
      `)
      .eq('event_id', eventId);
    
    if (error) throw error;
    return data || [];
  }
};

// Helper function for updating event participants count
async function updateEventParticipantsCount(eventId: string): Promise<void> {
  const { data: participants } = await supabase
    .from('community_event_participants')
    .select('id')
    .eq('event_id', eventId);
  
  const count = participants?.length || 0;
  
  const { error } = await supabase
    .from('community_events')
    .update({ current_participants: count })
    .eq('id', eventId);
  
  if (error) {
    console.error('Error updating event participants count:', error);
  }
}

// Groups Service
export const groupsService = {
  async getGroupsBySociety(societyId: string, userId: string): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner(user_id, role)
      `)
      .eq('society_id', societyId)
      .eq('group_members.user_id', userId);
    
    if (error) throw error;
    
    // Transform data to include member count and user role
    const groupsWithDetails = await Promise.all(
      (data || []).map(async (group) => {
        const memberCount = await this.getGroupMemberCount(group.id);
        const userRole = group.group_members?.[0]?.role || 'member';
        
        return {
          ...group,
          member_count: memberCount,
          user_role: userRole,
          is_member: true
        };
      })
    );
    
    return groupsWithDetails;
  },

  async getGroupsBySocietyName(societyName: string, userId: string): Promise<Group[]> {
    try {
      const society = await societyService.getSocietyByName(societyName);
      if (society) {
        return await this.getGroupsBySociety(society.id, userId);
      }
      return [];
    } catch (error) {
      console.error('Error in getGroupsBySocietyName:', error);
      return [];
    }
  },

  async getAllGroupsInSociety(societyId: string, userId: string): Promise<Group[]> {
    // Get all groups in society and check if user is a member
    const { data: allGroups, error } = await supabase
      .from('groups')
      .select('*')
      .eq('society_id', societyId);
    
    if (error) throw error;
    
    const groupsWithDetails = await Promise.all(
      (allGroups || []).map(async (group) => {
        const memberCount = await this.getGroupMemberCount(group.id);
        const isMember = await this.isUserMemberOfGroup(group.id, userId);
        const userRole = isMember ? await this.getUserRoleInGroup(group.id, userId) : null;
        
        return {
          ...group,
          member_count: memberCount,
          is_member: isMember,
          user_role: userRole
        };
      })
    );
    
    return groupsWithDetails;
  },

  async getAllGroupsInSocietyByName(societyName: string, userId: string): Promise<Group[]> {
    try {
      const society = await societyService.getSocietyByName(societyName);
      if (society) {
        return await this.getAllGroupsInSociety(society.id, userId);
      }
      return [];
    } catch (error) {
      console.error('Error in getAllGroupsInSocietyByName:', error);
      return [];
    }
  },

  async createGroup(groupData: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .insert([groupData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Add creator as admin member
    await this.addMemberToGroup(data.id, groupData.created_by, 'admin');
    
    return data;
  },

  async addMemberToGroup(groupId: string, userId: string, role: string = 'member'): Promise<GroupMember> {
    const { data, error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: userId, role }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        user_profile:user_profiles(name, avatar)
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async getGroupMemberCount(groupId: string): Promise<number> {
    const { count, error } = await supabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId);
    
    if (error) throw error;
    return count || 0;
  },

  async isUserMemberOfGroup(groupId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return !!data;
  },

  async getUserRoleInGroup(groupId: string, userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data?.role || null;
  },

  async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group> {
    const { data, error } = await supabase
      .from('groups')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', groupId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteGroup(groupId: string): Promise<void> {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);
    
    if (error) throw error;
  }
}; 