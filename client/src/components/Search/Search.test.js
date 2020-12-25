import { render, cleanup, server } from '../../test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Search } from './Search';
import { fireEvent, act, waitFor } from '@testing-library/react';
import { rest } from 'msw';

const serverResData = {
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
};

beforeEach(() => server.use(
    rest.get(`${process.env.REACT_APP_API_URL}/spotify/searchTracks`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(serverResData),
        );
    }),
));
afterEach(cleanup);

test('renders the search bar', () => {
    const { getByPlaceholderText } = render(<Search />);

    expect(getByPlaceholderText('Search for a Song')).toBeInTheDocument();
});

test('searches results', async () => {
    
    const url = `${process.env.REACT_APP_API_URL}/spotify/searchTracks`;
    const createComponents = jest.fn(data => [<div key={0}>Results</div>]);
    const { getByText, getByPlaceholderText, findByText } = render(<Search searchUrl={url}  createComponents={createComponents}/>);

    const searchInput = getByPlaceholderText('Search for a Song');

    fireEvent.change(searchInput, { target: { value: 'Back Again' } });
    expect(searchInput.value).toBe('Back Again');

    const searchBtn = getByText('Search');
    fireEvent.click(searchBtn);

    await findByText('Results');

    expect(createComponents.mock.calls.length).toBe(1);
    expect(createComponents.mock.calls[0][0].data).toStrictEqual(serverResData);
});

test('searches multiple times', async () => {

    const url = `${process.env.REACT_APP_API_URL}/spotify/searchTracks`;
    const createComponents = jest.fn(data => [<div key={0}>Results</div>]);
    const { getByText, getByPlaceholderText, findByText } = render(<Search searchUrl={url}  createComponents={createComponents}/>);

    const searchInput = getByPlaceholderText('Search for a Song');
    fireEvent.change(searchInput, { target: { value: 'Back Again' } });

    await act(async () => {
        for (let i = 0; i < 50; i++) {
            fireEvent.click(getByText('Search'));
            await findByText('Results');
            await waitFor(() => expect(createComponents).toHaveBeenCalled());

            expect(createComponents.mock.calls.length).toBe(i + 1);
            expect(createComponents.mock.calls[i][0].data).toStrictEqual(serverResData);
        }
    });
})