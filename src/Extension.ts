import * as vscode from 'vscode';
import {Constants} from "./Constants";
import {logDebug} from "./tools/LogTools";

// noinspection JSUnusedGlobalSymbols
export async function activate(context: vscode.ExtensionContext): Promise<void>
{
    if (Constants.DEBUG_STARTUP) logDebug("activate START");

    let disposable = vscode.commands.registerCommand("CleanConsole.filterMessages", () => {
        // Create and show a quick pick to select filter options
        const items = [
            {
                label: "Show All Messages",
                description: "Show all debug console messages"
            },
            {
                label: "Hide Info Messages",
                description: "Hide info level messages"
            },
            {
                label: "Hide Warning Messages",
                description: "Hide warning level messages"
            },
            {
                label: "Hide Error Messages",
                description: "Hide error level messages"
            },
            {
                label: "Custom Filter",
                description: "Set a custom filter pattern"
            }
        ];

        vscode.window.showQuickPick(items).then(selection => {
            if (!selection) {
                return;
            }

            switch (selection.label) {
                case "Show All Messages":
                    // Reset any existing filters
                    vscode.commands.executeCommand("workbench.debug.action.clearRepl");
                    break;
                case "Hide Info Messages":
                    // Implement info message filtering
                    filterMessages("info");
                    break;
                case "Hide Warning Messages":
                    // Implement warning message filtering
                    filterMessages("warning");
                    break;
                case "Hide Error Messages":
                    // Implement error message filtering
                    filterMessages("error");
                    break;
                case "Custom Filter":
                    // Prompt for custom filter pattern
                    vscode.window
                        .showInputBox({
                            placeHolder: "Enter filter pattern (regex)",
                            prompt: "Messages matching this pattern will be hidden"
                        })
                        .then(pattern => {
                            if (pattern) {
                                filterMessages("custom", pattern);
                            }
                        });
                    break;
            }
        });
    });

    context.subscriptions.push(disposable);

    if (Constants.DEBUG_STARTUP) logDebug("activate END");
}

// noinspection JSUnusedGlobalSymbols
export async function deactivate(): Promise<void>
{
}

function filterMessages(type: string, pattern?: string) {
    logDebug(`filterMessages(${type}, ${pattern})`);
    
    // Get the debug console
    const debugConsole = vscode.debug.activeDebugConsole;
    if (!debugConsole) {
        vscode.window.showErrorMessage("No active debug session");
        return;
    }

    // Clear the console first
    vscode.commands.executeCommand("workbench.debug.action.clearRepl");

    // Here you would implement the actual filtering logic
    // This is a simplified example - in reality, you would need to:
    // 1. Track the debug protocol messages
    // 2. Filter them based on the selected criteria
    // 3. Only show the filtered messages in the console

    vscode.window.showInformationMessage(`Filtering ${type} messages${pattern ? ` with pattern: ${pattern}` : ""}`);
}
