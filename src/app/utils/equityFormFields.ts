import { marketCapValues } from "./drop-down/market-cap";

/*
export interface IEquity {
    id: string,
    company_name: string,
    stock_symbol: string,
    stock_name: string,
    stock_sector: string,
    stock_industry: string,
    stock_market_cap: string,
    purchase_price: number,
    sale_price: number,
    profit: number,
    quantity: number,
    purchase_date: string,
    sale_date: string,
    dividend_yield: number,
    earnings_per_share: number,
    revenue: number,
    expenses: number,
    net_income: number,
    market_price: number,
    market_capitalization: number,
    outstanding_shares: number,
    equity_ratio: number,
    debt_ratio: number,
    return_on_equity: number,
    price_to_earnings_ratio: number,
    price_to_sales_ratio: number,
    price_to_book_ratio: number,
    beta: number,
    volatility: number,
    dividend_payout_ratio: number,
} 
  */
export const equityFormFields = [
    { name: 'company_name', label: 'Company Name', type: 'text', validators: [] },
    { name: 'stock_symbol', label: 'Stock Symbol', type: 'text', validators: [] },
    { name: 'stock_name', label: 'Stock Name', type: 'text', validators: [] },
    { name: 'stock_sector', label: 'Stock Sector', type: 'text', validators: [] },
    { name: 'stock_industry', label: 'Stock Industry', type: 'text', validators: [] },
    { name: 'stock_market_cap', label: 'Stock Market Cap', type: 'select', validators: [], options: marketCapValues },
    { name: 'purchase_price', label: 'Purchase Price', type: 'number', validators: [] },
    { name: 'sale_price', label: 'Sale Price', type: 'number', validators: [] },
    { name: 'profit', label: 'Profit', type: 'number', validators: [] },
    { name: 'quantity', label: 'Quantity', type: 'number', validators: [] },
    { name: 'purchase_date', label: 'Purchase Date', type: 'date', validators: [] },
    { name: 'sale_date', label: 'Sale Date', type: 'date', validators: [] },
    { name: 'dividend_yield', label: 'Dividend Yield', type: 'number', validators: [] },
    { name: 'earnings_per_share', label: 'Earnings Per Share', type: 'number', validators: [] },
    { name: 'revenue', label: 'Revenue', type: 'number', validators: [] },
    { name: 'expenses', label: 'Expenses', type: 'number', validators: [] },
    { name: 'net_income', label: 'Net Income', type: 'number', validators: [] },
    { name: 'market_price', label: 'Market Price', type: 'number', validators: [] },
    { name: 'market_capitalization', label: 'Market Capitalization', type: 'number', validators: [] },
    { name: 'outstanding_shares', label: 'Outstanding Shares', type: 'number', validators: [] },
    { name: 'equity_ratio', label: 'Equity Ratio', type: 'number', validators: [] },
    { name: 'debt_ratio', label: 'Debt Ratio', type: 'number', validators: [] },
    { name: 'return_on_equity', label: 'Return On Equity', type: 'number', validators: [] },
    { name: 'price_to_earnings_ratio', label: 'Price To Earnings Ratio', type: 'number', validators: [] },
    { name: 'price_to_sales_ratio', label: 'Price To Sales Ratio', type: 'number', validators: [] },
    { name: 'price_to_book_ratio', label: 'Price To Book Ratio', type: 'number', validators: [] },
    { name: 'beta', label: 'Beta', type: 'number', validators: [] },
    { name: 'volatility', label: 'Volatility', type: 'number', validators: [] },
    { name: 'dividend_payout_ratio', label: 'Dividend Payout Ratio', type: 'number', validators: [] },
];