import * as vscode from 'vscode';
import { Instruction } from '../models/profile';

export function extractProfileFromMarkdown(editedContent: string): {
  name: string;
  description: string;
  instructions: Instruction[];
} {
  const sections = editedContent.split(/^#\s+/m);

  const nameHeading = vscode.l10n.t('Name');
  const descriptionHeading = vscode.l10n.t('Description');
  const instructionsHeading = vscode.l10n.t('Instructions');

  const nameSection = sections.find(s => s.startsWith(nameHeading));
  const descriptionSection = sections.find(s => s.startsWith(descriptionHeading));
  const instructionsSection = sections.find(s => s.startsWith(instructionsHeading));

  if (!nameSection || !descriptionSection || !instructionsSection) {
    throw new Error(
      vscode.l10n.t('The edited content is not formatted correctly. Do not remove headings.')
    );
  }

  const name = nameSection.replace(`${nameHeading}\n`, '').trim();
  const description = descriptionSection.replace(`${descriptionHeading}\n`, '').trim();
  const instructionsText = instructionsSection.replace(`${instructionsHeading}\n`, '');

  if (name.length === 0) {
    throw new Error(vscode.l10n.t('Profile name is required.'));
  }

  const instructions: Instruction[] = instructionsText
    .split(/\n+/)
    .filter(text => text.trim().length > 0)
    .map(text => ({ text: text.trim() }));

  return { name, description, instructions };
}
