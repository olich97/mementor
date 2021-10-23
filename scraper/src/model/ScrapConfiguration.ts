export abstract class ScrapConfiguration {
    /**
     * Complete target url for scrap from
     */
    private _targetUrl: string;
    public get targetUrl(): string {
        return this._targetUrl;
    }
    public set targetUrl(value: string) {
        this._targetUrl = value;
    }

    /**
     * Main html target element
     */
    private _targetElementPattern: string;
    public get targetElementPattern(): string {
        return this._targetElementPattern;
    }
    public set targetElementPattern(value: string) {
        this._targetElementPattern = value;
    }

    /**
     * The pattern to use in order to find meme text or title
     */
    private _textPattern: string;
    public get textPattern(): string {
        return this._textPattern;
    }
    public set textPattern(value: string) {
        this._textPattern = value;
    }

    /**
     * The pattern to use in order to find meme content
     */
    private _contentPattern: string;
    public get contentPattern(): string {
        return this._contentPattern;
    }
    public set contentPattern(value: string) {
        this._contentPattern = value;
    }
    /**
     * The pattern to use for find the content url
     */
    private _contentPatternAttribute: string;
    public get contentPatternAttribute(): string {
        return this._contentPatternAttribute;
    }
    public set contentPatternAttribute(value: string) {
        this._contentPatternAttribute = value;
    }

    public constructor(
        targetUrl: string,
        targetElementPattern: string,
        textPattern: string,
        contentPattern: string,
        contentPatternAttribute: string
    ) {
        this._targetUrl = targetUrl;
        this._targetElementPattern = targetElementPattern;
        this._textPattern = textPattern;
        this._contentPattern = contentPattern;
        this._contentPatternAttribute = contentPatternAttribute;
    }
}
