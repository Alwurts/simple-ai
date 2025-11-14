# Releasing Guide

This document explains the simple, standardized process for releasing new versions of `create-simple-ai` to npm using [Changesets](https://github.com/changesets/changesets).

## Core Philosophy

Our release process is declarative. We "declare" our changes using changeset files during development. The release itself is a mechanical process that consumes these declarations to bump versions, update changelogs, and publish to npm. This removes guesswork and prevents mistakes.

## Workflow Part 1: Adding a Changeset (During Development)

Anytime you make a change that should be reflected in the changelog and version bump (e.g., bug fixes, new features, template updates), you must add a changeset.

1. **Run the Changeset command:**

    ```bash
    npm run changeset
    ```

2. **Follow the prompts:**

    * It will ask which packages to include. **Always select `create-simple-ai`**. The `@simple-ai/docs` package is ignored.

    * Choose the appropriate version bump (**Major**, **Minor**, or **Patch**) according to [SemVer](https://semver.org/).

    * Write a clear, concise summary of the change. This text will appear directly in the `CHANGELOG.md`.

3. **Commit the generated file:** A new `.md` file will be created in the `.changeset` directory. Add this file to your commit.

> **Tip:** It's best practice to add the changeset in the same pull request as the code changes it describes.

## Workflow Part 2: Performing a Release

Releases should only be done from the `main` branch after all pull requests have been merged.

### Step 1: Prepare Your Local Environment

Ensure your `main` branch is clean and up-to-date.

```bash
git checkout main
git pull origin main
npm install
```

### Step 2: Run Pre-Release Checks (Recommended)

Verify that all tests, linting, and build steps are passing.

```bash
npm run check:release
```

This script will validate the project state and ensure you're ready to publish. Fix any issues before proceeding.

### Step 3: Version the Package

This is the step where Changesets updates the `package.json` version and `CHANGELOG.md` based on all the collected changeset files.

```bash
npm run version
```

This will consume all `.md` files in the `.changeset` directory and then delete them.

### Step 4: Commit the Version Update

Commit the changes made by the versioning command.

```bash
git add .
git commit -m "chore(release): version packages"
```

### Step 5: Publish to NPM

This is the final step. The command will build the CLI package and publish it to npm. Changesets is smart enough to know which package to publish and will automatically create and push a git tag for you (e.g., `create-simple-ai@0.1.1`).

```bash
npm run release
```

### Step 6: Push the Commit and Tags

The `release` command pushed the tags, but you still need to push the versioning commit.

```bash
git push origin main
git push origin --tags
```

Congratulations, the release is complete!

## Canary / Pre-Releases

The previous custom canary script has been removed in favor of the standard Changesets workflow. If you need to do a pre-release (e.g., an alpha or beta), please refer to the official [Changesets Pre-Release documentation](https://github.com/changesets/changesets/blob/main/docs/prereleases.md).

## Quick Reference

```bash
# During development, after making a change
npm run changeset

# When you are ready to release a new version
npm run check:release
npm run version
git add . && git commit -m "chore(release): version packages"
npm run release
git push origin main
```

