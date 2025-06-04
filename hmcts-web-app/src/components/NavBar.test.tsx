import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import NavBar from './NavBar';
import { MemoryRouter } from 'react-router-dom';


test('renders Header correctly', () => {
  const { asFragment } = render(
    <MemoryRouter><NavBar currentPage='allTasks' /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});

test('renders Header correctly', () => {
  const { asFragment } = render(<MemoryRouter><NavBar currentPage='createTask' /></MemoryRouter>);
  expect(asFragment()).toMatchSnapshot();
});
