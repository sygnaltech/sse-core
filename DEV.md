# SSE Core - Local Development Guide

Quick reference for developing sse-core with a local template project.

## Local Linking Workflow

### 1. Link sse-core (one time setup)

```bash
cd d:\Projects\Engines\sse-core
npm link
```

### 2. Link in your template project

```bash
cd d:\Projects\YourTemplate
npm link @sygnal/sse-core
```

### 3. Development cycle

In **sse-core**:
```bash
npm run build        # or npm run watch
```

In **template project**:
```bash
npm run build        # Rebuild to pick up changes
```

## Quick Commands

### Build sse-core
```bash
npm run build        # Single build
npm run watch        # Auto-rebuild on changes
```

### Unlink (when done)
```bash
# In template project
npm unlink @sygnal/sse-core
npm install

# In sse-core (optional cleanup)
npm unlink -g @sygnal/sse-core
```

## Alternative: Direct File Link

Edit your template's `package.json`:
```json
{
  "dependencies": {
    "@sygnal/sse-core": "file:../sse-core"
  }
}
```

Then run `npm install` in the template.

## Troubleshooting

**Changes not appearing?**
1. Rebuild sse-core: `npm run build`
2. Rebuild template: `npm run build`
3. Clear browser cache / hard refresh

**Link broken?**
```bash
# Re-link
cd d:\Projects\Engines\sse-core
npm link

cd d:\Projects\YourTemplate
npm link @sygnal/sse-core
```

**TypeScript errors?**
- Ensure both projects use compatible TypeScript versions
- Check that `experimentalDecorators: true` is enabled in template's tsconfig.json

## Publishing Checklist

Before publishing to npm:

1. ✅ Update version in `package.json`
2. ✅ Build: `npm run build`
3. ✅ Test with linked template
4. ✅ Update CHANGELOG.md
5. ✅ Commit changes
6. ✅ Tag: `git tag v0.X.Y`
7. ✅ Push: `git push --tags`
8. ✅ Publish: `npm publish`

## Current Version

**Version**: 2.0.0 (check package.json for current)
