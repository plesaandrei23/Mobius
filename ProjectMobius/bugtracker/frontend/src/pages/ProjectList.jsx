import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const { user } = useAuth();

    // Create form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [repoUrl, setRepoUrl] = useState('');

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/projects', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProjects(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch projects');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/projects',
                { name, description, repoUrl },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setShowCreate(false);
            setName('');
            setDescription('');
            setRepoUrl('');
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert('Failed to create project');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Update UI
            setProjects(projects.filter(p => p.id !== projectId));
            alert('Project deleted');
        } catch (err) {
            console.error(err);
            alert('Failed to delete project. You might not be the owner.');
        }
    };

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--primary-color)' }}>Your Projects</h2>
                <button className="btn" onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? 'Cancel' : 'Create New Project'}
                </button>
            </div>

            {showCreate && (
                <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Create New Project</h3>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Project Name</label>
                            <input
                                className="input-field"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Description</label>
                            <textarea
                                className="input-field"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={{ minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Repository URL</label>
                            <input
                                className="input-field"
                                type="text"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn">Save Project</button>
                    </form>
                </div>
            )}

            <div className="projects-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '4rem', // Increased gap
                paddingBottom: '4rem',
                alignItems: 'stretch' // Ensure consistent height
            }}>
                {projects.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No projects found. Create one to get started!</p>
                    </div>
                ) : (
                    projects.map(project => (
                        <div key={project.id} className="card" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            // Removed height: 100% to let content define height if needed, but flex stretch will handle it
                            // Removed minHeight constraint if it was causing issues, but keeping it is fine if space allows
                            minHeight: '200px',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{project.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{project.description || 'No description provided.'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <Link to={`/projects/${project.id}`} className="btn" style={{ flex: 1, textAlign: 'center', backgroundColor: 'var(--surface-dark)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
                                    View Details
                                </Link>
                                {(project.ownerId === user.id || user.role === 'ADMIN') && (
                                    <button
                                        onClick={() => handleDeleteProject(project.id)}
                                        className="btn"
                                        style={{ backgroundColor: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectList;
