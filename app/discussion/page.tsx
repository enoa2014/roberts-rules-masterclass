"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Loader2, Plus, MessageSquare, Heart, Send } from "lucide-react";
import { useSession } from "next-auth/react";

type Post = {
  id: number;
  title: string;
  content: string;
  nickname: string;
  createdAt: string;
  commentCount: number;
};

type Comment = {
  id: number;
  content: string;
  nickname: string;
  createdAt: string;
};

export default function DiscussionPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Forms
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/discussion/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: number) => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/discussion/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/discussion/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPostTitle, content: newPostContent }),
      });
      if (res.ok) {
        setShowPostForm(false);
        setNewPostTitle("");
        setNewPostContent("");
        fetchPosts();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/discussion/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: selectedPost.id, content: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(selectedPost.id);
        // Optimistically update reply count
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, commentCount: p.commentCount + 1 } : p));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="留言讨论" description="分享学习心得，与同学们交流互动">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 h-[calc(100vh-200px)]">
        {/* Left: Post List */}
        <div className={`bg-white rounded-xl border shadow-sm flex flex-col ${selectedPost ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">全部话题</h3>
            <button
              onClick={() => { setShowPostForm(true); setSelectedPost(null); }}
              className="button text-xs px-3 py-1.5 h-auto"
            >
              <Plus className="mr-1 h-3 w-3" /> 发帖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">暂无话题</div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  onClick={() => { setSelectedPost(post); setShowPostForm(false); }}
                  className={`p-4 rounded-lg cursor-pointer transition-colors border ${selectedPost?.id === post.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
                    }`}
                >
                  <h4 className={`font-bold text-sm mb-1 ${selectedPost?.id === post.id ? 'text-primary' : 'text-gray-900'}`}>
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.content}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{post.nickname || '匿名'} · {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> {post.commentCount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Content or Form */}
        <div className={`col-span-2 bg-white rounded-xl border shadow-sm flex flex-col ${!selectedPost && !showPostForm ? 'hidden lg:flex' : 'flex'}`}>
          {showPostForm ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">发布新话题</h3>
                <button onClick={() => setShowPostForm(false)} className="text-gray-400 hover:text-gray-600">
                  取消
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <input
                  className="w-full p-3 border rounded-lg font-bold"
                  placeholder="标题"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  required
                />
                <textarea
                  className="w-full p-3 border rounded-lg h-60"
                  placeholder="内容..."
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button type="submit" disabled={submitting} className="button">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 发布
                  </button>
                </div>
              </form>
            </div>
          ) : selectedPost ? (
            <>
              {/* Post Header */}
              <div className="p-6 border-b">
                <button onClick={() => setSelectedPost(null)} className="lg:hidden text-gray-500 text-sm mb-4">
                  &larr; 返回列表
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPost.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {selectedPost.nickname?.[0]}
                  </div>
                  {selectedPost.nickname} · {new Date(selectedPost.createdAt).toLocaleString()}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <h4 className="font-bold text-sm text-gray-500 mb-4">评论 ({comments.length})</h4>
                <div className="space-y-4">
                  {loadingComments ? (
                    <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></div>
                  ) : comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                        {comment.nickname?.[0]}
                      </div>
                      <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs text-gray-900">{comment.nickname}</span>
                          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-4 bg-white border-t">
                <form onSubmit={handleCreateComment} className="flex gap-2">
                  <input
                    className="flex-1 border rounded-full px-4 text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="写下你的评论..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    required
                  />
                  <button type="submit" disabled={submitting} className="button rounded-full w-10 h-10 px-0 flex items-center justify-center">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              选择左侧话题查看详情
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
