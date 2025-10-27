import { useState, useEffect, useMemo } from 'react';
import { Clock, Trash2, Eye, Search, Filter, Cloud, HardDrive, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { PromptStorage } from '../lib/promptStorage';
import type { Prompt } from '../lib/supabase';
import type { LocalPrompt } from '../lib/promptStorage';
import SortDropdown from './SortDropdown';
import ConfirmModal from './ConfirmModal';
import { LoginPrompt } from './LoginPrompt';
import { Button, OptionButton, Badge } from './ui';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { SearchInput } from './SearchInput';

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
    if (score >= 90) return 'text-state-ok bg-state-ok/10 border border-state-ok/30';
    if (score >= 75) return 'text-state-info bg-state-info/10 border border-state-info/30';
    if (score >= 60) return 'text-state-warning bg-state-warning/10 border border-state-warning/30';
    return 'text-state-error bg-state-error/10 border border-state-error/30';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <LoadingState message={t.historyLoading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-state-error/10 border border-state-error/30 rounded-xl p-6 text-center">
          <p className="text-state-error mb-4">{error}</p>
          <Button
            onClick={loadHistory}
            variant="cut"
            size="md"
          >
            {t.language === 'zh' ? '重试' : 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <EmptyState
          icon={Clock}
          title={t.historyEmpty}
          description={t.historyEmptyDesc}
          action={
            !user ? (
              <LoginPrompt
                variant="compact"
                message={t.storageGuestTip}
                showBenefits={false}
              />
            ) : undefined
          }
        />
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
              <Button
                onClick={() => setShowLoginPrompt(true)}
                variant="rim"
                size="sm"
                className="hover:shadow-light"
              >
                {language === 'zh' ? '立即登录解锁' : 'Sign In to Unlock'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary">{t.historyTitle}</h2>
        <Badge
          variant={user ? 'info' : 'secondary'}
          size="md"
          className="flex items-center gap-2"
        >
          {user ? (
            <>
              <Cloud className="w-4 h-4" />
              <span>{t.storageCloud}</span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4" />
              <span>{t.storageLocalLimit.replace('{{count}}', String(prompts.length))}</span>
            </>
          )}
        </Badge>
      </div>

      <div className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-6 mb-6 space-y-5">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.historySearch}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Filter className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <div className="flex gap-2 flex-wrap">
              <OptionButton
                onClick={() => setFilterMode('all')}
                selected={filterMode === 'all'}
                className="!px-3 !py-1.5 text-sm"
                showCheckmark={false}
              >
                {t.historyFilterAll}
              </OptionButton>
              <OptionButton
                onClick={() => setFilterMode('quick')}
                selected={filterMode === 'quick'}
                className="!px-3 !py-1.5 text-sm"
                showCheckmark={false}
              >
                {t.historyFilterQuick}
              </OptionButton>
              <OptionButton
                onClick={() => setFilterMode('director')}
                selected={filterMode === 'director'}
                className="!px-3 !py-1.5 text-sm"
                showCheckmark={false}
              >
                {t.historyFilterDirector}
              </OptionButton>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-text-secondary">
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
        <EmptyState
          icon={Search}
          title={t.historyNoResults}
          description={t.historyEmptyDesc}
        />
      ) : (
        <div className="space-y-6">
          {filteredAndSortedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-scene-fill rounded-xl shadow-depth-md border border-keyLight/20 p-6 hover:shadow-depth-lg hover:border-keyLight/30 transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-semibold mb-2 truncate text-base">
                    {prompt.user_input}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary flex-wrap">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate font-code">{formatDate(prompt.created_at)}</span>
                    <Badge
                      variant="secondary"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      {prompt.mode === 'quick' ? t.historyFilterQuick : t.historyFilterDirector}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={
                    prompt.quality_score >= 90 ? 'success' :
                    prompt.quality_score >= 75 ? 'info' :
                    prompt.quality_score >= 60 ? 'warning' : 'danger'
                  }
                  size="md"
                  className="flex-shrink-0"
                >
                  {prompt.quality_score}
                </Badge>
              </div>

              <div className="mb-5 bg-scene-fillLight rounded-lg p-4 border border-keyLight/10 overflow-hidden hover:border-keyLight/20 transition-colors duration-300">
                <p className="text-text-secondary text-sm line-clamp-3 break-words overflow-wrap-anywhere leading-relaxed">
                  {prompt.generated_prompt}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onSelectPrompt(prompt)}
                  variant="preview"
                  size="md"
                  icon={Eye}
                  fullWidth
                  className="flex-1"
                  aria-label={`${t.view} ${prompt.user_input}`}
                >
                  {t.view}
                </Button>
                <Button
                  onClick={() => handleDeleteClick(prompt.id)}
                  variant="cut"
                  size="md"
                  icon={Trash2}
                  aria-label={`${t.delete} ${prompt.user_input}`}
                >
                  {t.delete}
                </Button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-medium backdrop-blur-sm animate-cut-fade">
          <div className="relative max-w-md animate-modal-enter">
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-scene-fill rounded-full shadow-depth-lg flex items-center justify-center text-text-secondary hover:text-text-primary z-10 border-2 border-keyLight/20 hover:border-keyLight/40 transition-all duration-300"
              aria-label={language === 'zh' ? '关闭' : 'Close'}
            >
              <X className="w-4 h-4" />
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
