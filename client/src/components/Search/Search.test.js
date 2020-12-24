import { render, cleanup } from '../../test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Search } from './Search';
import { fireEvent } from '@testing-library/react';

afterEach(cleanup);

test('renders the search bar', () => {
    const { container, getByPlaceholderText } = render(<Search />);

    expect(getByPlaceholderText('Search for a Song')).toBeInTheDocument();
});

test('searches results on enter keypress', () => {
    const { getByPlaceholderText } = render(<Search />);

    const searchInput = getByPlaceholderText('Search for a Song');

    fireEvent.click(searchInput);
    fireEvent.keyPress('H');
    fireEvent.keyPress('E');
    fireEvent.keyPress('Y');

    expect(searchInput).toHaveText();
})