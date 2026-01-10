import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'projects'
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${user.token}` };

            const usersRes = await axios.get('http://localhost:8080/api/admin/users', { headers });
            setUsers(usersRes.data);

            const projectsRes = await axios.get('http://localhost:8080/api/admin/projects', { headers });
            setProjects(projectsRes.data);

            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch admin data. Are you an admin?');
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/admin/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    if (loading) return <div>Loading Admin Dashboard...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>Admin Dashboard</h2>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className="btn"
                    onClick={() => setActiveTab('users')}
                    style={{ opacity: activeTab === 'users' ? 1 : 0.5 }}
                >
                    Manage Users
                </button>
                <button
                    className="btn"
                    onClick={() => setActiveTab('projects')}
                    style={{ opacity: activeTab === 'projects' ? 1 : 0.5 }}
                >
                    Manage Projects
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="card">
                    <h3>Users ({users.length})</h3>
                    <table style={{ width: '100%', marginTop: '1rem', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.5rem' }}>{u.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{u.email}</td>
                                    <td style={{ padding: '0.5rem' }}>{u.role}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'projects' && (
                <div className="card">
                    <h3>Projects ({projects.length})</h3>
                    <table style={{ width: '100%', marginTop: '1rem', textAlign: 'left' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Members</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '0.5rem' }}>{p.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{p.name}</td>
                                    <td style={{ padding: '0.5rem' }}>{p.members?.length || 0}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <button
                                            onClick={() => handleDeleteProject(p.id)}
                                            style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
