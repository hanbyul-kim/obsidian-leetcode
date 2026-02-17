import {App, PluginSettingTab, Setting} from "obsidian";
import LeetCodePlugin from "./main";

export interface LeetCodePluginSettings {
	folderPath: string;
	includeHints: boolean;
	defaultStatus: string;
}

export const DEFAULT_SETTINGS: LeetCodePluginSettings = {
	folderPath: 'LeetCode',
	includeHints: true,
	defaultStatus: 'todo'
}

export class LeetCodeSettingTab extends PluginSettingTab {
	plugin: LeetCodePlugin;

	constructor(app: App, plugin: LeetCodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// eslint-disable-next-line obsidianmd/ui/sentence-case
		new Setting(containerEl).setName('LeetCode plugin').setHeading();

		new Setting(containerEl)
			.setName('Folder path')
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('The folder where LeetCode problems will be saved (default: LeetCode)')
			.addText(text => text
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				.setPlaceholder('LeetCode')
				.setValue(this.plugin.settings.folderPath)
				.onChange(async (value) => {
					this.plugin.settings.folderPath = value || 'LeetCode';
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Include hints')
			.setDesc('Include hints in the generated notes')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeHints)
				.onChange(async (value) => {
					this.plugin.settings.includeHints = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Default status')
			.setDesc('Default status for new problems (e.g., todo, in-progress, completed)')
			.addText(text => text
				.setPlaceholder('Todo')
				.setValue(this.plugin.settings.defaultStatus)
				.onChange(async (value) => {
					this.plugin.settings.defaultStatus = value || 'todo';
					await this.plugin.saveSettings();
				}));
	}
}
