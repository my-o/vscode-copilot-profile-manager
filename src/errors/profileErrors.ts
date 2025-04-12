import * as vscode from 'vscode';

export class ProfileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileError';
    Object.setPrototypeOf(this, ProfileError.prototype);
  }

  getUserMessage(): string {
    return vscode.l10n.t('Profile operation error: {0}', this.message);
  }
}

export class ProfileNotFoundError extends ProfileError {
  constructor(profileId: string) {
    super(`Profile not found. ID: ${profileId}`);
    this.name = 'ProfileNotFoundError';
    Object.setPrototypeOf(this, ProfileNotFoundError.prototype);
  }

  getUserMessage(): string {
    return vscode.l10n.t('The specified profile was not found. It may have been deleted.');
  }
}

export class ProfileSaveError extends ProfileError {
  constructor(message: string) {
    super(`Failed to save profile: ${message}`);
    this.name = 'ProfileSaveError';
    Object.setPrototypeOf(this, ProfileSaveError.prototype);
  }

  getUserMessage(): string {
    return vscode.l10n.t('Failed to save profile: {0}', this.message);
  }
}

export class ProfileApplicationError extends ProfileError {
  constructor(profileId: string, reason: string) {
    super(`Failed to apply profile (ID: ${profileId}): ${reason}`);
    this.name = 'ProfileApplicationError';
    Object.setPrototypeOf(this, ProfileApplicationError.prototype);
  }

  getUserMessage(): string {
    return vscode.l10n.t('Failed to apply profile: {0}', this.message);
  }
}

export class ProfileValidationError extends ProfileError {
  constructor(reason: string) {
    super(`Profile validation failed: ${reason}`);
    this.name = 'ProfileValidationError';
    Object.setPrototypeOf(this, ProfileValidationError.prototype);
  }

  getUserMessage(): string {
    return vscode.l10n.t('Profile validation failed: {0}', this.message);
  }
}

export class StorageOperationError extends ProfileError {
  constructor(operation: string, reason: string) {
    super(`Storage operation [${operation}] failed: ${reason}`);
    this.name = 'StorageOperationError';
    Object.setPrototypeOf(this, StorageOperationError.prototype);
  }

  getUserMessage(): string {
    return vscode.l10n.t('Storage operation failed: {0}', this.message);
  }
}
