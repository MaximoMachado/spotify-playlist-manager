import { render, cleanup, server } from '../../test-utils';
import '@testing-library/jest-dom/extend-expect';
import { MultiplePlaylistSearcher } from './MultiplePlaylistSearcher';
import { rest } from 'msw';

const generateBody = (bodyData) => ({body: bodyData});

const generateSearchData = (itemType, items) => {
    const data = {};
    data[itemType] = {
        items: items,
        total: items.length,
        offset: 0,
        limit: items.length,
    };
    console.log(data);
    return generateBody(data);
};

const handlers = [
    rest.get(`${process.env.REACT_APP_API_URL}/spotify/searchTracks`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(generateSearchData('tracks', [
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
            ])),
        );
    }),
    rest.get(`${process.env.REACT_APP_API_URL}/spotify/getMe`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(generateBody({ display_name: 'Maximo Machado', images: [{ url: '' }] })),
        )
    }),
]
beforeEach(() => server.use(...handlers));

afterEach(cleanup);

jest.mock('../../components/SpotifyAvatar/SpotifyAvatar', () => ({ SpotifyAvatar: () => <div />}));

test('renders initial ui correctly', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<MultiplePlaylistSearcher />);

    expect(getByText('Spotify Playlist Manager')).toBeInTheDocument();
    expect(getByPlaceholderText('Search for a Song')).toBeInTheDocument();
    expect(queryByText('Playlists Containing')).toBe(null);
});