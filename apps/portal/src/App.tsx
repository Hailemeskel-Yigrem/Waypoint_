import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortalLayout } from './layouts/PortalLayout.js';
import { LoginPage } from './pages/auth/LoginPage.js';
import { HomePage } from './pages/HomePage.js';
import { BookDeskPage } from './pages/book/BookDeskPage.js';
import { BookSpacePage } from './pages/book/BookSpacePage.js';
import { MyBookingsPage } from './pages/bookings/MyBookingsPage.js';
import { InviteVisitorPage } from './pages/visitors/InviteVisitorPage.js';
import { AmenitiesPage } from './pages/amenities/AmenitiesPage.js';
import { DirectoryPage } from './pages/directory/DirectoryPage.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <PortalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="book/desk" element={<BookDeskPage />} />
        <Route path="book/space" element={<BookSpacePage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="visitors/invite" element={<InviteVisitorPage />} />
        <Route path="amenities" element={<AmenitiesPage />} />
        <Route path="directory" element={<DirectoryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
