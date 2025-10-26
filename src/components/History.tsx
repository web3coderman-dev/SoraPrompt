import { useState, useEffect, useMemo } from 'react';
import { Clock, Trash2, Eye, Search, Filter, Cloud, HardDrive } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { PromptStorage } from '../lib/promptStorage';
import type { Prompt } from '../lib/supabase';
import type { LocalPrompt } from '../lib/promptStorage';
import SortDropdown from './SortDropdown';
import ConfirmModal from './ConfirmModal';

type HistoryProps = {
  onSelectPrompt: (prompt: Prompt | LocalPrompt) => void;
};

type FilterMode = 'all' | 'quick' | 'director';
type SortOption = 'newest' | 'oldest' | 'score-high' | 'score-low';

export default function History({ onSelectPrompt }: HistoryProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<(Prompt | LocalPrompt)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        const cloudPrompts = await PromptStorage.loadCloudPrompts(user.id);
        setPrompts(cloudPrompts);
      } else {
        const localPrompts = PromptStorage.getLocalPrompts();
        setPrompts(localPrompts);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError(t.historyLoadError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPromptToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promptToDelete) return;

    try {
      if (user) {
        const success = await PromptStorage.deleteCloudPrompt(promptToDelete);
        if (!success) throw new Error('Failed to delete');
      } else {
        PromptStorage.deleteLocalPrompt(promptToDelete);
      }

      setPrompts(prompts.filter(p => p.id !== promptToDelete));
      setDeleteModalOpen(false);
      setPromptToDelete(null);
    } catch (err) {
      console.error('Error deleting prompt:', err);
      alert(t.historyLoadError);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPromptToDelete(null);
  };

  const filteredAndSortedPrompts = useMemo(() => {
    let result = [...prompts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(prompt =>
        prompt.user_input.toLowerCase().includes(query) ||
        prompt.generated_prompt.toLowerCase().includes(query) ||
        (prompt.intent_data?.theme && String(prompt.intent_data.theme).toLowerCase().includes(query)) ||
        (prompt.intent_data?.tone && String(prompt.intent_data.tone).toLowerCase().includes(query)) ||
        (prompt.intent_data?.scene && String(prompt.intent_data.scene).toLowerCase().includes(query)) ||
        (prompt.style_data?.director && String(prompt.style_data.director).toLowerCase().includes(query))
      );
    }

    if (filterMode !== 'all') {
      result = result.filter(prompt => prompt.mode === filterMode);
    }

    switch (sortOption) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'score-high':
        result.sort((a, b) => b.quality_score - a.quality_score);
        break;
      case 'score-low':
        result.sort((a, b) => a.quality_score - b.quality_score);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [prompts, searchQuery, filterMode, sortOption]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(t.language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-primary-600 bg-primary-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.historyLoading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadHistory}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.language === 'zh' ? '重试' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.historyEmpty}</h3>
          <p className="text-gray-600">{t.historyEmptyDesc}</p>
          {!user && (
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm text-primary-800">
                {t.storageGuestTip}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.historyTitle}</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
          {user ? (
            <>
              <Cloud className="w-4 h-4 text-primary-600" />
              <span className="text-gray-700">
                {t.storageCloud}
              </span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">
                {t.storageLocalLimit.replace('{{count}}', String(prompts.length))}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.historySearch}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterMode === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.historyFilterAll}
              </button>
              <button
                onClick={() => setFilterMode('quick')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterMode === 'quick'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.historyFilterQuick}
              </button>
              <button
                onClick={() => setFilterMode('director')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterMode === 'director'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.historyFilterDirector}
              </button>
            </div>
          </div>

          <div className="flex justify-end sm:justify-start">
            <SortDropdown
              options={[
                { value: 'newest', label: t.historySortNewest },
                { value: 'oldest', label: t.historySortOldest },
                { value: 'score-high', label: t.historySortScoreHigh },
                { value: 'score-low', label: t.historySortScoreLow },
              ]}
              value={sortOption}
              onChange={(val) => setSortOption(val as SortOption)}
            />
          </div>
        </div>
      </div>

      {filteredAndSortedPrompts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.historyNoResults}</h3>
          <p className="text-gray-600">{t.historyEmptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium text-sm mb-1 truncate">
                    {prompt.user_input}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(prompt.created_at)}</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                      {prompt.mode === 'quick' ? t.historyFilterQuick : t.historyFilterDirector}
                    </span>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ml-3 whitespace-nowrap ${getScoreColor(prompt.quality_score)}`}>
                  {prompt.quality_score}
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2 bg-gray-50 rounded-lg p-3 border border-gray-100">
                {prompt.generated_prompt}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectPrompt(prompt)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  {t.view}
                </button>
                <button
                  onClick={() => handleDeleteClick(prompt.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title={t.historyDeleteTitle}
        message={t.historyDeleteConfirm}
        confirmText={t.confirm}
        cancelText={t.cancel}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </div>
  );
}
