import * as vscode from "vscode";
import { Constants } from "./Constants";
import { logDebug } from "./tools/LogTools";

// noinspection JSUnusedGlobalSymbols
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    if (Constants.DEBUG_STARTUP) logDebug("activate START");

    const disposable = filterMessages();
    if (disposable) {
        context.subscriptions.push(disposable);
    }

    if (Constants.DEBUG_STARTUP) logDebug("activate END");
}

// noinspection JSUnusedGlobalSymbols
export async function deactivate(): Promise<void> {}

function filterMessages(): vscode.Disposable | undefined {
    // Get the debug console
    const debugConsole = vscode.debug.activeDebugConsole;
    if (!debugConsole) {
        vscode.window.showErrorMessage("No active debug session");
        return undefined;
    }

    // Subscribe to debug protocol messages
    const disposable = vscode.debug.registerDebugAdapterTrackerFactory("*", {
        createDebugAdapterTracker(session: vscode.DebugSession) {
            return {
                onDidSendMessage: (message: any) => {
                    if (message.type === "event" && message.event === "output") {
                        const colorCode = getColorCode(message.body.output);
                        if (colorCode === undefined) {
                            logDebug("Ignored: " + message.body.output);
                            message.body.output = "";
                        } else {
                            message.body.output = colorCode + message.body.output + Constants.COLOR_RESET;
                        }
                    }
                }
            };
        }
    });

    return disposable;
}

function matches(message: string, pattern: string): boolean {
    const regex = new RegExp(pattern);
    return regex.test(message);
}

const getColorCode = (output: any): string | undefined => {
    if (
        matches(output, "D/EGL_emulation") || //
        matches(output, "E/libEGL") || //
        matches(output, "I/Choreographer") //
    ) {
        return undefined;
    }

    if (matches(output, "Error:")) {
        return Constants.COLOR_RED;
    }

    if (matches(output, "Warn:")) {
        return Constants.COLOR_ORANGE;
    }

    if (matches(output, "Info:")) {
        return Constants.COLOR_BLUE;
    }

    if (matches(output, "Debug:")) {
        return Constants.COLOR_WHITE;
    }

    return Constants.COLOR_GRAY;
};
