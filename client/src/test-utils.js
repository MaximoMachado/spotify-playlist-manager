import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const AllTheProviders = ({ children }) => {
  return (
    <ChakraProvider>
        <MemoryRouter>
            {children}
        </MemoryRouter>
    </ChakraProvider>
  )
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

const handlers = [
    rest.get('*', (req, res, ctx) => {
        console.error(`Please add request handler for ${req.url}`);
        return res(
            ctx.status(500),
            ctx.json({ error: 'Please add request handler'})
        );
    }),
]

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render, server, rest };