import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { CommandIds } from '../constants/commandIds';
import * as extension from '../extension';
import { ProfileService } from '../services/profileService';
import { mockContext, testSetup, testTeardown } from './testUtil';

suite('Initialize extension', () => {
  setup(() => {
    testSetup();
  });

  teardown(() => {
    testTeardown();
  });

  test('Can activate the extension', async () => {
    await extension.activate(mockContext);

    assert.ok((extension as any).logger, 'logger is not initialized');
    assert.ok(
      (extension as any).profileService instanceof ProfileService,
      'ProfileService is not initialized'
    );
  });

  test('Can register commands', async () => {
    await extension.activate(mockContext);

    [
      CommandIds.CREATE_PROFILE,
      CommandIds.EDIT_PROFILE,
      CommandIds.DELETE_PROFILE,
      CommandIds.APPLY_PROFILE,
      CommandIds.PROFILE_MENU,
    ].forEach(commandId => {
      sinon.assert.calledWith(
        vscode.commands.registerCommand as sinon.SinonStub,
        sinon.match(commandId),
        sinon.match.func
      );
    });
  });

  test('Can create a status bar item', async () => {
    (vscode.window.createStatusBarItem as sinon.SinonStub).reset();

    let statusBarShown = false;
    let statusBarCommand = '';

    (vscode.window.createStatusBarItem as sinon.SinonStub).callsFake(() => {
      return {
        set command(value: string) {
          statusBarCommand = value;
        },
        get command() {
          return statusBarCommand;
        },
        show: () => {
          statusBarShown = true;
        },
        dispose: sinon.stub(),
      };
    });

    await extension.activate(mockContext);

    assert.ok(statusBarShown, 'status bar item is not displayed');
    assert.strictEqual(statusBarCommand, CommandIds.PROFILE_MENU, 'command is not correctly set');
  });
});
