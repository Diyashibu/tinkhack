import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import './CommunityPage.css';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const email = 'diyathereseshibu@gmail.com'; // Hardcoded email

  // Fetch posts from Supabase on component load
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, content, email, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
        setPosts([]);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // Handle submitting a new post
  const handlePost = async () => {
    if (!content.trim()) return;

    const newPost = {
      content,
      email,
      created_at: new Date().toISOString(), // Store in UTC format
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([newPost])
      .select(); // Fetch inserted row immediately

    if (error) {
      console.error('Error adding post:', error.message);
    } else {
      console.log('Post added successfully:', data);
      // Display new post instantly without re-fetching
      setPosts((prevPosts) => [data[0], ...prevPosts]);
      setContent('');
    }
  };

  // Convert UTC to IST (Indian Standard Time)
  const formatDateToLocal = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="community-container">
      <h1 className="title">Community Support</h1>

      {/* Posts section taking full width */}
      <div className="posts-container">
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <span className="email">By: {post.email}</span>
                <span className="timestamp">{formatDateToLocal(post.created_at)}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet. Be the first to share!</p>
        )}
      </div>

      {/* Post input box */}
      <div className="post-form">
        <div className="email-display">Posting as: {email}</div>
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handlePost} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;