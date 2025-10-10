# Version Management & Release Process

This project uses [Semantic Versioning](https://semver.org/) and automated releases via [semantic-release](https://github.com/semantic-release/semantic-release).

## Semantic Versioning (SemVer)

Version numbers follow the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes and minor improvements (backwards-compatible)

## Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

| Type       | Description                           | Version Bump |
| ---------- | ------------------------------------- | ------------ |
| `feat`     | New feature                           | MINOR        |
| `fix`      | Bug fix                               | PATCH        |
| `perf`     | Performance improvement               | PATCH        |
| `docs`     | Documentation changes                 | PATCH        |
| `style`    | Code style changes (formatting, etc.) | PATCH        |
| `refactor` | Code refactoring                      | PATCH        |
| `test`     | Adding or updating tests              | PATCH        |
| `build`    | Build system changes                  | PATCH        |
| `ci`       | CI/CD configuration changes           | PATCH        |
| `chore`    | Other changes (maintenance, etc.)     | PATCH        |
| `revert`   | Revert previous commit                | PATCH        |

### Breaking Changes

To trigger a MAJOR version bump, add `BREAKING CHANGE:` in the commit footer or add `!` after the type:

```bash
# Method 1: Using footer
feat: add new authentication method

BREAKING CHANGE: The old auth method is no longer supported

# Method 2: Using !
feat!: redesign API interface
```

### Examples

#### Feature (Minor bump: 3.3.8 → 3.4.0)

```bash
feat: add support for MMS messages

- Added sendMMS() method
- Updated types for MMS support
```

#### Bug Fix (Patch bump: 3.3.8 → 3.3.9)

```bash
fix: correct phone number validation regex

The previous regex didn't account for international formats
```

#### Breaking Change (Major bump: 3.3.8 → 4.0.0)

```bash
feat!: migrate to async/await only

BREAKING CHANGE: Removed callback support. All methods now return Promises only.
```

#### With Scope

```bash
feat(otp): add OTP retry mechanism
fix(validation): improve phone number format checking
docs(readme): add TypeScript usage examples
```

## Automated Release Process

### How It Works

1. **Commit to main/master branch** with conventional commit message
2. **GitHub Actions CI** runs tests on Node 18, 20, and 22
3. **Semantic-release analyzes commits** since last release
4. **Version is bumped automatically** based on commit types
5. **CHANGELOG.md is generated** from commit messages
6. **Git tag is created** with new version
7. **Package is published to npm** automatically
8. **GitHub release is created** with release notes

### Release Workflow

```
Developer commits → CI runs tests → semantic-release → npm publish → GitHub release
```

### Manual Release (if needed)

To manually trigger a release:

```bash
npm run semantic-release
```

**Note**: Ensure you have proper credentials:

- `GITHUB_TOKEN` for GitHub releases
- `NPM_TOKEN` for npm publishing

## Commit Message Validation

Commit messages are automatically validated using [commitlint](https://commitlint.js.org/):

- **Pre-commit hook** via husky validates messages before commit
- Invalid messages will be rejected
- Helps maintain consistent commit history

### Validation Rules

- Type must be from allowed list
- Subject cannot be empty
- Subject cannot end with period
- Header max length: 100 characters
- Body/footer max line length: 100 characters

## Best Practices

### 1. Write Clear Commit Messages

```bash
# ✅ Good
feat(sms): add urgent message priority flag
fix(balance): handle null balance response correctly

# ❌ Bad
updated code
fix bug
WIP
```

### 2. Atomic Commits

- One commit per logical change
- Each commit should be self-contained
- Makes history easier to navigate and revert if needed

### 3. Use Scopes When Appropriate

```bash
feat(otp): add verification timeout
fix(validation): improve error messages
docs(api): update authentication examples
```

### 4. Include Context in Body

```bash
fix(send): retry failed SMS requests

Implements exponential backoff retry logic for transient
network failures. Retries up to 3 times with increasing delays.

Closes #123
```

### 5. Reference Issues

```bash
fix(balance): prevent negative balance display

Closes #456
Relates to #789
```

## Version History

All versions and changes are documented in [CHANGELOG.md](./CHANGELOG.md), which is automatically generated.

## Troubleshooting

### Commit Rejected by commitlint

If your commit is rejected:

1. Check the error message for specific rule violation
2. Fix the commit message format
3. Use `git commit --amend` to update message
4. Common issues:
   - Missing type: `feat:`, `fix:`, etc.
   - Invalid type: use one from the allowed list
   - Subject too long: keep under 100 characters
   - Capitalization: use lowercase for type and scope

### Release Didn't Trigger

Possible reasons:

1. No commits since last release
2. Only commits that don't trigger releases (e.g., `chore`, `ci` without new features/fixes)
3. CI tests failed
4. Commit messages don't follow conventional commits format

### How to Check What Version Will Be Released

```bash
# Dry run semantic-release
npx semantic-release --dry-run --branches main
```

This will show:

- What version would be released
- Which commits would be included
- Generated changelog

## Resources

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [semantic-release](https://github.com/semantic-release/semantic-release)
- [commitlint](https://commitlint.js.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## Questions?

If you have questions about the versioning process, please:

- Check existing issues: https://github.com/gosms-ge/gosmsge-node/issues
- Create a new issue with the `question` label
- Contact us at info@gosms.ge
