import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import {
  getAllPosts,
  createPost,
  deletePost,
  getAllComments,
  postComment,
  incrementPostLike,
  resetPost
} from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css';
import { BASE_URL } from '@/config';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);

  const [postContent, setPostContent] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    }

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const handleUpload = async () => {
    if (!postContent && !fileContent) return;

    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent('');
    setFileContent(null);
    dispatch(getAllPosts());
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.wrapper}>
            {/* Create Post Section */}
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={
                  authState.user?.profilePicture
                    ? `${BASE_URL}/uploads/${authState.user.profilePicture}`
                    : `${BASE_URL}/uploads/default.jpg`
                }
                alt="Profile"
              />

              <textarea
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
                placeholder="What's in your mind?"
                className={styles.textAreaOfContent}
              ></textarea>

              <label htmlFor="fileUpload">
                <div className={styles.Fab}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </label>

              <input
                onChange={(e) => setFileContent(e.target.files[0])}
                type="file"
                hidden
                id="fileUpload"
              />

              {postContent.length > 0 && (
                <div onClick={handleUpload} className={styles.uploadButton}>
                  Post
                </div>
              )}
            </div>

            <div className={styles.postContainer}>
              {postState.posts && postState.posts.length > 0 ? (
                postState.posts.map((post) => {
                  if (!post.userId) return null;

                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.singleCard_profileContainer}>
                        <img
                          className={styles.userProfile}
                          src={
                            post.userId.profilePicture
                              ? `${BASE_URL}/uploads/${post.userId.profilePicture}`
                              : `${BASE_URL}/uploads/default.jpg`
                          }
                          alt="User"
                        />
                        <div>
                          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'space-between' }}>
                            <p style={{ fontWeight: 'bold' }}>{post.userId.name}</p>
                            {post.userId._id === authState.user?.userId._id && (
                              <div
                                onClick={async () => {
                                  await dispatch(deletePost({ post_id: post._id }));
                                  await dispatch(getAllPosts());
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <svg style={{ height: '1.4em', color: 'red' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21..." />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p style={{ color: 'grey' }}>@{post.userId.username}</p>
                        </div>
                      </div>

                      <p style={{ paddingTop: '1.3rem' }}>{post.body}</p>

                      {post.media && post.media !== "" && (
                        <div className={styles.singleCard_image}>
                          <img src={`${BASE_URL}/${post.media}`} />
                        </div>
                      )}

                      <div className={styles.optionsContainer}>
                        <div
                          onClick={async () => {
                            await dispatch(incrementPostLike({ post_id: post._id }));
                            dispatch(getAllPosts());
                          }}
                          className={styles.singleOption_optionContainer}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25..." />
                          </svg>
                          <p>{post.likes}</p>
                        </div>

                        <div
                          onClick={() => {
                            dispatch(getAllComments({ post_id: post._id }));
                          }}
                          className={styles.singleOption_optionContainer}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25..." />
                          </svg>
                        </div>

                        <div
                          onClick={() => {
                            const text = encodeURIComponent(post.body);
                            const url = encodeURIComponent('apnacollege.in');
                            const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                            window.open(twitterUrl, '_blank');
                          }}
                          className={styles.singleOption_optionContainer}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907..." />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No posts yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {postState.postId !== '' && (
          <div onClick={() => dispatch(resetPost())} className={styles.commentsContainer}>
            <div onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer}>
              {postState.comments.length === 0 && <h2>No Comments</h2>}
              {postState.comments.length !== 0 && (
                <div>
                  {postState.comments.map((postComment, index) => (
                    <div className={styles.singleComment} key={postComment._id || `comment-${index}`}>
                      <div className={styles.singleComment_profileContainer}>
                        <img src={`${BASE_URL}/${postComment.userId.profilePicture}`} alt="" />
                        <div>
                          <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{postComment.userId.name}</p>
                          <p>@{postComment.userId.username}</p>
                        </div>
                      </div>
                      <p>{postComment.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.postCommentContainer}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Comment"
                />
                <div
                  onClick={async () => {
                    await dispatch(postComment({ post_id: postState.postId, body: commentText }));
                    await dispatch(getAllComments({ post_id: postState.postId }));
                    setCommentText('');
                  }}
                  className={styles.postCommentContainer_commentBtn}
                >
                  <p>Comment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
