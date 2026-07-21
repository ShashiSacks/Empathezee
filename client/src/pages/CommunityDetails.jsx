import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const CommunityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  
  const [chatInput, setChatInput] = useState('');
  const chatMessagesRef = useRef(null);
  const socketRef = useRef(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    initSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [commRes, postsRes, chatRes] = await Promise.all([
        axios.get(`/api/communities/${id}`),
        axios.get(`/api/communities/${id}/posts`),
        axios.get(`/chat/community/${id}`)
      ]);
      setCommunity(commRes.data);
      setPosts(postsRes.data);
      setChatMessages(chatRes.data);
    } catch (err) {
      console.error('Failed to load community details', err);
    } finally {
      setLoading(false);
    }
  };

  const initSocket = () => {
    socketRef.current = io();
    const commRoomId = `community_${id}`;
    
    socketRef.current.emit('join-room', commRoomId);
    
    socketRef.current.on('new-message', (msg) => {
      if (msg.community && msg.community.toString() === id) {
        setChatMessages(prev => [...prev, msg]);
      }
    });

    socketRef.current.on('new-post', (post) => {
      setPosts(prev => [post, ...prev]);
    });

    socketRef.current.on('post-liked', (data) => {
      setPosts(prev => prev.map(p => p._id === data.postId ? { ...p, likes: new Array(data.likes) } : p));
    });

    socketRef.current.on('post-unliked', (data) => {
      setPosts(prev => prev.map(p => p._id === data.postId ? { ...p, likes: new Array(data.likes) } : p));
    });

    socketRef.current.on('new-comment', (comment) => {
      setPosts(prev => prev.map(p => {
        if (p._id === comment.post) {
          const currentComments = p.comments || [];
          return { ...p, comments: [...currentComments, comment] };
        }
        return p;
      }));
    });
  };

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new URLSearchParams();
      payload.append('community', id);
      payload.append('disease', community.disease);
      payload.append('title', postTitle);
      payload.append('content', postContent);
      
      await axios.post('/api/posts', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      setPostTitle('');
      setPostContent('');
      // Optimistic update via socket 'new-post' event, or just refetch here
    } catch (err) {
      alert('Failed to submit post');
    }
  };

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    
    socketRef.current.emit('send-message', {
      roomId: `community_${id}`,
      content: text,
      communityId: id
    });
    setChatInput('');
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter') handleSendChat();
  };

  const toggleCommentForm = (postId) => {
    const el = document.getElementById(`comment-form-${postId}`);
    if (el) {
      const isHidden = el.style.display === 'none' || el.style.display === '';
      el.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) el.querySelector('input').focus();
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    try {
      const payload = new URLSearchParams();
      payload.append('postId', postId);
      payload.append('content', content);
      
      await axios.post('/api/comments', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      e.target.reset();
      // Socket will broadcast 'new-comment'
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  const handleLikePost = async (e, postId) => {
    e.preventDefault();
    try {
      await axios.post(`/api/posts/like/${postId}`);
      // Socket handles UI update
    } catch (err) {
      alert('Failed to like post');
    }
  };

  if (loading || !community) {
    return <main className="page-container" style={{ textAlign: 'center', padding: '100px' }}><h2>Loading Community...</h2></main>;
  }

  return (
    <main>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(145deg, var(--primary-50) 0%, var(--accent-50) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 24px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', background: 'radial-gradient(circle,rgba(37,99,235,0.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

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
                {community.type === 'online' ? (
                  <span className="badge badge-teal">🌐 Online</span>
                ) : (
                  <span className="badge badge-orange">🏢 In-Person</span>
                )}
                {community.paymentType === 'free' ? (
                  <span className="badge badge-green"><i className="fa-solid fa-circle-check"></i> Free</span>
                ) : (
                  <span className="badge badge-red">₹{community.price}</span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '640px', margin: 0 }}>
                {community.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container" style={{ paddingTop: '32px', maxWidth: '1300px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'flex-start' }}>

          {/* Left: Post Feed */}
          <div>
            <div className="card" style={{ padding: '24px', marginBottom: '20px', borderTop: '3px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="feed-avatar" style={{ fontSize: '0.9rem', flexShrink: 0 }}>
                  {(user?.username || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{user?.username}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Share with the community</div>
                </div>
              </div>

              <form onSubmit={handlePostSubmit} style={{ gap: '12px' }}>
                <div className="form-group">
                  <label>Post Title</label>
                  <input type="text" placeholder="What's on your mind?" required value={postTitle} onChange={e => setPostTitle(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Share Your Experience</label>
                  <textarea placeholder="Share a question, experience, or supportive message..." required style={{ minHeight: '100px' }} value={postContent} onChange={e => setPostContent(e.target.value)}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <button type="submit" className="btn-gradient btn-sm" style={{ minWidth: 'unset' }}>
                    <i className="fa-solid fa-paper-plane"></i> Post to Community
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <i className="fa-solid fa-shield-halved"></i> All posts are moderated for safety
                  </span>
                </div>
              </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ textAlign: 'left', fontSize: '1.15rem', margin: 0, color: 'var(--text)', fontWeight: 700 }}>
                <i className="fa-solid fa-message" style={{ color: 'var(--primary)', marginRight: '6px' }}></i> Community Feed
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {posts.length} post{posts.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div id="posts-container">
              {posts.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">💬</span>
                  <h3>No posts yet</h3>
                  <p>Be the first to share your experience with this community. Your story might help someone today.</p>
                </div>
              ) : (
                posts.map(post => (
                  <article key={post._id} className="feed-post">
                    <div className="feed-post-header">
                      <div className="feed-avatar">
                        {(post.author?.username || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div className="feed-post-meta">
                        <div className="feed-author">
                          {post.author?.username || 'Anonymous'}
                          {post.author?.role === 'doctor' && (
                            <span className="condition-badge" style={{ background: 'var(--accent-50)', color: 'var(--accent-dark)', borderColor: 'rgba(20,184,166,0.2)' }}>
                              <i className="fa-solid fa-stethoscope"></i> Doctor
                            </span>
                          )}
                          <span className="condition-badge">{community.disease}</span>
                        </div>
                        <div className="feed-time">
                          <span className={`status-${post.status.toLowerCase()}`} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', borderRadius: '999px' }}>
                            {post.status}
                          </span>
                          {post.aiReason && <>&nbsp;·&nbsp; <em style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{post.aiReason}</em></>}
                        </div>
                      </div>
                    </div>

                    <h3 style={{ textAlign: 'left', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 0 }}>{post.content}</p>

                    <div className="feed-reactions">
                      <form onSubmit={(e) => handleLikePost(e, post._id)} style={{ margin: 0, width: 'auto', background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
                        <button type="submit" className="reaction-btn">
                          ❤️ Support <span className="like-count" style={{ fontWeight: 700, color: 'var(--primary)' }}>({post.likes?.length || 0})</span>
                        </button>
                      </form>
                      <button className="reaction-btn helpful-btn" onClick={() => toggleCommentForm(post._id)}>
                        <i className="fa-solid fa-comment"></i> Reply
                      </button>
                      <button className="reaction-btn" style={{ cursor: 'default' }}>
                        <i className="fa-solid fa-circle-check" style={{ color: 'var(--secondary)' }}></i> Helpful
                      </button>
                    </div>

                    <div id={`comment-form-${post._id}`} style={{ display: 'none', marginTop: '12px' }}>
                      <form onSubmit={(e) => handleCommentSubmit(e, post._id)} style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0, flexDirection: 'row', gap: '8px', alignItems: 'flex-end' }}>
                        <input type="text" name="content" placeholder="Write a supportive reply..." required style={{ flex: 1, fontSize: '0.85rem', borderRadius: '999px', padding: '8px 16px' }} />
                        <button type="submit" className="btn-success btn-sm" style={{ minWidth: 'unset', flexShrink: 0 }}>
                          <i className="fa-solid fa-paper-plane"></i>
                        </button>
                      </form>
                    </div>

                    {post.comments && post.comments.length > 0 && (
                      <div className="comments" style={{ marginTop: '14px', padding: '14px', background: 'var(--bg-warm)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {post.comments.map(c => (
                          <div key={c._id || Math.random()} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                              {(c.author?.username || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '8px 12px', fontSize: '0.85rem', lineHeight: 1.5, flex: 1 }}>
                              <span style={{ fontWeight: 700, color: 'var(--text)' }}>{c.author?.username || 'Anonymous'}:</span>
                              <span style={{ color: 'var(--text-secondary)', marginLeft: '4px' }}>{c.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Right: Live Chat */}
          <div style={{ position: 'sticky', top: 'calc(var(--nav-h) + 16px)' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden', height: '580px', display: 'flex', flexDirection: 'column', borderTop: '3px solid var(--accent)' }}>
              
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>💬</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Live Group Chat</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="online-dot"></span> Real-time messaging
                  </div>
                </div>
              </div>

              <div ref={chatMessagesRef} style={{ flex: 1, padding: '14px', overflowY: 'auto', background: 'var(--bg-warm)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {chatMessages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', padding: '24px 16px', lineHeight: 1.6 }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>👋</div>
                    <strong>Welcome to Live Chat!</strong><br />
                    Messages are instant & real-time. Say hello!
                  </div>
                ) : (
                  chatMessages.map((msg, index) => {
                    const isMe = msg.sender?._id === user?.id || msg.sender?._id === user?._id;
                    return (
                      <div key={msg._id || index} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {msg.sender?.username} {msg.sender?.role === 'doctor' && ' 🩺'}
                        </span>
                        <div style={{ 
                          padding: '8px 14px', borderRadius: '16px', fontSize: '0.85rem', lineHeight: 1.4, maxWidth: '90%', wordBreak: 'break-word',
                          background: isMe ? 'var(--primary)' : (msg.sender?.role === 'doctor' ? 'var(--accent-50)' : 'var(--surface)'),
                          color: isMe ? 'white' : (msg.sender?.role === 'doctor' ? 'var(--accent-dark)' : 'var(--text)'),
                          border: isMe ? 'none' : (msg.sender?.role === 'doctor' ? '1px solid rgba(20,184,166,0.2)' : '1px solid var(--border)'),
                          borderTopRightRadius: isMe ? '4px' : '16px',
                          borderTopLeftRadius: isMe ? '16px' : '4px'
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ padding: '12px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  placeholder="Say something kind..." 
                  style={{ flex: 1, fontSize: '0.85rem', borderRadius: '999px', padding: '9px 16px', border: '1.5px solid var(--border)' }} 
                  autoComplete="off" 
                />
                <button onClick={handleSendChat} className="btn-primary btn-sm" style={{ margin: 0, minWidth: 'unset', borderRadius: '999px', padding: '9px 16px' }}>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-xl)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span>🆘</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--danger)' }}>Need Immediate Help?</span>
              </div>
              <a href="tel:112" className="btn-danger btn-sm btn-block">
                <i className="fa-solid fa-phone"></i> Emergency — Call 112
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CommunityDetails;
