const vscode = require('vscode');

const logger = vscode.window.createOutputChannel('Add UseTranslation');
function activate(context) {
  // first command runs on document save, finds all instances of t('common:' and replaces it with t('
  // this is because i18 alloy appends the key with common. and we want to remove it
  let disposable = vscode.workspace.onDidSaveTextDocument((document) => {
    logger.appendLine(`onDidSaveTextDocument: ${document.fileName}`);
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document === document) {
      const configurations = {
        common: {
          find: "t('common" + '.',
          replace: "t('",
        },
      };
      logger.appendLine(`Found ${Object.keys(configurations).length} rule sets`);
      for (let ruleSetKey in configurations) {
        if (configurations.hasOwnProperty(ruleSetKey)) {
          const ruleSet = configurations[ruleSetKey];
          applyReplacement(ruleSet.find, ruleSet.replace);
        }
      }
    }
  });

  // second command adds the import statement and useTranslation hook to the file
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
  context.subscriptions.push(disposable);
}

function applyReplacement(findString, replaceString) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  editor
    .edit((editBuilder) => {
      const doc = editor.document;
      const text = doc.getText();

      // Simple replacement - can be improved to handle regular expressions or more complex scenarios
      const newText = text.split(findString).join(replaceString);
      const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(text.length));
      logger.appendLine(`Replacing ${findString} with ${replaceString}`);

      if (newText !== text) {
        editBuilder.replace(fullRange, newText);
      }
    })
    .then((editApplied) => {
      logger.appendLine(`Edit applied: ${editApplied}`);
      if (editApplied && editor.document.isDirty) {
        editor.document.save();
      }
    });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
