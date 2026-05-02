import React, { useEffect, useState } from 'react';
import { Bell, Pencil, Trash2, RefreshCw, Save, X } from 'lucide-react';

type NoticeAudience = 'Student' | 'All';

type NoticeAuthor = {
  name?: string;
  email?: string;
  role?: string;
};

type Notice = {
  _id: string;
  title: string;
  content: string;
  audience: NoticeAudience;
  createdAt: string;
  createdBy?: NoticeAuthor | null;
};

type NoticeManagerProps = {
  className?: string;
  heading?: string;
  description?: string;
};

export const NoticeManager = ({
  className,
  heading = 'Manage Notices',
  description = 'Edit or remove previously posted notices.',
}: NoticeManagerProps) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: '', content: '', audience: 'Student' as NoticeAudience });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/notices/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to load notices');
      }

      const data = await response.json();
      setNotices(data.notices || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notices';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const startEdit = (notice: Notice) => {
    setEditingId(notice._id);
    setDraft({ title: notice.title, content: notice.content, audience: notice.audience });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ title: '', content: '', audience: 'Student' });
  };

  const saveEdit = async (noticeId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/notices/${noticeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: draft.title.trim(),
          content: draft.content.trim(),
          audience: draft.audience,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to update notice');
      }

      const data = await response.json();
      const updated = data.notice as Notice | undefined;
      setNotices((prev) => prev.map((item) => (item._id === noticeId && updated ? updated : item)));
      cancelEdit();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update notice';
      setError(message);
    }
  };

  const removeNotice = async (noticeId: string) => {
    if (!window.confirm('Delete this notice?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/notices/${noticeId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to delete notice');
      }

      setNotices((prev) => prev.filter((item) => item._id !== noticeId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete notice';
      setError(message);
    }
  };

  return (
    <div className={`border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800 ${className || ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300 rounded-lg">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{heading}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <button
          onClick={fetchNotices}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200 mb-3">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No notices posted yet.</p>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => {
            const isEditing = editingId === notice._id;
            const authorName = notice.createdBy?.name || 'Staff';
            const authorRole = notice.createdBy?.role ? ` (${notice.createdBy?.role})` : '';
            return (
              <div key={notice._id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gray-50/60 dark:bg-gray-800/60">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notice.createdAt).toLocaleDateString()} • {authorName}{authorRole}
                    </p>
                    {isEditing ? (
                      <input
                        value={draft.title}
                        onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                        className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{notice.title}</h4>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
                      {notice.audience === 'All' ? 'All Users' : 'Students'}
                    </span>
                    {isEditing ? (
                      <select
                        value={draft.audience}
                        onChange={(event) => setDraft((prev) => ({ ...prev, audience: event.target.value as NoticeAudience }))}
                        className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg p-1.5"
                      >
                        <option value="Student">Students Only</option>
                        <option value="All">All Users</option>
                      </select>
                    ) : null}
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    rows={3}
                    value={draft.content}
                    onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-300">{notice.content}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(notice._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(notice)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => removeNotice(notice._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/40 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/60"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
