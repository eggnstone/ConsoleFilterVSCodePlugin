export class AnsiColors {
    private static readonly ANSI_PREFIX = "\x1b[";
    private static readonly ANSI_RESET = "0m";

    static readonly COLOR_WHITE = AnsiColors.rgb(255, 255, 255);
    static readonly COLOR_GRAY = AnsiColors.rgb(128, 128, 128);
    static readonly COLOR_RED = AnsiColors.rgb(255, 0, 0);
    static readonly COLOR_GREEN = AnsiColors.rgb(64, 192, 64);
    static readonly COLOR_BLUE = AnsiColors.rgb(128, 160, 255);
    static readonly COLOR_ORANGE = AnsiColors.rgb(255, 128, 0);
    static readonly COLOR_YELLOW = AnsiColors.rgb(255, 255, 0);

    static readonly COLOR_RESET = AnsiColors.ANSI_PREFIX + AnsiColors.ANSI_RESET;

    static rgb(r: number, g: number, b: number): string {
        // Clamp values to valid range
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        return `${AnsiColors.ANSI_PREFIX}38;2;${r};${g};${b}m`;
    }

    static getColorCode(colorText: string): string | undefined {
        // Check if it's a hex color code (e.g. 0xffffff or #ffffff)
        if (colorText.startsWith("0x") || colorText.startsWith("#")) {
            try {
                const hex = colorText.startsWith("0x") ? colorText.substring(2) : colorText.substring(1);
                if (hex.length === 6) {
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
                        return AnsiColors.rgb(r, g, b);
                    }
                }
            } catch {
                return AnsiColors.COLOR_GRAY;
            }
        }

        if (colorText === "red") {
            return AnsiColors.COLOR_RED;
        } else if (colorText === "orange") {
            return AnsiColors.COLOR_ORANGE;
        } else if (colorText === "blue") {
            return AnsiColors.COLOR_BLUE;
        } else if (colorText === "white") {
            return AnsiColors.COLOR_WHITE;
        } else if (colorText === "yellow") {
            return AnsiColors.COLOR_YELLOW;
        } else if (colorText === "green") {
            return AnsiColors.COLOR_GREEN;
        } else {
            return AnsiColors.COLOR_GRAY;
        }
    }
}
