import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { OrgSettingsPage } from './pages/settings/OrgSettingsPage.js';
import { SpacesListPage } from './pages/spaces/SpacesListPage.js';
import { SpaceDetailPage } from './pages/spaces/SpaceDetailPage.js';
import { DesksPage } from './pages/spaces/DesksPage.js';
import { BookingsPage } from './pages/bookings/BookingsPage.js';
import { BookingsCalendarPage } from './pages/bookings/BookingsCalendarPage.js';
import { VisitorsPage } from './pages/visitors/VisitorsPage.js';
import { AmenitiesPage } from './pages/amenities/AmenitiesPage.js';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage.js';
import { BillingPage } from './pages/billing/BillingPage.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<OrgSettingsPage />} />
        <Route path="spaces" element={<SpacesListPage />} />
        <Route path="spaces/:id" element={<SpaceDetailPage />} />
        <Route path="desks" element={<DesksPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/calendar" element={<BookingsCalendarPage />} />
        <Route path="visitors" element={<VisitorsPage />} />
        <Route path="amenities" element={<AmenitiesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
