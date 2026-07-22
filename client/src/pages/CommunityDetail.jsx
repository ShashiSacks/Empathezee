import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Container, Card, FormGroup, Input, Button } from '../components/ui';

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
      <Container size="md" style={{ textAlign: 'center', paddingTop: 'var(--space-12)' }}>
        <h2>Community Not Found</h2>
        <Link to="/communities" style={{ textDecoration: 'none' }}>
          <Button variant="primary" style={{ marginTop: 'var(--space-4)' }}>Back to Communities</Button>
        </Link>
      </Container>
    );
  }

  return (
    <main style={{ flex: 1 }}>
      {/* Community Header Banner */}
      <div style={{ background: 'linear-gradient(145deg, var(--primary-50) 0%, var(--accent-50) 100%)', borderBottom: '1px solid var(--border)', padding: 'var(--space-8) var(--space-6)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <Link to="/communities" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm" icon={<i className="fa-solid fa-arrow-left"></i>} style={{ marginBottom: 'var(--space-4)' }}>
              All Communities
            </Button>
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-xl)', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, boxShadow: 'var(--shadow-blue)' }}>
              🏥
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-2)', color: 'var(--text)' }}>
                {community.name}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <span className="badge badge-blue"><i className="fa-solid fa-virus"></i> {community.disease}</span>
                <span className="badge badge-green"><span className="online-dot"></span> Active Community</span>
                {community.type === 'online' ? <span className="badge badge-teal">🌐 Online</span> : <span className="badge badge-orange">🏢 In-Person</span>}
                {community.paymentType === 'free' ? <span className="badge badge-green">Free</span> : <span className="badge badge-red">₹{community.price}</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '640px', margin: 0 }}>
                {community.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Feed */}
      <Container size="lg">
        {/* Post Composer */}
        <Card accentBorder="primary" padding="lg" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div className="feed-avatar" style={{ fontSize: '0.9rem', flexShrink: 0 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user?.username}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Share with the community</div>
            </div>
          </div>

          <form onSubmit={handleCreatePost}>
            <FormGroup label="Post Title" htmlFor="post-title" required>
              <Input type="text" id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" required />
            </FormGroup>

            <FormGroup label="Share Your Experience" htmlFor="post-content" required>
              <textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a question, experience, or supportive message..."
                required
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--border)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  color: 'var(--text)',
                  outline: 'none',
                }}
              ></textarea>
            </FormGroup>

            <Button type="submit" variant="primary" size="sm" icon={<i className="fa-solid fa-paper-plane"></i>}>
              Post to Community
            </Button>
          </form>
        </Card>

        {/* Feed Posts */}
        <h2 style={{ textAlign: 'left', fontSize: '1.2rem', marginBottom: 'var(--space-4)', color: 'var(--text)', fontWeight: 700 }}>
          <i className="fa-solid fa-message" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> Community Feed
        </h2>

        {posts.length === 0 ? (
          <Card padding="lg" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>💬</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 var(--space-2)' }}>No Posts Yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Start the discussion by creating the first post above!</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {posts.map((post) => (
              <Card key={post._id} padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
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

                <h3 style={{ textAlign: 'left', fontSize: '1.15rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text)' }}>{post.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>{post.content}</p>

                {/* Comments Section */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Comments ({post.comments?.length || 0})
                  </h4>

                  {post.comments && post.comments.map((comm, cIdx) => (
                    <div key={cIdx} style={{ background: 'var(--bg-warm)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--primary)' }}>{comm.author?.username || 'User'}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{comm.text}</div>
                    </div>
                  ))}

                  <form onSubmit={(e) => handleAddComment(e, post._id)} style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                      />
                    </div>
                    <Button type="submit" variant="primary" size="sm">Comment</Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
