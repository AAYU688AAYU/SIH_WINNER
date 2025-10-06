import Layout from "./Layout.jsx";

import Home from "./Home";

import Diagnosis from "./Diagnosis";

import About from "./About";

import Reports from "./Reports";

import Doctors from "./Doctors";

import Chat from "./Chat";

import AdminDashboard from "./AdminDashboard";

import Settings from "./Settings";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Diagnosis: Diagnosis,
    
    About: About,
    
    Reports: Reports,
    
    Doctors: Doctors,
    
    Chat: Chat,
    
    AdminDashboard: AdminDashboard,
    
    Settings: Settings,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Diagnosis" element={<Diagnosis />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Reports" element={<Reports />} />
                
                <Route path="/Doctors" element={<Doctors />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/AdminDashboard" element={<AdminDashboard />} />
                
                <Route path="/Settings" element={<Settings />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}