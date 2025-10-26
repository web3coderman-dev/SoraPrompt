import { supabase } from './supabase';
import type { Prompt } from './supabase';

const LOCAL_STORAGE_KEY = 'sora-local-prompts';
const MAX_LOCAL_PROMPTS = 10;

export type LocalPrompt = Omit<Prompt, 'user_id'> & {
  isLocal: true;
};

export class PromptStorage {
  static getLocalPrompts(): LocalPrompt[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local prompts:', error);
      return [];
    }
  }

  static saveLocalPrompt(prompt: Omit<Prompt, 'id' | 'user_id'>): LocalPrompt {
    const prompts = this.getLocalPrompts();

    const newPrompt: LocalPrompt = {
      ...prompt,
      id: crypto.randomUUID(),
      isLocal: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    prompts.unshift(newPrompt);

    if (prompts.length > MAX_LOCAL_PROMPTS) {
      prompts.pop();
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prompts));
    } catch (error) {
      console.error('Error saving local prompt:', error);
    }

    return newPrompt;
  }

  static deleteLocalPrompt(id: string): void {
    const prompts = this.getLocalPrompts();
    const filtered = prompts.filter(p => p.id !== id);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting local prompt:', error);
    }
  }

  static clearLocalPrompts(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing local prompts:', error);
    }
  }

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
      return [];
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
      return false;
    }
  }

  static async migrateLocalPromptsToCloud(userId: string): Promise<number> {
    const localPrompts = this.getLocalPrompts();
    let migratedCount = 0;

    for (const prompt of localPrompts) {
      const { isLocal, ...promptData } = prompt;
      const saved = await this.saveToCloud(promptData, userId);
      if (saved) {
        migratedCount++;
      }
    }

    if (migratedCount > 0) {
      this.clearLocalPrompts();
    }

    return migratedCount;
  }

  static getLocalPromptCount(): number {
    return this.getLocalPrompts().length;
  }

  static hasReachedLocalLimit(): boolean {
    return this.getLocalPromptCount() >= MAX_LOCAL_PROMPTS;
  }
}
