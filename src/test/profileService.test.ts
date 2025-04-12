import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { Instruction, Profile } from '../models/profile';
import { ProfileService } from '../services/profileService';
import { Logger } from '../utils/logger';
import { mockContext, sandbox, testSetup, testTeardown } from './testUtil';

suite('ProfileService', () => {
  let profileService: ProfileService;
  let mockLogger: Logger;
  let mockGlobalStateGet: sinon.SinonStub;
  let mockGlobalStateUpdate: sinon.SinonStub;
  let mockConfigUpdate: sinon.SinonStub;
  let mockWorkspaceGetConfiguration: sinon.SinonStub;

  const testProfiles: Profile[] = [
    {
      id: 'test-id-1',
      name: 'Test Profile 1',
      description: 'This is test profile 1',
      instructions: [{ text: 'Test instruction 1' }],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: 'test-id-2',
      name: 'Test Profile 2',
      description: 'This is test profile 2',
      instructions: [{ text: 'Test instruction 2' }],
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2025-01-02'),
    },
  ];

  setup(() => {
    testSetup();

    mockLogger = {
      channel: {
        appendLine: sandbox.stub(),
      } as any,
      currentLogLevel: 'info',
      info: sandbox.stub(),
      warn: sandbox.stub(),
      error: sandbox.stub(),
      debug: sandbox.stub(),
      log: sandbox.stub(),
    } as any;

    mockGlobalStateGet = sandbox.stub();
    mockGlobalStateUpdate = sandbox.stub();
    mockContext.globalState.get = mockGlobalStateGet;
    mockContext.globalState.update = mockGlobalStateUpdate;

    mockConfigUpdate = sandbox.stub();
    mockWorkspaceGetConfiguration = sandbox.stub(vscode.workspace, 'getConfiguration').returns({
      update: mockConfigUpdate,
    } as any);

    profileService = new ProfileService(mockContext, mockLogger);
  });

  teardown(() => {
    testTeardown();
  });

  test('getProfiles - Can retrieve a list of profiles', () => {
    mockGlobalStateGet.returns(testProfiles);

    const result = profileService.getProfiles();

    sinon.assert.calledWith(mockGlobalStateGet, 'copilotProfiles', []);

    assert.deepStrictEqual(result, testProfiles);
  });

  test('getProfile - Can retrieve a profile when providing an existing profile ID', () => {
    mockGlobalStateGet.returns(testProfiles);

    const result = profileService.getProfile('test-id-2');

    assert.deepStrictEqual(result, testProfiles[1]);
  });

  test('getProfile - Returns undefined when providing a non-existent profile ID', () => {
    mockGlobalStateGet.returns(testProfiles);

    const result = profileService.getProfile('non-existent-id');

    assert.strictEqual(result, undefined);
  });

  test('saveProfile - Can save a valid profile data', async () => {
    mockGlobalStateGet.returns([]);
    mockGlobalStateUpdate.resolves();

    const result = await profileService.saveProfile('Test Save Profile', 'Test description', [
      { text: 'Test save instruction' },
    ]);

    const updateCall = mockGlobalStateUpdate.getCall(0);
    const savedProfiles = updateCall.args[1];

    sinon.assert.calledOnce(mockGlobalStateUpdate);
    assert.strictEqual(savedProfiles.length, 1);

    assert.strictEqual(savedProfiles[0].id, result.id);
    assert.strictEqual(savedProfiles[0].name, result.name);
    assert.strictEqual(savedProfiles[0].description, result.description);
    assert.deepStrictEqual(savedProfiles[0].instructions, result.instructions);
    assert.strictEqual(savedProfiles[0].createdAt.getTime(), result.createdAt.getTime());
    assert.strictEqual(savedProfiles[0].updatedAt.getTime(), result.updatedAt.getTime());
  });

  test('saveProfile - Can add a new profile when existing profiles exist', async () => {
    mockGlobalStateGet.returns([...testProfiles]);
    mockGlobalStateUpdate.resolves();

    const result = await profileService.saveProfile('New Added Profile', 'New added description', [
      { text: 'New added instruction' },
    ]);

    const updateCall = mockGlobalStateUpdate.getCall(0);
    const savedProfiles = updateCall.args[1];

    assert.strictEqual(savedProfiles.length, 3);

    assert.ok(savedProfiles.find((p: Profile) => p.id === result.id) !== undefined);
    assert.deepStrictEqual(
      savedProfiles.find((p: Profile) => p.id === 'test-id-1'),
      testProfiles[0]
    );
    assert.deepStrictEqual(
      savedProfiles.find((p: Profile) => p.id === 'test-id-2'),
      testProfiles[1]
    );
  });

  test('saveProfile - Throws an error when name is empty', async () => {
    await assert.rejects(
      async () =>
        await profileService.saveProfile('', 'Test description', [
          { text: 'Test save instruction' },
        ]),
      {
        name: 'ProfileValidationError',
      }
    );
  });

  test('updateProfile - Can update an existing profile', async () => {
    mockGlobalStateGet.returns([...testProfiles]);
    mockGlobalStateUpdate.resolves();

    const updatedProfile: Profile = {
      ...testProfiles[0],
      name: 'Updated Profile Name',
      description: 'Updated description',
      instructions: [{ text: 'Updated instruction' }],
    };

    await profileService.updateProfile(updatedProfile);

    const updateCall = mockGlobalStateUpdate.getCall(0);
    const updatedProfiles = updateCall.args[1];

    sinon.assert.calledOnce(mockGlobalStateUpdate);

    const updatedProfileInStorage = updatedProfiles.find((p: Profile) => p.id === 'test-id-1');
    assert.strictEqual(updatedProfileInStorage.name, 'Updated Profile Name');
    assert.strictEqual(updatedProfileInStorage.description, 'Updated description');
    assert.deepStrictEqual(updatedProfileInStorage.instructions, [{ text: 'Updated instruction' }]);

    const unchangedProfile = updatedProfiles.find((p: Profile) => p.id === 'test-id-2');
    assert.deepStrictEqual(unchangedProfile, testProfiles[1]);
  });

  test('updateProfile - Throws an error when trying to update a non-existent profile', async () => {
    mockGlobalStateGet.returns([...testProfiles]);

    const nonExistentProfile: Profile = {
      id: 'non-existent-id',
      name: 'Non-existent Profile',
      description: 'Description',
      instructions: [{ text: 'Instruction' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await assert.rejects(async () => await profileService.updateProfile(nonExistentProfile), {
      name: 'ProfileNotFoundError',
    });
  });

  test('deleteProfile - Can delete an existing profile', async () => {
    mockGlobalStateGet.returns([...testProfiles]);
    mockGlobalStateUpdate.resolves();

    await profileService.deleteProfile('test-id-1');

    const updateCall = mockGlobalStateUpdate.getCall(0);
    const updatedProfiles = updateCall.args[1];

    sinon.assert.calledOnce(mockGlobalStateUpdate);

    assert.strictEqual(updatedProfiles.length, 1);

    assert.ok(updatedProfiles.find((p: Profile) => p.id === 'test-id-1') === undefined);
    assert.ok(updatedProfiles.find((p: Profile) => p.id === 'test-id-2') !== undefined);
  });

  test('deleteProfile - Throws an error when trying to delete a non-existent profile', async () => {
    mockGlobalStateGet.returns([...testProfiles]);

    await assert.rejects(async () => await profileService.deleteProfile('non-existent-id'), {
      name: 'ProfileNotFoundError',
    });
  });

  test('applyProfile - Can apply an existing profile', async () => {
    mockGlobalStateGet.returns(testProfiles);
    mockConfigUpdate.resolves();

    await profileService.applyProfile('test-id-1');

    sinon.assert.calledOnce(mockWorkspaceGetConfiguration);
    sinon.assert.calledWith(
      mockConfigUpdate,
      'github.copilot.chat.codeGeneration.instructions',
      testProfiles[0].instructions,
      vscode.ConfigurationTarget.Global
    );
  });

  test('applyProfile - Throws an error when trying to apply a non-existent profile', async () => {
    mockGlobalStateGet.returns(testProfiles);

    await assert.rejects(async () => await profileService.applyProfile('non-existent-id'), {
      name: 'ProfileNotFoundError',
    });
  });

  test('applyInstructions - Can apply valid instructions', async () => {
    mockConfigUpdate.resolves();
    const instructions: Instruction[] = [{ text: 'Test instruction' }];

    await profileService.applyInstructions(instructions);

    sinon.assert.calledOnce(mockWorkspaceGetConfiguration);
    sinon.assert.calledWith(
      mockConfigUpdate,
      'codeGeneration.instructions',
      instructions,
      vscode.ConfigurationTarget.Global
    );
  });
});
