import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const GROUPS = [
  'All Groups',
  'Mindfulness & Serenity',
  'Desk & Office Relief',
  'Face Yoga Glow',
  'Morning Movers',
  'Beginners Circle'
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('All Groups');
  const [postContent, setPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.getCommunityFeed();
      if (res?.data) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error('Community fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      const payload = {
        content: postContent,
        group_category: selectedGroup === 'All Groups' ? 'Mindfulness & Serenity' : selectedGroup,
        author_name: user?.name || 'Mindful Seeker'
      };
      const res = await api.createCommunityPost(payload);
      if (res?.post) {
        setPosts((prev) => [res.post, ...prev]);
        setPostContent('');
      }
    } catch (err) {
      alert('Unable to post reflection at this moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p))
      );
      await api.likePost(postId);
    } catch (err) {}
  };

  const filteredPosts = selectedGroup === 'All Groups'
    ? posts
    : posts.filter((p) => p.group_category === selectedGroup);

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-900 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Compassionate Community Circle</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Mindful Reflections & Support
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          A moderated, gentle haven to share insights, celebrate daily streaks, and encourage fellow practitioners on the path.
        </p>
      </div>

      {/* Share Reflection Input Box */}
      <div className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-4">
        <h3 className="font-serif text-lg font-bold text-stone-900">
          Share a Practice Reflection or Daily Gratitude
        </h3>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            rows={3}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What shifted in your mind or body during your breath or yoga session today?..."
            className="w-full px-4 py-3 rounded-2xl border border-sage-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 font-medium">Post to:</span>
              <select
                value={selectedGroup === 'All Groups' ? 'Mindfulness & Serenity' : selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-sage-200 text-xs font-semibold text-stone-700 bg-white"
              >
                {GROUPS.filter((g) => g !== 'All Groups').map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!postContent.trim() || submitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Sharing...' : 'Share with Circle'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Group Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-4 h-4 text-stone-400 mr-1 flex-shrink-0" />
        {GROUPS.map((grp) => (
          <button
            key={grp}
            onClick={() => setSelectedGroup(grp)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              selectedGroup === grp
                ? 'bg-sage-700 text-white shadow-sm'
                : 'bg-white/80 border border-sage-200 text-stone-700 hover:bg-sage-100'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="zen-glass p-6 rounded-3xl border border-sage-200/90 subtle-shadow space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-sage-200 text-sage-800 font-bold flex items-center justify-center text-sm">
                  {post.author_name ? post.author_name[0] : 'S'}
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold">{post.author_name}</strong>
                  <span className="text-[11px] text-stone-500">
                    {new Date(post.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800">
                {post.group_category || 'Mindfulness'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            <div className="pt-2 border-t border-sage-100 flex items-center justify-between">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors p-1 rounded-lg hover:bg-rose-50"
              >
                <Heart className="w-4 h-4 fill-rose-500/20" />
                <span>{post.likes_count || 0} Gentle Hearts</span>
              </button>

              <span className="text-[11px] text-stone-400">Moderated Sanctuary Community</span>
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Medical Notice */}
      <div className="pt-4">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
