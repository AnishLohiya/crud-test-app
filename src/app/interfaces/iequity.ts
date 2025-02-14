
export interface IEquity {
    id: string,
    company_name: string,
    stock_symbol: string,
    stock_name: string,
    stock_sector: string,
    stock_industry: string,
    stock_market_cap: string,
    multi_cell: string[],
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