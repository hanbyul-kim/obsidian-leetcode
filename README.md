# Obsidian LeetCode Importer Plugin

An Obsidian plugin that lets you easily import and organize LeetCode problems. Simply enter a LeetCode URL and the plugin will parse the problem information and automatically generate a markdown note with frontmatter metadata.

## Features

- 🔗 **Easy Import via URL**: Just paste a LeetCode problem URL to automatically parse it
- 📝 **Frontmatter Metadata**: Automatically saves problem number, difficulty, tags, acceptance rate, completion status, time taken, number of attempts, and more in frontmatter
- 💻 **Python Code Template**: Automatically includes a Python code template
- 📂 **Automatic Folder Organization**: Creates problem notes in your configured folder
- 🎨 **Markdown Conversion**: Automatically converts HTML problem descriptions into readable markdown

## Installation

### Manual Installation

1. Clone or download this repository
2. Run `npm install`
3. Run `npm run build`
4. Copy `main.js`, `manifest.json`, and `styles.css` into your Obsidian vault's `.obsidian/plugins/obsidian-leetcode/` folder

## Usage

### 1. Using the Ribbon Icon

- Click the code icon in the left ribbon menu
- Enter the LeetCode URL
- Click the "Import" button

### 2. Using the Command Palette

1. Open the command palette with `Ctrl/Cmd + P`
2. Search for "Import LeetCode Problem"
3. Enter the LeetCode URL
4. Press Enter or click the "Import" button

### 3. Supported URL Formats

```
https://leetcode.com/problems/two-sum/
https://leetcode.com/problems/two-sum/description/
https://leetcode.com/problems/add-two-numbers/
```

## Generated Note Structure

```markdown
---
title: "Two Sum"
leetcode_id: 1
difficulty: Easy
tags: ["Array", "Hash Table"]
acceptance_rate: 49.50%
url: "https://leetcode.com/problems/two-sum/"
date_created: 2026-01-12
status: "todo"
done: false
time_taken_min: 0
num_tries: 0
---

# 1. Two Sum

## Problem Description

[Problem description displayed in markdown format]

## Hints

[Hints are displayed if available]

## Solution

### Approach

<!-- Describe your approach here -->

### Complexity Analysis

- Time Complexity:
- Space Complexity:

### Code

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:

```

## Notes

<!-- Add your notes here -->
```

## Settings

You can configure the following options in the plugin settings tab:

- **Folder Path**: The folder where LeetCode problems will be saved (default: `LeetCode`)
- **Include Hints**: Whether to include hints in the note (default: enabled)
- **Default Status**: The default status for new problems (default: `todo`)

## Frontmatter Fields

The generated note's frontmatter includes the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Problem title | "Two Sum" |
| `leetcode_id` | Problem number | 1 |
| `difficulty` | Difficulty level | Easy, Medium, Hard |
| `tags` | Problem tags | ["Array", "Hash Table"] |
| `acceptance_rate` | Acceptance rate | 49.50% |
| `url` | LeetCode problem link | https://leetcode.com/... |
| `date_created` | Date created | 2026-01-12 |
| `status` | Problem status | todo, in-progress, completed |
| `done` | Completion status | false, true |
| `time_taken_min` | Time taken (minutes) | 0, 30, 45, ... |
| `num_tries` | Number of attempts | 0, 1, 2, ... |

## Dataview Examples

You can effectively manage your LeetCode problems by using the Dataview plugin:

### Problems by Difficulty

```dataview
TABLE difficulty, tags, acceptance_rate
FROM "LeetCode"
SORT difficulty ASC, leetcode_id ASC
```

### Incomplete Problems

```dataview
TABLE leetcode_id, title, difficulty
FROM "LeetCode"
WHERE status = "todo"
SORT difficulty ASC
```

### Problem Statistics by Tag

```dataview
TABLE length(rows) as Count
FROM "LeetCode"
FLATTEN tags
GROUP BY tags
SORT Count DESC
```

## Development

### Build

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

## Tech Stack

- TypeScript
- Obsidian API
- LeetCode GraphQL API

## License

0-BSD License

## Contributing

Issues and pull requests are always welcome!

## Known Limitations

- Requires a network connection as it uses the LeetCode GraphQL API
- Some premium problems may not be importable
- HTML to Markdown conversion may not be perfect in all cases

## Roadmap

- [ ] Premium problem support
- [ ] Problem search functionality
- [ ] Tag-based filtering
- [ ] Automatic Daily Challenge import
- [ ] Submission history management
- [ ] Progress dashboard
