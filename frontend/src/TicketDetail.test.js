import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TicketDetail from './pages/TicketDetail';
import AuthContext from './context/AuthContext';
import * as api from './utils/api';

jest.mock('./utils/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn()
}));

const mockTicketResponse = {
  data: {
    success: true,
    data: {
      ticket: {
        _id: 'ticket123',
        title: 'Test Ticket',
        description: 'Test Description',
        priority: 'high',
        status: 'open',
        createdAt: '2026-01-01',
        tags: ['test']
      },
      comments: []
    }
  }
};

const renderTicketDetailWithRole = (role) => {
  const mockUser = { role, name: 'Test User' };
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();

  api.get.mockResolvedValue(mockTicketResponse);

  return render(
    <MemoryRouter initialEntries={['/tickets/ticket123']}>
      <AuthContext.Provider value={{ user: mockUser, login: mockLogin, logout: mockLogout }}>
        <Routes>
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Internal Note UI visibility based on role', () => {
  test('hides internal note option when user role is customer', async () => {
    renderTicketDetailWithRole('customer');

    await waitFor(() => {
      expect(screen.getByText(/Test Ticket/i)).toBeInTheDocument();
    });

    const internalOption = screen.queryByText(/internal note/i);
    expect(internalOption).not.toBeInTheDocument();
  });

  test('shows internal note option when user role is agent', async () => {
    renderTicketDetailWithRole('agent');

    await waitFor(() => {
      expect(screen.getByText(/Test Ticket/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const internalOption = screen.getByText(/internal note/i);
      expect(internalOption).toBeInTheDocument();
    });
  });

  test('shows internal note option when user role is admin', async () => {
    renderTicketDetailWithRole('admin');

    await waitFor(() => {
      expect(screen.getByText(/Test Ticket/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      const internalOption = screen.getByText(/internal note/i);
      expect(internalOption).toBeInTheDocument();
    });
  });
});
