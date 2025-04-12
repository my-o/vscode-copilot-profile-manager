const PREFIX = 'copilot-profile-manager.';

export const CommandIds = {
  CREATE_PROFILE: `${PREFIX}create`,
  EDIT_PROFILE: `${PREFIX}edit`,
  DELETE_PROFILE: `${PREFIX}delete`,
  APPLY_PROFILE: `${PREFIX}apply`,
  PROFILE_MENU: `${PREFIX}menu`,
} as const;
