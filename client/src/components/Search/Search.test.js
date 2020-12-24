import { render, cleanup } from '../../test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Search } from './Search';

afterEach(cleanup);

test('renders the search bar', () => {
    const { container, getByPlaceholderText } = render(<Search />);

    expect(getByPlaceholderText('Search for a Song')).toBeInTheDocument();
});

test('searches results on enter keypress', () => {
    const { getByPlaceholderText } = render(<Search />);

    const searchInput = getByPlaceholderText('Search for a Song');

    
})