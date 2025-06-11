import React, { useState } from "react";
import { FaUsers, FaClipboardList, FaChartBar, FaFileAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importer useAuth
import logo from "../images/HomePage/Eval.png";

function Sidebar() {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState('');
    const { logout } = useAuth(); // Utiliser la fonction logout du contexte
    
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = async () => {
        try {
            await logout(); // Cette fonction gère déjà tout : API call, nettoyage des tokens, redirection
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            // En cas d'erreur, forcer la redirection quand même
            window.location.href = '/login';
        }
    };

    const menuItems = [
        { icon: FaHome, label: "Tableau de bord", path: "/admin", id: "dashboard", color: "text-yellow-400" },
        { icon: FaUsers, label: "Enseignants", path: "/admin/ens", id: "ens", color: "text-yellow-400" },
        { icon: FaUsers, label: "Étudiants", path: "/admin/etud", id: "etud", color: "text-yellow-400" },
        { icon: FaUsers, label: "Professionnels", path: "/admin/pro", id: "pro", color: "text-yellow-400" },
        { icon: FaUsers, label: "Filieres", path: "/admin/formations", id: "formations", color: "text-yellow-400" },
        { icon: FaUsers, label: "Modules", path: "/admin/modules", id: "modules", color: "text-yellow-400" },
        { icon: FaClipboardList, label: "Questionnaires", path: "/admin/questionnaire", id: "questionnaire", color: "text-yellow-400" },
        { icon: FaFileAlt, label: "Publications", path: "/admin/publications", id: "publications", color: "text-yellow-400" },
        { icon: FaChartBar, label: "Statistiques", path: "/admin/statistics", id: "statistics", color: "text-yellow-400" },
    ];

    return (
        <div className="flex h-screen">
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 text-white w-80 flex flex-col shadow-2xl">
                {/* Overlay pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}></div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header with Logo */}
                    <div className="p-8 border-b border-white/10">
                        <div className="flex items-center justify-center mb-4">
                            <img src={logo} alt="Logo" className="w-32 h-auto" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                EvalPro Admin
                            </h1>
                            <p className="text-slate-300 text-sm mt-1">Tableau de bord</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActiveItem = isActive(item.path);
                                const isHovered = hoveredItem === item.id;
                                
                                return (
                                    <li key={item.id}>
                                        <Link
                                            to={item.path}
                                            className={`
                                                group relative flex items-center px-4 py-4 rounded-xl transition-all duration-300 ease-out
                                                ${isActiveItem 
                                                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 shadow-lg shadow-yellow-400/20' 
                                                    : 'hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20'
                                                }
                                            `}
                                            onMouseEnter={() => setHoveredItem(item.id)}
                                            onMouseLeave={() => setHoveredItem('')}
                                        >
                                            {/* Background glow */}
                                            <div className={`
                                                absolute inset-0 rounded-xl transition-opacity duration-300
                                                ${isActiveItem ? 'bg-gradient-to-r from-yellow-400/10 to-orange-400/10' : 'opacity-0'}
                                            `}></div>
                                            
                                            {/* Icon */}
                                            <div className={`
                                                relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                                                ${isActiveItem 
                                                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 shadow-lg shadow-yellow-400/30' 
                                                    : 'bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white'
                                                }
                                            `}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            
                                            {/* Text */}
                                            <span className={`
                                                relative z-10 ml-4 font-semibold text-base transition-all duration-300
                                                ${isActiveItem ? 'text-yellow-300' : 'text-slate-200 group-hover:text-white'}
                                            `} style={{ fontFamily: "Sofia, sans-serif" }}>
                                                {item.label}
                                            </span>
                                            
                                            {/* Arrow indicator */}
                                            <div className={`
                                                relative z-10 ml-auto transition-all duration-300 transform
                                                ${isActiveItem ? 'text-yellow-300 translate-x-0' : 'text-slate-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}
                                            `}>
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                            
                                            {/* Active indicator */}
                                            {isActiveItem && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-r-full shadow-lg shadow-yellow-400/50"></div>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer - Logout */}
                    <div className="p-6 border-t border-white/10 flex-shrink-0">
                        <button
                            onClick={handleLogout}
                            className="
                                group relative w-full flex items-center justify-center px-6 py-4 
                                bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                                text-white font-semibold rounded-xl transition-all duration-300 
                                shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:shadow-xl
                                transform hover:-translate-y-1 active:translate-y-0
                                overflow-hidden
                            "
                            onMouseEnter={() => setHoveredItem('logout')}
                            onMouseLeave={() => setHoveredItem('')}
                        >
                            {/* Background animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            
                            <FaSignOutAlt className="relative z-10 mr-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="relative z-10">Se déconnecter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
