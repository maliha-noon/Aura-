import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner } from 'react-bootstrap';
import { FaUsers, FaCalendarAlt, FaTicketAlt, FaPowerOff, FaTrash, FaUserShield } from 'react-icons/fa';
import ApiClient from '../api';
import toast from 'react-hot-toast';

const api = new ApiClient();

interface Stats {
    total_users: number;
    total_events: number;
    total_bookings: number;
    total_revenue: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    last_login_at: string | null;
    created_at: string;
}

const AdminDashboard: React.FC = () => {
    console.log("[ADMIN] Mounting AdminDashboard...");
    const [stats, setStats] = useState<Stats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("[ADMIN] useEffect triggered");
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        console.log("[ADMIN] Fetching data...");
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.getAdminStats(),
                api.getAdminUsers()
            ]);

            console.log("[ADMIN] Stats Response:", statsRes);
            console.log("[ADMIN] Users Response:", usersRes);

            if (statsRes.success) setStats(statsRes.data || null);
            if (usersRes.success) setUsers(usersRes.data || []);
        } catch (err) {
            console.error("[ADMIN] Data Fetch Error:", err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId: number) => {
        const res = await api.toggleUserStatus(userId);
        if (res.success) {
            toast.success(res.message);
            fetchDashboardData();
        } else {
            toast.error(res.message);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to suspend this user?')) {
            const res = await api.deleteUser(userId);
            if (res.success) {
                toast.success(res.message);
                fetchDashboardData();
            } else {
                toast.error(res.message);
            }
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="danger" />
            </Container>
        );
    }

    return (
        <Container className="py-5 mt-5">
            <h2 className="text-white mb-4 fw-bold">Admin Dashboard</h2>

            <Row className="mb-5">
                <Col md={3}>
                    <Card className="bg-dark text-white border-secondary shadow-sm">
                        <Card.Body className="d-flex align-items-center">
                            <div className="bg-primary p-3 rounded-3 me-3">
                                <FaUsers size={24} />
                            </div>
                            <h5 className="mb-0 fw-bold text-primary">Users: {stats?.total_users || 0}</h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-dark text-white border-secondary shadow-sm">
                        <Card.Body className="d-flex align-items-center">
                            <div className="bg-success p-3 rounded-3 me-3">
                                <FaCalendarAlt size={24} />
                            </div>
                            <h5 className="mb-0 fw-bold text-success">Events: {stats?.total_events || 0}</h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-dark text-white border-secondary shadow-sm">
                        <Card.Body className="d-flex align-items-center">
                            <div className="bg-warning p-3 rounded-3 me-3">
                                <FaTicketAlt size={24} />
                            </div>
                            <h5 className="mb-0 fw-bold text-warning">Tickets: {stats?.total_bookings || 0}</h5>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-dark text-white border-secondary shadow-sm">
                        <Card.Body className="d-flex align-items-center">
                            <div className="bg-danger p-3 rounded-3 me-3">
                                <FaUserShield size={24} />
                            </div>
                            <h5 className="mb-0 fw-bold text-success">Secure</h5>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* User Management */}
            <Card className="bg-dark text-white border-secondary shadow-sm">
                <Card.Header className="bg-transparent border-secondary py-3">
                    <h5 className="mb-0 fw-bold">User Management</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover variant="dark" className="mb-0">
                        <thead className="bg-secondary bg-opacity-10 text-muted">
                            <tr>
                                <th className="ps-4">User</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Activity</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user.id} className="align-middle border-secondary border-opacity-25">
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-small me-3 bg-secondary rounded-circle d-flex justify-content-center align-items-center text-white" style={{ width: '32px', height: '32px' }}>
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="fw-bold">{user.name || 'Unknown User'}</div>
                                                <small className="text-red">{user.email}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge bg={user.role === 'admin' ? 'danger' : 'primary'} className="text-uppercase" style={{ fontSize: '10px' }}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={user.is_active ? 'success' : 'secondary'} className="rounded-pill">
                                            {user.is_active ? 'Active' : 'Suspended'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <small className="text-red">
                                            {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                                        </small>
                                    </td>
                                    <td className="text-center pe-4">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => handleToggleStatus(user.id)}
                                                title={user.is_active ? 'Suspend User' : 'Activate User'}
                                            >
                                                <FaPowerOff />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={user.role === 'admin'}
                                                title="Delete User"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;
