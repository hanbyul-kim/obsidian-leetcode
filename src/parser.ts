import { requestUrl } from 'obsidian';

export interface LeetCodeProblem {
    questionId: string;
    questionFrontendId: string;
    title: string;
    titleSlug: string;
    difficulty: string;
    content: string;
    topicTags: string[];
    codeSnippets: CodeSnippet[];
    stats: string;
    hints: string[];
    similarQuestions: string;
    exampleTestcases: string;
    companyTags: string[];
    acRate: number;
}

export interface CodeSnippet {
    lang: string;
    langSlug: string;
    code: string;
}

export class LeetCodeParser {
    private readonly GRAPHQL_ENDPOINT = 'https://leetcode.com/graphql';

    /**
     * Extract problem slug from LeetCode URL
     * Examples:
     * - https://leetcode.com/problems/two-sum/ -> two-sum
     * - https://leetcode.com/problems/two-sum/description/ -> two-sum
     */
    extractSlugFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);
            const match = urlObj.pathname.match(/\/problems\/([^\/]+)/);
            return match && match[1] ? match[1] : null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Fetch problem data from LeetCode GraphQL API
     */
    async fetchProblem(titleSlug: string): Promise<LeetCodeProblem> {
        const query = `
            query questionData($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                    questionId
                    questionFrontendId
                    title
                    titleSlug
                    content
                    difficulty
                    exampleTestcases
                    topicTags {
                        name
                        slug
                    }
                    codeSnippets {
                        lang
                        langSlug
                        code
                    }
                    stats
                    hints
                    similarQuestions
                }
            }
        `;

        const response = await requestUrl({
            url: this.GRAPHQL_ENDPOINT,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: { titleSlug: titleSlug }
            })
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch problem: ${response.status}`);
        }

        const data = response.json;
        if (data.errors) {
            throw new Error(`GraphQL error: ${JSON.stringify(data.errors)}`);
        }

        if (!data.data || !data.data.question) {
            throw new Error('Problem not found');
        }

        const question = data.data.question;

        // Parse stats to get acceptance rate
        let acRate = 0;
        try {
            const stats = JSON.parse(question.stats);
            acRate = parseFloat(stats.acRate) || 0;
        } catch (e) {
            // Ignore parse errors
        }

        return {
            questionId: question.questionId,
            questionFrontendId: question.questionFrontendId,
            title: question.title,
            titleSlug: question.titleSlug,
            difficulty: question.difficulty,
            content: question.content || '',
            topicTags: question.topicTags.map((tag: any) => tag.name),
            codeSnippets: question.codeSnippets,
            stats: question.stats,
            hints: question.hints || [],
            similarQuestions: question.similarQuestions || '[]',
            exampleTestcases: question.exampleTestcases || '',
            companyTags: [],
            acRate: acRate
        };
    }

    /**
     * Convert HTML content to Markdown (basic conversion)
     */
    htmlToMarkdown(html: string): string {
        let markdown = html;

        // Remove style tags
        markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Convert paragraphs
        markdown = markdown.replace(/<p[^>]*>/gi, '\n');
        markdown = markdown.replace(/<\/p>/gi, '\n');

        // Convert strong/bold
        markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

        // Convert emphasis/italic
        markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

        // Convert code
        markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

        // Convert pre blocks
        markdown = markdown.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, code) => {
            return '\n```\n' + code.replace(/<[^>]+>/g, '') + '\n```\n';
        });

        // Convert lists
        markdown = markdown.replace(/<ul[^>]*>/gi, '\n');
        markdown = markdown.replace(/<\/ul>/gi, '\n');
        markdown = markdown.replace(/<ol[^>]*>/gi, '\n');
        markdown = markdown.replace(/<\/ol>/gi, '\n');
        markdown = markdown.replace(/<li[^>]*>/gi, '- ');
        markdown = markdown.replace(/<\/li>/gi, '\n');

        // Convert links
        markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

        // Convert headers
        markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
        markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
        markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
        markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');

        // Convert sup tags (for superscript)
        markdown = markdown.replace(/<sup[^>]*>(.*?)<\/sup>/gi, '^$1^');

        // Remove remaining HTML tags
        markdown = markdown.replace(/<[^>]+>/g, '');

        // Decode HTML entities
        markdown = markdown.replace(/&nbsp;/g, ' ');
        markdown = markdown.replace(/&lt;/g, '<');
        markdown = markdown.replace(/&gt;/g, '>');
        markdown = markdown.replace(/&amp;/g, '&');
        markdown = markdown.replace(/&quot;/g, '"');
        markdown = markdown.replace(/&#39;/g, "'");

        // Clean up multiple newlines
        markdown = markdown.replace(/\n{3,}/g, '\n\n');

        return markdown.trim();
    }

    /**
     * Generate Obsidian note content with frontmatter
     */
    generateNote(problem: LeetCodeProblem, url: string): string {
        const frontmatter = [
            '---',
            `title: "${problem.title}"`,
            `leetcode_id: ${problem.questionFrontendId}`,
            `difficulty: ${problem.difficulty}`,
            `tags: [${problem.topicTags.map(tag => `"${tag}"`).join(', ')}]`,
            `acceptance_rate: ${problem.acRate.toFixed(2)}%`,
            `url: "${url}"`,
            `date_created: ${new Date().toISOString().split('T')[0]}`,
            `status: "todo"`,
            `done: false`,
            `time_taken_min: 0`,
            `num_tries: 0`,
            '---',
            ''
        ].join('\n');

        const contentMarkdown = this.htmlToMarkdown(problem.content);

        const sections = [
            `# ${problem.questionFrontendId}. ${problem.title}`,
            '',
            '## Problem Description',
            '',
            contentMarkdown,
            ''
        ];

        // Add hints if available
        if (problem.hints && problem.hints.length > 0) {
            sections.push('## Hints');
            sections.push('');
            problem.hints.forEach((hint, index) => {
                sections.push(`${index + 1}. ${hint}`);
            });
            sections.push('');
        }

        // Add code template section
        sections.push('## Solution');
        sections.push('');
        sections.push('### Approach');
        sections.push('');
        sections.push('<!-- Describe your approach here -->');
        sections.push('');
        sections.push('### Complexity Analysis');
        sections.push('');
        sections.push('- Time Complexity: ');
        sections.push('- Space Complexity: ');
        sections.push('');
        sections.push('### Code');
        sections.push('');

        // Add Python code snippet
        const pythonSnippet = problem.codeSnippets.find(snippet => snippet.langSlug === 'python3');
        if (pythonSnippet) {
            sections.push('```python');
            sections.push(pythonSnippet.code);
            sections.push('```');
            sections.push('');
        }

        sections.push('## Notes');
        sections.push('');
        sections.push('<!-- Add your notes here -->');
        sections.push('');

        return frontmatter + sections.join('\n');
    }
}
