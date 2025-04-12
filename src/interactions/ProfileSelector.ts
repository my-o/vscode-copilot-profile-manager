import * as vscode from 'vscode';
import { profileService } from '../extension';
import { Profile } from '../models/profile';

export async function showProfileSelector(
  placeHolder: string = vscode.l10n.t('Select a profile')
): Promise<Profile | undefined> {
  const profiles = profileService.getProfiles();

  if (profiles.length === 0) {
    vscode.window.showInformationMessage(
      vscode.l10n.t('No saved profiles found. Please create a profile first.')
    );
    return undefined;
  }

  const picked = await vscode.window.showQuickPick(
    profiles.map(profile => ({
      label: profile.name,
      description: profile.description || '',
      detail: vscode.l10n.t('Last updated: {0}', profile.updatedAt.toLocaleString()),
      profile: profile,
    })),
    {
      placeHolder: placeHolder,
    }
  );

  if (picked) {
    return picked.profile;
  } else {
    return undefined;
  }
}
