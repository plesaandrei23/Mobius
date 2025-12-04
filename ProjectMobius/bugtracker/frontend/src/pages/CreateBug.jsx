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
        <div className="create-bug-container">
            <h2>Report a Bug</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Severity:</label>
                    <select value={severity} onChange={e => setSeverity(e.target.value)}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Priority:</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Commit Link (Tested):</label>
                    <input
                        type="text"
                        value={commitLink}
                        onChange={e => setCommitLink(e.target.value)}
                    />
                </div>
                <button type="submit">Report Bug</button>
            </form>
        </div>
    );
};

export default CreateBug;
