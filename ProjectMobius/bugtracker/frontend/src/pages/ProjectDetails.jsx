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
        <div className="project-details-container">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Repo:</strong> {project.repoUrl}</p>

            <div className="team-section">
                <div className="members-column">
                    <h3>Members (MP)</h3>
                    <ul>
                        {project.members.map(m => <li key={m.id}>{m.email}</li>)}
                    </ul>
                    {isMember && (
                        <form onSubmit={handleAddMember}>
                            <input
                                type="email"
                                placeholder="Add member by email"
                                value={newMemberEmail}
                                onChange={e => setNewMemberEmail(e.target.value)}
                            />
                            <button type="submit">Add</button>
                        </form>
                    )}
                </div>

                <div className="testers-column">
                    <h3>Testers (TST)</h3>
                    <ul>
                        {project.testers.map(t => <li key={t.id}>{t.email}</li>)}
                    </ul>
                    {isMember && (
                        <form onSubmit={handleAddTester}>
                            <input
                                type="email"
                                placeholder="Add tester by email"
                                value={newTesterEmail}
                                onChange={e => setNewTesterEmail(e.target.value)}
                            />
                            <button type="submit">Add</button>
                        </form>
                    )}
                    {!isMember && !isTester && (
                        <button onClick={handleJoinAsTester}>Join as Tester</button>
                    )}
                </div>
            </div>

            <div className="bugs-section">
                <div className="bugs-header">
                    <h3>Bugs</h3>
                    {isTester && (
                        <Link to={`/projects/${projectId}/bugs/new`} className="report-bug-btn">
                            Report Bug
                        </Link>
                    )}
                </div>

                {bugs.length === 0 ? <p>No bugs reported.</p> : (
                    <table className="bugs-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Severity</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Reporter</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bugs.map(bug => (
                                <tr key={bug.id}>
                                    <td>{bug.title}</td>
                                    <td>{bug.severity}</td>
                                    <td>{bug.priority}</td>
                                    <td>{bug.status}</td>
                                    <td>{bug.reporter?.email}</td>
                                    <td>{bug.allocated?.email || 'Unassigned'}</td>
                                    <td>
                                        {/* TODO: Add bug update actions for MP */}
                                        <Link to={`/projects/${projectId}/bugs/${bug.id}`}>Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
