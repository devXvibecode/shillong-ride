import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="bg-surface min-h-screen flex items-center justify-center">
      <div className="text-center py-12">
        <h1 className="h1 font-serif text-text-primary mb-6">
          404
        </h1>
        <h2 className="h2 font-semibold text-text-secondary mb-6">
          Page Not Found
        </h2>
        <p className="body-lg text-text-muted max-w-xl mx-auto mb-8">
          It seems the page you're looking for doesn't exist or has been moved.
          Please check the URL or return to the homepage.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Return Home
        </Link>
      </div>
    </div>
  );
}
