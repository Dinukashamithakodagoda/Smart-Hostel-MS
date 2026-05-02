import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';

type NoticeAudience = 'Student' | 'All';

type NoticeComposerProps = {
  className?: string;
  heading?: string;
  description?: string;
};

export const NoticeComposer = ({
  className,
  heading = 'Post Notice',
  description = 'Send updates to student dashboards.',
}: NoticeComposerProps) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<NoticeAudience>('Student');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !content.trim()) {
      setError('Title and message are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${apiBaseUrl}/api/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), audience }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Failed to post notice');
      }

      setSuccess('Notice posted successfully.');
      setTitle('');
      setContent('');
      setAudience('Student');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to post notice';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`border border-gray-200 dark:border-gray-700 p-6 rounded-xl bg-white dark:bg-gray-800 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300 rounded-lg">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{heading}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-400/40 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700 dark:border-green-400/40 dark:bg-green-500/10 dark:text-green-200">
            {success}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g., Water supply interruption"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
            rows={3}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the notice message for students..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Audience</label>
            <select
              value={audience}
              onChange={(event) => setAudience(event.target.value as NoticeAudience)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
            >
              <option value="Student">Students Only</option>
              <option value="All">All Users</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 text-xs font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Posting...' : 'Post Notice'}
          </button>
        </div>
      </form>
    </div>
  );
};
