export type Comparison = {
    id: number;
    fieldA: string;
    operator: '>' | '<' | '=';
    fieldB?: string;
    value?: string | number | null;
    useValue: boolean;
  };
  
  export type FindRow = {
    StockAnalysisId?: number;
    StockAnalysis_Id?: number;
    Id?: number;
    Symbol: string;
    Sector?: string;
    Exchange?: string;
    Country?: string;
    TradeDate?: string;
    HighOpenRation?: string;
    OpenPrice?: number;
    HighPrice?: number;
    LowPrice?: number;
    ClosePrice?: number;
    Volume?: number;
  
    VwapPM?: number;
    YesterdayVolume?: number;
    MinSMAOpen1005?: number;
    Day10AverageVolume?: number;
    VolHODPM?: number;
    VOLCLOSEPM?: number;
    SMA10?: number;
    EMA10?: number;
    Volume935?: number;
    Volume940?: number;
    Volume945?: number;
    Volume10?: number;
    Volume1030?: number;
    RSI10?: number;
    SmaHod1005?: number;
    EmaOpen1005?: number;
    ATR10?: number;
    YesterdayClose?: number;
    RVOL10?: number;
  
    PremarketVolume?: number;
    FloatShares?: number;
    MarketCap?: number;
    GapPercent?: number;
    VolumeToPremarketRatio?: number;
    PriceBeforeGap?: number;
    EstimatePriceCover50?: number;
    EstimatePriceCover70?: number;
    GapHighPricePercent?: number;
    WinRate?: number;
    TimeHigh?: string;
    TimeLow?: string;
    TimeHighVolume?: string;
  
    DailyDollar?: number;
    PremarketDollar?: number;
    VWAP?: number;
    VolumeFromOpenToHOD?: number;
    VolumeFromHODToClose?: number;
    PreDailyDollarRatio?: number;
    OpenToHODVolumeRatio?: number;
    PreOpenToHODVolumeRatio?: number;
  
    YesterdayHigh?: number;
    TomorrowsHigh?: number;
    PremarketHigh?: number;
    PremarketLow?: number;
    ChangePercent?: number;
  
    ClosedRed?: any;           
    BrokePremarketHigh?: any;  
  };
  
  export type Summary = {
    timeHighBeforeLowCount: number;
    timeLowBeforeHighCount: number;
  };
  
  export type ApiResponse = {
    data: FindRow[];
    summary?: Summary;
  };
  