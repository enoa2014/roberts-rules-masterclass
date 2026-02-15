"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { Loader2, Plus, MessageSquare, Send, ArrowLeft, X } from "lucide-react";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

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
        setPosts((prev) =>
          prev.map((p) =>
            p.id === selectedPost.id
              ? { ...p, commentCount: p.commentCount + 1 }
              : p
          )
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="留言讨论" description="分享学习心得，与同学们交流互动">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Left: Post List */}
        <div
          className={`bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden ${selectedPost ? "hidden lg:flex" : "flex"
            }`}
        >
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">全部话题</h3>
            <button
              onClick={() => {
                setShowPostForm(true);
                setSelectedPost(null);
              }}
              className="button text-xs px-3 py-1.5 h-auto"
            >
              <Plus className="mr-1 h-3 w-3" /> 发帖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">暂无话题</p>
                <p className="text-gray-300 text-xs mt-1">点击“发帖”开始讨论</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setShowPostForm(false);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${selectedPost?.id === post.id
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "hover:bg-gray-50 border-transparent hover:border-gray-100"
                    }`}
                >
                  <h4
                    className={`font-bold text-sm mb-1.5 ${selectedPost?.id === post.id
                        ? "text-primary"
                        : "text-gray-900"
                      }`}
                  >
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                      {post.nickname || "匿名"} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 badge bg-gray-50 text-gray-500 px-2 py-0.5">
                      <MessageSquare className="h-3 w-3" /> {post.commentCount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Content or Form */}
        <div
          className={`col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden ${!selectedPost && !showPostForm ? "hidden lg:flex" : "flex"
            }`}
        >
          {showPostForm ? (
            <div className="p-7 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">发布新话题</h3>
                <button
                  onClick={() => setShowPostForm(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <input
                  className="input font-bold"
                  placeholder="输入标题..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                />
                <textarea
                  className="input h-52 py-3 resize-none"
                  placeholder="分享你的想法..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button"
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    发布话题
                  </button>
                </div>
              </form>
            </div>
          ) : selectedPost ? (
            <>
              {/* Post Header */}
              <div className="p-7 border-b border-gray-50">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="lg:hidden flex items-center gap-1 text-gray-500 text-sm mb-4 hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> 返回列表
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2.5 text-sm text-gray-500 mb-5">
                  <div className="h-7 w-7 rounded-full gradient-primary text-white flex items-center justify-center text-xs font-bold">
                    {selectedPost.nickname?.[0]}
                  </div>
                  <span className="font-medium text-gray-700">{selectedPost.nickname}</span>
                  <span className="text-gray-300">·</span>
                  <span>{new Date(selectedPost.createdAt).toLocaleString()}</span>
                </div>
                <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>

              {/* Comments */}
              <div className="flex-1 overflow-y-auto p-7 bg-gray-50/50">
                <h4 className="font-bold text-sm text-gray-500 mb-5">
                  评论 ({comments.length})
                </h4>
                <div className="space-y-4">
                  {loadingComments ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      暂无评论，来说说你的想法吧
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">
                          {comment.nickname?.[0]}
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm flex-1">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-semibold text-xs text-gray-900">
                              {comment.nickname}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-4 bg-white border-t border-gray-50">
                <form
                  onSubmit={handleCreateComment}
                  className="flex gap-2"
                >
                  <input
                    className="flex-1 h-11 border border-gray-200 rounded-full px-5 text-sm bg-gray-50
                             focus:bg-white transition-all duration-200 outline-none
                             focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="写下你的评论..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button rounded-full w-11 h-11 px-0 flex items-center justify-center"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <MessageSquare className="h-12 w-12 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">选择左侧话题查看详情</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
