"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  distribution: { score: string; quantidade: number }[];
  monthly: { month: string; media: number }[];
  sectorName: string;
}

export function SectorCharts({ distribution, monthly, sectorName }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <figure aria-label={`Distribuição das notas — ${sectorName}`}>
        <figcaption className="mb-1 text-xs font-medium text-slate-600">Distribuição das notas</figcaption>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" /><YAxis allowDecimals={false} /><Tooltip />
            <Bar dataKey="quantidade" name="Avaliações" fill="#1d5bc4" />
          </BarChart>
        </ResponsiveContainer>
      </figure>
      <figure aria-label={`Evolução mensal — ${sectorName}`}>
        <figcaption className="mb-1 text-xs font-medium text-slate-600">Evolução mensal da média</figcaption>
        {monthly.length === 0 ? <p className="py-16 text-center text-sm text-slate-500">Sem dados no período.</p> : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" /><YAxis domain={[1, 5]} /><Tooltip /><Legend />
              <Line type="monotone" dataKey="media" name="Média" stroke="#0f766e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </figure>
    </div>
  );
}
