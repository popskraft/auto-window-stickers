# YAML Formatting Rules for Content Generator

## Literal Style Escaping Rules

### When to Use Literal Style (`|`)

1. **Large Text Blocks**: Any text content that spans multiple lines or contains more than 50-60 characters should use literal style
2. **Content with Quotes**: Text containing single (`'`) or double (`"`) quotes should use literal style to avoid escaping
3. **Multi-line Content**: Any content that naturally spans multiple lines should use literal style
4. **Template Variables**: Content containing template variables like `[[product]]`, `[[state]]`, `[[keyword]]` should use literal style for consistency

### Literal Style Format

```yaml
# Correct format for large text blocks
summary: |
  This is a multi-line text block that uses literal style.
  It can contain quotes like "this" and 'that' without escaping.
  Template variables like [[product]] work seamlessly.
  No need to escape special characters in most cases.

# Correct format for single-line content with quotes
title: "F.A.Q."  # Use quotes for simple strings with special characters
```

### When NOT to Use Literal Style

1. **Simple strings**: Short strings without quotes or special characters can use regular format
2. **Numbers and booleans**: These should never use literal style
3. **Arrays and objects**: Use regular YAML format for data structures

### Examples of Proper Formatting

```yaml
# Good - uses literal style for multi-line content
- title: "Why Choose [[product]]?"
  summary: |
    [[product]] creates a polished look on every vehicle in [[state]], letting [[keyword]] stand out for customers walking the lot. This helps buyers quickly spot key information as they browse.

# Good - uses literal style for content with quotes
- question: "How do I apply [[product]] to a car window in [[state]]?"
  answer: |
    Clean the glass, peel off the backing, and smooth [[product]] onto the window. No tools required.

# Good - simple strings without quotes
- title: F.A.Q.
  question: "Can [[product]] be removed without leaving residue?"
  answer: |
    Yes, [[product]] peels away cleanly and leaves no sticky marks behind.
```

### Benefits of Literal Style

1. **No escaping needed**: Quotes and special characters don't need to be escaped
2. **Better readability**: Multi-line content is easier to read and edit
3. **Consistency**: All text content follows the same formatting pattern
4. **Template safety**: Template variables like `[[product]]` are handled safely
5. **Maintenance**: Easier to update and modify content without breaking YAML syntax

### Implementation Guidelines

1. **Always use literal style for**: `summary`, `answer`, `description`, `content` fields
2. **Use quotes for**: `title`, `headline`, `subtitle` when they contain special characters
3. **Keep simple**: `question` fields can use quotes or literal style depending on length
4. **Consistent spacing**: Use 2-space indentation throughout
5. **Template variables**: Always use `[[variable]]` format consistently
6. **Avoid unnecessary line breaks**: Keep content on single lines when possible for better readability

### File Structure Pattern

```yaml
- title: "Section Title"
  summary: |
    Multi-line content that describes the section or product. This can contain template variables like [[product]] and [[state]]. Quotes and special characters are handled automatically.

- question: "Question text with quotes?"
  answer: |
    Detailed answer that may span multiple lines and contain template variables [[product]] and other content.
```

### Important Notes

- **Single-line content**: When using literal style (`|`), keep content on a single line unless it naturally needs to span multiple lines
- **No forced line breaks**: Avoid artificial line breaks in the middle of sentences or phrases
- **Consistent formatting**: All similar fields should follow the same formatting pattern
- **Template variables**: Always use `[[variable]]` format consistently throughout all files

This formatting ensures all YAML files in the content generator are consistent, readable, and maintainable.
