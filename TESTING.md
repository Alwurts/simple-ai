# Testing Guide

This document explains how to test `create-simple-ai` both manually and automatically.

## Automated Testing

We use [Vitest](https://vitest.dev/) for automated testing. Tests are located in the `test/` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- `test/test-utils.ts` - Helper functions for testing
- `test/basic.test.ts` - Basic project creation tests
- `test/database.test.ts` - Database-specific configuration tests
- `test/templates.test.ts` - Template generation validation
- `test/integration.test.ts` - End-to-end integration tests

### Test Utilities

The test utilities provide helpers for:
- Creating test projects in `.smoke/` directory
- Validating project structure
- Validating file contents
- Validating package.json configuration
- Validating database configurations

## Manual Testing

### Option 1: Direct Execution (Recommended for Development)

After building the project, make the CLI executable and run it directly:

```bash
# Build the project
npm run build

# Make executable
chmod +x dist/cli.js

# Run with defaults
./dist/cli.js test-app --yes

# Run with specific database
./dist/cli.js test-app-postgres --database postgres --yes
./dist/cli.js test-app-sqlite --database sqlite --yes

# Run without installation (faster for testing)
./dist/cli.js test-app --yes --no-install

# Run without git initialization
./dist/cli.js test-app --yes --no-git
```

### Option 2: Using npm link (For Global Testing)

Link the package globally to test it as users would:

```bash
# From the create-simple-ai directory
npm link

# Now test from anywhere
create-simple-ai my-test-app --database postgres --yes

# Unlink when done
npm unlink -g create-simple-ai
```

### Option 3: Using npx with Local Path

```bash
# From any directory
npx /absolute/path/to/create-simple-ai/dist/cli.js test-app --yes
```

### Option 4: Using Node Directly (Not Recommended)

If you need to use `node` directly, you'll need to remove the shebang first or use a workaround:

```bash
# This won't work due to shebang in ESM
node dist/cli.js test-app --yes  # ❌ Fails

# Use direct execution instead
./dist/cli.js test-app --yes  # ✅ Works
```

## What to Test Manually

1. **Basic Functionality**
   - Create a project with default options
   - Create a project with each database type (postgres, sqlite)
   - Verify all files are generated correctly

2. **Configuration Options**
   - Test with different package managers (npm, pnpm, bun)
   - Test with/without git initialization
   - Test with/without dependency installation

3. **Generated Project**
   - Verify `package.json` has correct dependencies
   - Verify database config files are correct
   - Verify auth setup is correct
   - Try running the generated project: `cd test-app && npm install && npm run dev`

4. **Error Handling**
   - Test with invalid project names
   - Test with existing directories
   - Test with invalid database types

## Test Project Location

All test projects (both automated and manual) are created in the `.smoke/` directory in the project root. This directory is gitignored and can be safely deleted.

```bash
# Clean up test projects
rm -rf .smoke
```

## Continuous Integration

Tests should be run in CI/CD pipelines before merging code. The test suite:
- Creates real projects in `.smoke/` directory
- Validates file structure and content
- Tests all database configurations
- Tests all package managers
- Cleans up after itself

