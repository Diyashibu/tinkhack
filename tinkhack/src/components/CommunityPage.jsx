import React, { useState, useEffect, useRef } from 'react';
import supabase from '../supabase';
import './CommunityPage.css';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const email = 'diyathereseshibu@gmail.com'; // Hardcoded email
  const postsContainerRef = useRef(null);

  // Fetch posts from Supabase on component load
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, content, email, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error.message);
          setPosts([]);
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.post-menu-container')) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Handle submitting a new post
  const handlePost = async () => {
    if (!content.trim()) return;
    
    setIsPosting(true);
    
    const newPost = {
      content: content.trim(),
      email,
      created_at: new Date().toISOString(), // Store in UTC format
    };

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([newPost])
        .select();

      if (error) {
        console.error('Error adding post:', error.message);
      } else if (data && data.length > 0) {
        console.log('Post added successfully:', data);
        // Display new post at the bottom instead of the top
        setPosts((prevPosts) => [...prevPosts, data[0]]);
        setContent('');
        
        // Scroll to bottom of posts container to see new post
        if (postsContainerRef.current) {
          postsContainerRef.current.scrollTop = postsContainerRef.current.scrollHeight;
        }
      }
    } catch (err) {
      console.error('Unexpected error during post:', err);
    } finally {
      setIsPosting(false);
    }
  };

  // Toggle menu for a post
  const toggleMenu = (e, postId) => {
    e.stopPropagation(); // Prevent the document click handler from running
    setOpenMenuId(openMenuId === postId ? null : postId);
  };

  // Start editing a post
  const startEdit = (e, post) => {
    e.stopPropagation();
    setEditingId(post.id);
    setEditContent(post.content);
    setOpenMenuId(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  // Save edited post
  const saveEdit = async () => {
    if (!editContent.trim() || !editingId) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content: editContent.trim() })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating post:', error.message);
      } else {
        setPosts(posts.map(post => 
          post.id === editingId 
            ? { ...post, content: editContent.trim() } 
            : post
        ));
        setEditingId(null);
        setEditContent('');
      }
    } catch (err) {
      console.error('Unexpected error during edit:', err);
    }
  };

  // Delete a post
  const deletePost = async (e, postId) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error.message);
      } else {
        setPosts(posts.filter(post => post.id !== postId));
        setOpenMenuId(null);
      }
    } catch (err) {
      console.error('Unexpected error during delete:', err);
    }
  };

  // Handle pressing Enter to submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  // Format date to readable format
  const formatDateToLocal = (utcDate) => {
    if (!utcDate) return '';
    
    try {
      const date = new Date(utcDate);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return String(utcDate);
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community</h1>
      </div>
      
      <div className="posts-container" ref={postsContainerRef}>
        {loading ? (
          <div className="loading-indicator">Loading posts...</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <span className="post-email">{post.email}</span>
                <div className="post-menu-container">
                  <button 
                    className="post-menu-button" 
                    onClick={(e) => toggleMenu(e, post.id)}
                  >
                    ...
                  </button>
                  {openMenuId === post.id && (
                    <div className="post-menu">
                      <button onClick={(e) => startEdit(e, post)}>Edit</button>
                      <button onClick={(e) => deletePost(e, post.id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="post-body">
                {editingId === post.id ? (
                  <div className="edit-controls">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-textarea"
                    />
                    <div className="edit-buttons">
                      <button onClick={saveEdit} disabled={!editContent.trim()}>
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{post.content}</p>
                )}
              </div>
              
              <div className="post-footer">
                <span className="post-timestamp">{formatDateToLocal(post.created_at)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts-message">No posts yet. Be the first to share!</p>
        )}
      </div>
      
      <div className="input-container">
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPosting}
          className="limited-width-textarea"
        />
        <button 
          onClick={handlePost} 
          disabled={isPosting || !content.trim()}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;