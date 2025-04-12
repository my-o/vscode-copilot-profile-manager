import * as vscode from 'vscode';
import { CommandIds } from '../constants/commandIds';
import { ErrorHandler } from '../errors/errorHandler';
import { profileService } from '../extension';
import { showProfileSelector } from '../interactions/ProfileSelector';
import { Command } from '../interfaces/command';

export class DeleteProfileCommand implements Command {
  getCommandId(): string {
    return CommandIds.DELETE_PROFILE;
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(this.getCommandId(), async () => {
      try {
        const profile = await showProfileSelector();
        if (!profile) {
          return;
        }

        const confirmed = await vscode.window.showWarningMessage(
          vscode.l10n.t('Are you sure you want to delete profile [{0}]?', profile.name),
          { modal: true },
          vscode.l10n.t('Delete')
        );
        if (confirmed !== vscode.l10n.t('Delete')) {
          return;
        }

        await profileService.deleteProfile(profile.id);
        vscode.window.showInformationMessage(
          vscode.l10n.t('Profile [{0}] has been deleted', profile.name)
        );
      } catch (error) {
        ErrorHandler.handleError('DeleteProfileCommand', error);
      }
    });
  }
}
