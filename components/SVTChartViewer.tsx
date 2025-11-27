import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartContent } from '../types';
import { RefreshCcw } from 'lucide-react';

interface SVTChartViewerProps {
  data: ChartContent;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const SVTChartViewer: React.FC<SVTChartViewerProps> = ({ data, onRegenerate, isRegenerating }) => {
  if (!data || !data.data || data.data.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm my-6 p-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <div>
           <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{data.title}</h4>
           <div className="text-[10px] text-slate-400">Données générées par IA • Vérifier la cohérence</div>
        </div>
        <button 
          onClick={onRegenerate} 
          disabled={isRegenerating}
          className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-50"
          title="Générer un autre graphique si celui-ci est incohérent"
        >
          <RefreshCcw className={`w-4 h-4 ${isRegenerating ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {data.type === 'line' ? (
            <LineChart data={data.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} label={{ value: data.xAxisLabel, position: 'insideBottomRight', offset: -5 }} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: data.yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="value" name={data.yAxisLabel} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : (
            <BarChart data={data.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} label={{ value: data.xAxisLabel, position: 'insideBottomRight', offset: -5 }} />
              <YAxis stroke="#64748b" fontSize={12} label={{ value: data.yAxisLabel, angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" name={data.yAxisLabel} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-xs text-slate-400 italic">
        Analyse de données SVT
      </div>
    </div>
  );
};

export default SVTChartViewer;