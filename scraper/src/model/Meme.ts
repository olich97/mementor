export class Meme {
    private _text: string;
    private _contentUrl: string;
    private _updateDate: Date;

    private constructor(text: string, contentUrl: string) {
        this._text = text;
        this._contentUrl = contentUrl;
    }

    public static Create(text: string, contentUrl: string): Meme {
        return new Meme(text, contentUrl);
    }

    public Update(text: string, contentUrl: string): void {
        this._text = text;
        this._contentUrl = contentUrl;
        this._updateDate = new Date();
    }
}
