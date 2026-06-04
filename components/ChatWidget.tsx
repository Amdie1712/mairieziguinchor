
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel de la Mairie de Ziguinchor. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  // Initialisation de la session Gemini
  const getChatSession = () => {
    if (!chatSessionRef.current) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Tu es l'assistant IA officiel de la Mairie de Ziguinchor au Sénégal. 
          Ton rôle est d'aider les citoyens avec :
          1. Les démarches administratives (Etat civil : naissance, mariage, décès ; Urbanisme : permis de construire).
          2. Informations sur les services municipaux (propreté, voirie, social, culture).
          3. Les actualités de la commune et l'agenda des événements.
          4. Des informations sur le Conseil Municipal et le Maire Ousmane Sonko.
          
          Ton ton doit être professionnel, accueillant et serviable. 
          Réponds en français. Si une demande est trop spécifique ou nécessite une action officielle, suggère de contacter la mairie au +221 33 991 12 34 ou de se rendre à l'Hôtel de Ville rue du Général de Gaulle.
          Utilise des réponses concises et structurées.`,
        },
      });
    }
    return chatSessionRef.current;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const newUserMsg: Message = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const session = getChatSession();
      const result = await session.sendMessage({ message: userText });
      const botResponse = result.text;

      const newBotMsg: Message = {
        id: Date.now() + 1,
        text: botResponse || "Je m'excuse, je rencontre une difficulté technique. Veuillez réessayer plus tard.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Désolé, je ne parviens pas à me connecter au service. Vous pouvez nous contacter directement au +221 33 991 12 34.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl mb-4 border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 animate-fade-in-up" style={{ height: '500px' }}>
          
          {/* Header */}
          <div className="bg-primary p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></div>
                </div>
                <div>
                    <h3 className="font-bold text-sm">Assistance Mairie</h3>
                    <p className="text-xs text-green-100">En ligne</p>
                </div>
            </div>
            <div className="flex space-x-2">
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                    <Minimize2 className="w-5 h-5" />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition">
                    <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            <div className="text-center text-xs text-gray-400 my-2">Aujourd'hui</div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
               <div className="flex justify-start">
                   <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-1">
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
              disabled={isTyping}
            />
            <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                className={`p-2 rounded-full transition ${inputValue.trim() && !isTyping ? 'bg-primary text-white hover:bg-green-700 shadow-md' : 'bg-gray-200 text-gray-400'}`}
            >
                <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-primary hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative"
        >
          <MessageCircle className="w-7 h-7" />
          
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>

          {/* Tooltip */}
          <div className={`absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Besoin d'aide ? Discutez avec nous
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
