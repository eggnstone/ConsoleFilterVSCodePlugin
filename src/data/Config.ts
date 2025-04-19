import { WorkspaceConfiguration } from "vscode";
import { logError } from "../tools/LogTools";

export class Config {
    readonly ignorePatterns: RegExp[] = [];
    readonly patternsByColorMap: Map<string, RegExp[]> = new Map();

    constructor(configuration: WorkspaceConfiguration) {
        const ignorePatterns: any = configuration.get("ignorePatterns");
        if (ignorePatterns && Array.isArray(ignorePatterns)) {
            this.ignorePatterns = ignorePatterns.filter((p) => typeof p === "string").map((pattern) => new RegExp(pattern));
        }

        const patternsByColorMap: any = configuration.get("patternsByColorMap");
        if (patternsByColorMap && typeof patternsByColorMap === "object") {
            for (const [color, patterns] of Object.entries(patternsByColorMap)) {
                if (Array.isArray(patterns) && patterns.every((p) => typeof p === "string")) {
                    this.patternsByColorMap.set(
                        color,
                        patterns.map((pattern) => new RegExp(pattern))
                    );
                }
            }
        }
    }

    static parse(configuration: WorkspaceConfiguration): Config | undefined {
        try {
            return new Config(configuration);
        } catch (e) {
            logError("Error parsing configuration: " + e);
            return undefined;
        }
    }
}
