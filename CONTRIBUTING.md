# Contributing to gosmsge-node

Thank you for considering contributing to gosmsge-node! This document outlines the process and guidelines for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Coding Standards](#coding-standards)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setup Development Environment

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/gosmsge-node.git
cd gosmsge-node
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up git hooks**

```bash
npm run prepare
```

This will set up Husky hooks for commit message validation.

4. **Run tests to verify setup**

```bash
npm test
```

5. **Build the project**

```bash
npm run build
```

## Development Workflow

### 1. Create a Branch

Create a feature branch from `master`:

```bash
git checkout master
git pull origin master
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write clean, readable code
- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Ensure all tests pass and maintain 100% code coverage.

### 4. Build the Project

```bash
npm run build
```

Verify that the build completes without errors.

### 5. Commit Your Changes

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
git add .
git commit -m "feat: add new feature description"
```

**Important**: Commit messages are automatically validated by commitlint. Invalid messages will be rejected.

See [VERSIONING.md](./VERSIONING.md) for detailed commit message guidelines.

### 6. Push and Create Pull Request

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub.

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or updates
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

### Examples

```bash
# Feature
feat(sms): add support for scheduled messages

# Bug fix
fix(validation): correct phone number regex

# Breaking change
feat!: redesign API interface

BREAKING CHANGE: removed callback support, use promises instead
```

### Commit Message Rules

- Type must be from allowed list
- Subject in lowercase
- No period at end of subject
- Max header length: 100 characters
- Use imperative mood ("add" not "added")

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code follows TypeScript strict mode
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commit messages follow conventional commits

### PR Template

When creating a PR, include:

**Description**

- Clear description of changes
- Link to related issues

**Type of Change**

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

**Testing**

- Describe tests added/updated
- Include test coverage metrics

**Checklist**

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass

### Review Process

1. **Automated Checks**: CI/CD runs tests on Node 18, 20, 22
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: PR approved by maintainer
5. **Merge**: Merged into master branch
6. **Release**: Automated via semantic-release

## Testing

### Writing Tests

Tests use Jest with TypeScript support:

```typescript
import { SMS } from '../index';

describe('SMS Class', () => {
  it('should send SMS successfully', async () => {
    const sms = new SMS('test-api-key');
    // Test implementation
  });
});
```

### Test Location

- Place tests in `__tests__/` directory
- Name test files: `*.test.ts`

### Test Coverage

- Maintain 100% code coverage
- Test all methods and edge cases
- Include error scenarios
- Mock external dependencies (fetch API)

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define explicit types for all parameters and return values
- Avoid `any` type
- Use interfaces for object shapes

### Code Style

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters
- Use async/await over promises

### Example

```typescript
async send(
  phoneNumbers: string | string[],
  text: string,
  senderName: string,
  urgent: boolean = false
): Promise<SmsSendResponse | SmsError> {
  // Implementation
}
```

### Documentation

- Add JSDoc comments for public methods
- Include parameter descriptions
- Provide usage examples
- Update README.md for new features

````typescript
/**
 * Sends an SMS message to one or multiple phone numbers
 * @param phoneNumbers - Single phone number or array of numbers
 * @param text - Message text to send
 * @param senderName - Registered sender name
 * @param urgent - Send as urgent message (default: false)
 * @returns Promise with send response or error
 * @example
 * ```typescript
 * await sms.send('995555123456', 'Hello!', 'GOSMS.GE');
 * ```
 */
````

## Release Process

### Automated Releases

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and publishing.

**Process:**

1. Merge PR to `master` branch
2. CI runs tests on all supported Node versions
3. semantic-release analyzes commits
4. Version bumped automatically based on commit types
5. CHANGELOG.md generated
6. Git tag created
7. Package published to npm
8. GitHub release created

See [VERSIONING.md](./VERSIONING.md) for complete details.

### Version Bumps

- `feat:` commits → MINOR version (3.3.8 → 3.4.0)
- `fix:` commits → PATCH version (3.3.8 → 3.3.9)
- `BREAKING CHANGE:` → MAJOR version (3.3.8 → 4.0.0)

## Project Structure

```
gosmsge-node/
├── __tests__/           # Test files
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── .husky/              # Git hooks
├── dist/                # Compiled output (gitignored)
├── examples/            # Usage examples
├── lib/                 # Type definitions
├── index.ts             # Main entry point
├── package.json         # Package configuration
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Jest configuration
├── commitlint.config.js # Commit linting rules
├── .releaserc.json      # Semantic-release config
└── README.md            # Main documentation
```

## Getting Help

### Resources

- [README.md](./README.md) - Main documentation
- [VERSIONING.md](./VERSIONING.md) - Version management guide
- [SECURITY.md](./SECURITY.md) - Security policy
- [GitHub Issues](https://github.com/gosms-ge/gosmsge-node/issues)

### Questions?

- Check existing [issues](https://github.com/gosms-ge/gosmsge-node/issues)
- Create a new issue with `question` label
- Email: info@gosms.ge

## Recognition

Contributors will be acknowledged in:

- Release notes
- Repository contributors list
- Special thanks in README (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing to gosmsge-node! 🎉
