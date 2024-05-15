const vscode = require('vscode');

const logger = vscode.window.createOutputChannel('Add UseTranslation');
function activate(context) {
  let disposableCommand = vscode.commands.registerCommand('extension.addUseTranslation', function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const importStatement = "import { useTranslation } from 'react-i18next';\n";
    const useTranslationStatement = 'const { t } = useTranslation();';

    editor.edit((editBuilder) => {
      // Add import statement at the top of the file
      editBuilder.insert(new vscode.Position(0, 0), importStatement);

      // Insert useTranslation statement at the cursor position
      const position = editor.selection.active;
      editBuilder.insert(position, useTranslationStatement);
    });
  });

  context.subscriptions.push(disposableCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
