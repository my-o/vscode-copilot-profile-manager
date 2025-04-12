import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { CommandIds } from './constants/commandIds';
import { ProfileService } from './services/profileService';
import { Logger } from './utils/logger';

export let profileService: ProfileService;
export let logger: Logger;

export function activate(context: vscode.ExtensionContext) {
  try {
    initializeLogger(context);
    logger.info('GitHub Copilot Profile Manager has started');

    profileService = new ProfileService(context);

    registerCommands(context);
    createStatusBarItem(context);

    logger.info('Extension initialization completed');
  } catch (error) {
    console.error('Extension activation failed:', error);
    if (logger) {
      logger.error('An error occurred during extension initialization', error);
    }
  }
}

export function deactivate() {
  logger.info('Shutting down GitHub Copilot Profile Manager');
}

function initializeLogger(context: vscode.ExtensionContext): void {
  const outputChannel = vscode.window.createOutputChannel('GitHub Copilot Profile Manager');
  context.subscriptions.push(outputChannel);

  logger = new Logger(outputChannel);
}

function createStatusBarItem(context: vscode.ExtensionContext): void {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  statusBarItem.text = '$(copilot)✨';
  statusBarItem.tooltip = 'GitHub Copilot Profile Manager';
  statusBarItem.command = CommandIds.PROFILE_MENU;
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
}
