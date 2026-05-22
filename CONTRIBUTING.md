# Contributing to CollabEdit Pro

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** - Search to see if the bug has already been reported
2. **Create a new issue** - Use the bug report template
3. **Provide details:**
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. **Check existing feature requests**
2. **Create a new issue** - Use the feature request template
3. **Describe:**
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Use cases and examples

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add user profile feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a pull request**

---

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(editor): add syntax highlighting
fix(socket): resolve connection timeout issue
docs(readme): update installation instructions
style(ui): improve button styling
refactor(api): simplify room management logic
perf(db): optimize document queries
test(editor): add cursor tracking tests
chore(deps): update dependencies
```

---

## 🏗️ Development Setup

### Prerequisites
- Node.js 14+
- MongoDB 4.4+
- Git

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/collab-editor.git
   cd collab-editor
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/collab-editor.git
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Start MongoDB**
   ```bash
   mongod --dbpath="C:\data\db"
   ```

5. **Run development servers**
   ```bash
   # Backend (terminal 1)
   cd backend
   npm start

   # Frontend (terminal 2)
   cd frontend
   npm start
   ```

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run all tests
npm run test:all
```

### Writing Tests

**Backend (Jest):**
```javascript
// backend/tests/room.test.js
describe('Room Management', () => {
  test('should create a new room', async () => {
    const room = await createRoom('test-room');
    expect(room.roomId).toBe('test-room');
  });
});
```

**Frontend (React Testing Library):**
```javascript
// frontend/src/components/Editor.test.js
import { render, screen } from '@testing-library/react';
import Editor from './Editor';

test('renders editor', () => {
  render(<Editor content="" />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
```

---

## 📐 Code Style

### JavaScript/React

- Use ES6+ features
- Use functional components with hooks
- Follow Airbnb style guide
- Use meaningful variable names
- Add comments for complex logic

### Formatting

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

---

## 🏛️ Project Structure

```
collab-editor/
├── backend/
│   ├── server.js          # Main server
│   ├── db.js              # Database config
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utility functions
│   └── tests/             # Backend tests
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # Global styles
│   │   └── tests/         # Frontend tests
│   └── package.json
└── docs/                  # Documentation
```

---

## 🎨 UI/UX Guidelines

### Design Principles
1. **Simplicity** - Keep interfaces clean and intuitive
2. **Consistency** - Use consistent patterns and components
3. **Accessibility** - Ensure WCAG 2.1 AA compliance
4. **Performance** - Optimize for speed and responsiveness
5. **Feedback** - Provide clear user feedback

### Component Guidelines

```javascript
// Good: Clear, reusable component
function Button({ onClick, children, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      aria-label={children}
    >
      {children}
    </button>
  );
}

// Bad: Unclear, not reusable
function Btn({ o, c }) {
  return <button onClick={o}>{c}</button>;
}
```

---

## 🔒 Security Guidelines

### Best Practices
1. **Never commit secrets** - Use environment variables
2. **Validate all input** - Both client and server side
3. **Sanitize user content** - Prevent XSS attacks
4. **Use HTTPS** - In production
5. **Keep dependencies updated** - Regular security audits

### Security Checklist
- [ ] Input validation
- [ ] Output encoding
- [ ] Authentication checks
- [ ] Authorization checks
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] SQL injection prevention
- [ ] XSS prevention

---

## 📚 Documentation

### Code Documentation

```javascript
/**
 * Creates a new collaboration room
 * @param {string} roomId - Unique room identifier
 * @param {Object} options - Room configuration options
 * @param {number} options.maxUsers - Maximum users allowed
 * @returns {Promise<Room>} The created room object
 * @throws {Error} If room already exists
 */
async function createRoom(roomId, options = {}) {
  // Implementation
}
```

### README Updates

When adding features, update:
- README.md - Main documentation
- API.md - API documentation
- FEATURES.md - Feature list
- CHANGELOG.md - Version history

---

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots
If applicable

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] Code reviewed
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs
2. **Code review** - Maintainer reviews code
3. **Feedback** - Address review comments
4. **Approval** - Maintainer approves PR
5. **Merge** - PR merged to main branch

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

---

## 💬 Communication

### Channels
- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - General questions, ideas
- **Discord** - Real-time chat (coming soon)
- **Email** - security@collabedit.com (security issues only)

### Response Times
- **Critical bugs** - Within 24 hours
- **Feature requests** - Within 1 week
- **Pull requests** - Within 3 days

---

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: conduct@collabedit.com

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## ❓ Questions?

- Read the [FAQ](FAQ.md)
- Check [existing issues](https://github.com/your-repo/collab-editor/issues)
- Ask in [Discussions](https://github.com/your-repo/collab-editor/discussions)

---

**Thank you for contributing to CollabEdit Pro! 🎉**
