import '@testing-library/jest-dom';

const jest = {
    fn: () => { },
    mock: () => { },
};

vi.mock('relay-test-utils', () => ({
    createMockEnvironment: () => ({
        mock: {
            resolveMostRecentOperation: vi.fn(),
        },
    }),
    MockPayloadGenerator: {
        generate: vi.fn(),
    },
}));

vi.mock('(craco-alias)', () => ({}));
