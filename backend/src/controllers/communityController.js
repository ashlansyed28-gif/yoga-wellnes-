import { db } from '../services/dbService.js';

export async function getCommunityFeed(req, res) {
  try {
    const posts = await db.getCommunityPosts();
    return res.status(200).json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('[Community Feed Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve community feed.'
    });
  }
}

export async function createCommunityPost(req, res) {
  try {
    const userId = req.user.id;
    const { content, group_category, author_name } = req.validatedBody;

    // Fetch user name if not provided
    let displayName = author_name;
    if (!displayName) {
      const profile = await db.getProfile(userId);
      displayName = profile ? profile.name : 'Mindful Practitioner';
    }

    const post = await db.createCommunityPost({
      user_id: userId,
      author_name: displayName,
      group_category: group_category || 'Mindfulness & Serenity',
      content
    });

    return res.status(201).json({
      success: true,
      message: 'Mindful reflection shared with the community.',
      post
    });
  } catch (error) {
    console.error('[Create Community Post Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to share post.'
    });
  }
}

export async function likeCommunityPost(req, res) {
  try {
    const { id } = req.params;
    const post = await db.likeCommunityPost(id);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    return res.status(200).json({
      success: true,
      likes_count: post.likes_count
    });
  } catch (error) {
    console.error('[Like Community Post Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to like post.'
    });
  }
}
