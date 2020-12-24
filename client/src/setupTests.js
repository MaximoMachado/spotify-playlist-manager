// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import './test-utils';
import { rest } from 'msw';
import { setUpServer } from 'msw/node';

const server = setUpServer(
    rest.get('*', (req, res, ctx) => {
        console.error(`Please add request handler for ${req.url}`);
        return res(
            ctx.status(500),
            ctx.json({ error: 'Please add request handler'}),
        );
    })
);

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())