"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PainDataPoint } from '@/lib/utils-data';

interface PainProgressChartProps {
    data: PainDataPoint[];
    patientName?: string;
}

export function PainProgressChart({ data, patientName }: PainProgressChartProps) {
    if (data.length < 2) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Pain Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                        Need at least 2 visits with VAS scores to show progress graph.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const firstScore = data[0]?.painScore ?? 0;
    const lastScore = data[data.length - 1]?.painScore ?? 0;
    const improvement = firstScore - lastScore;
    const trend = improvement > 0 ? 'improving' : improvement < 0 ? 'worsening' : 'stable';

    const trendColor = trend === 'improving' ? 'text-green-600' : trend === 'worsening' ? 'text-red-600' : 'text-yellow-600';
    const trendIcon = trend === 'improving' ? '📉' : trend === 'worsening' ? '📈' : '➡️';
    const chartColor = trend === 'improving' ? '#22c55e' : trend === 'worsening' ? '#ef4444' : '#eab308';

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Pain Progress {patientName ? `— ${patientName}` : ''}</CardTitle>
                    <div className={`text-sm font-semibold ${trendColor} flex items-center gap-1`}>
                        {trendIcon} {trend === 'improving' ? `Improved by ${improvement} pts` : trend === 'worsening' ? `Worsened by ${Math.abs(improvement)} pts` : 'Stable'}
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">VAS Pain Intensity over {data.length} visits</p>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="formattedDate"
                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                            />
                            <YAxis
                                domain={[0, 10]}
                                ticks={[0, 2, 4, 6, 8, 10]}
                                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                                axisLine={{ stroke: 'hsl(var(--border))' }}
                                label={{ value: 'VAS', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' } }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                }}
                                formatter={(value: number) => [`${value}/10`, 'Pain']}
                                labelFormatter={(label: string) => `Visit: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="painScore"
                                stroke={chartColor}
                                strokeWidth={3}
                                fill="url(#painGradient)"
                                dot={{ r: 5, fill: chartColor, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, fill: chartColor, strokeWidth: 2, stroke: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                    <span>First visit: <strong className="text-foreground">{firstScore}/10</strong></span>
                    <span>Latest: <strong className="text-foreground">{lastScore}/10</strong></span>
                </div>
            </CardContent>
        </Card>
    );
}
