export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  exchangeRate: number; // Rate to USD for conversion
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    exchangeRate: 1.0
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    exchangeRate: 0.85
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    exchangeRate: 0.73
  },
  THB: {
    code: 'THB',
    symbol: '฿',
    name: 'Thai Baht',
    locale: 'th-TH',
    exchangeRate: 35.5
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    exchangeRate: 149.0
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    exchangeRate: 1.35
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
    exchangeRate: 1.53
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    locale: 'en-SG',
    exchangeRate: 1.36
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    locale: 'zh-CN',
    exchangeRate: 7.25
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    exchangeRate: 83.0
  }
};

// Country to currency mapping
export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: 'USD',
  CA: 'CAD',
  GB: 'GBP',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  AT: 'EUR',
  BE: 'EUR',
  TH: 'THB',
  JP: 'JPY',
  AU: 'AUD',
  SG: 'SGD',
  CN: 'CNY',
  IN: 'INR',
  // Add more countries as needed
};

export class CurrencyService {
  private static instance: CurrencyService;
  private currentCurrency: CurrencyInfo = CURRENCIES.USD;
  private userLocation: string | null = null;

  private constructor() {}

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  async detectUserLocation(): Promise<string | null> {
    try {
      // Try to get user's location from IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      this.userLocation = data.country_code;
      
      // Set currency based on country
      const currencyCode = COUNTRY_TO_CURRENCY[data.country_code] || 'USD';
      this.setCurrency(currencyCode);
      
      return data.country_code;
    } catch (error) {
      console.warn('Failed to detect user location, using USD as default:', error);
      this.userLocation = 'US';
      this.setCurrency('USD');
      return 'US';
    }
  }

  setCurrency(currencyCode: string): void {
    const currency = CURRENCIES[currencyCode];
    if (currency) {
      this.currentCurrency = currency;
      localStorage.setItem('mmhub_currency', currencyCode);
    }
  }

  getCurrentCurrency(): CurrencyInfo {
    return this.currentCurrency;
  }

  initializeFromStorage(): void {
    const storedCurrency = localStorage.getItem('mmhub_currency');
    if (storedCurrency && CURRENCIES[storedCurrency]) {
      this.currentCurrency = CURRENCIES[storedCurrency];
    }
  }

  formatPrice(amount: number, options?: Intl.NumberFormatOptions): string {
    const currency = this.getCurrentCurrency();
    
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options
    }).format(amount);
  }

  convertFromUSD(usdAmount: number): number {
    return usdAmount * this.currentCurrency.exchangeRate;
  }

  convertToUSD(localAmount: number): number {
    return localAmount / this.currentCurrency.exchangeRate;
  }

  formatPriceRange(min: number, max: number): string {
    if (min === max) {
      return this.formatPrice(min);
    }
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`;
  }

  getPriceRanges(): { label: string; min: number; max: number }[] {
    const currency = this.getCurrentCurrency();
    const baseRanges = [
      { label: 'Under $500', min: 0, max: 500 },
      { label: '$500 - $1,000', min: 500, max: 1000 },
      { label: '$1,000 - $1,500', min: 1000, max: 1500 },
      { label: '$1,500 - $2,000', min: 1500, max: 2000 },
      { label: '$2,000 - $3,000', min: 2000, max: 3000 },
      { label: '$3,000 - $5,000', min: 3000, max: 5000 },
      { label: '$5,000+', min: 5000, max: 10000 }
    ];

    return baseRanges.map(range => ({
      label: this.formatPriceRange(
        this.convertFromUSD(range.min),
        this.convertFromUSD(range.max)
      ),
      min: Math.round(this.convertFromUSD(range.min)),
      max: Math.round(this.convertFromUSD(range.max))
    }));
  }

  getMaxPrice(): number {
    return Math.round(this.convertFromUSD(10000)); // $10,000 USD max
  }

  getCurrencyList(): CurrencyInfo[] {
    return Object.values(CURRENCIES);
  }
}

// Hook for React components
export const useCurrency = () => {
  const currencyService = CurrencyService.getInstance();
  
  const formatPrice = (amount: number, options?: Intl.NumberFormatOptions) => {
    return currencyService.formatPrice(amount, options);
  };

  const formatPriceRange = (min: number, max: number) => {
    return currencyService.formatPriceRange(min, max);
  };

  const getCurrentCurrency = () => {
    return currencyService.getCurrentCurrency();
  };

  const setCurrency = (currencyCode: string) => {
    currencyService.setCurrency(currencyCode);
  };

  const convertFromUSD = (amount: number) => {
    return currencyService.convertFromUSD(amount);
  };

  const convertToUSD = (amount: number) => {
    return currencyService.convertToUSD(amount);
  };

  const getPriceRanges = () => {
    return currencyService.getPriceRanges();
  };

  const getMaxPrice = () => {
    return currencyService.getMaxPrice();
  };

  const getCurrencyList = () => {
    return currencyService.getCurrencyList();
  };

  return {
    formatPrice,
    formatPriceRange,
    getCurrentCurrency,
    setCurrency,
    convertFromUSD,
    convertToUSD,
    getPriceRanges,
    getMaxPrice,
    getCurrencyList
  };
};

export default CurrencyService;