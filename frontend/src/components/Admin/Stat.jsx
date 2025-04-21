import React from 'react';

export default function Stat({ title, value, desc, icon }) {
    return (
        <div className="stats shadow rounded-lg bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white p-4 border-[1px] border-gray-900">
            <div className="stat flex items-center">
                <div className="stat-figure text-4xl mr-4">
                    {icon}
                </div>
                <div>
                    <div className="stat-title text-sm uppercase tracking-wide font-semibold text-gray-400">{title}</div>
                    <div className="stat-value text-2xl font-bold">{value}</div>
                    {desc && <div className="stat-desc text-sm text-gray-500 mt-1">{desc}</div>}
                </div>
            </div>
        </div>
    );
}
