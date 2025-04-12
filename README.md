# GitHub Copilot Profile Manager

[English](#english) | [日本語](#日本語)

<a id="english"></a>

## 🌟 Overview

**GitHub Copilot Profile Manager** is a VS Code extension for creating, managing, and switching between GitHub Copilot profiles. This extension enables quick switching of the `github.copilot.chat.codeGeneration.instructions` setting at the user level, allowing you to maintain multiple instruction sets and apply them with a single click.

```
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Your instruction"
    }
  ],
}
```

## ✨ Key Features

- **Create Profiles**: Create custom Copilot profiles for different roles or purposes.
- **Edit Profiles**: Easily modify existing profiles.
- **Apply Profiles**: Apply saved profiles to Copilot with one click.
- **Delete Profiles**: Remove unwanted profiles.
- **Status Bar Integration**: Quick access from VS Code's status bar.

## 📋 How to Use

### Creating a Profile

1. Click the `$(copilot)✨` icon in the status bar.
2. Select "Create Profile".
3. Enter a profile name and description.
4. Edit the profile instructions in the opened editor.
5. Click "Save Profile" in the status bar to save.

### Applying a Profile

1. Click the `$(copilot)✨` icon in the status bar.
2. Select "Apply Profile".
3. Choose the profile you want to apply.

### Editing a Profile

1. Click the `$(copilot)✨` icon in the status bar.
2. Select "Edit Profile".
3. Choose the profile you want to edit.
4. Make your changes in the editor.
5. Click "Save Profile" in the status bar to save.

### Deleting a Profile

1. Click the `$(copilot)✨` icon in the status bar.
2. Select "Delete Profile".
3. Choose the profile you want to delete.
4. Confirm deletion in the dialog.

## 🛠️ Settings

The extension provides the following settings:

- `copilot-profile-manager.logLevel`: Set the logging level ("debug", "info", "warn", "error").

## 🔍 Commands

The following commands are available in the command palette:

- `Copilot Profile Manager: Create Profile`: Create a new profile.
- `Copilot Profile Manager: Edit Profile`: Edit an existing profile.
- `Copilot Profile Manager: Delete Profile`: Delete a profile.
- `Copilot Profile Manager: Apply Profile`: Apply a profile to Copilot.

## 📝 Example Profiles

You can create profiles for various purposes. Here are some examples:

### Code Reviewer Profile

```
You are a code reviewer.
Identify bugs, performance issues, and security risks in code, and suggest improvements.
Focus on code quality and best practices.
```

## 🔗 Related Information

- [GitHub Repository](https://github.com/my-o/vscode-copilot-profile-manager)
- [Report Issues](https://github.com/my-o/vscode-copilot-profile-manager/issues)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=my-o.copilot-profile-manager)

## 📄 License

[MIT](LICENSE)

---

<a id="日本語"></a>

# GitHub Copilot Profile Manager

## 🌟 概要

**GitHub Copilot Profile Manager**は、GitHub Copilot のプロファイルを簡単に作成・管理・切り替えるための VS Code 拡張機能です。この拡張機能は、ユーザーレベルの`github.copilot.chat.codeGeneration.instructions`設定を素早く切り替えることができ、複数の指示セットを管理し、ワンクリックで適用することができます。

```
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "あなたの指示"
    }
  ],
}
```

## ✨ 主な機能

- **プロファイルの作成**: 異なる役割や目的に合わせた Copilot プロファイルを作成できます。
- **プロファイルの編集**: 既存のプロファイルを簡単に編集できます。
- **プロファイルの適用**: ワンクリックで保存済みのプロファイルを Copilot に適用できます。
- **プロファイルの削除**: 不要になったプロファイルを削除できます。
- **ステータスバー統合**: VS Code のステータスバーからすぐにアクセスできます。

## 📋 使い方

### プロファイルの作成

1. ステータスバーの `$(copilot)✨` アイコンをクリックします。
2. 「プロファイルを作成する」を選択します。
3. プロファイル名と説明を入力します。
4. エディタが開くので、プロファイルの指示内容を編集します。
5. ステータスバーの「プロファイルを保存」ボタンをクリックして保存します。

### プロファイルの適用

1. ステータスバーの `$(copilot)✨` アイコンをクリックします。
2. 「プロファイルを適用する」を選択します。
3. 適用したいプロファイルを選択します。

### プロファイルの編集

1. ステータスバーの `$(copilot)✨` アイコンをクリックします。
2. 「プロファイルを編集する」を選択します。
3. 編集したいプロファイルを選択します。
4. エディタが開くので、内容を編集します。
5. ステータスバーの「プロファイルを保存」ボタンをクリックして保存します。

### プロファイルの削除

1. ステータスバーの `$(copilot)✨` アイコンをクリックします。
2. 「プロファイルを削除する」を選択します。
3. 削除したいプロファイルを選択します。
4. 確認ダイアログで「削除する」をクリックします。

## 🛠️ 設定

拡張機能の設定は以下の通りです：

- `copilot-profile-manager.logLevel`: ログの出力レベルを設定します（"debug"、"info"、"warn"、"error"）。

## 🔍 コマンド

以下のコマンドがコマンドパレットから利用できます：

- `Copilot Profile Manager: プロファイルを作成`: 新しいプロファイルを作成します。
- `Copilot Profile Manager: プロファイルを編集`: 既存のプロファイルを編集します。
- `Copilot Profile Manager: プロファイルを削除`: プロファイルを削除します。
- `Copilot Profile Manager: プロファイルを適用`: プロファイルを Copilot に適用します。

## 📝 プロファイル例

様々な目的に合わせたプロファイルを作成できます。以下は例です：

### コードレビュアープロファイル

```
あなたはコードレビュアーです。
コードのバグ、パフォーマンス問題、セキュリティリスクを特定し、改善案を提案してください。
コード品質とベストプラクティスに焦点を当ててください。
```

## 🔗 関連情報

- [GitHub リポジトリ](https://github.com/my-o/vscode-copilot-profile-manager)
- [問題の報告](https://github.com/my-o/vscode-copilot-profile-manager/issues)
- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=my-o.copilot-profile-manager)

## 📄 ライセンス

[MIT](LICENSE)
