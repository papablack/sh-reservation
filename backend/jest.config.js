module.exports = {
    moduleFileExtensions: ['ts', 'js'],
    rootDir: '.',
    testRegex: '.spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', {
          tsconfig: '../tsconfig.json'
        }]
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/test/'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
  };