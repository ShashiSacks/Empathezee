import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommunityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/communities/${id}`);
      setCommunity(res.data.community);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/posts', {
        community: id,
        disease: community?.disease,
        title,
        content,
      });
      setTitle('');
      setContent('');
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text) return;

    try {
      await api.post(`/api/comments/${postId}`, { text });
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      fetchDetails();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <main className="page-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Community Not Found</h2>
        <Link to="/communities" className="btn-primary" style={{ marginTop: '16px' }}>Back to Communities</Link>
      </main>
    );
  }

  return (
    <main>
      {/* Community Header Banner */}
      <div style={{ background: 'linear-gradient(145deg, var(--primary-50) 0%, var(--accent-50) 100%)', borderBottom: '1px solid var(--border)', padding: '40px 24px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Link to="/communities" className="btn-outline btn-sm" style={{ borderRadius: '999px', marginBottom: '20px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <i className="fa-solid fa-arrow-left"></i> All Communities
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, boxShadow: 'var(--shadow-blue)' }}>
              🏥
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '6px', color: 'var(--text)' }}>
                {community.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <span className="badge badge-blue"><i className="fa-solid fa-virus"></i> {community.disease}</span>
                <span className="badge badge-green"><span className="online-dot"></span> Active Community</span>
                {community.type === 'online' ? <span className="badge badge-teal">🌐 Online</span> : <span className="badge badge-orange">🏢 In-Person</span>}
                {community.paymentType === 'free' ? <span className="badge badge-green">Free</span> : <span className="badge badge-red">₹{community.price}</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '640px', margin: 0 }}>
                {community.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Feed */}
      <div className="page-container" style={{ paddingTop: '32px', maxWidth: '1000px' }}>
        {/* Post Composer */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px', borderTop: '3px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="feed-avatar" style={{ fontSize: '0.9rem', flexShrink: 0 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user?.username}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Share with the community</div>
            </div>
          </div>

          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
              <label htmlFor="post-title">Post Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" required />
            </div>
            <div className="form-group">
              <label htmlFor="post-content">Share Your Experience</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Share a question, experience, or supportive message..." required style={{ minHeight: '100px' }}></textarea>
            </div>
            <button type="submit" className="btn-gradient btn-sm" style={{ alignSelf: 'flex-start' }}>
              <i className="fa-solid fa-paper-plane"></i> Post to Community
            </button>
          </form>
        </div>

        {/* Feed Posts */}
        <h2 style={{ textAlign: 'left', fontSize: '1.15rem', marginBottom: '16px', color: 'var(--text)', fontWeight: 700 }}>
          <i className="fa-solid fa-message" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> Community Feed
        </h2>

        {posts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">💬</span>
            <h3>No Posts Yet</h3>
            <p>Start the discussion by creating the first post above!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {posts.map((post) => (
              <div key={post._id} className="card" style={{ padding: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="feed-avatar">{post.author?.username?.charAt(0).toUpperCase() || 'A'}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{post.author?.username || 'Anonymous'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  {post.status && (
                    <span className={`badge status-${post.status.toLowerCase()}`}>{post.status}</span>
                  )}
                </div>

                <h3 style={{ textAlign: 'left', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>{post.content}</p>

                {/* Comments Section */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Comments ({post.comments?.length || 0})
                  </h4>

                  {post.comments && post.comments.map((comm, cIdx) => (
                    <div key={cIdx} style={{ background: 'var(--bg-warm)', padding: '10px 14px', borderRadius: 'var(--radius)', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--primary)' }}>{comm.author?.username || 'User'}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{comm.text}</div>
                    </div>
                  ))}

                  <form onSubmit={(e) => handleAddComment(e, post._id)} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn-primary btn-sm">Comment</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
