import {WorkspaceConfiguration} from "vscode";
import {logDebug} from "../tools/LogTools";

export class Config
{
    private readonly ignorePatterns: string[] = [];
    private readonly patternsByColorMap: Map<string, string[]> = new Map();

    private constructor(configuration: WorkspaceConfiguration)
    {
        const ignorePatterns: any = configuration.get("ignorePatterns");
        if (ignorePatterns && Array.isArray(ignorePatterns))
            this.ignorePatterns = ignorePatterns;

        const patternsByColorMap: any = configuration.get("patternsByColorMap");
        if (patternsByColorMap && typeof patternsByColorMap === 'object') {
            for (const [color, patterns] of Object.entries(patternsByColorMap)) {
                if (Array.isArray(patterns)) {
                    this.patternsByColorMap.set(color, patterns as string[]);
                }
            }
        }
    }

    static parse(configuration: WorkspaceConfiguration): Config | undefined
    {
        try
        {
            return new Config(configuration);
        }
        catch (e)
        {
            logDebug("Error parsing configuration: " + e);
            return undefined;
        }
    }
}
