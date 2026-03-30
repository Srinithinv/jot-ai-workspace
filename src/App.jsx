import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import AIPanel from './components/AIPanel';
import Auth from './pages/Auth';
import { Loader2 } from 'lucide-react';

function Workspace({ user }) {
  const [content, setContent] = useState(() => localStorage.getItem('zeno_document') || '');
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [activeTool, setActiveTool] = useState('grammar');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('zeno_theme') === 'dark');
  const quillRef = useRef(null);

  // Persist Document
  useEffect(() => {
    localStorage.setItem('zeno_document', content);
  }, [content]);

  // Persist Theme
  useEffect(() => {
    localStorage.setItem('zeno_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

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
    <div className={`flex h-screen w-full transition-colors duration-500 font-sans overflow-hidden ${isDark ? 'dark-theme bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <div className="flex-1 flex overflow-hidden">
        <Editor 
          content={content} 
          setContent={setContent} 
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
        />
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined);

  // Global Auth Observer to verify Cloud Token
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Show a sleek loading spinner while waiting for Firebase ping to resolve
  if (user === undefined) {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center gap-4 animate-in fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Connecting to Cloud Backend</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Route Guards: Completely protect the workspace from unauthenticated URLs */}
      <Route path="/" element={user ? <Navigate to="/app" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/app" /> : <Auth />} />
      <Route path="/signup" element={user ? <Navigate to="/app" /> : <Auth />} />
      <Route path="/app" element={user ? <Workspace user={user} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
