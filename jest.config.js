module.exports = {
    preset: 'ts-jest', // Use ts-jest preset
    testEnvironment: 'node', // Test environment to use
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore specific paths
    moduleFileExtensions: ['ts', 'js'], // Extensions Jest will look for
    transform: {
      '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
    },
  };
  