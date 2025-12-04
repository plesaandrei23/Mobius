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

    if (loading) return <div>Loading projects...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="project-list-container">
            <div className="header-actions">
                <h2>Your Projects</h2>
                <button onClick={() => setShowCreate(!showCreate)}>
                    {showCreate ? 'Cancel' : 'Create New Project'}
                </button>
            </div>

            {showCreate && (
                <form onSubmit={handleCreate} className="create-project-form">
                    <div className="form-group">
                        <label>Project Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Repository URL:</label>
                        <input
                            type="text"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                        />
                    </div>
                    <button type="submit">Save Project</button>
                </form>
            )}

            <div className="projects-grid">
                {projects.length === 0 ? (
                    <p>No projects found. Create one!</p>
                ) : (
                    projects.map(project => (
                        <div key={project.id} className="project-card">
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <Link to={`/projects/${project.id}`}>View Details</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectList;
