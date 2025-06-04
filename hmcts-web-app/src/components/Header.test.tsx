import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import Header from './Header';

test('renders Header correctly', () => {
  const { asFragment } = render(<Header />);
  expect(asFragment()).toMatchSnapshot();
});
