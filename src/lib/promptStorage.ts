import { supabase } from './supabase';
import type { Prompt } from './supabase';

export class PromptStorage {
  static async saveToCloud(prompt: Omit<Prompt, 'id'>, userId: string): Promise<Prompt | null> {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          ...prompt,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving prompt to cloud:', error);
      return null;
    }
  }

  static async loadCloudPrompts(userId: string): Promise<Prompt[]> {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading cloud prompts:', error);
      throw error;
    }
  }

  static async deleteCloudPrompt(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting cloud prompt:', error);
      throw error;
    }
  }

  static async updateCloudPrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'user_id' | 'created_at'>>): Promise<Prompt | null> {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cloud prompt:', error);
      throw error;
    }
  }

  static async getCloudPromptById(id: string): Promise<Prompt | null> {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cloud prompt:', error);
      throw error;
    }
  }
}
