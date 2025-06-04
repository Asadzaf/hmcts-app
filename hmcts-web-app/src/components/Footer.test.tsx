import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import Footer from './Footer';

test('renders Header correctly', () => {
  const { asFragment } = render(<Footer/>);
  expect(asFragment()).toMatchSnapshot();
});
