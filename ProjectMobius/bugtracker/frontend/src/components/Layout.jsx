import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                background: 'rgba(17, 24, 39, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--glass-border)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '70px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <Link to="/dashboard" style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'none'
                        }}>
                            Mobius
                        </Link>

                        <nav style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/projects" style={{
                                color: location.pathname.startsWith('/projects') ? 'var(--primary-color)' : 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontWeight: '500',
                                transition: 'color 0.2s'
                            }}>
                                Projects
                            </Link>

                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" style={{
                                    color: location.pathname.startsWith('/admin') ? 'var(--primary-color)' : 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    transition: 'color 0.2s'
                                }}>
                                    Admin Dashboard
                                </Link>
                            )}
                        </nav>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {user && (
                            <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                                <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                    {user.email}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                    {user.role}
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="btn"
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main style={{ flexGrow: 1, paddingBottom: '2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
