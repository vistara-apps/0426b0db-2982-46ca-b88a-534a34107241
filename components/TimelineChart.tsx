'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendData, ChartDataPoint } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface TimelineChartProps {
  data: TrendData[];
  variant: 'symptom-severity' | 'symptom-frequency';
  height?: number;
}

export function TimelineChart({ data, variant, height = 300 }: TimelineChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return [];

    // Combine all data points and sort by date
    const allPoints: (ChartDataPoint & { symptom: string; color: string })[] = [];
    
    data.forEach(trend => {
      trend.data.forEach(point => {
        allPoints.push({
          ...point,
          symptom: trend.symptom,
          color: trend.color
        });
      });
    });

    // Group by date
    const groupedByDate = allPoints.reduce((acc, point) => {
      const date = point.date;
      if (!acc[date]) {
        acc[date] = { date, total: 0, count: 0 };
      }
      acc[date].total += point.value;
      acc[date].count += 1;
      acc[date][point.symptom] = point.value;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  const formatXAxisLabel = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-textPrimary mb-2">
            {formatXAxisLabel(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-textSecondary">{entry.dataKey}:</span>
              <span className="font-medium text-textPrimary">
                {variant === 'symptom-severity' ? `${entry.value}/3` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data.length || !chartData.length) {
    return (
      <div className="glass-card p-8 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-textPrimary mb-2">No Data Available</h3>
          <p className="text-textSecondary">
            Start logging symptoms to see trends and patterns over time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-textPrimary mb-2">
          {variant === 'symptom-severity' ? 'Symptom Severity Trends' : 'Symptom Frequency'}
        </h3>
        <p className="text-sm text-textSecondary">
          {variant === 'symptom-severity' 
            ? 'Track how your symptom severity changes over time'
            : 'Monitor how often symptoms occur'
          }
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {variant === 'symptom-frequency' ? (
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              {data.map((trend) => (
                <Bar
                  key={trend.symptom}
                  dataKey={trend.symptom}
                  fill={trend.color}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisLabel}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                domain={[0, 3]} 
                ticks={[0, 1, 2, 3]}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              {data.map((trend) => (
                <Line
                  key={trend.symptom}
                  type="monotone"
                  dataKey={trend.symptom}
                  stroke={trend.color}
                  strokeWidth={3}
                  dot={{ fill: trend.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: trend.color, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {data.map((trend) => (
          <div key={trend.symptom} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: trend.color }}
            />
            <span className="text-sm text-textSecondary">{trend.symptom}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
