export class RegExTools
{
    static matches(s: string, pattern: string): boolean
    {
        const regex = new RegExp(pattern);
        return regex.test(s);
    }
}
