import * as vscode from 'vscode';
import { CommandIds } from '../constants/commandIds';
import { ErrorHandler } from '../errors/errorHandler';
import { logger, profileService } from '../extension';
import {
  extractProfileFromEditor,
  isProfileBeingEdited,
  showEditor,
} from '../interactions/ProfileEditor';
import { extractProfileFromMarkdown } from '../interactions/ProfileParser';
import { showProfileSelector } from '../interactions/ProfileSelector';
import { Command } from '../interfaces/command';
import { Profile } from '../models/profile';

export class EditProfileCommand implements Command {
  private static readonly SAVE_COMMAND_ID = `${CommandIds.EDIT_PROFILE}.save`;
  private static readonly APPLY_COMMAND_ID = `${CommandIds.EDIT_PROFILE}.apply`;

  private static saveButton: vscode.StatusBarItem | undefined;
  private static applyButton: vscode.StatusBarItem | undefined;

  getCommandId(): string {
    return CommandIds.EDIT_PROFILE;
  }

  register(): vscode.Disposable {
    const editCommand = vscode.commands.registerCommand(
      this.getCommandId(),
      async (profileParam?: Profile) => {
        try {
          const profile = profileParam || (await showProfileSelector());
          if (!profile) {
            return;
          }

          await showEditor(profile);
          this.updateButtonVisibility(vscode.window.activeTextEditor);
        } catch (error) {
          ErrorHandler.handleError('EditProfileCommand', error);
        }
      }
    );

    const saveCommand = vscode.commands.registerCommand(
      EditProfileCommand.SAVE_COMMAND_ID,
      async () => {
        const editorData = extractProfileFromEditor();
        if (!editorData) {
          return;
        }

        const { profile, document } = editorData;
        const { name, description, instructions } = extractProfileFromMarkdown(document.getText());

        try {
          const profileToUpdate = profileService.getProfile(profile.id);
          if (!profileToUpdate) {
            logger.warn(`Profile not found: ${profile.id}`);
            vscode.window.showErrorMessage(
              vscode.l10n.t('Profile [{0}] not found. Please create a new one.', name)
            );
            return;
          }

          profileToUpdate.name = name;
          profileToUpdate.description = description;
          profileToUpdate.instructions = instructions;
          profileToUpdate.updatedAt = new Date();
          await profileService.updateProfile(profileToUpdate);

          vscode.window.showInformationMessage(
            vscode.l10n.t('Profile [{0}] has been updated', profileToUpdate.name)
          );
        } catch (error) {
          ErrorHandler.handleError('SaveProfileCommand', error);
        }
      }
    );

    const applyCommand = vscode.commands.registerCommand(
      EditProfileCommand.APPLY_COMMAND_ID,
      async () => {
        try {
          const editorData = extractProfileFromEditor();
          if (!editorData) {
            return;
          }

          const { document } = editorData;
          const { name, instructions } = extractProfileFromMarkdown(document.getText());

          await profileService.applyInstructions(instructions);
          vscode.window.showInformationMessage(
            vscode.l10n.t('Profile [{0}] has been applied', name)
          );
        } catch (error) {
          ErrorHandler.handleError('applyCommand', error);
        }
      }
    );

    const saveButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    saveButton.text = vscode.l10n.t('$(save) Save Profile');
    saveButton.tooltip = vscode.l10n.t('Save the profile being edited');
    saveButton.command = EditProfileCommand.SAVE_COMMAND_ID;
    EditProfileCommand.saveButton = saveButton;

    const applyButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    applyButton.text = vscode.l10n.t('$(zap) Apply Profile');
    applyButton.tooltip = vscode.l10n.t('Apply the profile being edited');
    applyButton.command = EditProfileCommand.APPLY_COMMAND_ID;
    EditProfileCommand.applyButton = applyButton;

    const onDidChangeActiveEditor = vscode.window.onDidChangeActiveTextEditor(editor => {
      this.updateButtonVisibility(editor);
    });

    return new vscode.Disposable(() => {
      editCommand.dispose();
      saveCommand.dispose();
      applyCommand.dispose();
      onDidChangeActiveEditor.dispose();
      EditProfileCommand.saveButton?.dispose();
      EditProfileCommand.applyButton?.dispose();
    });
  }

  private updateButtonVisibility(editor: vscode.TextEditor | undefined): void {
    if (editor && isProfileBeingEdited(editor.document.uri.toString())) {
      EditProfileCommand.applyButton?.show();
      EditProfileCommand.saveButton?.show();
    } else {
      EditProfileCommand.applyButton?.hide();
      EditProfileCommand.saveButton?.hide();
    }
  }
}
