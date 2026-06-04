import React, { useState, useEffect } from 'react';
import { Lightbulb, Vote, Users, MessageSquare, Plus, CheckCircle, Clock, AlertCircle, Send, X } from 'lucide-react';
import { ParticipationService, ParticipationProject, ParticipationComment } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

const Participation: React.FC = () => {
  const [projects, setProjects] = useState<ParticipationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProjectComments, setActiveProjectComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, ParticipationComment[]>>({});
  const [newComment, setNewComment] = useState("");
  const [commentingAs, setCommentingAs] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Environnement',
    author_name: '',
    budget_estimate: '',
    image_url: 'https://picsum.photos/seed/project/800/600'
  });

  useEffect(() => {
    fetchProjects();
    
    // Auto-fill user name if logged in
    const stored = localStorage.getItem('mairie_current_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user && user.name) {
          setCommentingAs(user.name);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await ParticipationService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: number) => {
    try {
      await ParticipationService.vote(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async (projectId: number) => {
    try {
      const data = await ParticipationService.getComments(projectId);
      setComments(prev => ({ ...prev, [projectId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = (projectId: number) => {
    if (activeProjectComments === projectId) {
      setActiveProjectComments(null);
    } else {
      setActiveProjectComments(projectId);
      if (!comments[projectId]) {
        fetchComments(projectId);
      }
    }
  };

  const handleAddComment = async (projectId: number) => {
    if (!newComment.trim() || !commentingAs.trim()) return;
    setSubmittingComment(true);
    try {
      await ParticipationService.addComment(projectId, {
        user_name: commentingAs,
        comment: newComment
      });
      setNewComment("");
      fetchComments(projectId);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ParticipationService.submitProject(newProject);
      setIsModalOpen(false);
      setNewProject({
        title: '',
        description: '',
        category: 'Environnement',
        author_name: '',
        budget_estimate: '',
        image_url: 'https://picsum.photos/seed/project/800/600'
      });
      fetchProjects();
      alert("Votre projet a été soumis avec succès et sera étudié par nos services !");
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['Environnement', 'Sport', 'Culture', 'Social', 'Urbanisme', 'Autre'];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Validé': return 'bg-green-100 text-green-700';
      case 'En cours': return 'bg-blue-100 text-blue-700';
      case 'Rejeté': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tight mb-6 uppercase italic"
          >
            Budget <span className="text-amber-400">Participatif</span> 2024
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-medium"
          >
            Imaginez Ziguinchor de demain. Proposez vos idées, débattez avec vos concitoyens et votez pour les projets qui transformeront votre ville.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition flex items-center"
            >
              <Lightbulb className="mr-3 h-5 w-5" /> Proposer un projet
            </button>
            <button className="bg-primary-dark border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition">
              Comment ça marche ?
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-xs text-gray-400 tracking-widest mb-1">Impact Direct</h3>
              <p className="text-gray-600 text-sm">Financement de projets choisis par VOUS.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-xs text-gray-400 tracking-widest mb-1">Transparence</h3>
              <p className="text-gray-600 text-sm">Suivi temps réel de l'étude à la réalisation.</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-xs text-gray-400 tracking-widest mb-1">Co-construction</h3>
              <p className="text-gray-600 text-sm">Dialogue permanent entre élus et citoyens.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">Les Projets <span className="text-primary">Citoyens</span></h2>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 shadow-sm">{projects.length} Projets</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-[400px] rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(projects) && projects.map((project) => (
              <motion.div 
                layout
                key={project.id}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="h-56 relative overflow-hidden">
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-6 left-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-xs font-black text-gray-800 shadow-sm">
                      {project.budget_estimate}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">{project.category}</div>
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight mb-4 group-hover:text-primary transition">{project.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400 uppercase">
                        {project.author_name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-gray-400">Par {project.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => toggleComments(project.id)}
                         className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl transition-all"
                       >
                         <MessageSquare className="h-4 w-4" />
                         <span className="font-black text-xs uppercase tracking-widest">{comments[project.id]?.length || 0}</span>
                       </button>
                       <button 
                        onClick={() => handleVote(project.id)}
                        className="flex items-center gap-2 bg-primary/5 hover:bg-primary text-primary hover:text-white px-5 py-2.5 rounded-2xl transition-all group/btn"
                      >
                        <Vote className="h-4 w-4 group-hover/btn:scale-110 transition" />
                        <span className="font-black text-xs uppercase tracking-widest">{project.votes_count}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {activeProjectComments === project.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/50 border-t border-gray-50"
                      >
                        <div className="p-8">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 italic">Discussion Citoyenne</h4>
                          
                          <div className="space-y-6 mb-8">
                            {comments[project.id]?.map((comment, i) => (
                              <div key={i} className="flex gap-4">
                                <div className="h-8 w-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-[10px] text-primary flex-shrink-0">
                                  {comment.user_name.charAt(0)}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black uppercase text-gray-900">{comment.user_name}</span>
                                    <span className="text-[9px] text-gray-400 font-bold">{new Date(comment.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 leading-relaxed">{comment.comment}</p>
                                </div>
                              </div>
                            ))}
                            {(!comments[project.id] || comments[project.id].length === 0) && (
                              <p className="text-xs text-gray-400 italic text-center py-4">Soyez le premier à commenter ce projet !</p>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <input 
                              type="text"
                              placeholder="Votre nom"
                              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold transition outline-none focus:border-primary/20"
                              value={activeProjectComments === project.id ? commentingAs : ""}
                              onChange={e => setCommentingAs(e.target.value)}
                            />
                            <div className="relative">
                              <textarea 
                                placeholder="Votre commentaire..."
                                rows={2}
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium transition outline-none focus:border-primary/20 pr-12"
                                value={activeProjectComments === project.id ? newComment : ""}
                                onChange={e => setNewComment(e.target.value)}
                              />
                              <button 
                                onClick={() => handleAddComment(project.id)}
                                disabled={submittingComment || !newComment || !commentingAs}
                                className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:scale-110 active:scale-95 transition disabled:opacity-50 disabled:scale-100"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-8 md:p-12"
            >
              <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8">Votre <span className="text-primary">Projet</span> pour la Ville</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du Projet</label>
                    <input 
                      required
                      placeholder="Ex: Piste cyclable quartier Sud"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold text-sm transition outline-none" 
                      value={newProject.title} 
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                    <select 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold text-sm transition outline-none"
                      value={newProject.category}
                      onChange={e => setNewProject({...newProject, category: e.target.value})}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description Détaillée</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Expliquez votre idée et son impact pour les citoyens..."
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold text-sm transition outline-none"
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estimation Budget (Optionnel)</label>
                    <input 
                      placeholder="Ex: 5M FCFA"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold text-sm transition outline-none"
                      value={newProject.budget_estimate}
                      onChange={e => setNewProject({...newProject, budget_estimate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Votre Nom</label>
                    <input 
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 font-bold text-sm transition outline-none"
                      value={newProject.author_name}
                      onChange={e => setNewProject({...newProject, author_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-gray-200 transition"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition"
                  >
                    Soumettre mon idée
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Participation;
