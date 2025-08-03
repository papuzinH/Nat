import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../shared/Button';

interface BlogPostActionsProps {
  postUrl: string;
  postTitle: string;
}

const BlogPostActions: React.FC<BlogPostActionsProps> = ({ postUrl, postTitle }) => {
  const navigate = useNavigate();

  const shareOnTwitter = () => {
    const tweetText = `¡Echa un vistazo a este artículo! "${postTitle}"`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(postUrl)}`;
    window.open(tweetUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    });
  };

  const goBack = () => {
    navigate('/blog');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 py-8 border-b border-cream-300">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="small" onClick={shareOnTwitter}>
          Compartir en Twitter
        </Button>
        <Button variant="secondary" size="small" onClick={shareOnFacebook}>
          Compartir en Facebook
        </Button>
        <Button variant="outline" size="small" onClick={copyToClipboard}>
          Copiar enlace
        </Button>
      </div>
      <Button variant="ghost" onClick={goBack}>
        ← Volver al blog
      </Button>
    </div>
  );
};

export default BlogPostActions;
