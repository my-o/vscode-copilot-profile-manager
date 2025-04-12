import * as vscode from 'vscode';
import { CommandIds } from '../constants/commandIds';
import { ErrorHandler } from '../errors/errorHandler';
import { profileService } from '../extension';
import { showProfileSelector } from '../interactions/ProfileSelector';
import { Command } from '../interfaces/command';

export class ApplyProfileCommand implements Command {
  getCommandId(): string {
    return CommandIds.APPLY_PROFILE;
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(this.getCommandId(), async () => {
      try {
        const profile = await showProfileSelector();
        if (!profile) {
          return;
        }

        await profileService.applyProfile(profile.id);
        vscode.window.showInformationMessage(
          vscode.l10n.t('Profile [{0}] has been applied', profile.name)
        );
      } catch (error) {
        ErrorHandler.handleError('ApplyProfileCommand', error);
      }
    });
  }
}
