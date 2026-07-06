import { Link } from "react-router-dom";
const ForbiddenPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <p className="text-9xl font-extrabold text-gradient">403</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
      <p className="mt-2 text-gray-500">You don't have permission to view this page.</p>
      <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Back to Dashboard</Link>
    </div>
  </div>
);
export default ForbiddenPage;
