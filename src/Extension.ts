import * as vscode from "vscode";
import { Constants } from "./Constants";
import { logDebug } from "./tools/LogTools";
import { Config } from "./data/Config";
import { AnsiColors } from "./tools/AnsiColors";

let config: Config | undefined;

// noinspection JSUnusedGlobalSymbols
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    if (Constants.DEBUG_EXTENSION) logDebug("ConsoleFilter.activate START");

    config = Config.parse(vscode.workspace.getConfiguration("consoleFilter"));
    if (Constants.DEBUG_EXTENSION) logDebug("  Initialized config.");

    const disposable = filterMessages();
    if (disposable) {
        context.subscriptions.push(disposable);
    }

    // Register configuration change listener
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("consoleFilter")) {
                if (Constants.DEBUG_EXTENSION) logDebug("Workspace configuration changed");
                config = Config.parse(vscode.workspace.getConfiguration("consoleFilter"));
                logDebug("Using updated config.");
            }
        })
    );

    if (Constants.DEBUG_EXTENSION) logDebug("ConsoleFilter.activate END");
}

// noinspection JSUnusedGlobalSymbols
export async function deactivate(): Promise<void> {
    config = undefined;
}

function filterMessages(): vscode.Disposable | undefined {
    const debugConsole = vscode.debug.activeDebugConsole;
    if (!debugConsole) {
        vscode.window.showErrorMessage("No active debug session");
        return undefined;
    }

    const disposable = vscode.debug.registerDebugAdapterTrackerFactory("*", {
        createDebugAdapterTracker() {
            if (Constants.DEBUG_EXTENSION) logDebug("createDebugAdapterTracker");
            return {
                onDidSendMessage: (message: any) => {
                    if (Constants.DEBUG_EXTENSION) logDebug("onDidSendMessage");
                    if (message.type === "event" && message.event === "output" && config) {
                        const colorCode = getColorCode(message.body.output, config);
                        if (colorCode === undefined) {
                            logDebug("Ignored: " + message.body.output.trim());
                            message.body.output = "";
                        } else {
                            message.body.output = colorCode + message.body.output + AnsiColors.COLOR_RESET;
                        }
                    }
                }
            };
        }
    });

    return disposable;
}

function getColorCode(output: any, config: Config): string | undefined {
    for (const ignorePattern of config.ignorePatterns) {
        if (ignorePattern.test(output)) {
            return undefined;
        }
    }

    for (const [colorText, patterns] of config.patternsByColorMap.entries()) {
        for (const pattern of patterns) {
            if (pattern.test(output)) {
                return AnsiColors.getColorCode(colorText);
            }
        }
    }

    return AnsiColors.COLOR_GRAY;
}
