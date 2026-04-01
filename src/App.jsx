import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIPanel from './components/AIPanel';
import Auth from './pages/Auth';
import DocsModal from './components/DocsModal';
import { Loader2 } from 'lucide-react';

function Workspace({ user }) {
  // --- MULTI-DOCUMENT ARCHITECTURE ---
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('jot_documents');
    if (saved) return JSON.parse(saved);
    // Migrate legacy unstructured document
    const legacyContent = localStorage.getItem('zeno_document');
    if (legacyContent) {
      return [{ id: 'doc-1', title: 'Imported Document', content: legacyContent, updatedAt: Date.now() }];
    }
    return [{ id: 'doc-1', title: 'Untitled Document', content: '', updatedAt: Date.now() }];
  });

  const [activeDocId, setActiveDocId] = useState(() => localStorage.getItem('jot_active_doc') || documents[0].id);

  // Derived Active State
  const activeDoc = documents.find(d => d.id === activeDocId) || documents[0];
  const [content, setContent] = useState(activeDoc.content);
  const [docTitle, setDocTitle] = useState(activeDoc.title);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [activeTool, setActiveTool] = useState('grammar');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('zeno_theme') === 'dark');
  const [isMobileAIPanelOpen, setIsMobileAIPanelOpen] = useState(false);
  const quillRef = useRef(null);

  // Sync edits silently into the global documents array
  useEffect(() => {
    setDocuments(prev => prev.map(doc => 
      doc.id === activeDocId 
      ? { ...doc, title: docTitle, content: content, updatedAt: Date.now() } 
      : doc
    ));
  }, [content, docTitle, activeDocId]);

  // Persist arrays to hard-disk
  useEffect(() => {
    localStorage.setItem('jot_documents', JSON.stringify(documents));
    localStorage.setItem('jot_active_doc', activeDocId);
    // Keep legacy single-doc cache alive as backup
    localStorage.setItem('zeno_document', content);
  }, [documents, activeDocId, content]);

  useEffect(() => { localStorage.setItem('zeno_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  // CRUD Handlers
  const switchDocument = (id) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setActiveDocId(id);
      setContent(doc.content);
      setDocTitle(doc.title);
      setIsDocsOpen(false);
    }
  };

  const createNewDocument = () => {
    const newId = 'doc-' + Date.now();
    const newDoc = { id: newId, title: 'Untitled Document', content: '', updatedAt: Date.now() };
    setDocuments([newDoc, ...documents]);
    setActiveDocId(newId);
    setContent('');
    setDocTitle('Untitled Document');
    setIsDocsOpen(false);
  };

  const deleteDocument = (id) => {
     if (documents.length === 1) return alert("You must have at least one document.");
     const newDocs = documents.filter(d => d.id !== id);
     setDocuments(newDocs);
     if (activeDocId === id) {
       switchDocument(newDocs[0].id);
     }
  };

  const handleSelection = (range, source, editor) => {
    if (range && range.length > 0) {
      setSelectedText(editor.getText(range.index, range.length));
      setSelectionRange(range);
    } else {
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  const handleReplaceSelection = (newText) => {
    if (quillRef.current && selectionRange) {
       const editor = quillRef.current.getEditor();
       editor.deleteText(selectionRange.index, selectionRange.length);
       editor.insertText(selectionRange.index, newText);
       setSelectedText('');
       setSelectionRange(null);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row h-[100dvh] w-full transition-colors duration-500 font-sans overflow-hidden ${isDark ? 'dark-theme bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar 
        activeTool={activeTool} 
        setActiveTool={(id) => { setActiveTool(id); setIsMobileAIPanelOpen(true); }} 
        setIsDocsOpen={setIsDocsOpen}
      />
      <div className="flex-1 flex overflow-hidden mb-[72px] md:mb-0 relative py-0 min-h-0">
        <Editor 
          content={content} 
          setContent={setContent} 
          docTitle={docTitle}
          setDocTitle={setDocTitle}
          handleSelection={handleSelection} 
          quillRef={quillRef}
          isDark={isDark}
          setIsDark={setIsDark}
        />
        <AIPanel 
          activeTab={activeTool} 
          selectedText={selectedText} 
          editorContent={content}
          onReplace={handleReplaceSelection}
          setContent={setContent}
          isMobileOpen={isMobileAIPanelOpen}
          setIsMobileOpen={setIsMobileAIPanelOpen}
        />
      </div>

      <DocsModal 
        isOpen={isDocsOpen} 
        onClose={() => setIsDocsOpen(false)} 
        documents={documents} 
        activeDocId={activeDocId} 
        switchDocument={switchDocument} 
        createNewDocument={createNewDocument} 
        deleteDocument={deleteDocument} 
      />
      
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <div className="h-[100dvh] w-full bg-slate-50 flex flex-col items-center justify-center gap-4 animate-in fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Connecting to Cloud Backend</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/app" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/app" /> : <Auth />} />
      <Route path="/signup" element={user ? <Navigate to="/app" /> : <Auth />} />
      <Route path="/app" element={user ? <Workspace user={user} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
