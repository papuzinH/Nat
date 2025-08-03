import React from 'react';

interface BlogPostContentProps {
  content: string;
  loading: boolean;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cream-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className="prose prose-lg max-w-none [&>h2]:text-2xl [&>h2]:font-title [&>h2]:text-gray-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:first:mt-0 [&>h3]:text-xl [&>h3]:font-title [&>h3]:text-gray-800 [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:text-gray-700 [&>p]:font-body [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-lg [&>blockquote]:border-l-4 [&>blockquote]:border-cream-400 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:my-8 [&>blockquote]:bg-cream-50 [&>blockquote]:rounded-r-lg [&>blockquote>p]:text-gray-800 [&>blockquote>p]:font-body [&>blockquote>p]:text-lg [&>blockquote>p]:italic [&>blockquote>p]:leading-relaxed [&>blockquote>p]:mb-0"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogPostContent;
