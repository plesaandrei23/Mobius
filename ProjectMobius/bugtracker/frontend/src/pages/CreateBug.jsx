import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

const CreateBug = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('LOW');
    const [priority, setPriority] = useState('LOW');
    const [commitLink, setCommitLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/projects/${projectId}/bugs`,
                { title, description, severity, priority, commitLink },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            navigate(`/projects/${projectId}`);
        } catch (err) {
            console.error(err);
            alert('Failed to report bug');
        }
    };

    return (
        <div className="center-layout">
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Report a Bug</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Title</label>
                        <input
                            className="input-field"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                            className="input-field"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Severity</label>
                            <select
                                className="input-field"
                                value={severity}
                                onChange={e => setSeverity(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Priority</label>
                            <select
                                className="input-field"
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-secondary)' }}>Commit Link (Tested)</label>
                        <input
                            className="input-field"
                            type="text"
                            value={commitLink}
                            onChange={e => setCommitLink(e.target.value)}
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <button type="submit" className="btn" style={{ marginTop: '1rem' }}>Report Bug</button>
                    <button type="button" onClick={() => navigate(-1)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateBug;
