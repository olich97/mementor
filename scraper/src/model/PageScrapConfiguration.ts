import { ScrapConfiguration } from './ScrapConfiguration';

export class PageScrapConfiguration extends ScrapConfiguration {
    private _startPage: number;
    public get startPage(): number {
        return this._startPage;
    }
    public set startPage(value: number) {
        this._startPage = value;
    }

    private _endPage: number;
    public get endPage(): number {
        return this._endPage;
    }
    public set endPage(value: number) {
        this._endPage = value;
    }

    public constructor(
        targetUrl: string,
        targetElementPattern: string,
        textPattern: string,
        contentPattern: string,
        contentPatternAttribute: string,
        startPage: number,
        endPage: number
    ) {
        super(
            targetUrl,
            targetElementPattern,
            textPattern,
            contentPattern,
            contentPatternAttribute
        );
        this._startPage = startPage;
        this._endPage = endPage;
    }
}
