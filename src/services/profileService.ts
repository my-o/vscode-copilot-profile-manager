import { v4 as uuidv4 } from 'uuid';
import * as vscode from 'vscode';
import {
  ProfileApplicationError,
  ProfileNotFoundError,
  ProfileSaveError,
  ProfileValidationError,
  StorageOperationError,
} from '../errors/profileErrors';
import { Instruction, Profile } from '../models/profile';
import { Logger } from '../utils/logger';

export class ProfileService {
  private context: vscode.ExtensionContext;
  private logger: Logger;

  private static readonly GLOBAL_STATE_PROFILES_KEY = 'copilotProfiles';
  private static readonly COPILOT_CHAT_SECTION = 'github.copilot.chat';
  private static readonly CODE_GENERATION_INSTRUCTIONS_KEY = 'codeGeneration.instructions';

  constructor(context: vscode.ExtensionContext, logger?: Logger) {
    this.context = context;

    if (logger) {
      this.logger = logger;
    } else {
      this.logger = require('../extension').logger;
    }

    this.context.globalState.setKeysForSync([ProfileService.GLOBAL_STATE_PROFILES_KEY]);
    this.logger.info('Enabled cross-device sync for Copilot profiles');
  }

  async saveProfile(
    name: string,
    description: string,
    instructions: Instruction[]
  ): Promise<Profile> {
    try {
      this.validateProfileData(name);

      const newProfile: Profile = {
        id: uuidv4(),
        name: name,
        description: description,
        instructions: instructions,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const profiles = this.getProfiles();
      profiles.push(newProfile);

      await this.updateStorage(profiles, 'saveProfile');
      this.logger.info(`Saved profile "${name}" (ID: ${newProfile.id})`);

      return newProfile;
    } catch (error) {
      if (error instanceof ProfileValidationError) {
        throw error;
      }
      throw new ProfileSaveError(error instanceof Error ? error.message : String(error));
    }
  }

  async updateProfile(profile: Profile): Promise<void> {
    try {
      this.validateProfileData(profile.name);

      const profiles = this.getProfiles();
      const index = profiles.findIndex(p => p.id === profile.id);

      if (index === -1) {
        throw new ProfileNotFoundError(profile.id);
      }

      profile.updatedAt = new Date();
      profiles[index] = profile;

      await this.updateStorage(profiles, 'updateProfile');
      this.logger.info(`Updated profile "${profile.name}" (ID: ${profile.id})`);
    } catch (error) {
      if (error instanceof ProfileNotFoundError || error instanceof ProfileValidationError) {
        throw error;
      }
      throw new ProfileSaveError(error instanceof Error ? error.message : String(error));
    }
  }

  async deleteProfile(profileId: string): Promise<void> {
    try {
      const profiles = this.getProfiles();
      const profileToDelete = profiles.find(p => p.id === profileId);

      if (!profileToDelete) {
        throw new ProfileNotFoundError(profileId);
      }

      const filteredProfiles = profiles.filter(p => p.id !== profileId);

      await this.updateStorage(filteredProfiles, 'deleteProfile');
      this.logger.info(`Deleted profile "${profileToDelete.name}" (ID: ${profileId})`);
    } catch (error) {
      if (error instanceof ProfileNotFoundError) {
        throw error;
      }
      throw new StorageOperationError(
        'deleteProfile',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async applyProfile(profileId: string): Promise<void> {
    try {
      const profile = this.getProfile(profileId);

      if (!profile) {
        throw new ProfileNotFoundError(profileId);
      }

      const config = vscode.workspace.getConfiguration(ProfileService.COPILOT_CHAT_SECTION);
      await config.update(
        ProfileService.CODE_GENERATION_INSTRUCTIONS_KEY,
        profile.instructions,
        vscode.ConfigurationTarget.Global
      );

      this.logger.info(`Applied profile "${profile.name}" (ID: ${profileId})`);
    } catch (error) {
      if (error instanceof ProfileNotFoundError) {
        throw error;
      }
      throw new ProfileApplicationError(
        profileId,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async applyInstructions(instructions: Instruction[]): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration(ProfileService.COPILOT_CHAT_SECTION);
      await config.update(
        ProfileService.CODE_GENERATION_INSTRUCTIONS_KEY,
        instructions,
        vscode.ConfigurationTarget.Global
      );

      this.logger.info(`Applied instructions (count: ${instructions.length})`);
    } catch (error) {
      throw new ProfileApplicationError(
        'applyInstructions',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  getProfiles(): Profile[] {
    try {
      const profiles = this.context.globalState.get<Profile[]>(
        ProfileService.GLOBAL_STATE_PROFILES_KEY,
        []
      );
      return profiles;
    } catch (error) {
      throw new StorageOperationError(
        'getProfiles',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  getProfile(profileId: string): Profile | undefined {
    try {
      const profiles = this.getProfiles();
      const profile = profiles.find(p => p.id === profileId);
      if (!profile) {
        this.logger.warn(`Profile not found with ID: ${profileId}`);
      }
      return profile;
    } catch (error) {
      throw new StorageOperationError(
        'getProfile',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private async updateStorage(profiles: Profile[], operation: string): Promise<void> {
    try {
      await this.context.globalState.update(ProfileService.GLOBAL_STATE_PROFILES_KEY, profiles);
    } catch (error) {
      throw new StorageOperationError(
        operation,
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  private validateProfileData(name: string): void {
    if (!name || name.trim() === '') {
      throw new ProfileValidationError(vscode.l10n.t('Profile name is required'));
    }
  }
}
