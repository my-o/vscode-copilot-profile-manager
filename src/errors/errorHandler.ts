import * as vscode from 'vscode';
import { logger } from '../extension';
import { ProfileError } from './profileErrors';

export class ErrorHandler {
  static handleError(context: string, error: unknown): void {
    ErrorHandler.logError(context, error);
    ErrorHandler.showErrorMessage(error);
  }

  private static logError(context: string, error: unknown): void {
    logger.error(`[${context}] Error occurred`, error);
  }

  private static showErrorMessage(error: unknown): void {
    if (error instanceof ProfileError) {
      vscode.window.showErrorMessage(error.getUserMessage());
    } else {
      vscode.window.showErrorMessage(
        vscode.l10n.t(
          'An unexpected error occurred: {0}',
          error instanceof Error ? error.message : String(error)
        )
      );
    }
  }
}
