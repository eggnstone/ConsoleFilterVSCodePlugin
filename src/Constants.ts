export class Constants
{
    private static readonly DEBUG = false;

    static readonly DEBUG_STARTUP = Constants.DEBUG && false;

    // ANSI color code base
    private static readonly ANSI_PREFIX = "\x1b[";
    private static readonly ANSI_RESET = "0m";

    // ANSI color numbers
    private static readonly COLOR_RED_NUM = "31m";
    private static readonly COLOR_ORANGE_NUM = "33m";
    private static readonly COLOR_BLUE_NUM = "1m";
    private static readonly COLOR_WHITE_NUM = "37m";
    private static readonly COLOR_GRAY_NUM = "90m";

    // Complete ANSI color codes
    static readonly COLOR_RED = Constants.ANSI_PREFIX + Constants.COLOR_RED_NUM;
    static readonly COLOR_ORANGE = Constants.ANSI_PREFIX + Constants.COLOR_ORANGE_NUM;
    static readonly COLOR_BLUE = Constants.ANSI_PREFIX + Constants.COLOR_BLUE_NUM;
    static readonly COLOR_WHITE = Constants.ANSI_PREFIX + Constants.COLOR_WHITE_NUM;
    static readonly COLOR_GRAY = Constants.ANSI_PREFIX + Constants.COLOR_GRAY_NUM;
    static readonly COLOR_RESET = Constants.ANSI_PREFIX + Constants.ANSI_RESET;
}
