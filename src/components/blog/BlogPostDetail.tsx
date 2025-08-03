import React from 'react';
import { Section } from '../shared';
import { type BlogPost } from './BlogPostCard';
import BlogPostHeader from './BlogPostHeader';
import BlogPostContent from './BlogPostContent';
import BlogPostActions from './BlogPostActions';
import BlogPostSidebar from './BlogPostSidebar';
import BlogPostNewsletter from './BlogPostNewsletter';
import { useBlogPostLogic } from '../../hooks/useBlogPostLogic';

interface BlogPostDetailProps {
    post: BlogPost;
    relatedPosts?: BlogPost[];
}

const BlogPostDetail: React.FC<BlogPostDetailProps> = ({
    post,
    relatedPosts = []
}) => {
    const { extendedContent, loading: contentLoading } = useBlogPostLogic(post.id);

    // Convertir los relatedPosts al formato esperado por el sidebar
    const sidebarRelatedPosts = relatedPosts.map(post => ({
        id: post.id.toString(), // Convertir a string
        title: post.title,
        slug: post.id.toString(), // Usar id como slug ya que no existe slug en BlogPost
        excerpt: post.excerpt,
        image: post.image || '/images/default-blog.jpg',
        date: post.date
    }));

    return (
        <div className="min-h-screen">
            {/* Header Section del Post */}
            <BlogPostHeader post={post} />

            {/* Contenido del artículo */}
            <Section>
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Contenido principal */}
                    <article className="lg:col-span-8">
                        <BlogPostContent
                            content={extendedContent}
                            loading={contentLoading}
                        />
                    </article>

                    {/* Sidebar */}
                    <BlogPostSidebar relatedPosts={sidebarRelatedPosts} />
                </div>
                {/* Acciones del artículo */}
                <BlogPostActions
                    postUrl={window.location.href}
                    postTitle={post.title}
                />
            </Section>

            {/* Newsletter Section */}
            <BlogPostNewsletter />
        </div>
    );
};

export default BlogPostDetail;
