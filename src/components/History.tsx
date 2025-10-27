import { useState, useEffect, useMemo } from 'react';
import { Clock, Trash2, Eye, Search, Filter, Cloud, HardDrive, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { PromptStorage } from '../lib/promptStorage';
import type { Prompt } from '../lib/supabase';
import type { LocalPrompt } from '../lib/promptStorage';
import SortDropdown from './SortDropdown';
import ConfirmModal from './ConfirmModal';
import { LoginPrompt } from './LoginPrompt';

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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const isLocalNearLimit = !user && prompts.length >= 7;
  const isLocalAtLimit = !user && prompts.length >= 10;

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
    if (score >= 90) return 'text-state-ok bg-state-ok/10';
    if (score >= 75) return 'text-keyLight bg-keyLight/10 border border-keyLight/30';
    if (score >= 60) return 'text-state-warning bg-state-warning/10 border border-state-warning/30';
    return 'text-state-error bg-state-error/10';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-neon border-t-transparent mx-auto mb-4"></div>
            <p className="text-text-secondary">{t.historyLoading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-state-error/10 border border-state-error/30 rounded-xl p-6 text-center">
          <p className="text-state-error mb-4">{error}</p>
          <button
            onClick={loadHistory}
            className="px-5 py-2.5 bg-state-error text-white rounded-lg hover:bg-state-error/80 active:bg-red-800 transition-colors"
          >
            {t.language === 'zh' ? '重试' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-scene-fill rounded-2xl shadow-depth-lg border border-keyLight/20 p-12 text-center">
          <Clock className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">{t.historyEmpty}</h3>
          <p className="text-text-secondary">{t.historyEmptyDesc}</p>
          {!user && (
            <div className="mt-6">
              <LoginPrompt
                variant="compact"
                message={t.storageGuestTip}
                showBenefits={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto overflow-hidden">
      {(isLocalNearLimit || isLocalAtLimit) && (
        <div className="mb-6 p-4 bg-state-warning/10 border-2 border-state-warning/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-state-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-state-warning mb-1">
                {isLocalAtLimit
                  ? (language === 'zh' ? '本地存储已满！' : 'Local storage is full!')
                  : (language === 'zh' ? '本地存储即将用尽' : 'Local storage almost full')
                }
              </h3>
              <p className="text-sm text-state-warning mb-3">
                {isLocalAtLimit
                  ? (language === 'zh'
                      ? '您的本地存储已达上限（10条）。新记录将覆盖最旧的记录。登录以保存所有历史记录到云端！'
                      : 'Your local storage has reached its limit (10 records). New records will overwrite the oldest ones. Sign in to save all history to the cloud!')
                  : (language === 'zh'
                      ? `您已使用 ${prompts.length}/10 条本地记录。登录后可享受无限云端存储！`
                      : `You've used ${prompts.length}/10 local records. Sign in for unlimited cloud storage!`)
                }
              </p>
              <button
                onClick={() => setShowLoginPrompt(true)}
                className="bg-state-warning hover:bg-state-warning/80 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {language === 'zh' ? '立即登录解锁' : 'Sign In to Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-text-primary">{t.historyTitle}</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-scene-fillLight rounded-lg text-sm">
          {user ? (
            <>
              <Cloud className="w-4 h-4 text-keyLight" />
              <span className="text-text-secondary">
                {t.storageCloud}
              </span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary">
                {t.storageLocalLimit.replace('{{count}}', String(prompts.length))}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.historySearch}
            className="w-full pl-10 pr-4 py-2.5 border border-keyLight/20 rounded-lg focus:ring-2 focus:ring-keyLight/20 focus:border-transparent text-text-primary"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Filter className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterMode === 'all'
                    ? 'bg-keyLight text-white'
                    : 'bg-scene-fillLight text-text-secondary hover:bg-scene-fillLight'
                }`}
              >
                {t.historyFilterAll}
              </button>
              <button
                onClick={() => setFilterMode('quick')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterMode === 'quick'
                    ? 'bg-keyLight text-white'
                    : 'bg-scene-fillLight text-text-secondary hover:bg-scene-fillLight'
                }`}
              >
                {t.historyFilterQuick}
              </button>
              <button
                onClick={() => setFilterMode('director')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterMode === 'director'
                    ? 'bg-keyLight text-white'
                    : 'bg-scene-fillLight text-text-secondary hover:bg-scene-fillLight'
                }`}
              >
                {t.historyFilterDirector}
              </button>
            </div>
          </div>

          <div className="flex justify-end sm:justify-start">
            <span className="text-sm text-text-secondary mr-auto sm:mr-0">
              {filteredAndSortedPrompts.length} {t.language === 'zh' ? '条记录' : 'results'}
            </span>
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
        <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-12 text-center">
          <Search className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">{t.historyNoResults}</h3>
          <p className="text-text-secondary">{t.historyEmptyDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-5 hover:shadow-depth-lg transition-shadow overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium mb-1 truncate">
                    {prompt.user_input}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary flex-wrap">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate font-code">{formatDate(prompt.created_at)}</span>
                    <span className="px-2 py-0.5 bg-scene-fillLight rounded text-text-secondary whitespace-nowrap">
                      {prompt.mode === 'quick' ? t.historyFilterQuick : t.historyFilterDirector}
                    </span>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getScoreColor(prompt.quality_score)}`}>
                  {prompt.quality_score}
                </div>
              </div>

              <div className="mb-4 bg-scene-fillLight rounded-lg p-3 border border-keyLight/10 overflow-hidden">
                <p className="text-text-secondary text-sm line-clamp-3 break-words overflow-wrap-anywhere">
                  {prompt.generated_prompt}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectPrompt(prompt)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-keyLight hover:bg-keyLight-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  {t.view}
                </button>
                <button
                  onClick={() => handleDeleteClick(prompt.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-state-error/10 hover:bg-red-100 text-state-error text-sm font-medium rounded-lg transition-colors"
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

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative max-w-md">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-scene-fill rounded-full shadow-depth-lg flex items-center justify-center text-text-secondary hover:text-text-primary z-10"
            >
              ×
            </button>
            <LoginPrompt
              onLoginSuccess={() => setShowLoginPrompt(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
