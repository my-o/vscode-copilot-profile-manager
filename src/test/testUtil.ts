import * as sinon from 'sinon';
import * as vscode from 'vscode';

export const sandbox = sinon.createSandbox();

export function createMockContext(): vscode.ExtensionContext {
  return {
    subscriptions: [],
    workspaceState: {
      get: sandbox.stub(),
      update: sandbox.stub(),
      keys: sandbox.stub().returns([]),
    } as any,
    globalState: {
      get: sandbox.stub(),
      update: sandbox.stub(),
      keys: sandbox.stub().returns([]),
    } as any,
    extensionPath: '/path/to/extension',
    asAbsolutePath: relativePath => `/path/to/extension/${relativePath}`,
    storagePath: '/path/to/storage',
    globalStoragePath: '/path/to/global/storage',
    logPath: '/path/to/log',
    extensionUri: vscode.Uri.parse('file:/path/to/extension'),
    environmentVariableCollection: {} as any,
    storageUri: vscode.Uri.parse('file:/path/to/storage'),
    globalStorageUri: vscode.Uri.parse('file:/path/to/global/storage'),
    extensionMode: vscode.ExtensionMode.Test,
    extension: {} as any,
    logUri: vscode.Uri.parse('file:/path/to/log'),
    secrets: {} as any,
    languageModelAccessInformation: {} as any,
  };
}

export function mockVSCodeAPI() {
  sandbox.stub(vscode.window, 'createOutputChannel').returns({
    appendLine: sandbox.stub(),
    clear: sandbox.stub(),
    show: sandbox.stub(),
    dispose: sandbox.stub(),
  } as any);

  sandbox.stub(vscode.window, 'createStatusBarItem').returns({
    text: '',
    tooltip: '',
    command: '',
    show: sandbox.stub(),
    dispose: sandbox.stub(),
  } as any);

  sandbox.stub(vscode.commands, 'registerCommand').returns({ dispose: sandbox.stub() });
}

export let mockContext: vscode.ExtensionContext;

export function testSetup() {
  mockContext = createMockContext();
  mockVSCodeAPI();
}

export function testTeardown() {
  sandbox.restore();
}
