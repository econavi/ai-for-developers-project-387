import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { BookingConfirmPage } from './pages/guest/BookingConfirmPage';
import { BookingFormPage } from './pages/guest/BookingFormPage';
import { EventTypeDetailPage } from './pages/guest/EventTypeDetailPage';
import { EventTypesPage } from './pages/guest/EventTypesPage';
import { BookingsPage } from './pages/owner/BookingsPage';
import { DashboardPage } from './pages/owner/DashboardPage';
import { EventTypeEditPage } from './pages/owner/EventTypeEditPage';
import { EventTypesListPage } from './pages/owner/EventTypesListPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <EventTypesPage /> },
      { path: 'event-types/:id', element: <EventTypeDetailPage /> },
      { path: 'event-types/:id/book', element: <BookingFormPage /> },
      { path: 'event-types/:id/confirm', element: <BookingConfirmPage /> },
    ],
  },
  {
    path: '/owner',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'event-types', element: <EventTypesListPage /> },
      { path: 'event-types/new', element: <EventTypeEditPage /> },
      { path: 'event-types/:id/edit', element: <EventTypeEditPage /> },
      { path: 'bookings', element: <BookingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
