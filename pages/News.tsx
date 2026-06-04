import React, { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleService, Article } from '../services/api';
import { useNavigate } from 'react-router-dom';

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const categories = ["Tout", "Politique", "Culture", "Sport", "Urbanisme", "Santé", "Éducation"];
  const navigate = useNavigate();
  const ARTICLES_PER_PAGE = 10; // Ajuster selon le design souhaité

  useEffect(() => {
      setLoading(true);
      // Fetch paginated articles from backend
      ArticleService.getAll(currentPage, ARTICLES_PER_PAGE, activeCategory)
        .then(response => {
            setArticles(response?.data || []);
            setTotalPages(response?.meta?.totalPages || 1);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
  }, [currentPage, activeCategory]);

  const handleCategoryChange = (category: string) => {
      setActiveCategory(category);
      setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  // Determine Featured Article only on the first page
  // Note: With backend pagination, the "featured" article logic is simplified.
  // We take the first element of the first page as featured if it's marked or just the first one.
  let featuredArticle: Article | undefined;
  let standardArticles: Article[] = articles;

  if (currentPage === 1 && articles.length > 0) {
      featuredArticle = articles.find(a => a.isFeatured) || articles[0];
      standardArticles = articles.filter(a => a.id !== featuredArticle?.id);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Actualités et Événements</h1>
        <p className="text-gray-600">Restez informé de la vie de votre commune.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat, idx) => (
          <button 
            key={idx}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
          <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
      ) : (
        <>
            {/* Featured News (Only on Page 1) */}
            {featuredArticle && currentPage === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
                    <div 
                        onClick={() => navigate(`/news/${featuredArticle?.id}`)}
                        className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-lg h-96 group cursor-pointer"
                    >
                    <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-secondary text-gray-900 text-xs font-bold px-2 py-1 rounded uppercase">À la une</span>
                            <span className="bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded uppercase">{featuredArticle.category}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-secondary transition">{featuredArticle.title}</h2>
                        <p className="text-gray-200 line-clamp-2">{featuredArticle.content}</p>
                        <div className="text-gray-400 text-xs mt-3 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> {featuredArticle.date}
                        </div>
                    </div>
                    </div>
                    
                    {/* Side List (First 3 of the rest) */}
                    <div className="space-y-6 overflow-y-auto max-h-96 pr-2">
                        {standardArticles.slice(0, 3).map((article) => (
                            <div 
                                key={article.id} 
                                onClick={() => navigate(`/news/${article.id}`)}
                                className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
                            >
                                <img src={article.imageUrl} alt={article.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0 group-hover:opacity-90 transition" />
                                <div className="flex flex-col justify-center flex-grow">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-primary font-semibold mb-1">{article.category}</span>
                                        <span className="text-xs text-gray-400 flex items-center"><Calendar className="h-3 w-3 mr-1" /> {article.date}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary transition line-clamp-2">{article.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Grid (Rest of articles or all articles if page > 1) */}
            {(currentPage > 1 || standardArticles.length > 3) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {(currentPage === 1 ? standardArticles.slice(3) : standardArticles).map((article) => (
                    <article 
                        key={article.id} 
                        onClick={() => navigate(`/news/${article.id}`)}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group flex flex-col"
                    >
                        <div className="h-48 overflow-hidden">
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                        <div className="text-sm text-primary font-semibold mb-2">{article.category}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                            {article.content}
                        </p>
                        <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">Publié le {new Date(article.date).toLocaleDateString()}</div>
                        </div>
                    </article>
                    ))}
                </div>
            )}

            {articles.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucune actualité disponible pour le moment.</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12 pb-12">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border flex items-center transition ${currentPage === 1 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-primary hover:text-white hover:border-primary'}`}
                    >
                        <ChevronLeft className="h-5 w-5 mr-1" /> Précédent
                    </button>
                    
                    <div className="hidden sm:flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          if (totalPages <= 7) return true;
                          return page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                        })
                        .map((page, idx, arr) => (
                          <React.Fragment key={page}>
                            {idx > 0 && page - arr[idx - 1] > 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg font-bold text-sm transition shadow-sm ${
                                    currentPage === page
                                    ? 'bg-primary text-white shadow-primary/20'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                            >
                                {page}
                            </button>
                          </React.Fragment>
                      ))}
                    </div>

                    {/* Mobile page indicator */}
                    <span className="sm:hidden text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                      Page {currentPage} / {totalPages}
                    </span>

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border flex items-center transition ${currentPage === totalPages ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-primary hover:text-white hover:border-primary'}`}
                    >
                        Suivant <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                </div>
            )}
        </>
      )}

      {/* Agenda Section Link */}
      <div className="border-t border-gray-200 pt-12 text-center mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Agenda à venir</h2>
        <p className="text-gray-600 mb-6">Ne manquez pas les prochains événements de la commune.</p>
        <button onClick={() => navigate('/agenda')} className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
            Consulter l'agenda complet
        </button>
      </div>
    </div>
  );
};

export default News;