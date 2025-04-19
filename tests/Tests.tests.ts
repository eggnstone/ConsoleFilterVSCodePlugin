import { describe, it, expect } from "@jest/globals";
import { RegExTools } from "./RegExTools";

describe("RegEx Tests", () => {
    it("Positive test with simple text", () => {
        const s = "E/Abcdef";
        const pattern = "Abc";

        const result = RegExTools.matches(s, pattern);
        expect(result).toBe(true);
    });

    it("Positive test with real pattern", () => {
        const s = "E/Abcdef";
        const pattern = "^./Abc";

        const result = RegExTools.matches(s, pattern);
        expect(result).toBe(true);
    });

    it("Negative test 1", () => {
        const s = "Abcdef";
        const pattern = "^./Abc";

        const result = RegExTools.matches(s, pattern);
        expect(result).toBe(false);
    });

    it("Negative test 2", () => {
        const s = "xAbcdef";
        const pattern = "^./Abc";

        const result = RegExTools.matches(s, pattern);
        expect(result).toBe(false);
    });

    it("Negative test: Pattern must be found at the start of the text", () => {
        const s = "XYZx/Abcdef";
        const pattern = "^./Abc";

        const result = RegExTools.matches(s, pattern);
        expect(result).toBe(false);
    });
});
