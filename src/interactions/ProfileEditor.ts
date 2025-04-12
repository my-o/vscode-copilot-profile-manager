import * as vscode from 'vscode';
import { logger } from '../extension';
import { Profile } from '../models/profile';

const privateScope = (() => {
  const editSessions: Map<
    string,
    {
      profile: Profile;
      document: vscode.TextDocument;
    }
  > = new Map();

  return {
    getEditSession(documentUri: string) {
      return editSessions.get(documentUri);
    },

    setEditSession(
      documentUri: string,
      session: { profile: Profile; document: vscode.TextDocument }
    ) {
      editSessions.set(documentUri, session);
    },

    deleteEditSession(documentUri: string) {
      editSessions.delete(documentUri);
    },

    hasEditSession(documentUri: string) {
      return editSessions.has(documentUri);
    },

    clearAllSessions() {
      editSessions.clear();
    },
  };
})();

export async function showEditor(profile: Profile): Promise<void> {
  const document = await vscode.workspace.openTextDocument({
    content: [
      `# ${vscode.l10n.t('Name')}`,
      profile.name,
      `\n# ${vscode.l10n.t('Description')}`,
      profile.description || '',
      `\n# ${vscode.l10n.t('Instructions')}`,
      profile.instructions.map(instruction => instruction.text).join('\n'),
    ].join('\n'),
    language: 'markdown',
  });

  privateScope.setEditSession(document.uri.toString(), {
    profile,
    document,
  });

  await vscode.window.showTextDocument(document);

  const disposable = vscode.workspace.onDidCloseTextDocument(closedDoc => {
    if (privateScope.hasEditSession(closedDoc.uri.toString())) {
      disposable.dispose();
      privateScope.deleteEditSession(closedDoc.uri.toString());
    }
  });

  vscode.window.showInformationMessage(
    vscode.l10n.t(
      'Edit content under each [#] heading. When finished, click the [Save Profile] in the status bar.'
    )
  );
}

export function extractProfileFromEditor():
  | {
      profile: Profile;
      document: vscode.TextDocument;
    }
  | undefined {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    logger.warn('No active editor');
    vscode.window.showErrorMessage(vscode.l10n.t('No profile to save.'));
    return undefined;
  }

  const editSession = privateScope.getEditSession(activeEditor.document.uri.toString());
  if (!editSession) {
    logger.warn(`No edit session found: ${activeEditor.document.uri.toString()}`);
    vscode.window.showErrorMessage(vscode.l10n.t('No profile to save.'));
    return undefined;
  }

  const { profile, document } = editSession;
  return { profile, document };
}

export function isProfileBeingEdited(documentUri: string): boolean {
  return privateScope.hasEditSession(documentUri);
}

export function clearAllSessions(): void {
  privateScope.clearAllSessions();
}
