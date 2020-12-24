import { render, cleanup, server } from '../../test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Search } from './Search';
import { fireEvent } from '@testing-library/react';
import { rest } from 'msw';

afterEach(cleanup);

server.use(
    rest.get(`${process.env.REACT_APP_API_URL}/spotify/searchTracks`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                body: {
                    tracks: {
                        items: [
                            {
                                name: 'Back Again',
                                artists: [{ name: 'Marvin Divine'}],
                                album: { name: 'Back Again' },
                            },
                            {
                                name: 'Dogs',
                                artists: [{ name: 'Abhi the Nomand'}, { name: 'Dani Rae' }],
                                album: { name: 'Marbled' },
                            },
                        ]
                    }
                }
            }),
        );
    }),
);

test('renders the search bar', () => {
    const { container, getByPlaceholderText } = render(<Search />);

    expect(getByPlaceholderText('Search for a Song')).toBeInTheDocument();
});

test('searches results on enter keypress', () => {
    const { getByPlaceholderText } = render(<Search />);

    const searchInput = getByPlaceholderText('Search for a Song');

    fireEvent.change(searchInput, { target: { value: 'Back Again' } });
    expect(searchInput.value).toBe('Back Again');
})