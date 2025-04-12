import * as vscode from 'vscode';
import { CommandIds } from '../constants/commandIds';
import { ErrorHandler } from '../errors/errorHandler';
import { profileService } from '../extension';
import { Command } from '../interfaces/command';

export class CreateProfileCommand implements Command {
  getCommandId(): string {
    return CommandIds.CREATE_PROFILE;
  }

  register(): vscode.Disposable {
    return vscode.commands.registerCommand(this.getCommandId(), async () => {
      const name = await vscode.window.showInputBox({
        prompt: vscode.l10n.t('Enter profile name'),
        placeHolder: vscode.l10n.t('Example: Code Reviewer, Documentation Writer, Cat...'),
      });
      if (!name) {
        return;
      }

      const description = await vscode.window.showInputBox({
        prompt: vscode.l10n.t('Enter profile description'),
        placeHolder: vscode.l10n.t(
          'Example: Reviews code with focus on performance and best practices'
        ),
      });

      try {
        const newProfile = await profileService.saveProfile(name, description || '', []);

        await vscode.commands.executeCommand(CommandIds.EDIT_PROFILE, newProfile);
        vscode.window.showInformationMessage(vscode.l10n.t('Profile [{0}] has been created', name));
      } catch (error) {
        ErrorHandler.handleError('CreateProfileCommand', error);
      }
    });
  }
}
