import { Home, Briefcase, ClipboardCheck, Bookmark, LogOut, LayoutDashboard } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

// import { removeCookie } from '../../utils/cookieUtils';

export const BottomDock = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        localStorage.clear(); // Clear other app state if any
        navigate('/login');
    };

    const navItems = [
        { icon: Home, label: 'Feed', path: '/feed' },
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Briefcase, label: 'Jobs', path: '/jobs' },
        { icon: ClipboardCheck, label: 'Applied', path: '/applied' },
        { icon: Bookmark, label: 'Saved', path: '/bookmarks' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-black via-black to-transparent">
            {/* Dock Container */}
            <div className="max-w-md mx-auto bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around py-3 shadow-2xl">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`
                        }
                    >
                        <item.icon className="w-6 h-6" />
                        {/* Optional: Add labels if space permits, or keep it minimal just icons */}
                        {/* <span className="text-[10px]">{item.label}</span>  */}
                    </NavLink>
                ))}

                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-1 transition-colors text-zinc-500 hover:text-red-500"
                    aria-label="Logout"
                >
                    <LogOut className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
