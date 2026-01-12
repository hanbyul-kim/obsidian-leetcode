import { App, Modal, Notice, Setting, TFolder } from 'obsidian';
import { LeetCodeParser } from './parser';

export class LeetCodeModal extends Modal {
    private url: string = '';
    private parser: LeetCodeParser;
    private folderPath: string;
    private onSubmit: (content: string, filename: string) => void;

    constructor(
        app: App,
        folderPath: string,
        onSubmit: (content: string, filename: string) => void
    ) {
        super(app);
        this.parser = new LeetCodeParser();
        this.folderPath = folderPath;
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.createEl('h2', { text: 'Import LeetCode Problem' });

        new Setting(contentEl)
            .setName('LeetCode URL')
            .setDesc('Enter the LeetCode problem URL (e.g., https://leetcode.com/problems/two-sum/)')
            .addText(text => text
                .setPlaceholder('https://leetcode.com/problems/...')
                .setValue(this.url)
                .onChange(async (value) => {
                    this.url = value;
                })
                .inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.importProblem();
                    }
                })
            );

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Cancel')
                .onClick(() => {
                    this.close();
                }))
            .addButton(btn => btn
                .setButtonText('Import')
                .setCta()
                .onClick(() => {
                    this.importProblem();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    private async importProblem() {
        if (!this.url) {
            new Notice('Please enter a LeetCode URL');
            return;
        }

        // Extract problem slug from URL
        const slug = this.parser.extractSlugFromUrl(this.url);
        if (!slug) {
            new Notice('Invalid LeetCode URL');
            return;
        }

        // Show loading notice
        const loadingNotice = new Notice('Fetching problem from LeetCode...', 0);

        try {
            // Fetch problem data
            const problem = await this.parser.fetchProblem(slug);

            // Generate note content
            const content = this.parser.generateNote(problem, this.url);

            // Create filename: "1. Two Sum.md"
            const filename = `${problem.questionFrontendId}. ${problem.title}.md`;

            // Close loading notice
            loadingNotice.hide();

            // Call the submit callback
            this.onSubmit(content, filename);

            new Notice(`Successfully imported: ${problem.title}`);
            this.close();
        } catch (error) {
            loadingNotice.hide();
            console.error('Error importing LeetCode problem:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            new Notice(`Failed to import problem: ${errorMessage}`);
        }
    }
}
