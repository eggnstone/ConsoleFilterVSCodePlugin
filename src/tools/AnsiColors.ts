export class AnsiColors {
    private static readonly ANSI_PREFIX = "\x1b[";
    private static readonly ANSI_RESET = "0m";

    static readonly COLOR_WHITE = AnsiColors.rgb(255, 255, 255);
    static readonly COLOR_GREY = AnsiColors.rgb(128, 128, 128);
    static readonly COLOR_RED = AnsiColors.rgb(255, 0, 0);
    static readonly COLOR_GREEN = AnsiColors.rgb(64, 192, 64);
    static readonly COLOR_BLUE = AnsiColors.rgb(128, 160, 255);
    static readonly COLOR_ORANGE = AnsiColors.rgb(255, 128, 0);

    static readonly COLOR_RESET = AnsiColors.ANSI_PREFIX + AnsiColors.ANSI_RESET;

    static rgb(r: number, g: number, b: number): string {
        // Clamp values to valid range
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        return `${AnsiColors.ANSI_PREFIX}38;2;${r};${g};${b}m`;
    }
}
