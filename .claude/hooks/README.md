# Hooks

Claude Code hooks for automation. Configured in `.claude/settings.json` under the `hooks` key.

## Recommended Hooks for Haim's Projects

### PostToolUse: Auto-format after edit

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATHS 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

### PostToolUse: Run lint on changed files

```json
{
  "matcher": "Edit|Write",
  "hooks": [
    {
      "type": "command",
      "command": "npx eslint --fix $CLAUDE_FILE_PATHS 2>/dev/null || true"
    }
  ]
}
```

### PreToolUse: Block dangerous commands

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -qE '(rm -rf|DROP TABLE|git push --force)' && exit 1 || exit 0"
          }
        ]
      }
    ]
  }
}
```

### Stop: Run tests before ending session

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npm test -- --run 2>&1 | tail -20"
          }
        ]
      }
    ]
  }
}
```

### SessionStart: Load project state

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git status --short && cat TODO.md 2>/dev/null | head -20"
          }
        ]
      }
    ]
  }
}
```

## Installation

Copy the hooks you want into your `.claude/settings.json`:

```json
{
  "permissions": { ... },
  "hooks": {
    "PostToolUse": [...],
    "PreToolUse": [...],
    "Stop": [...]
  }
}
```

## Testing Hooks

After adding a hook, test it works:

1. Trigger the event (edit a file, run a command)
2. Check the hook ran (look for output)
3. Verify it doesn't break normal flow

## Debugging

- Hooks that fail silently — check they exit 0
- Hooks that block everything — check exit codes
- View hook output with `claude --verbose`
