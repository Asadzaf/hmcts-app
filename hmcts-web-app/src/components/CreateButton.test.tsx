import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import CreateButton from './CreateButton';

test('renders Header correctly', () => {
  const { asFragment } = render(<CreateButton/>);
  expect(asFragment()).toMatchSnapshot();
});
