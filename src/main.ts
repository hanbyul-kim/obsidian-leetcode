import { Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, LeetCodePluginSettings, LeetCodeSettingTab } from "./settings";
import { LeetCodeModal } from "./modal";

export default class LeetCodePlugin extends Plugin {
	settings: LeetCodePluginSettings;

	async onload() {
		await this.loadSettings();

		// Add ribbon icon for quick access
		// eslint-disable-next-line obsidianmd/ui/sentence-case
		this.addRibbonIcon('code', 'Import LeetCode problem', () => {
			this.openImportModal();
		});

		// Add command to import LeetCode problem
		this.addCommand({
			id: 'import-leetcode-problem',
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			name: 'Import LeetCode problem',
			callback: () => {
				this.openImportModal();
			}
		});

		// Add settings tab
		this.addSettingTab(new LeetCodeSettingTab(this.app, this));
	}

	onunload() {
		// Cleanup if needed
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<LeetCodePluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private openImportModal() {
		new LeetCodeModal(
			this.app,
			this.settings.folderPath,
			(content: string, filename: string) => {
				void this.createNote(content, filename);
			}
		).open();
	}

	private async createNote(content: string, filename: string) {
		try {
			// Ensure the folder exists
			const folderPath = this.settings.folderPath;
			await this.ensureFolderExists(folderPath);

			// Create the full path
			const filePath = `${folderPath}/${filename}`;

			// Check if file already exists
			const existingFile = this.app.vault.getAbstractFileByPath(filePath);
			if (existingFile) {
				new Notice(`File already exists: ${filename}`);
				return;
			}

			// Create the file
			const file = await this.app.vault.create(filePath, content);

			// Open the file
			await this.app.workspace.getLeaf(false).openFile(file);

			new Notice(`Created: ${filename}`);
		} catch (error) {
			console.error('Error creating note:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			new Notice(`Failed to create note: ${errorMessage}`);
		}
	}

	private async ensureFolderExists(folderPath: string) {
		const folders = folderPath.split('/');
		let currentPath = '';

		for (const folder of folders) {
			currentPath = currentPath ? `${currentPath}/${folder}` : folder;
			const existingFolder = this.app.vault.getAbstractFileByPath(currentPath);

			if (!existingFolder) {
				await this.app.vault.createFolder(currentPath);
			}
		}
	}
}
