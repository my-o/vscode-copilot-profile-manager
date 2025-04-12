import * as vscode from 'vscode';

export interface Command {
  getCommandId(): string;
  register(): vscode.Disposable;
}
