import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { Currency, CURRENCIES, getPreferredCurrency, setPreferredCurrency } from '@/utils/currency';

interface CurrencySelectorProps {
  onCurrencyChange?: (currency: Currency) => void;
}

export const CurrencySelector = ({ onCurrencyChange }: CurrencySelectorProps) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(getPreferredCurrency());

  const handleCurrencyChange = (currency: Currency) => {
    setPreferredCurrency(currency);
    setCurrentCurrency(currency);
    onCurrencyChange?.(currency);
    
    // Forcer le re-render de tous les composants
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency } }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {CURRENCIES[currentCurrency].symbol}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(CURRENCIES).map(([code, currency]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleCurrencyChange(code as Currency)}
            className={currentCurrency === code ? 'bg-accent' : ''}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{currency.symbol}</span>
              <span className="text-sm text-muted-foreground">{currency.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
