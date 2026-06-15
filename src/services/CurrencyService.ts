const BASE_URL = 'https://open.er-api.com/v6/latest/EUR';

export interface ExchangeRates {
  USD: number;
  GBP: number;
  JPY: number;
}

export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Error fetching exchange rates');
  const data = await response.json();
  return {
    USD: data.rates.USD,
    GBP: data.rates.GBP,
    JPY: data.rates.JPY,
  };
};

export const convertAmount = (amount: number, rate: number): number => {
  return parseFloat((amount * rate).toFixed(2));
};