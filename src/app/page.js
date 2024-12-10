'use client';

import { gql, useQuery, useLazyQuery } from '@apollo/client';
import client from './lib/client';
import { useState } from 'react';

// GraphQL Queries
const GET_POSTS = gql`
  query getAllPosts {
    getAllPosts {
      id
      title
    }
  }
`;

const GET_POST_BY_ID = gql`
  query getPostById($id: Int!) {
    getPostById(id: $id) {
      id
      title
      body
    }
  }
`;

export default function Home() {
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Fetch all posts
  const { loading: loadingPosts, error: errorPosts, data: postsData } = useQuery(GET_POSTS, { client });

  // Lazy query for fetching post by ID
  const [fetchPostById, { loading: loadingPost, error: errorPost, data: postData }] = useLazyQuery(GET_POST_BY_ID, {
    client,
  });

  // Handle post selection
  const handlePostClick = (id) => {
    setSelectedPostId(id);
    fetchPostById({ variables: { id } });
  };

  if (loadingPosts) return <p>Loading posts...</p>;
  if (errorPosts) return <p>Error loading posts: {errorPosts.message}</p>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {postsData.getAllPosts.map((post) => (
          <li key={post.id}>
            <button onClick={() => handlePostClick(post.id)}>{post.title}</button>
          </li>
        ))}
      </ul>

      {loadingPost && <p>Loading post details...</p>}
      {errorPost && <p>Error loading post details: {errorPost.message}</p>}

      {postData && postData.getPostById && (
        <div>
          <h2>Post Details</h2>
          <p><strong>Title:</strong> {postData.getPostById.title}</p>
          <p><strong>Content:</strong> {postData.getPostById.body}</p>
        </div>
      )}
    </div>
  );
}
