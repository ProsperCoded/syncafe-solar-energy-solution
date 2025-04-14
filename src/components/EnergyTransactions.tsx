
import React from 'react';
import { useEnergyData } from '@/hooks/useEnergyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, CreditCard } from 'lucide-react';

export const EnergyTransactions = () => {
  const { transactions, profile } = useEnergyData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Energy Sales History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No sales yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your energy sales will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Energy Sold</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                    </TableCell>
                    <TableCell>{transaction.amount} W</TableCell>
                    <TableCell>
                      {profile?.currencySymbol || '$'}{transaction.rate.toFixed(3)}/kWh
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      +{profile?.currencySymbol || '$'}{transaction.earnings.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
