import { Link } from "react-router-dom";
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <p className="text-9xl font-extrabold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary mt-6 inline-flex">Go to Dashboard</Link>
    </div>
  </div>
);
export default NotFoundPage;
