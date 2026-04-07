import { RouterProvider } from 'react-router';
import { router } from './routes';
import { initializeData, checkDataHealth } from './utils/seedData';

// Initialize data before React mounts any component
initializeData();

// Verify data health immediately after initialization
if (typeof window !== 'undefined') {
  // Run verification after a brief delay to ensure localStorage is updated
  setTimeout(() => {
    checkDataHealth();
  }, 100);
}

export default function App() {
  return <RouterProvider router={router} />;
}