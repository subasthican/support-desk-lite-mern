const React = require('react');

module.exports = {
  BrowserRouter: ({ children }) => React.createElement('div', null, children),
  MemoryRouter: ({ children }) => React.createElement('div', null, children),
  Route: ({ element }) => element || React.createElement('div'),
  Routes: ({ children }) => React.createElement('div', null, children),
  Link: ({ children, to, style }) => React.createElement('a', { href: to, style }, children),
  Navigate: () => null,
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'ticket123' }),
  useLocation: () => ({ pathname: '/' })
};
