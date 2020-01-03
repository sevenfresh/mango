// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { ComponentProvider, Dependency } from "./components";
import { SfCreateSerializer } from "./create";

const { window, commands, ViewColumn, workspace } = vscode;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "sevenfresh" is now active!');
  const componentProvider = new ComponentProvider(workspace.workspaceFolders);
  console.log(workspace.workspaceFolders);
  window.registerTreeDataProvider("component", componentProvider);

  vscode.window.registerWebviewPanelSerializer(
    "create",
    new SfCreateSerializer()
  );

  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  let disposeWebview = commands.registerCommand("sf.create", () => {
    const columnToShowIn = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : undefined;

    if (currentPanel) {
      currentPanel.reveal(columnToShowIn);
    } else {
      currentPanel = window.createWebviewPanel(
        "sevenFreshCreate",
        "SevenFresh Create",
        ViewColumn.One,
        { enableScripts: true }
      );

      currentPanel.onDidDispose(
        () => {
          console.log("------");
        },
        null,
        context.subscriptions
      );

      currentPanel.webview.html = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cat Coding</title>
      </head>
      <body>
          <div>SevenFresh</div>
      </body>
      </html>`;
    }
  });

  context.subscriptions.push(disposeWebview);
}

// this method is called when your extension is deactivated
export function deactivate() {}
