import React, { useState } from 'react';
import styles from '../Styles/BlogCard.module.css';

const BlogCard = ({ blog, user }) => {
    const [likes, setLikes] = useState(blog.likes);
    const [comments, setComments] = useState(blog.comments);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingBlog, setEditingBlog] = useState(false);
    const [blogContent, setBlogContent] = useState(blog.content);
  
    const handleLike = () => {
      setLikes(likes + 1);
      // Add logic to handle like in the backend
    };
  
    const handleAddComment = () => {
      const comment = {
        id: comments.length + 1,
        user: user.name,
        content: newComment,
        editable: true,
      };
      setComments([...comments, comment]);
      setNewComment('');
      // Add logic to handle adding comment in the backend
    };
  
    const handleEditComment = (commentId, content) => {
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, content } : comment
        )
      );
      setEditingCommentId(null);
      // Add logic to handle editing comment in the backend
    };
  
    const handleDeleteComment = (commentId) => {
      setComments(comments.filter((comment) => comment.id !== commentId));
      // Add logic to handle deleting comment in the backend
    };
  
    const handleEditBlog = () => {
      setEditingBlog(false);
      // Add logic to handle editing blog in the backend
    };
  
    const handleDeleteBlog = () => {
      // Add logic to handle deleting blog in the backend
    };
  
    return (
      <div className={styles.blogCard}>
        <div className={styles.header}>
          <div className={styles.ownerInfo}>
            <img src={blog.ownerAvatar} alt="Owner" className={styles.ownerAvatar} />
            <div className={styles.ownerName}>{blog.user}</div>
          </div>
          <div>
            {blog.user === user.name && (
              <div>
                <button onClick={() => setEditingBlog(true)} className={styles.button}>Edit</button>
                <button onClick={handleDeleteBlog} className={styles.button}>Delete</button>
              </div>
            )}
          </div>
        </div>
        {editingBlog ? (
          <div>
            <textarea
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              className={styles.textarea}
            />
            <button onClick={handleEditBlog} className={styles.button}>Save</button>
          </div>
        ) : (
          <div>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
          </div>
        )}
        <div className={styles.actions}>
          <button onClick={handleLike} className={styles.button}>Like ({likes})</button>
        </div>
        <div className={styles.comments}>
          <h4>Comments</h4>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p>
                <strong>{comment.user}</strong>: {comment.content}
              </p>
              {comment.editable && (
                <div>
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={comment.content}
                        onChange={(e) => setComments(
                          comments.map((c) => c.id === comment.id ? { ...c, content: e.target.value } : c)
                        )}
                        className={styles.textarea}
                      />
                      <button
                        onClick={() => handleEditComment(comment.id, comment.content)}
                        className={styles.button}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setEditingCommentId(comment.id)}
                        className={styles.button}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className={styles.button}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className={styles.addComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.textarea}
            />
            <button onClick={handleAddComment} className={styles.button}>Add Comment</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default BlogCard;
