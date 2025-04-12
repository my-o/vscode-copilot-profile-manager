import * as vscode from 'vscode';
import { Command } from '../interfaces/command';
import { ApplyProfileCommand } from './applyProfile';
import { CreateProfileCommand } from './createProfile';
import { DeleteProfileCommand } from './deleteProfile';
import { EditProfileCommand } from './editProfile';
import { ProfileMenuCommand } from './profileMenu';

type CommandConstructor = new () => Command;

export function registerCommands(context: vscode.ExtensionContext): void {
  const commandClasses: CommandConstructor[] = [
    ApplyProfileCommand,
    CreateProfileCommand,
    DeleteProfileCommand,
    EditProfileCommand,
    ProfileMenuCommand,
  ];

  context.subscriptions.push(...commandClasses.map(CommandClass => new CommandClass().register()));
}
