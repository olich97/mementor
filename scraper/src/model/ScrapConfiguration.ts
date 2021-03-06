export class ScrapConfiguration {
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
     * The pattern to use in order to find meme url
     */
    private _sourceUrlPattern: string;
    public get sourceUrlPattern(): string {
        return this._sourceUrlPattern;
    }
    public set sourceUrlPattern(value: string) {
        this._sourceUrlPattern = value;
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
        targetElementPattern: string,
        textPattern: string,
        sourceUrlPattern: string,
        contentPattern: string,
        contentPatternAttribute: string
    ) {
        this._targetElementPattern = targetElementPattern;
        this._textPattern = textPattern;
        this._sourceUrlPattern = sourceUrlPattern;
        this._contentPattern = contentPattern;
        this._contentPatternAttribute = contentPatternAttribute;
    }
}
