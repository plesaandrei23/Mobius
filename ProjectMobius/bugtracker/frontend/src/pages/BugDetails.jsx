import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const BugDetails = () => {
    const { projectId, bugId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bug, setBug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [project, setProject] = useState(null); // Need project to check permissions

    // Edit states
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [severity, setSeverity] = useState('');
    const [commitLink, setCommitLink] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Project Permissions
                const projRes = await axios.get(`http://localhost:8080/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProject(projRes.data);

                // Fetch Bug
                const res = await axios.get(`http://localhost:8080/api/projects/${projectId}/bugs`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const foundBug = res.data.find(b => b.id === parseInt(bugId));

                if (foundBug) {
                    setBug(foundBug);
                    setStatus(foundBug.status);
                    setPriority(foundBug.priority);
                    setSeverity(foundBug.severity);
                    setCommitLink(foundBug.commitLink || '');
                } else {
                    setError('Bug not found');
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId, bugId, user.token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:8080/api/bugs/${bugId}`,
                { status, priority, severity, commitLink },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert('Bug updated successfully');
            // navigate(`/projects/${projectId}`); // Optional: Stay on page to see changes or go back
        } catch (err) {
            console.error(err);
            alert('Failed to update bug');
        }
    };

    const handleAssignToMe = async () => {
        try {
            await axios.patch(`http://localhost:8080/api/bugs/${bugId}`,
                { allocatedId: user.id },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setBug({ ...bug, allocated: { email: user.email, id: user.id } }); // Optimistic update
            alert('Assigned to you');
        } catch (err) {
            alert('Failed to assign');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'var(--error)' }}>{error}</div>;
    if (!bug) return <div>Bug not found</div>;

    const isMember = project?.members.some(m => m.id === user.id); // PM role checks

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div className="center-layout">
                <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                    <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{bug.title}</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>{bug.description}</p>
                        </div>
                        {isMember && (
                            <button
                                onClick={handleAssignToMe}
                                className="btn"
                                disabled={bug.allocated?.id === user.id}
                                style={{
                                    opacity: bug.allocated?.id === user.id ? 0.5 : 1,
                                    fontSize: '0.875rem',
                                    padding: '0.5rem 1rem'
                                }}
                            >
                                {bug.allocated?.id === user.id ? 'Assigned to You' : 'Assign to Me'}
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Status</label>
                                <select
                                    className="input-field"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    disabled={!isMember}
                                    style={{ cursor: isMember ? 'pointer' : 'not-allowed', opacity: isMember ? 1 : 0.7 }}
                                >
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Priority</label>
                                <select
                                    className="input-field"
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    disabled={!isMember}
                                    style={{ cursor: isMember ? 'pointer' : 'not-allowed', opacity: isMember ? 1 : 0.7 }}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Severity</label>
                                <select
                                    className="input-field"
                                    value={severity}
                                    onChange={e => setSeverity(e.target.value)}
                                    disabled={!isMember}
                                    style={{ cursor: isMember ? 'pointer' : 'not-allowed', opacity: isMember ? 1 : 0.7 }}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Commit Link</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={commitLink}
                                    onChange={e => setCommitLink(e.target.value)}
                                    placeholder="https://github.com/..."
                                    disabled={!isMember}
                                />
                            </div>

                            <div className="card" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Details</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <strong>Reporter:</strong> {bug.reporter?.email}<br />
                                    <strong>Allocated:</strong> {bug.allocated?.email || 'Unassigned'}
                                </p>
                            </div>
                        </div>

                        {isMember && (
                            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button type="submit" className="btn">Save Changes</button>
                                <button type="button" onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        )}
                        {!isMember && (
                            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => navigate(-1)} className="btn" style={{ background: 'var(--surface-dark)', border: '1px solid var(--glass-border)' }}>Back</button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BugDetails;
