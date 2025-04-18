import * as vscode from "vscode";
import { Constants } from "./Constants";
import { logDebug } from "./tools/LogTools";
import { RegExTools } from "./tools/RegExTools";
import { Config } from "./data/Config";
import { AnsiColors } from "./tools/AnsiColors";

// noinspection JSUnusedGlobalSymbols
export async function activate(context: vscode.ExtensionContext): Promise<void> {
    if (Constants.DEBUG_STARTUP) logDebug("ConsoleFilter.activate START");

    const config = Config.parse(vscode.workspace.getConfiguration("consoleFilter"));

    const disposable = filterMessages(config);
    if (disposable) {
        context.subscriptions.push(disposable);
    }

    if (Constants.DEBUG_STARTUP) logDebug("ConsoleFilter.activate END");
}

// noinspection JSUnusedGlobalSymbols
export async function deactivate(): Promise<void> {}

function filterMessages(config: Config | undefined): vscode.Disposable | undefined {
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

const getColorCode = (output: any): string | undefined => {
    if (        
        RegExTools.matches(output, "Accessing hidden field") || //
        RegExTools.matches(output, "Accessing hidden method") || //
        RegExTools.matches(output, "Background concurrent mark compact GC freed") || //
        RegExTools.matches(output, "^./ApplicationLoaders") || //
        RegExTools.matches(output, "^./AssistStructure") || //
        RegExTools.matches(output, "^./Choreographer") || //
        RegExTools.matches(output, "^./CompatChangeReporter") || //
        RegExTools.matches(output, "^./DynamiteModule") || //
        RegExTools.matches(output, "^./EGL_emulation") || //
        RegExTools.matches(output, "^./EventGDTLogger") || //
        RegExTools.matches(output, "^./FirebaseAuth") || //
        RegExTools.matches(output, "^./FlagRegistrar") || //
        RegExTools.matches(output, "^./GoogleApiManager") || //
        RegExTools.matches(output, "^./ImeTracker") || //
        RegExTools.matches(output, "^./InputConnectionAdaptor") || //
        RegExTools.matches(output, "^./InputMethodManager") || //
        RegExTools.matches(output, "^./InsetsController") || //
        RegExTools.matches(output, "^./InteractionJankMonitor") || //
        RegExTools.matches(output, "^./JobService") || //
        RegExTools.matches(output, "^./NativeCrypto") || //
        RegExTools.matches(output, "^./SessionFirelogPublisher") || //
        RegExTools.matches(output, "^./SessionLifecycleClient") || //
        RegExTools.matches(output, "^./SessionLifecycleService") || //
        RegExTools.matches(output, "^./TrafficStats") || //
        RegExTools.matches(output, "^./TRuntime.CctTransportBackend") || //
        RegExTools.matches(output, "^./WindowOnBackDispatcher") || //
        RegExTools.matches(output, "^./exij") || //
        RegExTools.matches(output, "^./libEGL") || //
        RegExTools.matches(output, "^./nativeloader") //
    ) {
        return undefined;
    }

    if (RegExTools.matches(output, "Error:")) {
        return AnsiColors.COLOR_RED;
    }

    if (RegExTools.matches(output, "Warn:")) {
        return AnsiColors.COLOR_ORANGE;
    }

    if (RegExTools.matches(output, "Info:")) {
        return AnsiColors.COLOR_BLUE;
    }

    if (RegExTools.matches(output, "Debug:")) {
        return AnsiColors.COLOR_WHITE;
    }

    return AnsiColors.COLOR_GRAY;
};
