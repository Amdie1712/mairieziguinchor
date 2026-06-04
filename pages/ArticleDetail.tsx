import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArticleService, Article } from '../services/api';
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter, Copy, Check } from 'lucide-react';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
      ArticleService.getById(Number(id)).then(data => {
          setArticle(data || null);
          setLoading(false);
      });
  }, [id]);

  const handleShare = async () => {
      if (!article) return;
      const shareData = {
          title: article.title,
          text: `Découvrez cet article de la Mairie de Ziguinchor : ${article.title}`,
          url: window.location.href
      };

      if (navigator.share) {
          try {
              await navigator.share(shareData);
          } catch (err) {
              console.log('Error sharing:', err);
          }
      } else {
          // Fallback: Copy to clipboard
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  const shareSocial = (platform: 'facebook' | 'twitter') => {
      if (!article) return;
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(article.title);
      
      let shareUrl = '';
      if (platform === 'facebook') {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === 'twitter') {
          shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      }
      
      window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;

  if (!article) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article introuvable</h2>
            <button onClick={() => navigate('/news')} className="text-primary hover:underline">
                Retour aux actualités
            </button>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Image */}
      <div className="h-96 w-full relative">
        <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-6 left-6 md:left-12">
            <Link to="/news" className="inline-flex items-center text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
            </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                    {article.category}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
                {article.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg text-gray-700 max-w-none mb-12">
                {article.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                ))}
            </div>

            {/* Share */}
            <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-900 font-bold flex items-center">
                    <Share2 className="h-5 w-5 mr-3" />
                    Partager cet article
                </div>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => shareSocial('facebook')}
                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
                        title="Partager sur Facebook"
                    >
                        <Facebook className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={() => shareSocial('twitter')}
                        className="p-2 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 transition"
                        title="Partager sur Twitter"
                    >
                        <Twitter className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={handleShare}
                        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition relative group"
                        title="Copier le lien"
                    >
                        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                        {copied && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
                                Copié !
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;