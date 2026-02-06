import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    {/* Ensure logo image is in public/images */}
                    <img src="/images/logo-u.svg.png" alt="Uplas" className="h-8" />
                    <span className="font-bold text-xl text-blue-600 hidden md:block">Uplas</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-medium">Courses</Link>
                    <Link to="/projects" className="text-gray-600 hover:text-blue-600 font-medium">Projects</Link>
                    <Link to="/community" className="text-gray-600 hover:text-blue-600 font-medium">Community</Link>
                    <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium">Blog</Link>
                    <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</Link>
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600">
                                <User size={20} />
                                <span>{user.full_name?.split(' ')[0]}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            state={{ mode: 'signup' }}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Get Started
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
                    <Link to="/courses" className="py-2 text-gray-700 font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Courses</Link>
                    <Link to="/projects" className="py-2 text-gray-700 font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Projects</Link>
                    <Link to="/community" className="py-2 text-gray-700 font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Community</Link>
                    <Link to="/pricing" className="py-2 text-gray-700 font-medium border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="py-2 text-blue-600 font-bold" onClick={() => setIsMenuOpen(false)}>My Dashboard</Link>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="py-2 text-red-600 font-medium text-left">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="py-2 text-center bg-blue-600 text-white rounded-lg font-bold" onClick={() => setIsMenuOpen(false)}>Login / Sign Up</Link>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
