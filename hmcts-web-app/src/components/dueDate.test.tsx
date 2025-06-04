import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import DueDate from './dueDate';

test('renders Header correctly', () => {
  const { asFragment } = render(<DueDate onDateChange = {jest.fn}/>);
  expect(asFragment()).toMatchSnapshot();
});
