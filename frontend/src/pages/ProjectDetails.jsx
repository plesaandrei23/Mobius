import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Add member/tester state
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newTesterEmail, setNewTesterEmail] = useState('');

    const fetchProjectData = async () => {
        try {
            const headers = { Authorization: `Bearer ${user.token}` };

            const projRes = await axios.get(`http://localhost:8080/api/projects/${projectId}`, { headers });
            setProject(projRes.data);

            const bugsRes = await axios.get(`http://localhost:8080/api/projects/${projectId}/bugs`, { headers });
            setBugs(bugsRes.data);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/projects/${projectId}/members`,
                { email: newMemberEmail },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setNewMemberEmail('');
            fetchProjectData();
            alert('Member added');
        } catch (err) {
            alert('Failed to add member');
        }
    };

    const handleAddTester = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/projects/${projectId}/testers`,
                { email: newTesterEmail },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setNewTesterEmail('');
            fetchProjectData();
            alert('Tester added');
        } catch (err) {
            alert('Failed to add tester');
        }
    };

    const handleJoinAsTester = async () => {
        try {
            await axios.post(`http://localhost:8080/api/projects/${projectId}/testers`,
                {}, // No body needed for self join if backend handles it, but our backend expects email or uses req.user
                // Our backend implementation: if email provided use it, else use req.user.id.
                // So sending empty body is fine for self join.
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            fetchProjectData();
            alert('You have joined as a tester');
        } catch (err) {
            alert('Failed to join as tester');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    const isMember = project.members.some(m => m.id === user.id);
    const isTester = project.testers.some(t => t.id === user.id);

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                &larr; Back to Projects
            </Link>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{project.name}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>Repo:</span>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>{project.repoUrl}</a>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Members (MP)</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                        {project.members.map(m => (
                            <li key={m.id} style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{m.email}</li>
                        ))}
                    </ul>
                    {isMember && (
                        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                className="input-field"
                                type="email"
                                placeholder="Add member by email"
                                value={newMemberEmail}
                                onChange={e => setNewMemberEmail(e.target.value)}
                            />
                            <button type="submit" className="btn" style={{ padding: '0.5rem 1rem' }}>Add</button>
                        </form>
                    )}
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Testers (TST)</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
                        {project.testers.map(t => (
                            <li key={t.id} style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{t.email}</li>
                        ))}
                    </ul>
                    {isMember && (
                        <form onSubmit={handleAddTester} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                className="input-field"
                                type="email"
                                placeholder="Add tester by email"
                                value={newTesterEmail}
                                onChange={e => setNewTesterEmail(e.target.value)}
                            />
                            <button type="submit" className="btn" style={{ padding: '0.5rem 1rem' }}>Add</button>
                        </form>
                    )}
                    {!isMember && !isTester && (
                        <button onClick={handleJoinAsTester} className="btn" style={{ width: '100%' }}>Join as Tester</button>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="bugs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Reported Bugs</h3>
                    {isTester && (
                        <Link to={`/projects/${projectId}/bugs/new`} className="btn" style={{ textDecoration: 'none' }}>
                            Report Bug
                        </Link>
                    )}
                </div>

                {bugs.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No bugs reported yet.</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Title</th>
                                    <th style={{ padding: '1rem' }}>Severity</th>
                                    <th style={{ padding: '1rem' }}>Priority</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Reporter</th>
                                    <th style={{ padding: '1rem' }}>Assigned To</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bugs.map(bug => (
                                    <tr key={bug.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{bug.title}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.875rem',
                                                background: bug.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                                color: bug.severity === 'CRITICAL' ? '#fca5a5' : '#93c5fd'
                                            }}>
                                                {bug.severity}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>{bug.priority}</td>
                                        <td style={{ padding: '1rem' }}>{bug.status}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{bug.reporter?.email}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{bug.allocated?.email || 'Unassigned'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <Link to={`/projects/${projectId}/bugs/${bug.id}`} style={{ color: 'var(--secondary-color)' }}>Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
