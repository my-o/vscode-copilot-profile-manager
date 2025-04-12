import * as vscode from 'vscode';
import { CommandIds } from '../constants/commandIds';
import { ErrorHandler } from '../errors/errorHandler';
import { Command } from '../interfaces/command';

export class ProfileMenuCommand implements Command {
  private readonly options = [
    {
      label: vscode.l10n.t('Apply Profile'),
      description: vscode.l10n.t('Apply a saved profile to GitHub Copilot'),
      command: CommandIds.APPLY_PROFILE,
      iconPath: new vscode.ThemeIcon('check'),
    },
    {
      label: vscode.l10n.t('Create Profile'),
      description: vscode.l10n.t('Create a new GitHub Copilot profile'),
      command: CommandIds.CREATE_PROFILE,
      iconPath: new vscode.ThemeIcon('add'),
    },
    {
      label: vscode.l10n.t('Edit Profile'),
      description: vscode.l10n.t('Modify an existing profile'),
      command: CommandIds.EDIT_PROFILE,
      iconPath: new vscode.ThemeIcon('edit'),
    },
    {
      label: vscode.l10n.t('Delete Profile'),
      description: vscode.l10n.t('Remove unwanted profiles'),
      command: CommandIds.DELETE_PROFILE,
      iconPath: new vscode.ThemeIcon('trash'),
    },
  ];

  getCommandId(): string {
    return CommandIds.PROFILE_MENU;
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(this.getCommandId(), async () => {
      try {
        const selection = await vscode.window.showQuickPick(this.options, {
          placeHolder: vscode.l10n.t('Select a profile operation'),
        });

        if (selection) {
          await vscode.commands.executeCommand(selection.command);
        }
      } catch (error) {
        ErrorHandler.handleError('ProfileMenuCommand', error);
      }
    });
  }
}
