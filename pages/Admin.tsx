import React, { useState, useEffect } from 'react';
import { 
    ArticleService, ReportingService, ContactService, DossierService, ContentService, UserService,
    CouncilService, EventService, ImageService, ParticipationService, SystemService,
    Article, Report, Message, Dossier, MunicipalService, DocumentItem, AboutSection, AboutStat, ServiceItem,
    Event, CouncilMember, CouncilSession, Neighborhood, ImageItem, ParticipationProject, ProjectItem, ProcedureItem,
    AuditLogItem, SiteSettingItem
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { 
    LayoutDashboard, MessageSquare, AlertTriangle, FileText, Check, Users, Search, 
    Plus, Trash2, Edit, X, Clock, CheckCircle, FilePlus, Building2, Building, Send, Filter,
    Eye, Image as ImageIcon, Star, LogOut, File, Info, MailOpen, Mail, Download,
    ChevronRight, ArrowRight, Save, Camera, Upload, MapPin, Heart, UserPlus, Key, Newspaper,
    Calendar, Map as MapIcon, GraduationCap, Gavel, FolderOpen, Copy, CheckCircle2, Monitor, Phone, AtSign, ShieldCheck,
    Briefcase, Lightbulb, BookOpen, Database, TrendingUp, Settings, Activity, Lock, Unlock, ShieldAlert
} from 'lucide-react';
import { AuthService, User } from '../services/auth';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [participationProjects, setParticipationProjects] = useState<ParticipationProject[]>([]);
  const [procedures, setProcedures] = useState<ProcedureItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'reports' | 'messages' | 'dossiers' | 'documents' | 'about' | 'about_stats' | 'team' | 'agenda' | 'council' | 'neighborhoods' | 'images' | 'participation' | 'projects_mgt' | 'procedures' | 'services_mgt' | 'settings' | 'logs'>('overview');
  
  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [aboutStats, setAboutStats] = useState<AboutStat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [councilSessions, setCouncilSessions] = useState<CouncilSession[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [municipalServices, setMunicipalServices] = useState<ServiceItem[]>([]);
  const [systemImages, setSystemImages] = useState<Record<string, string>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingItem[]>([]);
  
  // Filtering & Modal States
  const [dosFilterService, setDosFilterService] = useState<string>('Tout');
  const [dosFilterCategory, setDosFilterCategory] = useState<string>('Tout');
  const [imgFilterCategory, setImgFilterCategory] = useState<string>('Tout');
  
  const [artPage, setArtPage] = useState(1);
  const [artTotalPages, setArtTotalPages] = useState(1);
  const ARTICLES_PER_PAGE_ADMIN = 10;

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isAboutStatModalOpen, setIsAboutStatModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCouncilMemberModalOpen, setIsCouncilMemberModalOpen] = useState(false);
  const [isCouncilSessionModalOpen, setIsCouncilSessionModalOpen] = useState(false);
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isProcedureModalOpen, setIsProcedureModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportTreatment, setReportTreatment] = useState({ 
    status: 'Nouveau' as any, 
    assigned_service: '' as MunicipalService 
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [viewingMessage, setViewingMessage] = useState<Message | null>(null);

  const isSuperAdmin = currentUser?.role === 'admin';

  // Form States
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({ title: '', category: 'Actualité', content: '', imageUrl: '', isFeatured: false });
  
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [docForm, setDocForm] = useState({ name: '', description: '', category: 'Délibérations', date: new Date().toISOString().split('T')[0], size: '', type: 'PDF' });
  const [memberImageFile, setMemberImageFile] = useState<File | null>(null);
  const [sessionDocFile, setSessionDocFile] = useState<File | null>(null);
  const [neighborhoodImageFile, setNeighborhoodImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [eventImageFile, setEventImageFile] = useState<File | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [docCategoryFilter, setDocCategoryFilter] = useState('Tout');
  
  const [imageForm, setImageForm] = useState({ title: '', url: '', category: 'Accueil' as any });
  
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({ title: '', category: 'Culture', description: '', imageUrl: '', date: '', time: '', location: '' });

  const [editingCouncilMember, setEditingCouncilMember] = useState<CouncilMember | null>(null);
  const [councilMemberForm, setCouncilMemberForm] = useState({ name: '', role: '', image: '', commission: '' });

  const [editingCouncilSession, setEditingCouncilSession] = useState<CouncilSession | null>(null);
  const [councilSessionForm, setCouncilSessionForm] = useState({ date: '', title: '', agenda: '', status: 'A venir' as any, docUrl: '' });

  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [neighborhoodForm, setNeighborhoodForm] = useState({ 
    name: '', 
    representative: '', 
    nextMeeting: '', 
    location: '', 
    description: '', 
    image: '', 
    reports_url: '', 
    contact_email: '',
    latitude: 12.5833,
    longitude: -16.2719
  });

  const [editingProcedure, setEditingProcedure] = useState<ProcedureItem | null>(null);
  const [procedureForm, setProcedureForm] = useState({ 
    title: '', 
    description: '', 
    icon: 'FileText', 
    category: 'Identité', 
    delay: '15 jours', 
    isOnline: true, 
    dossierType: '',
    requiredDocs: ''
  });

  const [aboutForm, setAboutForm] = useState({ id: 0, title: '', content: '' });
  const [editingAboutStat, setEditingAboutStat] = useState<AboutStat | null>(null);
  const [aboutStatForm, setAboutStatForm] = useState({ label: '', value: '', icon: 'TrendingUp' });
  
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({ 
    title: '', 
    description: '', 
    icon: 'FileText', 
    action: 'En savoir plus', 
    link: '',
    category: 'Général'
  });

  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<ProjectItem>>({ 
    title: '', 
    description: '', 
    image_url: '', 
    status: 'en_cours', 
    category: 'Construction de routes',
    budget: '',
    location_name: '',
    progress_pct: 0,
    completion_date: '',
    partners: '',
    results: '',
    photo_before: '',
    photo_after: '',
    studies_in_progress: '',
    future_investments: '',
    planned_calendar: '',
    latitude: 12.5859,
    longitude: -16.2729,
    video_url: ''
  });
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'employe' as 'employe' | 'admin', assigned_service: 'État Civil' as MunicipalService });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [resetPassForm, setResetPassForm] = useState({ userId: '', newPassword: '' });
  
  // Settings State
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [isSettingsSaving, setIsSettingsSaving] = useState(false);
  
  // Treatment Data State
  const [treatmentData, setTreatmentData] = useState({ 
    status: 'Instruction', 
    assigned_service: 'État Civil' as MunicipalService, 
    internalNotes: '', 
    serviceFeedback: '' 
  });

  const categories = ["Actualité", "Communiqué de Presse", "Flash Info", "Politique", "Culture", "Sport", "Urbanisme", "Santé"];
  const eventCategories = ["Culture", "Sport", "Politique", "Social", "Institutionnel"];
  const services: MunicipalService[] = [
    'État Civil',
    'Assainissement, Cadre de Vie & Équipements Marchands',
    'Voirie & Éclairage Public',
    'Éducation, Alphabétisation & Formation',
    'Santé & Action Sociale',
    'Jeunesse, Sport, Loisirs & Culture',
    'Gouvernance & Organisation des Quartiers'
  ];
  const imageCategories = ["Accueil", "Élus", "Patrimoine", "Services", "Autre"];
  const procedureCategories = [
    "État Civil", 
    "Assainissement, Cadre de Vie & Équipements Marchands", 
    "Voirie & Éclairage Public", 
    "Éducation, Alphabétisation & Formation", 
    "Santé & Action Sociale", 
    "Jeunesse, Sport, Loisirs & Culture", 
    "Gouvernance & Organisation des Quartiers"
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    // Restriction aux admins et employés
    if (!user || (user.role !== 'admin' && user.role !== 'employe')) {
        navigate('/login');
        return;
    }
    setCurrentUser(user);
    refreshData();
  }, [activeTab, artPage, navigate]);

  const refreshData = async () => {
    try {
        const [artRes, repRes, msgRes, dosRes, docRes, abRes, absRes, usrRes, eveRes, cmRes, csRes, nhRes, prjRes, partRes, procRes, serRes, logRes, setRes] = await Promise.all([
            ArticleService.getAll(artPage, ARTICLES_PER_PAGE_ADMIN, 'Tout'),
            ReportingService.getAll(),
            ContactService.getAll(),
            DossierService.getAll(),
            ContentService.getDocuments(),
            ContentService.getAbout(),
            ContentService.getAboutStats(),
            UserService.getAll(),
            EventService.getAll(),
            CouncilService.getMembers(),
            CouncilService.getSessions(),
            ContentService.getNeighborhoods(),
            ContentService.getProjects(),
            ParticipationService.getProjects(),
            ContentService.getProcedures(),
            ContentService.getServices(),
            isSuperAdmin ? SystemService.getLogs() : Promise.resolve([]),
            isSuperAdmin ? SystemService.getSettings() : Promise.resolve([])
        ]);
        setArticles(artRes.data || []);
        setArtTotalPages(artRes.meta?.totalPages || 1);
        setReports(Array.isArray(repRes) ? repRes : []);
        setMessages(Array.isArray(msgRes) ? msgRes : []);
        setDossiers(Array.isArray(dosRes) ? dosRes : []);
        setDocuments(Array.isArray(docRes) ? docRes : []);
        setAboutSections(Array.isArray(abRes) ? abRes : []);
        setAboutStats(Array.isArray(absRes) ? absRes : []);
        setUsers(Array.isArray(usrRes) ? usrRes : []);
        setEvents(Array.isArray(eveRes) ? eveRes : []);
        setCouncilMembers(Array.isArray(cmRes) ? cmRes : []);
        setCouncilSessions(Array.isArray(csRes) ? csRes : []);
        setNeighborhoods(Array.isArray(nhRes) ? nhRes : []);
        setProjects(Array.isArray(prjRes) ? prjRes : []);
        setParticipationProjects(Array.isArray(partRes) ? partRes : []);
        setProcedures(Array.isArray(procRes) ? procRes : []);
        setMunicipalServices(Array.isArray(serRes) ? serRes : []);
        setAuditLogs(logRes as any);
        setSiteSettings(setRes as any);
        
        try {
            const imagesData = await ImageService.getAll();
            setImages(imagesData);
        } catch (imgError) { 
            console.warn('Erreur chargement images:', imgError);
            setImages([]); 
        }
        
        try {
            const systemImagesData = await ImageService.getSystemImages();
            setSystemImages(systemImagesData);
        } catch (sysImgError) { 
            console.warn('Erreur chargement images système:', sysImgError);
            setSystemImages({}); 
        }
        
    } catch (err) { 
        console.error('Erreur refresh:', err); 
    }
  };

  const filteredDossiers = dossiers.filter(d => {
      const matchService = isSuperAdmin 
        ? (dosFilterService === 'Tout' || d.assigned_service === dosFilterService)
        : (d.assigned_service?.toLowerCase() === currentUser?.assigned_service?.toLowerCase());
      const matchCategory = dosFilterCategory === 'Tout' || d.category === dosFilterCategory;
      return matchService && matchCategory;
  });

  const [repFilterService, setRepFilterService] = useState('Tout');
  const filteredReports = reports.filter(r => {
      const matchService = isSuperAdmin 
        ? (repFilterService === 'Tout' || r.assigned_service === repFilterService)
        : (r.assigned_service?.toLowerCase() === currentUser?.assigned_service?.toLowerCase());
      return matchService;
  });

  // --- Handlers Médiathèque ---
  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    await ImageService.add(imageForm);
    setIsImageModalOpen(false);
    setImageForm({ title: '', url: '', category: 'Accueil' });
    refreshData();
  };

  const handleSetAsSystem = async (key: string, url: string) => {
    await ImageService.setSystem(key, url);
    alert(`Image définie pour : ${key}`);
    refreshData();
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Handlers Dossiers ---
  const [isDossierCreateModalOpen, setIsDossierCreateModalOpen] = useState(false);
  const [dossierCreateForm, setDossierCreateForm] = useState({
      user_name: '',
      user_email: '',
      type: 'Casier Judiciaire',
      category: 'Identité',
      reason: '',
      assigned_service: 'Guichet Unique' as MunicipalService,
      status: 'Instruction'
  });

  const handleSaveDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await DossierService.create({
        type: dossierCreateForm.type,
        category: dossierCreateForm.category,
        description: `Dossier créé par l'administration. Motif: ${dossierCreateForm.reason || 'N/A'}`,
        form_data: { 
          name: dossierCreateForm.user_name, 
          email: dossierCreateForm.user_email,
          reason: dossierCreateForm.reason,
          phone: '',
          address: ''
        },
        assigned_service: dossierCreateForm.assigned_service
      });
      setIsDossierCreateModalOpen(false);
      await refreshData();
      alert("Dossier créé avec succès.");
    } catch (err) {
      alert("Erreur lors de la création du dossier.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDossierModal = (d: Dossier) => {
    setSelectedDossier(d);
    setTreatmentData({
      status: d.status,
      assigned_service: d.assigned_service || 'Guichet Unique' as MunicipalService,
      internalNotes: d.internal_notes || '',
      serviceFeedback: d.service_feedback || ''
    });
  };

  const handleTreatDossier = async () => {
    if (!selectedDossier) return;
    setLoading(true);
    try {
      await DossierService.treat(selectedDossier.id, {
        status: treatmentData.status,
        assigned_service: treatmentData.assigned_service,
        internal_notes: treatmentData.internalNotes,
        service_feedback: treatmentData.serviceFeedback
      });
      setSelectedDossier(null);
      await refreshData();
      alert("Dossier mis à jour avec succès.");
    } catch (err) {
      alert("Erreur lors de la mise à jour du dossier.");
    } finally {
      setLoading(false);
    }
  };

  const handleTreatReport = async () => {
    if (!selectedReport) return;
    setLoading(true);
    try {
      await ReportingService.treat(selectedReport.id, {
        status: reportTreatment.status,
        assigned_service: reportTreatment.assigned_service
      });
      setSelectedReport(null);
      await refreshData();
      alert("Signalement mis à jour avec succès.");
    } catch (err) {
      alert("Erreur lors de la mise à jour du signalement.");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers Contenus ---
  const handleOpenArticleModal = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setArticleForm({ title: article.title, category: article.category, content: article.content, imageUrl: article.imageUrl, isFeatured: !!article.isFeatured });
    } else {
      setEditingArticle(null);
      setArticleForm({ title: '', category: 'Actualité', content: '', imageUrl: '', isFeatured: false });
    }
    setArticleFile(null);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', articleForm.title);
      formData.append('category', articleForm.category);
      formData.append('content', articleForm.content);
      formData.append('isFeatured', String(articleForm.isFeatured));
      formData.append('imageUrl', articleForm.imageUrl);
      if (articleFile) {
        formData.append('image', articleFile);
      }
      
      if (editingArticle) {
        await ArticleService.update(editingArticle.id, formData);
      } else {
        formData.append('date', new Date().toISOString());
        await ArticleService.add(formData);
      }
      setIsArticleModalOpen(false);
      await refreshData();
      alert('Article enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEventModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({ ...event });
    } else {
      setEditingEvent(null);
      setEventForm({ title: '', category: 'Culture', description: '', imageUrl: '', date: '', time: '', location: '' });
    }
    setEventImageFile(null);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('category', eventForm.category);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('time', eventForm.time);
      formData.append('location', eventForm.location);
      
      if (eventImageFile) {
        formData.append('image', eventImageFile);
      } else {
        formData.append('imageUrl', eventForm.imageUrl);
      }

      if (editingEvent) {
        await EventService.update(editingEvent.id, formData);
      } else {
        await EventService.add(formData);
      }
      setIsEventModalOpen(false);
      setEventImageFile(null);
      await refreshData();
      alert('Événement enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement de l\'événement');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCouncilMemberModal = (member?: CouncilMember) => {
    if (member) {
      setEditingCouncilMember(member);
      setCouncilMemberForm({ 
        name: member.name, 
        role: member.role, 
        image: member.image, 
        commission: member.commission || '' 
      });
    } else {
      setEditingCouncilMember(null);
      setCouncilMemberForm({ name: '', role: '', image: '', commission: '' });
    }
    setMemberImageFile(null);
    setIsCouncilMemberModalOpen(true);
  };

  const handleSaveCouncilMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', councilMemberForm.name);
      formData.append('role', councilMemberForm.role);
      formData.append('commission', councilMemberForm.commission);
      if (memberImageFile) {
        formData.append('image', memberImageFile);
      } else {
        formData.append('image', councilMemberForm.image);
      }

      if (editingCouncilMember) {
        await CouncilService.updateMember(editingCouncilMember.id, formData);
      } else {
        await CouncilService.addMember(formData);
      }
      setIsCouncilMemberModalOpen(false);
      setEditingCouncilMember(null);
      setMemberImageFile(null);
      await refreshData();
      alert('Membre enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du membre');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCouncilSessionModal = (session?: CouncilSession) => {
    if (session) {
      setEditingCouncilSession(session);
      setCouncilSessionForm({ 
        date: session.date, 
        title: session.title, 
        agenda: session.agenda || '',
        status: session.status, 
        docUrl: session.docUrl || '' 
      });
    } else {
      setEditingCouncilSession(null);
      setCouncilSessionForm({ date: '', title: '', agenda: '', status: 'A venir', docUrl: '' });
    }
    setSessionDocFile(null);
    setIsCouncilSessionModalOpen(true);
  };

  const handleSaveCouncilSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('date', councilSessionForm.date);
      formData.append('title', councilSessionForm.title);
      formData.append('agenda', councilSessionForm.agenda);
      formData.append('status', councilSessionForm.status);
      if (sessionDocFile) {
        formData.append('document', sessionDocFile);
      } else {
        formData.append('docUrl', councilSessionForm.docUrl);
      }

      if (editingCouncilSession) {
        await CouncilService.updateSession(editingCouncilSession.id, formData);
      } else {
        await CouncilService.addSession(formData);
      }
      setIsCouncilSessionModalOpen(false);
      setEditingCouncilSession(null);
      setSessionDocFile(null);
      await refreshData();
      alert('Séance enregistrée avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement de la séance');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNeighborhoodModal = (nh?: Neighborhood) => {
    if (nh) {
      setEditingNeighborhood(nh);
      setNeighborhoodForm({ 
        ...nh, 
        image: nh.image || '',
        reports_url: nh.reports_url || '',
        contact_email: nh.contact_email || '',
        latitude: nh.latitude || 12.5833,
        longitude: nh.longitude || -16.2719
      });
    } else {
      setEditingNeighborhood(null);
      setNeighborhoodForm({ 
        name: '', 
        representative: '', 
        nextMeeting: '', 
        location: '', 
        description: '', 
        image: '', 
        reports_url: '', 
        contact_email: '',
        latitude: 12.5833,
        longitude: -16.2719
      });
    }
    setNeighborhoodImageFile(null);
    setIsNeighborhoodModalOpen(true);
  };

  const handleSaveNeighborhood = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', neighborhoodForm.name);
      formData.append('representative', neighborhoodForm.representative);
      formData.append('nextMeeting', neighborhoodForm.nextMeeting || '');
      formData.append('location', neighborhoodForm.location || '');
      formData.append('description', neighborhoodForm.description || '');
      formData.append('reports_url', neighborhoodForm.reports_url || '');
      formData.append('contact_email', neighborhoodForm.contact_email || '');
      formData.append('latitude', String(neighborhoodForm.latitude || 12.5833));
      formData.append('longitude', String(neighborhoodForm.longitude || -16.2719));
      
      if (neighborhoodImageFile) {
        formData.append('image', neighborhoodImageFile);
      } else {
        formData.append('image', neighborhoodForm.image || '');
      }

      if (editingNeighborhood) {
        await ContentService.updateNeighborhood(editingNeighborhood.id, formData);
      } else {
        await ContentService.addNeighborhood(formData);
      }
      setIsNeighborhoodModalOpen(false);
      setEditingNeighborhood(null);
      setNeighborhoodImageFile(null);
      await refreshData();
      alert('Conseil de quartier enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du quartier');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (newUser.role === 'employe' && !newUser.assigned_service) {
      setError('Veuillez sélectionner un service pour l\'employé');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password || Math.random().toString(36).slice(-8),
        role: newUser.role,
        assigned_service: newUser.role === 'admin' ? null : newUser.assigned_service
      };
      await UserService.add(userData);
      setNewUser({ name: '', email: '', password: '', role: 'employe', assigned_service: 'Guichet Unique' });
      setIsTeamModalOpen(false);
      await refreshData();
      alert('Compte Agent/Admin créé avec succès !');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Supprimer ce compte employé ?")) {
      try {
        await UserService.delete(id);
        await refreshData();
      } catch (err) { 
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression.'); 
      }
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', docForm.name);
      formData.append('description', docForm.description);
      formData.append('category', docForm.category);
      formData.append('date', docForm.date);
      if (docFile) {
        formData.append('document', docFile);
      }
      
      if (editingDoc?.id) {
        await ContentService.updateDocument(editingDoc.id, formData);
      } else {
        await ContentService.addDocument(formData);
      }
      
      setIsDocModalOpen(false);
      setEditingDoc(null);
      setDocFile(null);
      await refreshData();
      alert('Document enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du document');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocModal = (doc?: DocumentItem) => {
    if (doc) {
      setEditingDoc(doc);
      setDocForm({ 
        name: doc.name, 
        description: doc.description || '', 
        category: doc.category, 
        date: doc.date || new Date().toISOString().split('T')[0], 
        size: doc.size || '', 
        type: doc.type || 'PDF' 
      });
    } else {
      setEditingDoc(null);
      setDocForm({ 
        name: '', 
        description: '', 
        category: 'Délibérations', 
        date: new Date().toISOString().split('T')[0], 
        size: '', 
        type: 'PDF' 
      });
    }
    setDocFile(null);
    setIsDocModalOpen(true);
  };

  const handleDeleteDoc = async (id?: number) => {
    if (id && window.confirm("Supprimer ce document ?")) {
      try {
        await ContentService.deleteDocument(id);
        await refreshData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteCouncilMember = async (id: number) => {
    if (window.confirm("Supprimer ce membre du conseil ?")) {
      try {
        await CouncilService.deleteMember(id);
        await refreshData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteCouncilSession = async (id: number) => {
    if (window.confirm("Supprimer cette séance ?")) {
      try {
        await CouncilService.deleteSession(id);
        await refreshData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteNeighborhood = async (id: number) => {
    if (window.confirm("Supprimer ce conseil de quartier ?")) {
      try {
        await ContentService.deleteNeighborhood(id);
        await refreshData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleUpdateMsgStatus = async (id: number, status: string) => {
    await ContactService.updateStatus(id, status);
    setViewingMessage(null);
    refreshData();
  };

  const handleOpenAboutModal = (section?: AboutSection) => {
    if (section) {
      setAboutForm({ id: section.id, title: section.title, content: section.content });
    } else {
      setAboutForm({ id: 0, title: '', content: '' });
    }
    setIsAboutModalOpen(true);
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (aboutForm.id) {
        await ContentService.updateAbout(aboutForm.id, { title: aboutForm.title, content: aboutForm.content });
      } else {
        await ContentService.addAbout({ title: aboutForm.title, content: aboutForm.content });
      }
      setIsAboutModalOpen(false);
      setAboutForm({ id: 0, title: '', content: '' });
      await refreshData();
      alert('Contenu mis à jour avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du contenu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAbout = async (id: number) => {
    if (window.confirm("Supprimer cette section ?")) {
      try {
        await ContentService.deleteAbout(id);
        await refreshData();
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleOpenAboutStatModal = (stat?: AboutStat) => {
    if (stat) {
      setEditingAboutStat(stat);
      setAboutStatForm({ label: stat.label, value: stat.value, icon: stat.icon || 'TrendingUp' });
    } else {
      setEditingAboutStat(null);
      setAboutStatForm({ label: '', value: '', icon: 'TrendingUp' });
    }
    setIsAboutStatModalOpen(true);
  };

  const handleSaveAboutStat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAboutStat) {
        await ContentService.updateAboutStat(editingAboutStat.id, aboutStatForm);
      } else {
        await ContentService.addAboutStat(aboutStatForm);
      }
      setIsAboutStatModalOpen(false);
      setEditingAboutStat(null);
      setAboutStatForm({ label: '', value: '', icon: 'TrendingUp' });
      await refreshData();
      alert('Statistique enregistrée avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde de la statistique');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAboutStat = async (id: number) => {
    if (window.confirm("Supprimer cette statistique ?")) {
      try {
        await ContentService.deleteAboutStat(id);
        await refreshData();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject?.id) {
        await ContentService.updateProject(editingProject.id, projectForm);
      } else {
        await ContentService.addProject(projectForm);
      }
      setIsProjectModalOpen(false);
      refreshData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du projet');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingsSaving(true);
    try {
      await SystemService.updateSettings(settingsForm);
      alert("Paramètres mis à jour avec succès.");
      await refreshData();
    } catch (err) {
      alert("Erreur lors de la mise à jour des paramètres.");
    } finally {
      setIsSettingsSaving(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UserService.resetPassword(resetPassForm.userId, resetPassForm.newPassword);
      setIsResetPassModalOpen(false);
      setResetPassForm({ userId: '', newPassword: '' });
      alert("Mot de passe mis à jour avec succès.");
    } catch (err) {
      alert("Erreur lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserStatus = async (user: User, status: string) => {
    try {
      await UserService.update(user.id, { ...user, status });
      await refreshData();
    } catch (err) {
      alert("Erreur lors du changement de statut");
    }
  };

  const handleOpenProcedureModal = (proc?: ProcedureItem) => {
    if (proc) {
      setEditingProcedure(proc);
      setProcedureForm({ 
        title: proc.title, 
        description: proc.description, 
        icon: proc.icon, 
        category: proc.category, 
        delay: proc.delay || '', 
        isOnline: proc.isOnline !== undefined ? proc.isOnline : true, 
        dossierType: proc.dossierType || '',
        requiredDocs: Array.isArray(proc.requiredDocs) ? proc.requiredDocs.join(', ') : ''
      });
    } else {
      setEditingProcedure(null);
      setProcedureForm({ title: '', description: '', icon: 'FileText', category: 'Identité', delay: '15 jours', isOnline: true, dossierType: '', requiredDocs: '' });
    }
    setIsProcedureModalOpen(true);
  };

  const handleSaveProcedure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...procedureForm,
        requiredDocs: procedureForm.requiredDocs.split(',').map(d => d.trim()).filter(d => d !== '')
      };
      if (editingProcedure?.id) {
        await ContentService.updateProcedure(editingProcedure.id, data);
      } else {
        await ContentService.addProcedure(data);
      }
      setIsProcedureModalOpen(false);
      refreshData();
      alert('Démarche enregistrée avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde de la démarche');
    }
  };

  const handleDeleteProcedure = async (id?: number) => {
    if (id && window.confirm("Supprimer cette démarche ?")) {
      await ContentService.deleteProcedure(id);
      refreshData();
    }
  };

  const handleOpenServiceModal = (ser?: any) => {
    if (ser) {
      setEditingService(ser);
      setServiceForm({
        title: ser.title,
        description: ser.description,
        icon: ser.icon || 'FileText',
        action: ser.action || 'En savoir plus',
        link: ser.link || '',
        category: ser.category || 'Général'
      });
    } else {
      setEditingService(null);
      setServiceForm({
        title: '',
        description: '',
        icon: 'FileText',
        action: 'En savoir plus',
        link: '',
        category: 'Général'
      });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingService) {
        await ContentService.updateService(editingService.id, serviceForm);
      } else {
        await ContentService.addService(serviceForm);
      }
      setIsServiceModalOpen(false);
      await refreshData();
      alert('Service enregistré avec succès');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement du service');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (window.confirm('Supprimer ce service ?')) {
      try {
        await ContentService.deleteService(id);
        await refreshData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    if (['Validé', 'VALIDE', 'Résolu', 'Traité', 'Passé', 'TERMINE'].includes(status)) colorClass = 'bg-green-100 text-green-700';
    if (['Instruction', 'EN_ATTENTE', 'EN_ANALYSE', 'ASSIGNE', 'Lu', 'A venir'].includes(status)) colorClass = 'bg-blue-100 text-blue-700';
    if (['Attente documents', 'ATTENTE_DOCUMENTS', 'Nouveau'].includes(status)) colorClass = 'bg-amber-100 text-amber-700';
    if (['REJETE', 'Rejeté'].includes(status)) colorClass = 'bg-red-100 text-red-700';
    return <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full tracking-wider ${colorClass}`}>{status}</span>;
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Admin */}
      <div className="bg-gray-900 text-white h-20 flex items-center justify-between px-8 sticky top-0 z-50 border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-xl transition">
            <X className="h-6 w-6 text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <img src="/images/accueil/logo.jpg" className="h-10 w-auto invert brightness-0" alt="Logo" />
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">Console <span className="text-primary">Municipale</span></h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase text-primary tracking-widest">
              {currentUser.role === 'admin' ? 'Super Administrateur' : currentUser.assigned_service}
            </p>
            <p className="text-sm font-bold text-gray-300">{currentUser.name}</p>
          </div>
          <button onClick={() => AuthService.logout()} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 p-6 space-y-2 overflow-y-auto shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-4">Menu Gestion</p>
          

          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard className="h-5 w-5 mr-4" /> Tableau de Bord
          </button>

          <button onClick={() => setActiveTab('dossiers')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'dossiers' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <FileText className="h-5 w-5 mr-4" /> Dossiers Citoyen
          </button>

          {isSuperAdmin && (
            <>
              <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <AlertTriangle className="h-5 w-5 mr-4" /> Signalements
              </button>
              <button onClick={() => setActiveTab('images')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'images' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <FolderOpen className="h-5 w-5 mr-4" /> Médiathèque
              </button>
              <button onClick={() => setActiveTab('team')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'team' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Users className="h-5 w-5 mr-4" /> Gestion Équipe
              </button>
              <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Newspaper className="h-5 w-5 mr-4" /> Presse & Actus
              </button>
              <button onClick={() => setActiveTab('agenda')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'agenda' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Calendar className="h-5 w-5 mr-4" /> Agenda Municipal
              </button>
              <button onClick={() => setActiveTab('council')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'council' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Gavel className="h-5 w-5 mr-4" /> Conseil Municipal
              </button>
              <button onClick={() => setActiveTab('neighborhoods')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'neighborhoods' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <MapIcon className="h-5 w-5 mr-4" /> Conseils de Quartier
              </button>
              <button onClick={() => setActiveTab('about')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'about' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Building className="h-5 w-5 mr-4" /> Contenus À Propos
              </button>
              <button onClick={() => setActiveTab('documents')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'documents' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <File className="h-5 w-5 mr-4" /> Actes & Documents
              </button>
              <button onClick={() => setActiveTab('procedures')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'procedures' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Briefcase className="h-5 w-5 mr-4" /> Catalogue Démarches
              </button>
              <button onClick={() => setActiveTab('messages')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <MessageSquare className="h-5 w-5 mr-4" /> Messagerie
              </button>
              <button onClick={() => setActiveTab('participation')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'participation' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Lightbulb className="h-5 w-5 mr-4" /> Participation
              </button>
              <button onClick={() => setActiveTab('projects_mgt')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'projects_mgt' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Briefcase className="h-5 w-5 mr-4" /> Grands Travaux
              </button>
              <button onClick={() => setActiveTab('services_mgt')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'services_mgt' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Monitor className="h-5 w-5 mr-4" /> Services Page
              </button>
              <div className="h-px bg-gray-100 my-4 mx-4"></div>
              <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Activity className="h-5 w-5 mr-4" /> Journaux d'activité
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Settings className="h-5 w-5 mr-4" /> Configuration Système
              </button>
            </>
          )}
          

          <div className="pt-6 mt-6 border-t border-gray-100">
             <button 
               onClick={() => navigate('/guide')} 
               className="w-full flex items-center px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all border-2 border-dashed border-primary/20 hover:border-primary/40"
             >
               <BookOpen className="h-4 w-4 mr-4" /> Manuel d'utilisation
             </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-grow p-8 overflow-y-auto bg-gray-50/50">
          
          {/* SERVICES MANAGEMENT */}
          {activeTab === 'services_mgt' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Services de la Ville</h2>
                  <p className="text-gray-500">Gérez les services affichés sur la page d'accueil et la page des services.</p>
                </div>
                <button onClick={() => handleOpenServiceModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                  <Plus className="h-5 w-5 mr-3" /> Nouveau Service
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {municipalServices.map(ser => {
                  const SerIcon = (Icons as any)[ser.icon] || Icons.Monitor;
                  return (
                    <div key={(ser as any).id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl hover:shadow-primary/5 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-4 bg-primary/5 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                          <SerIcon className="h-6 w-6" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenServiceModal(ser)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteService((ser as any).id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 truncate uppercase tracking-tight">{ser.title}</h3>
                      <p className="text-gray-500 text-sm font-medium line-clamp-3 mb-6 flex-grow">{ser.description}</p>
                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Lien : {ser.link}</span>
                        <span className="text-[10px] font-black text-primary uppercase">{ser.action}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Signalements', val: filteredReports.length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'Messages', val: messages.length, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Dossiers', val: filteredDossiers.length, icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
                  { label: 'Événements', val: events.length, icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black text-gray-900">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isSuperAdmin && (
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-primary/20 flex flex-col items-center text-center">
                   <div className="p-5 bg-primary/5 rounded-full mb-6">
                     <Database className="h-10 w-10 text-primary" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tight">Initialisation des données</h3>
                   <p className="text-gray-500 max-w-md mb-8">
                     Si vous constatez que certaines pages sont vides (Services, Démarches, etc.), vous pouvez lancer l'initialisation pour restaurer les données par défaut.
                   </p>
                   <button 
                     onClick={async () => {
                        if(window.confirm("Voulez-vous réinitialiser les données par défaut ? Cela n'effacera pas vos contenus existants si les tables ne sont pas vides (selon la logique serveur).")) {
                          setLoading(true);
                          try {
                            await ContentService.seedData();
                            alert("Données initialisées avec succès !");
                            refreshData();
                          } catch (err) {
                            alert("Erreur lors de l'initialisation.");
                          } finally {
                            setLoading(false);
                          }
                        }
                     }}
                     disabled={loading}
                     className="bg-primary text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition active:scale-95 disabled:opacity-50"
                   >
                     {loading ? 'Chargement...' : 'Restaurer les données par défaut'}
                   </button>
                </div>
              )}
            </div>
          )}

          {/* IMAGES MANAGEMENT (Médiathèque) */}
          {activeTab === 'images' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                    <FolderOpen className="h-8 w-8 mr-3 text-primary" /> Dossier Images
                  </h2>
                  <p className="text-gray-500">Centralisez et affectez vos visuels locaux.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filtre Catégorie</p>
                    <select value={imgFilterCategory} onChange={(e) => setImgFilterCategory(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="Tout">Toutes</option>
                      {imageCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={() => setIsImageModalOpen(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition flex items-center self-end">
                    <Plus className="h-5 w-5 mr-3" /> Ajouter localement
                  </button>
                </div>
              </div>
              
              {images.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                  <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-gray-500 mb-2">Médiathèque vide</h3>
                  <p className="text-gray-400 mb-6">Aucune image n'a encore été référencée.</p>
                  <button 
                    onClick={() => setIsImageModalOpen(true)} 
                    className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-3" /> Ajouter votre première image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {images
                    .filter(img => imgFilterCategory === 'Tout' || img.category === imgFilterCategory)
                    .map(img => {
                      const isHero = systemImages['home_hero'] === img.url;
                      const isMayor = systemImages['mayor_portrait'] === img.url;

                      return (
                        <div key={img.id} className={`bg-white rounded-3xl border ${isHero || isMayor ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'} shadow-sm overflow-hidden group relative`}>
                          <div className="aspect-video relative overflow-hidden bg-gray-100">
                            <img 
                              src={img.url || '/placeholder.jpg'} 
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                              alt={img.title}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                              }}
                            />
                            
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleSetAsSystem('home_hero', img.url)} 
                                  className="p-3 bg-white text-primary rounded-xl hover:bg-primary hover:text-white transition shadow-lg flex items-center gap-2 text-[10px] font-black uppercase" 
                                  title="Bannière Accueil"
                                >
                                  <Monitor className="h-4 w-4" /> Hero
                                </button>
                                <button 
                                  onClick={() => handleSetAsSystem('mayor_portrait', img.url)} 
                                  className="p-3 bg-white text-secondary rounded-xl hover:bg-secondary hover:text-white transition shadow-lg flex items-center gap-2 text-[10px] font-black uppercase" 
                                  title="Photo Maire"
                                >
                                  <UserPlus className="h-4 w-4" /> Maire
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => copyToClipboard(img.url, img.id)} 
                                  className="p-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition shadow-lg" 
                                  title="Copier le chemin"
                                >
                                  {copiedId === img.id ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                </button>
                                <button 
                                  onClick={() => ImageService.delete(img.id).then(refreshData)} 
                                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg" 
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-black uppercase text-primary shadow-sm">
                              {img.category}
                            </div>
                            {isHero && (
                              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-primary text-white rounded-lg text-[9px] font-black uppercase shadow-sm flex items-center gap-1">
                                <Monitor className="h-3 w-3" /> Accueil
                              </div>
                            )}
                            {isMayor && (
                              <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-secondary text-white rounded-lg text-[9px] font-black uppercase shadow-sm flex items-center gap-1">
                                <UserPlus className="h-3 w-3" /> Portrait Maire
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="font-bold text-gray-900 text-sm line-clamp-1">{img.title}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1 truncate">
                              {img.url}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              )}
            </div>
          )}

          {/* AGENDA MANAGEMENT */}
          {activeTab === 'agenda' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Agenda Municipal</h2>
                  <p className="text-gray-500">Programmez les événements et manifestations de la ville.</p>
                </div>
                <button onClick={() => handleOpenEventModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                  <Plus className="h-5 w-5 mr-3" /> Nouvel Événement
                </button>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Événement</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Date & Heure</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Lieu</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <img src={e.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt={e.title} />
                            <span className="font-bold text-gray-900">{e.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium text-gray-600">
                          {new Date(e.date).toLocaleDateString()} - {e.time}
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-500">{e.location}</td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button onClick={() => handleOpenEventModal(e)} className="p-2 text-primary hover:bg-green-50 rounded-lg">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => EventService.delete(e.id).then(refreshData)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* ARTICLES MANAGEMENT */}
          {activeTab === 'articles' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Presse & Actualités</h2>
                  <p className="text-gray-500">Gérez le flux d'informations officielles et les communiqués de presse.</p>
                </div>
                <button onClick={() => handleOpenArticleModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                  <Plus className="h-5 w-5 mr-3" /> Nouveau Contenu
                </button>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Article / Communiqué</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Catégorie</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Statut</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {articles.map(art => (
                      <tr key={art.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <img src={art.imageUrl} className="h-12 w-12 rounded-xl object-cover bg-gray-100 shadow-sm" alt="Aperçu" />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1">{art.title}</p>
                              {art.isFeatured && <span className="flex items-center text-amber-500 text-[9px] font-black uppercase">
                                <Star className="h-3 w-3 mr-1 fill-amber-500" /> Épinglé à la une
                              </span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${art.category.includes('Presse') ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-primary'}`}>
                            {art.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="flex items-center text-green-500 text-[10px] font-black uppercase">
                            <CheckCircle className="h-3 w-3 mr-1" /> Publié
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button onClick={() => handleOpenArticleModal(art)} className="p-2 text-primary hover:bg-green-50 rounded-lg transition">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => ArticleService.delete(art.id).then(refreshData)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION ARTICLES */}
              {artTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setArtPage(prev => Math.max(1, prev - 1))}
                    disabled={artPage === 1}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-5 w-5 transform rotate-180 text-gray-400 group-disabled:text-gray-200" />
                  </button>
                  
                  {Array.from({ length: artTotalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setArtPage(page)}
                      className={`h-10 w-10 rounded-xl font-black text-sm transition-all ${
                        artPage === page 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' 
                          : 'bg-white border border-gray-200 text-gray-400 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setArtPage(prev => Math.min(artTotalPages, prev + 1))}
                    disabled={artPage === artTotalPages}
                    className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-400 group-disabled:text-gray-200" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ACTES & DOCUMENTS */}
          {activeTab === 'documents' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Actes & Documents</h2>
                  <p className="text-gray-500">Mise à jour des documents téléchargeables par les citoyens.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Rechercher un document..." 
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                    />
                  </div>
                  <select 
                    value={docCategoryFilter} 
                    onChange={(e) => setDocCategoryFilter(e.target.value)}
                    className="bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="Tout">Toutes les catégories</option>
                    {["Délibérations", "Finance", "Urbanisme", "Arrêtés", "Archives"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => handleOpenDocModal()} className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouveau Document
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Titre du document</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Catégorie</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 text-center">Poids / Format</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {documents
                      .filter(d => (docCategoryFilter === 'Tout' || d.category === docCategoryFilter))
                      .filter(d => (d.name.toLowerCase().includes(docSearch.toLowerCase())))
                      .map(doc => (
                      <tr key={doc.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-8 py-5 font-bold text-gray-700">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-red-50 rounded-lg">
                               <FileText className="h-5 w-5 text-red-500" />
                             </div>
                             {doc.name}
                          </div>
                          {doc.description && <p className="text-[10px] text-gray-400 mt-1 font-medium">{doc.description}</p>}
                        </td>
                        <td className="px-8 py-5 text-xs text-gray-400 font-bold">
                          {doc.date ? new Date(doc.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-8 py-5">
                          <span className="bg-blue-50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-500">{doc.category}</span>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <div className="flex flex-col items-center">
                             <span className="text-xs text-gray-400 font-bold">{doc.size || 'N/A'}</span>
                             <span className="text-[10px] text-gray-300 uppercase font-black">{doc.type || 'PDF'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg inline-block transition">
                            <Download className="h-5 w-5" />
                          </a>
                          <button onClick={() => handleOpenDocModal(doc)} className="p-2 text-primary hover:bg-green-50 rounded-lg">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROCEDURES MANAGEMENT */}
          {activeTab === 'procedures' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Catalogue des Démarches</h2>
                  <p className="text-gray-500">Gérez les types de démarches accessibles aux citoyens.</p>
                </div>
                <button onClick={() => handleOpenProcedureModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                  <Plus className="h-5 w-5 mr-3" /> Nouvelle Démarche
                </button>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Titre de la démarche</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Catégorie</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Délai</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Statut</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {procedures.map(proc => (
                      <tr key={proc.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <span className="font-bold text-gray-700">{proc.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-500">{proc.category}</span>
                        </td>
                        <td className="px-8 py-5 text-xs text-gray-400 font-bold">{proc.delay}</td>
                        <td className="px-8 py-5">
                          {proc.isOnline ? (
                            <span className="text-green-500 text-[10px] font-black uppercase flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" /> En ligne
                            </span>
                          ) : (
                            <span className="text-amber-500 text-[10px] font-black uppercase flex items-center">
                              <Clock className="h-3 w-3 mr-1" /> Guichet
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                          <button onClick={() => handleOpenProcedureModal(proc)} className="p-2 text-primary hover:bg-green-50 rounded-lg">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteProcedure(proc.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COUNCIL MANAGEMENT */}
          {activeTab === 'council' && isSuperAdmin && (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Membres du Conseil</h2>
                    <p className="text-gray-500">Gérez les élus et adjoints municipaux.</p>
                  </div>
                  <button onClick={() => handleOpenCouncilMemberModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvel Élu
                  </button>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 font-black uppercase text-[10px] text-gray-400">
                      <tr>
                        <th className="px-8 py-5">Nom / Rôle</th>
                        <th className="px-8 py-5">Délégation / Commission</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {councilMembers.map(m => (
                        <tr key={m.id} className="hover:bg-gray-50 transition">
                          <td className="px-8 py-5 flex items-center gap-4">
                            <div className="h-10 w-10 bg-gray-100 rounded-xl overflow-hidden">
                              {m.image ? <img src={m.image} className="w-full h-full object-cover" /> : <Users className="w-full h-full p-2 text-gray-400" />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{m.name}</p>
                                <p className="text-[10px] text-primary uppercase font-black tracking-widest">{m.role}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm text-gray-400 font-bold">{m.commission || 'Aucune'}</td>
                          <td className="px-8 py-5 text-right space-x-2">
                             <button onClick={() => handleOpenCouncilMemberModal(m)} className="p-2 text-primary hover:bg-green-50 rounded-lg"><Edit className="h-5 w-5" /></button>
                             <button onClick={() => handleDeleteCouncilMember(m.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Séances du Conseil</h2>
                    <p className="text-gray-500">Calendrier et PV des séances passées.</p>
                  </div>
                  <button onClick={() => handleOpenCouncilSessionModal()} className="border-2 border-primary text-primary px-6 py-4 rounded-2xl font-black hover:bg-primary hover:text-white transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvelle Séance
                  </button>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 font-black uppercase text-[10px] text-gray-400">
                      <tr>
                        <th className="px-8 py-5">Date / Objet</th>
                        <th className="px-8 py-5 text-center">Statut</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {councilSessions.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50 transition">
                          <td className="px-8 py-5">
                            <p className="font-bold text-gray-900">{s.title}</p>
                            <p className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.status === 'A venir' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>{s.status}</span>
                          </td>
                          <td className="px-8 py-5 text-right space-x-2">
                             <button onClick={() => handleOpenCouncilSessionModal(s)} className="p-2 text-primary hover:bg-green-50 rounded-lg"><Edit className="h-5 w-5" /></button>
                             <button onClick={() => handleDeleteCouncilSession(s.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NEIGHBORHOODS MANAGEMENT */}
          {activeTab === 'neighborhoods' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Conseils de Quartier</h2>
                  <p className="text-gray-500">Gérez les conseils et représentants de quartier.</p>
                </div>
                <button onClick={() => handleOpenNeighborhoodModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                  <Plus className="h-5 w-5 mr-3" /> Nouveau Conseil
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {neighborhoods.map(nh => (
                  <div key={nh.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group">
                    {nh.image && (
                      <div className="h-48 w-full overflow-hidden">
                        <img src={nh.image} alt={nh.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="p-8">
                       <div className="flex justify-between items-start mb-6">
                         <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                           <MapPin className="h-8 w-8" />
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => handleOpenNeighborhoodModal(nh)} className="p-2 text-gray-300 hover:text-primary transition"><Edit className="h-5 w-5" /></button>
                           <button onClick={() => handleDeleteNeighborhood(nh.id)} className="p-2 text-gray-300 hover:text-red-500 transition"><Trash2 className="h-5 w-5" /></button>
                         </div>
                       </div>
                       <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2">{nh.name}</h4>
                       <p className="text-xs text-primary font-black uppercase tracking-widest mb-1">Délégué : {nh.representative}</p>
                       {nh.contact_email && <p className="text-[10px] text-gray-400 font-bold mb-4 flex items-center"><Mail className="h-3 w-3 mr-1" /> {nh.contact_email}</p>}
                       <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-3">{nh.description}</p>
                       {nh.reports_url && (
                         <a href={nh.reports_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] font-black text-primary uppercase mb-6 bg-primary/5 px-3 py-2 rounded-lg hover:bg-primary/10 transition">
                           <FileText className="h-3 w-3 mr-2" /> Compte-rendu
                         </a>
                       )}
                       <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-gray-400">
                         <div className="flex items-center"><Clock className="h-3 w-3 mr-1.5" /> Next: {new Date(nh.nextMeeting).toLocaleDateString()}</div>
                         <div className="flex items-center"><MapIcon className="h-3 w-3 mr-1.5" /> {nh.location}</div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === 'messages' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Messagerie</h2>
                <p className="text-gray-500">Gérez les demandes de contact envoyées par les usagers.</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {messages.map(m => (
                  <div key={m.id} className={`bg-white p-6 rounded-3xl border transition-all ${m.status === 'Nouveau' ? 'border-primary ring-4 ring-primary/5 shadow-xl' : 'border-gray-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{m.subject}</p>
                          <p className="text-xs text-gray-400">De: {m.name} ({m.email})</p>
                        </div>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-2xl italic leading-relaxed">"{m.message}"</p>
                    <div className="flex justify-end gap-3">
                      {m.status !== 'Traité' && (
                        <button onClick={() => handleUpdateMsgStatus(m.id, 'Traité')} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase hover:bg-primary hover:text-white transition">
                          Marquer comme traité
                        </button>
                      )}
                      <button onClick={() => ContactService.delete(m.id).then(refreshData)} className="p-2 text-red-300 hover:text-red-500 transition">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && isSuperAdmin && (
            <div className="space-y-12 animate-fade-in">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Sections À Propos</h2>
                    <p className="text-gray-500">Gérez les textes descriptifs de la Mairie.</p>
                  </div>
                  <button onClick={() => handleOpenAboutModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouvelle Section
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {aboutSections.map(sec => (
                    <div key={sec.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-black text-gray-800 flex items-center gap-3">
                          <Info className="h-5 w-5 text-primary" /> {sec.title}
                        </h4>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenAboutModal(sec)} className="p-3 bg-gray-50 hover:bg-primary/10 text-primary rounded-2xl transition">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDeleteAbout(sec.id)} className="p-3 bg-gray-50 hover:bg-red-50 text-red-500 rounded-2xl transition">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-4 leading-relaxed">{sec.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">Chiffres Clés</h2>
                    <p className="text-gray-500">Gérez les statistiques affichées sur la page À Propos.</p>
                  </div>
                  <button onClick={() => handleOpenAboutStatModal()} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                    <Plus className="h-5 w-5 mr-3" /> Nouveau Chiffre
                  </button>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 font-black uppercase text-[10px] text-gray-400">
                      <tr>
                        <th className="px-8 py-5">Label</th>
                        <th className="px-8 py-5">Valeur</th>
                        <th className="px-8 py-5">Icône</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {aboutStats.map(stat => (
                        <tr key={stat.id} className="hover:bg-gray-50 transition">
                          <td className="px-8 py-5 font-bold text-gray-900">{stat.label}</td>
                          <td className="px-8 py-5 font-black text-primary">{stat.value}</td>
                          <td className="px-8 py-5 text-gray-400">{stat.icon}</td>
                          <td className="px-8 py-5 text-right space-x-2">
                             <button onClick={() => handleOpenAboutStatModal(stat)} className="p-2 text-primary hover:bg-green-50 rounded-lg"><Edit className="h-5 w-5" /></button>
                             <button onClick={() => handleDeleteAboutStat(stat.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TEAM MANAGEMENT */}
          {activeTab === 'team' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Équipe Municipale</h2>
                  <p className="text-gray-500">Comptes agents et administrateurs.</p>
                </div>
                <button onClick={() => setIsTeamModalOpen(true)} className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center">
                  <UserPlus className="h-5 w-5 mr-3" /> Nouvel Agent / Admin
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(u => u.role !== 'citoyen').map(u => (
                  <div key={u.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-primary uppercase">
                        {u.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 p-3 rounded-xl border ${u.role === 'admin' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-primary/5 border-primary/10 text-primary'}`}>
                      {u.role === 'admin' ? <ShieldCheck className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{u.role === 'admin' ? 'Super Admin' : u.assigned_service}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                       <select 
                         value={u.status || 'actif'} 
                         onChange={(e) => handleChangeUserStatus(u, e.target.value)}
                         className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full outline-none transition ${
                           (u.status || 'actif') === 'actif' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                         }`}
                       >
                         <option value="actif">Actif</option>
                         <option value="suspendu">Suspendu</option>
                       </select>

                       <div className="flex gap-2">
                         <button 
                           onClick={() => {
                             setResetPassForm({ userId: u.id, newPassword: '' });
                             setIsResetPassModalOpen(true);
                           }}
                           className="p-2 text-gray-300 hover:text-amber-500 transition"
                           title="Réinitialiser le mot de passe"
                         >
                            <Key className="h-4 w-4" />
                         </button>
                         {u.id !== currentUser.id && (
                           <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-300 hover:text-red-500 transition">
                             <Trash2 className="h-4 w-4" />
                           </button>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOSSIERS MANAGEMENT */}
          {activeTab === 'dossiers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                    <FileText className="h-8 w-8 mr-3 text-primary" /> Gestion des Dossiers
                  </h2>
                  <p className="text-gray-500">Instruction et traitement des demandes numériques des citoyens.</p>
                </div>
                <div className="flex flex-wrap gap-4 items-end">
                  {isSuperAdmin && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filtrer par Service</p>
                      <select value={dosFilterService} onChange={(e) => setDosFilterService(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="Tout">Tous les services</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                  <button 
                    onClick={() => setIsDossierCreateModalOpen(true)}
                    className="bg-black text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition"
                  >
                    <Plus className="h-4 w-4" /> Nouveau Dossier
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Référence / Date</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Citoyen</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Type de Demande</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Service</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400">Statut</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black uppercase text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredDossiers.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50 transition group">
                        <td className="px-8 py-5">
                          <div className="font-black text-gray-900">{d.id}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(d.date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-bold text-gray-700">{d.user_name}</div>
                          <div className="text-[10px] text-gray-400 font-bold">{d.user_email}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                               <FileText className="h-3.5 w-3.5" />
                             </div>
                             <span className="font-bold text-sm text-gray-600">{d.type}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-50 px-2 py-1 rounded">
                            {d.assigned_service || 'Non assigné'}
                          </span>
                        </td>
                        <td className="px-8 py-5"><StatusBadge status={d.status} /></td>
                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                          <button onClick={() => handleOpenDossierModal(d)} className="bg-primary text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition shadow-lg shadow-primary/20">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm("Supprimer ce dossier définitivement ?")) {
                                DossierService.delete(d.id).then(refreshData);
                              }
                            }}
                            className="p-2 text-red-300 hover:text-red-500 transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS MANAGEMENT */}
          {activeTab === 'reports' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center">
                    <AlertTriangle className="h-8 w-8 mr-3 text-amber-500" /> Signalements Citoyens
                  </h2>
                  <p className="text-gray-500">Traitez les incidents signalés sur la voie publique.</p>
                </div>
                {isSuperAdmin && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Filtrer par Service</p>
                    <select value={repFilterService} onChange={(e) => setRepFilterService(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="Tout">Tous les services</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b text-[10px] font-black uppercase text-gray-400">
                    <tr>
                      <th className="px-8 py-5">Date / Type</th>
                      <th className="px-8 py-5">Lieu</th>
                      <th className="px-8 py-5">Contact</th>
                      <th className="px-8 py-5">Service</th>
                      <th className="px-8 py-5">Statut</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredReports.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition">
                        <td className="px-8 py-5 font-bold text-gray-900">
                           {new Date(r.date).toLocaleDateString()}
                           <div className="text-[10px] text-primary">{r.type}</div>
                        </td>
                        <td className="px-8 py-5 text-sm text-gray-600 font-medium">{r.location}</td>
                        <td className="px-8 py-5 text-xs text-gray-500">
                          <p className="font-bold flex items-center gap-1.5"><Mail className="h-3 w-3" /> {r.email}</p>
                          <p className="mt-1 flex items-center gap-1.5"><Phone className="h-3 w-3" /> {r.phone}</p>
                          {(r as any).imageUrl && (
                            <a href={(r as any).imageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-primary/5 text-primary rounded-lg font-bold hover:bg-primary/10 transition">
                              <ImageIcon className="h-3 w-3" /> Photo jointe
                            </a>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{r.assigned_service || 'Non assigné'}</span>
                        </td>
                        <td className="px-8 py-5"><StatusBadge status={r.status} /></td>
                        <td className="px-8 py-5 text-right flex justify-end gap-2">
                           <button 
                             onClick={() => {
                               setSelectedReport(r);
                               setReportTreatment({ status: r.status, assigned_service: r.assigned_service || '' as MunicipalService });
                             }} 
                             className="p-2 text-primary hover:bg-primary/10 rounded-xl transition"
                           >
                             <Edit className="h-5 w-5" />
                           </button>
                           <button 
                             onClick={() => {
                               if (window.confirm("Supprimer ce signalement ?")) {
                                 ReportingService.delete(r.id).then(refreshData);
                               }
                             }}
                             className="p-2 text-red-300 hover:text-red-500 transition"
                           >
                             <Trash2 className="h-5 w-5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {/* PARTICIPATION MANAGEMENT */}
          {activeTab === 'participation' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Budget Participatif</h2>
                  <p className="text-gray-500">Suivi des idées citoyennes et gestion des votes.</p>
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Projet / Auteur</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Votes</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget est.</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Statut</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participationProjects.map(p => (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition">
                        <td className="px-8 py-5">
                          <p className="font-bold text-gray-900">{p.title}</p>
                          <p className="text-[10px] text-gray-400">Par {p.author_name} • {p.category}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">{p.votes_count}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-bold text-gray-600">{p.budget_estimate}</td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            p.status === 'Validé' ? 'bg-green-100 text-green-600' :
                            p.status === 'En cours' ? 'bg-blue-100 text-blue-600' :
                            p.status === 'Rejeté' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-2">
                           <select 
                             className="text-xs border rounded-lg bg-white p-1"
                             value={p.status}
                             onChange={(e) => ParticipationService.updateStatus(p.id, e.target.value).then(refreshData)}
                           >
                             <option value="Soumis">Soumis</option>
                             <option value="En cours">En cours</option>
                             <option value="Validé">Validé</option>
                             <option value="Rejeté">Rejeté</option>
                           </select>
                           <button onClick={() => ParticipationService.delete(p.id).then(refreshData)} className="p-2 text-red-300 hover:text-red-500">
                             <Trash2 className="h-4 w-4" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECTS MANAGEMENT (Grands Travaux) */}
          {activeTab === 'projects_mgt' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Grands Travaux</h2>
                  <p className="text-gray-500">Projets structurants de la ville en cours ou terminés.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({ 
                      title: '', 
                      description: '', 
                      image_url: '', 
                      status: 'en_cours', 
                      category: 'Construction de routes',
                      budget: '',
                      location_name: '',
                      progress_pct: 0,
                      completion_date: '',
                      partners: '',
                      results: '',
                      photo_before: '',
                      photo_after: '',
                      studies_in_progress: '',
                      future_investments: '',
                      planned_calendar: '',
                      latitude: 12.5859,
                      longitude: -16.2729,
                      video_url: ''
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="bg-primary text-white px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition flex items-center"
                >
                  <Plus className="h-5 w-5 mr-3" /> Nouveau Chantier
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p, i) => (
                  <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group">
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.color}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.category}</span>
                        <div className="flex items-center text-[10px] font-black text-gray-400">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {p.progress_pct}%
                        </div>
                      </div>
                      <h4 className="font-black uppercase text-lg tracking-tighter mb-2">{p.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{p.description}</p>
                      
                      <div className="w-full bg-gray-100 h-1 rounded-full mb-6 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-1000" 
                          style={{ width: `${p.progress_pct}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button onClick={() => {
                          setEditingProject(p);
                          setProjectForm({...p});
                          setIsProjectModalOpen(true);
                        }} className="p-2 text-gray-400 hover:text-primary transition">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => p.id && ContentService.deleteProject(p.id).then(refreshData)} className="p-2 text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SYSTEM SETTINGS */}
          {activeTab === 'settings' && isSuperAdmin && (
            <div className="space-y-8 animate-fade-in pb-20">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Configuration Système</h2>
                  <p className="text-gray-500">Paramètres globaux de la plateforme municipale.</p>
                </div>
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSettingsSaving}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition flex items-center disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-3" /> {isSettingsSaving ? 'Enregistrement...' : 'Enregistrer tout'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-xl font-black">
                      <Phone className="h-5 w-5" />
                    </div>
                    <h3 className="font-black uppercase tracking-tight text-xl">Coordonnées de la Ville</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adresse physique</label>
                       <input 
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-secondary/10" 
                         value={settingsForm['contact_address'] || siteSettings.find(s => s.setting_key === 'contact_address')?.setting_value || ''} 
                         onChange={e => setSettingsForm({...settingsForm, contact_address: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Téléphone Secrétariat</label>
                       <input 
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-secondary/10" 
                         value={settingsForm['contact_phone'] || siteSettings.find(s => s.setting_key === 'contact_phone')?.setting_value || ''} 
                         onChange={e => setSettingsForm({...settingsForm, contact_phone: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail Officiel</label>
                       <input 
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-secondary/10" 
                         value={settingsForm['contact_email'] || siteSettings.find(s => s.setting_key === 'contact_email')?.setting_value || ''} 
                         onChange={e => setSettingsForm({...settingsForm, contact_email: e.target.value})}
                       />
                    </div>
                  </div>
                </div>

                {/* General Options */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl font-black">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="font-black uppercase tracking-tight text-xl">Options Générales</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900">Mode Maintenance</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Désactiver l'accès public au site</p>
                      </div>
                      <button 
                        onClick={() => setSettingsForm({...settingsForm, maintenance_mode: (settingsForm['maintenance_mode'] || siteSettings.find(s => s.setting_key === 'maintenance_mode')?.setting_value) === 'true' ? 'false' : 'true'})}
                        className={`w-14 h-8 rounded-full relative transition-colors ${(settingsForm['maintenance_mode'] || siteSettings.find(s => s.setting_key === 'maintenance_mode')?.setting_value) === 'true' ? 'bg-red-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${(settingsForm['maintenance_mode'] || siteSettings.find(s => s.setting_key === 'maintenance_mode')?.setting_value) === 'true' ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900">Module de Chat Citoyen</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Activer le support en temps réel</p>
                      </div>
                      <button 
                        onClick={() => setSettingsForm({...settingsForm, enable_chat: (settingsForm['enable_chat'] || siteSettings.find(s => s.setting_key === 'enable_chat')?.setting_value) === 'true' ? 'false' : 'true'})}
                        className={`w-14 h-8 rounded-full relative transition-colors ${(settingsForm['enable_chat'] || siteSettings.find(s => s.setting_key === 'enable_chat')?.setting_value) === 'true' ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${(settingsForm['enable_chat'] || siteSettings.find(s => s.setting_key === 'enable_chat')?.setting_value) === 'true' ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Texte de Mentions Légales (Pied de page)</label>
                       <textarea 
                         rows={3}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-primary/10" 
                         value={settingsForm['footer_text'] || siteSettings.find(s => s.setting_key === 'footer_text')?.setting_value || ''} 
                         onChange={e => setSettingsForm({...settingsForm, footer_text: e.target.value})}
                       />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AUDIT LOGS */}
          {activeTab === 'logs' && isSuperAdmin && (
            <div className="space-y-6 animate-fade-in pb-20">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">Journaux d'activité</h2>
                  <p className="text-gray-500">Historique complet des actions administratives effectuées sur la console.</p>
                </div>
                <div className="p-4 bg-primary/10 text-primary rounded-2xl">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 font-black">Date & Heure</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 font-black">Administrateur</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 font-black">Action</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 font-black">Détails</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 font-black">IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-8 py-5 text-xs font-bold text-gray-500">
                          {new Date(log.created_at).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center font-black text-[10px] text-gray-400">
                              {log.user_name?.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-gray-900">{log.user_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            log.action.includes('DELETE') ? 'bg-red-50 text-red-500' :
                            log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-500' :
                            log.action.includes('CREATE') ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-500'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-xs text-gray-600 line-clamp-1 max-w-xs" title={log.details}>{log.details}</p>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-mono text-gray-400">
                          {log.ip_address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {auditLogs.length === 0 && (
                  <div className="p-20 text-center text-gray-400">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">Aucune activité enregistrée</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- MODALS --- */}
      
      {/* REPORT TREATMENT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSelectedReport(null)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-scale-up">
            <div className="bg-amber-500 p-8 text-white relative">
              <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition">
                <X className="h-6 w-6" />
              </button>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">Traitement de signalement</p>
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">{selectedReport.type}</h3>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu</p>
                  <p className="font-bold text-gray-700">{selectedReport.location}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                  <p className="font-bold text-gray-700">{new Date(selectedReport.date).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</p>
                  <p className="text-sm text-gray-600">{selectedReport.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Statut</label>
                     <select 
                       value={reportTreatment.status} 
                       onChange={(e) => setReportTreatment({...reportTreatment, status: e.target.value as any})}
                       className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/10 transition"
                     >
                       <option value="Nouveau">Nouveau</option>
                       <option value="Pris en compte">Pris en compte</option>
                       <option value="Résolu">Résolu</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Assigné</label>
                     <select 
                       value={reportTreatment.assigned_service} 
                       onChange={(e) => setReportTreatment({...reportTreatment, assigned_service: e.target.value as MunicipalService})}
                       className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:ring-4 focus:ring-primary/10 transition"
                     >
                       <option value="">Non assigné</option>
                       {services.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setSelectedReport(null)}
                className="flex-1 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-400 hover:text-gray-600 transition"
              >
                Annuler
              </button>
              <button 
                onClick={handleTreatReport}
                disabled={loading}
                className="flex-[2] bg-amber-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
              >
                {loading ? 'Traitement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROJET MODAL (Grands Travaux) */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsProjectModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveProject}>
              <div className="p-8 bg-black text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">{editingProject ? 'Modifier le projet' : 'Initialiser un chantier'}</h3>
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations Générales */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Informations Générales</p>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du Projet</label>
                      <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                      <select className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})}>
                        <option value="Construction de routes">Construction de routes</option>
                        <option value="Éclairage public">Éclairage public</option>
                        <option value="Réhabilitation écoles">Réhabilitation écoles</option>
                        <option value="Numérisation état civil">Numérisation état civil</option>
                        <option value="Infrastructures Sportives">Infrastructures Sportives</option>
                        <option value="Assainissement">Assainissement</option>
                        <option value="Marché & Commerce">Marché & Commerce</option>
                        <option value="Santé">Santé</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Statut</label>
                        <select className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.status} onChange={e => setProjectForm({...projectForm, status: e.target.value as any})}>
                          <option value="en_cours">En cours</option>
                          <option value="realise">Réalisé</option>
                          <option value="avenir">À venir</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Budget</label>
                        <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.budget} onChange={e => setProjectForm({...projectForm, budget: e.target.value})} placeholder="Ex: 50 000 000 FCFA" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Localisation</label>
                        <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.location_name} onChange={e => setProjectForm({...projectForm, location_name: e.target.value})} placeholder="Ex: Kandé, Boucotte..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Avancement (%)</label>
                        <input type="number" className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.progress_pct} onChange={e => setProjectForm({...projectForm, progress_pct: parseInt(e.target.value)})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Image Principale</label>
                      <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.image_url} onChange={e => setProjectForm({...projectForm, image_url: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date de livraison prévue</label>
                      <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.completion_date} onChange={e => setProjectForm({...projectForm, completion_date: e.target.value})} placeholder="Ex: Décembre 2024" />
                    </div>
                  </div>

                  {/* Détails et Technique */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Détails de Réalisation</p>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Partenaires</label>
                      <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.partners} onChange={e => setProjectForm({...projectForm, partners: e.target.value})} placeholder="Ex: Banque Mondiale, UE..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Résultats attendus / obtenus</label>
                      <textarea rows={2} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm" value={projectForm.results} onChange={e => setProjectForm({...projectForm, results: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Avant (URL)</label>
                        <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.photo_before} onChange={e => setProjectForm({...projectForm, photo_before: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Après (URL)</label>
                        <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.photo_after} onChange={e => setProjectForm({...projectForm, photo_after: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                        <input type="number" step="0.000001" className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.latitude} onChange={e => setProjectForm({...projectForm, latitude: parseFloat(e.target.value)})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                        <input type="number" step="0.000001" className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.longitude} onChange={e => setProjectForm({...projectForm, longitude: parseFloat(e.target.value)})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Vidéo (Youtube/Vimeo)</label>
                      <input className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={projectForm.video_url} onChange={e => setProjectForm({...projectForm, video_url: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Planification & Futur</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Études en cours</label>
                      <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm" value={projectForm.studies_in_progress} onChange={e => setProjectForm({...projectForm, studies_in_progress: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Investissements futurs</label>
                      <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm" value={projectForm.future_investments} onChange={e => setProjectForm({...projectForm, future_investments: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Calendrier prévisionnel</label>
                      <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm" value={projectForm.planned_calendar} onChange={e => setProjectForm({...projectForm, planned_calendar: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 border-t flex gap-4 bg-gray-50">
                <button type="button" onClick={() => setIsProjectModalOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-400 hover:text-gray-600 transition">Annuler</button>
                <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-xl hover:scale-[1.02] transition">Enregistrer le projet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMAGE MODAL (Médiathèque) */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsImageModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveImage}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Référencer une image</h3>
                <button type="button" onClick={() => setIsImageModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre du média</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={imageForm.title} onChange={e => setImageForm({...imageForm, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Chemin relatif (ex: /images/accueil/hero.jpg)</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={imageForm.url} onChange={e => setImageForm({...imageForm, url: e.target.value})} placeholder="/images/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</label>
                  <select className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={imageForm.category} onChange={e => setImageForm({...imageForm, category: e.target.value as any})}>
                    {imageCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl">Ajouter à la collection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsEventModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveEvent}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">{editingEvent ? 'Modifier' : 'Nouvel'} Événement</h3>
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre</label>
                    <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</label>
                    <select className="w-full border-2 border-gray-100 rounded-2xl p-4" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value})}>
                      {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                    <input type="date" required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Heure</label>
                    <input placeholder="Ex: 10:00 - 18:00" className="w-full border-2 border-gray-100 rounded-2xl p-4" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Image (Optionnelle)</label>
                  <div className="flex items-center gap-4">
                    {eventForm.imageUrl && !eventImageFile && (
                      <img src={eventForm.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover border border-gray-100" referrerPolicy="no-referrer" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setEventImageFile(e.target.files?.[0] || null)}
                      className="flex-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {!eventImageFile && (
                    <input 
                      className="w-full border-2 border-gray-100 rounded-2xl p-4 mt-2" 
                      value={eventForm.imageUrl} 
                      onChange={e => setEventForm({...eventForm, imageUrl: e.target.value})} 
                      placeholder="Ou URL : https://..." 
                    />
                  )}
                  {eventForm.imageUrl && !eventImageFile && <p className="text-[9px] text-gray-400 italic">Laissez vide pour conserver l'image actuelle ou l'URL actuelle</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea rows={4} className="w-full border-2 border-gray-100 rounded-2xl p-4" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUNCIL MEMBER MODAL */}
      {isCouncilMemberModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsCouncilMemberModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveCouncilMember}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Élu Municipal</h3>
                <button type="button" onClick={() => setIsCouncilMemberModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom Complet</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={councilMemberForm.name} onChange={e => setCouncilMemberForm({...councilMemberForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle / Titre</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={councilMemberForm.role} onChange={e => setCouncilMemberForm({...councilMemberForm, role: e.target.value})} placeholder="Ex: 1er Adjoint au Maire" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délégation / Commission</label>
                  <input className="w-full border-2 border-gray-100 rounded-2xl p-4" value={councilMemberForm.commission} onChange={e => setCouncilMemberForm({...councilMemberForm, commission: e.target.value})} placeholder="Ex: Santé & Action Sociale" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Photo (Optionnelle)</label>
                  <div className="flex items-center gap-4">
                    {councilMemberForm.image && !memberImageFile && (
                      <img src={councilMemberForm.image} alt="" className="h-12 w-12 rounded-full object-cover border border-gray-100" referrerPolicy="no-referrer" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setMemberImageFile(e.target.files?.[0] || null)}
                      className="flex-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {councilMemberForm.image && !memberImageFile && <p className="text-[9px] text-gray-400 italic">Laissez vide pour conserver l'image actuelle</p>}
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 transition">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUNCIL SESSION MODAL */}
      {isCouncilSessionModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsCouncilSessionModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveCouncilSession}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Séance du Conseil</h3>
                <button type="button" onClick={() => setIsCouncilSessionModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                  <input type="date" required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={councilSessionForm.date} onChange={e => setCouncilSessionForm({...councilSessionForm, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre / Objet</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={councilSessionForm.title} onChange={e => setCouncilSessionForm({...councilSessionForm, title: e.target.value})} placeholder="Ex: Vote du budget 2024" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordre du jour (Agenda)</label>
                  <textarea rows={6} className="w-full border-2 border-gray-100 rounded-2xl p-4 text-sm" value={councilSessionForm.agenda} onChange={e => setCouncilSessionForm({...councilSessionForm, agenda: e.target.value})} placeholder="1. Point A\n2. Point B..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</label>
                  <select className="w-full border-2 border-gray-100 rounded-2xl p-4" value={councilSessionForm.status} onChange={e => setCouncilSessionForm({...councilSessionForm, status: e.target.value as any})}>
                    <option value="A venir">À venir</option>
                    <option value="Passé">Passée / Terminée</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document (PV / Ordre du jour)</label>
                  <div className="flex items-center gap-4">
                    {councilSessionForm.docUrl && !sessionDocFile && (
                      <a href={councilSessionForm.docUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition">
                        <FileText size={20} />
                      </a>
                    )}
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setSessionDocFile(e.target.files?.[0] || null)}
                      className="flex-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {councilSessionForm.docUrl && !sessionDocFile && <p className="text-[9px] text-gray-400 italic">Laissez vide pour conserver le document actuel</p>}
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 transition">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEIGHBORHOOD MODAL */}
      {isNeighborhoodModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsNeighborhoodModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveNeighborhood}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Conseil de Quartier</h3>
                <button type="button" onClick={() => setIsNeighborhoodModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom du Quartier</label>
                    <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.name} onChange={e => setNeighborhoodForm({...neighborhoodForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délégué Référent</label>
                    <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.representative} onChange={e => setNeighborhoodForm({...neighborhoodForm, representative: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prochaine Réunion</label>
                    <input type="datetime-local" className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.nextMeeting} onChange={e => setNeighborhoodForm({...neighborhoodForm, nextMeeting: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu habituel</label>
                    <input className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.location} onChange={e => setNeighborhoodForm({...neighborhoodForm, location: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.description} onChange={e => setNeighborhoodForm({...neighborhoodForm, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lien Compte-rendu (PDF/URL)</label>
                     <input className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.reports_url} onChange={e => setNeighborhoodForm({...neighborhoodForm, reports_url: e.target.value})} placeholder="https://..." />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email de contact</label>
                     <input type="email" className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.contact_email} onChange={e => setNeighborhoodForm({...neighborhoodForm, contact_email: e.target.value})} placeholder="contact@quartier.sn" />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latitude</label>
                    <input type="number" step="0.000001" className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.latitude} onChange={e => setNeighborhoodForm({...neighborhoodForm, latitude: parseFloat(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Longitude</label>
                    <input type="number" step="0.000001" className="w-full border-2 border-gray-100 rounded-2xl p-4" value={neighborhoodForm.longitude} onChange={e => setNeighborhoodForm({...neighborhoodForm, longitude: parseFloat(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Photo illustrative</label>
                  <div className="flex items-center gap-4">
                    {neighborhoodForm.image && !neighborhoodImageFile && (
                      <img src={neighborhoodForm.image} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-100" referrerPolicy="no-referrer" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNeighborhoodImageFile(e.target.files?.[0] || null)}
                      className="flex-1 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  {neighborhoodForm.image && !neighborhoodImageFile && <p className="text-[9px] text-gray-400 italic">Laissez vide pour conserver l'image actuelle</p>}
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 transition">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROCEDURE MODAL */}
      {isProcedureModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsProcedureModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveProcedure}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">{editingProcedure ? 'Modifier' : 'Nouvelle'} Démarche</h3>
                <button type="button" onClick={() => setIsProcedureModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Titre</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4" value={procedureForm.title} onChange={e => setProcedureForm({...procedureForm, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</label>
                    <select className="w-full border-2 border-gray-100 rounded-2xl p-4" value={procedureForm.category} onChange={e => setProcedureForm({...procedureForm, category: e.target.value})}>
                      {procedureCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délai estimé</label>
                    <input className="w-full border-2 border-gray-100 rounded-2xl p-4" value={procedureForm.delay} onChange={e => setProcedureForm({...procedureForm, delay: e.target.value})} placeholder="ex: 48h, 15 jours" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type de dossier (Backend ID)</label>
                  <input className="w-full border-2 border-gray-100 rounded-2xl p-4" value={procedureForm.dossierType} onChange={e => setProcedureForm({...procedureForm, dossierType: e.target.value})} placeholder="ex: Casier Judiciaire" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4" value={procedureForm.description} onChange={e => setProcedureForm({...procedureForm, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prérequis (séparés par des virgules)</label>
                  <textarea rows={2} className="w-full border-2 border-gray-100 rounded-2xl p-4" value={procedureForm.requiredDocs} onChange={e => setProcedureForm({...procedureForm, requiredDocs: e.target.value})} placeholder="ex: Pièce d'identité, Justificatif de domicile..." />
                </div>
                <div className="flex items-center gap-4 py-2">
                   <input type="checkbox" checked={procedureForm.isOnline} onChange={e => setProcedureForm({...procedureForm, isOnline: e.target.checked})} className="w-5 h-5 accent-primary" />
                   <label className="text-sm font-bold text-gray-700">Disponible 100% en ligne</label>
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 transition">
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSSIER CREATE MODAL */}
      {isDossierCreateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsDossierCreateModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveDossier}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Nouveau Dossier</h3>
                <button type="button" onClick={() => setIsDossierCreateModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du citoyen</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold" value={dossierCreateForm.user_name} onChange={e => setDossierCreateForm({...dossierCreateForm, user_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email du citoyen</label>
                  <input required type="email" className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold" value={dossierCreateForm.user_email} onChange={e => setDossierCreateForm({...dossierCreateForm, user_email: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type du document <span className="text-red-500">*</span></label>
                    <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold" value={dossierCreateForm.type} onChange={e => setDossierCreateForm({...dossierCreateForm, type: e.target.value})} placeholder="ex: Casier Judiciaire" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie <span className="text-red-500">*</span></label>
                    <select required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" value={dossierCreateForm.category} onChange={e => setDossierCreateForm({...dossierCreateForm, category: e.target.value as any})}>
                        {procedureCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Motif de la demande <span className="text-red-500">*</span></label>
                  <textarea required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold min-h-[100px]" value={dossierCreateForm.reason} onChange={e => setDossierCreateForm({...dossierCreateForm, reason: e.target.value})} placeholder="Indiquez le motif du dépôt..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Assigné</label>
                  <select className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" value={dossierCreateForm.assigned_service} onChange={e => setDossierCreateForm({...dossierCreateForm, assigned_service: e.target.value as MunicipalService})}>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition disabled:opacity-50">
                  {loading ? 'Création...' : 'Créer le dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPassModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsResetPassModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-up">
            <div className="bg-amber-500 p-8 text-white">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Réinitialisation</h3>
              <p className="text-xs opacity-80 font-bold">Sécurité du compte agent</p>
            </div>
            <form onSubmit={handleResetPassword} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nouveau Mot de Passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-300" />
                  <input 
                    type="password"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition" 
                    placeholder="••••••••"
                    value={resetPassForm.newPassword}
                    onChange={e => setResetPassForm({...resetPassForm, newPassword: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsResetPassModalOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-gray-400 hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-amber-600 transition disabled:opacity-50"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsArticleModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveArticle}>
              <div className="p-10 bg-gray-900 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter italic">{editingArticle ? 'Modifier' : 'Nouveau'} Contenu Presse</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Édition Institutionnelle</p>
                </div>
                <button type="button" onClick={() => setIsArticleModalOpen(false)} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-10 space-y-8 max-h-[65vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre de la publication</label>
                    <input required className="w-full border-2 border-gray-100 rounded-2xl p-5 bg-gray-50 focus:border-primary/30 outline-none font-bold text-gray-800 transition-all" placeholder="Titre accrocheur..." value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type de contenu</label>
                    <select className="w-full border-2 border-gray-100 rounded-2xl p-5 bg-gray-50 font-bold text-gray-700 outline-none focus:border-primary/30 transition-all" value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Illustration & Média</label>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-grow border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-primary/30 transition-all cursor-pointer relative group">
                      <Camera className="h-10 w-10 text-gray-300 mb-3 group-hover:text-primary transition-colors" />
                      <p className="text-sm font-bold text-gray-500">{articleFile ? articleFile.name : 'Uploader une image HD'}</p>
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        accept="image/*"
                        onChange={(e) => setArticleFile(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="h-40 w-40 md:h-48 md:w-64 rounded-3xl bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden relative">
                      {articleFile ? (
                        <img src={URL.createObjectURL(articleFile)} className="h-full w-full object-cover" alt="Preview" />
                      ) : articleForm.imageUrl ? (
                        <img src={articleForm.imageUrl} className="h-full w-full object-cover" alt="Article" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-300" />
                      )}
                      {!articleFile && (
                        <input className="absolute inset-0 opacity-0 cursor-pointer" type="text" value={articleForm.imageUrl} onChange={e => setArticleForm({...articleForm, imageUrl: e.target.value})} placeholder="URL image optionnelle" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contenu détaillé</label>
                  <textarea required rows={8} className="w-full border-2 border-gray-100 rounded-2xl p-6 bg-gray-50 font-medium text-gray-700 leading-relaxed outline-none focus:border-primary/30 transition-all" placeholder="Rédigez votre article ou communiqué ici..." value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} />
                </div>
                <div className="flex items-center gap-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={articleForm.isFeatured} onChange={e => setArticleForm({...articleForm, isFeatured: e.target.checked})} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary uppercase">Épingler à la Une</p>
                    <p className="text-[10px] text-gray-400 font-bold italic">L'article apparaîtra en haut de la page d'accueil et des actualités.</p>
                  </div>
                </div>
              </div>
              <div className="p-10 border-t border-gray-100 flex gap-6 bg-gray-50/50">
                <button type="submit" className="flex-1 bg-primary text-white py-5 rounded-3xl font-black shadow-2xl shadow-primary/30 hover:bg-green-700 transition-all flex items-center justify-center text-lg active:scale-95">
                  <Save className="h-6 w-6 mr-3" /> {editingArticle ? 'Mettre à jour la publication' : 'Publier maintenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAM MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsTeamModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Nouvel Agent</h3>
                <button type="button" onClick={() => setIsTeamModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              
              {error && (
                <div className="mx-8 mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <input 
                    required 
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold" 
                    value={newUser.name} 
                    onChange={e => setNewUser({...newUser, name: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email professionnel</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold" 
                    value={newUser.email} 
                    onChange={e => setNewUser({...newUser, email: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe provisoire</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" 
                      value={newUser.password} 
                      onChange={e => setNewUser({...newUser, password: e.target.value})} 
                      placeholder="Laisser vide pour générer"
                    />
                    <button 
                      type="button"
                      onClick={() => setNewUser({...newUser, password: generateTemporaryPassword()})}
                      className="px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium"
                    >
                      Générer
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Instructeur</label>
                  <select 
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" 
                    value={newUser.assigned_service} 
                    onChange={e => setNewUser({...newUser, assigned_service: e.target.value as MunicipalService})}
                    disabled={newUser.role === 'admin'}
                  >
                    <option value="">{newUser.role === 'admin' ? 'Admin - Pas de service spécifique' : 'Sélectionner un service'}</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {newUser.role === 'admin' && (
                    <p className="text-xs text-gray-500 mt-1">Les administrateurs ont accès à tous les services.</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rôle</label>
                  <select 
                    className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" 
                    value={newUser.role} 
                    onChange={e => setNewUser({...newUser, role: e.target.value as 'employe' | 'admin'})}
                  >
                    <option value="employe">Employé</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
              
              <div className="p-8 border-t flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      Création...
                    </>
                  ) : (
                    'Créer le compte'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOC MODAL */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsDocModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveDoc}>
              <div className="p-8 bg-primary text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">{editingDoc ? 'Modifier le Document' : 'Nouveau Document'}</h3>
                <button type="button" onClick={() => {setIsDocModalOpen(false); setEditingDoc(null);}} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du document</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 focus:border-primary/30 outline-none font-bold" value={docForm.name} onChange={e => setDocForm({...docForm, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                    <select className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" value={docForm.category} onChange={e => setDocForm({...docForm, category: e.target.value})}>
                      {["Délibérations", "Finance", "Urbanisme", "Arrêtés", "Archives"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date du document</label>
                    <input type="date" required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" value={docForm.date} onChange={e => setDocForm({...docForm, date: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (optionnelle)</label>
                  <textarea rows={3} className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 outline-none font-medium text-sm" value={docForm.description} onChange={e => setDocForm({...docForm, description: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fichier (PDF uniquement)</label>
                  <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:bg-gray-50 cursor-pointer transition-all">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-500">{docFile ? docFile.name : 'Cliquez ou glissez pour uploader'}</p>
                    {editingDoc && !docFile && <p className="text-[10px] text-primary mt-2 italic">Laissez vide pour conserver le fichier actuel</p>}
                  </div>
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl transition disabled:opacity-50"
                >
                  {loading ? 'Enregistrement...' : editingDoc ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ABOUT MODAL */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsAboutModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveAbout}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Éditeur de Section</h3>
                <button type="button" onClick={() => setIsAboutModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 font-bold" value={aboutForm.title} onChange={e => setAboutForm({...aboutForm, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contenu textuel</label>
                  <textarea rows={10} required className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 text-sm leading-relaxed" value={aboutForm.content} onChange={e => setAboutForm({...aboutForm, content: e.target.value})} />
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 transition">
                   {loading ? 'Enregistrement...' : 'Mettre à jour le site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAboutStatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsAboutStatModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <form onSubmit={handleSaveAboutStat}>
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center">
                <h3 className="text-2xl font-black italic tracking-tighter">Chiffre Clé</h3>
                <button type="button" onClick={() => setIsAboutStatModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl">
                  <X />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Label (Libellé)</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={aboutStatForm.label} onChange={e => setAboutStatForm({...aboutStatForm, label: e.target.value})} placeholder="Ex: Population" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Valeur</label>
                  <input required className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={aboutStatForm.value} onChange={e => setAboutStatForm({...aboutStatForm, value: e.target.value})} placeholder="Ex: 300 000+" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Icône (Lucide)</label>
                  <select className="w-full border-2 border-gray-100 rounded-2xl p-4 font-bold" value={aboutStatForm.icon} onChange={e => setAboutStatForm({...aboutStatForm, icon: e.target.value})}>
                     <option value="TrendingUp">TrendingUp (Croissance)</option>
                     <option value="Users">Users (Population)</option>
                     <option value="Building">Building (Infrastructures)</option>
                     <option value="MapPin">MapPin (Localisation)</option>
                     <option value="CheckCircle">CheckCircle (Objectifs)</option>
                     <option value="Calendar">Calendar (Événements)</option>
                     <option value="Briefcase">Briefcase (Emplois)</option>
                  </select>
                </div>
              </div>
              <div className="p-8 border-t flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 transition">
                   {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOSSIER DETAIL MODAL */}
      {selectedDossier && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedDossier(null)}></div>
          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-fade-in-right overflow-hidden">
            <div className={`p-8 text-white ${selectedDossier.category === 'Social' ? 'bg-rose-600' : 'bg-gray-900'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  {selectedDossier.category === 'Social' ? <Heart className="h-8 w-8" /> : <Building2 className="h-8 w-8" />}
                </div>
                <button onClick={() => setSelectedDossier(null)} className="p-2 hover:bg-white/20 rounded-xl transition">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter mb-2">Instruction : {selectedDossier.id}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full">{selectedDossier.type}</span>
                <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full italic">{selectedDossier.user_name}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-gray-50/50">
              <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Détails du demandeur</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-bold">{selectedDossier.user_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AtSign className="h-4 w-4 text-primary" />
                    <span className="font-bold text-gray-500">{selectedDossier.user_email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="font-bold">{selectedDossier.form_data?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-bold text-gray-500">{selectedDossier.form_data?.address || 'N/A'}</span>
                  </div>
                </div>

                {/* Specific form data fields */}
                <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
                  {selectedDossier.form_data?.profession && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profession</p>
                      <p className="font-bold text-gray-700">{selectedDossier.form_data.profession}</p>
                    </div>
                  )}
                  {selectedDossier.form_data?.neighborhood && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quartier</p>
                      <p className="font-bold text-gray-700">{selectedDossier.form_data.neighborhood}</p>
                    </div>
                  )}
                  {selectedDossier.form_data?.motivation && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Motivation</p>
                      <p className="text-gray-600 italic">"{selectedDossier.form_data.motivation}"</p>
                    </div>
                  )}
                  {selectedDossier.form_data?.companyName && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Entreprise</p>
                      <p className="font-bold text-gray-800">{selectedDossier.form_data.companyName}</p>
                    </div>
                  )}
                  {selectedDossier.form_data?.networkReason && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Objectif Réseau</p>
                      <p className="text-gray-600 mb-2 italic">"{selectedDossier.form_data.networkReason}"</p>
                    </div>
                  )}
                  {/* Actes état civil */}
                  {selectedDossier.form_data?.concernedName && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personne concernée</p>
                      <p className="font-bold text-gray-800">{selectedDossier.form_data.concernedName}</p>
                    </div>
                  )}
                  {selectedDossier.form_data?.eventDate && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date événement</p>
                        <p className="font-bold text-gray-700">{selectedDossier.form_data.eventDate}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lieu événement</p>
                        <p className="font-bold text-gray-700">{selectedDossier.form_data.eventPlace}</p>
                      </div>
                    </div>
                  )}
                  {/* Occupation / Places */}
                  {selectedDossier.form_data?.occupationType && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type d'espace</p>
                        <p className="font-bold text-gray-800">{selectedDossier.form_data.occupationType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Durée souhaitée</p>
                        <p className="font-bold text-gray-800">{selectedDossier.form_data.duration}</p>
                      </div>
                    </div>
                  )}
                  {/* Stage / Emploi / Volontaire */}
                  {selectedDossier.form_data?.applicationType && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidature</p>
                          <p className="font-bold text-gray-800">{selectedDossier.form_data.applicationType}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponibilité</p>
                          <p className="font-bold text-gray-800">{selectedDossier.form_data.availabilityDate}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Domaine</p>
                          <p className="font-bold text-gray-800">{selectedDossier.form_data.studyDomain}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expérience</p>
                          <p className="font-bold text-gray-800">{selectedDossier.form_data.experienceLevel}</p>
                        </div>
                      </div>
                      {selectedDossier.form_data?.motivation && (
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Motivations</p>
                          <p className="text-gray-600 italic">"{selectedDossier.form_data.motivation}"</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedDossier.reason && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Motif de la demande</p>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">{selectedDossier.reason}</p>
                    </div>
                  )}
                  {selectedDossier.specific_info && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-bold">Informations Complémentaires</p>
                      <p className="text-gray-600 italic whitespace-pre-line">{selectedDossier.specific_info}</p>
                    </div>
                  )}
                </div>
              </section>
              <section className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Assignation Service</label>
                <select className="w-full border-2 border-gray-100 rounded-2xl p-5 bg-white font-bold text-gray-700 shadow-sm focus:border-primary/30 outline-none" value={treatmentData.assigned_service} onChange={e => setTreatmentData({...treatmentData, assigned_service: e.target.value as MunicipalService})}>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </section>
              <section className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block ml-1">Décision / Statut</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['EN_ANALYSE', 'ASSIGNE', 'ATTENTE_DOCUMENTS', 'VALIDE', 'REJETE', 'TERMINE'].map(s => (
                      <button key={s} type="button" onClick={() => setTreatmentData({...treatmentData, status: s as any})} className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${treatmentData.status === s ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}>
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest mb-4 block ml-1">Réponse Officielle au Citoyen</label>
                  <textarea rows={6} className="w-full border-2 border-primary/20 rounded-3xl p-6 bg-primary/5 text-sm font-bold shadow-sm outline-none focus:border-primary transition-all" placeholder="Madame/Monsieur..." value={treatmentData.serviceFeedback} onChange={e => setTreatmentData({...treatmentData, serviceFeedback: e.target.value})} />
                </div>
              </section>
            </div>
            <div className="p-8 border-t bg-white flex gap-4">
              <button onClick={handleTreatDossier} disabled={loading} className="flex-1 bg-primary text-white py-5 rounded-2xl font-black shadow-2xl shadow-primary/30 flex items-center justify-center text-lg hover:scale-[1.02] active:scale-95 transition disabled:opacity-50">
                {loading ? <Clock className="animate-spin h-6 w-6 mr-3" /> : <Send className="h-6 w-6 mr-3" />} Valider l'instruction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SERVICE */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
            <div className="px-10 py-8 bg-gray-50 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-2xl font-black tracking-tighter uppercase italic text-gray-800">
                {editingService ? "Édition du Service" : "Nouveau Service"}
              </h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition shadow-sm">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Titre du service</label>
                  <input 
                    type="text" 
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Catégorie</label>
                  <select 
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  >
                    <option value="Général">Général</option>
                    <option value="Administration">Administration</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Social">Social</option>
                    <option value="Culture">Culture</option>
                    <option value="Gouvernance">Gouvernance</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Icône (Lucide Name)</label>
                  <input 
                    type="text" 
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lien / URL</label>
                  <input 
                    type="text" 
                    value={serviceForm.link}
                    onChange={(e) => setServiceForm({...serviceForm, link: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="ex: /culture ou https://..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold h-32 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Texte du bouton</label>
                  <input 
                    type="text" 
                    value={serviceForm.action}
                    onChange={(e) => setServiceForm({...serviceForm, action: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="ex: En savoir plus"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lien / URL</label>
                  <input 
                    type="text" 
                    value={serviceForm.link}
                    onChange={(e) => setServiceForm({...serviceForm, link: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="ex: /culture ou https://..."
                    required
                  />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50">
                  {loading ? 'Traitement...' : 'Enregistrer le service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;