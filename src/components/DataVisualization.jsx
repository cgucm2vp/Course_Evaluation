import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './DataVisualization.css';

function DataVisualization({ stats }) {
    // 準備長條圖數據
    const barData = [
        { name: '甜度', value: stats.sweetness, fill: 'hsl(340, 82%, 52%)' },
        { name: '涼度', value: stats.coolness, fill: 'hsl(200, 82%, 52%)' },
        { name: '有料程度', value: stats.richness, fill: 'hsl(142, 71%, 45%)' }
    ];

    // 準備雷達圖數據
    const radarData = [
        { subject: '甜度', value: stats.sweetness, fullMark: 10 },
        { subject: '涼度', value: stats.coolness, fullMark: 10 },
        { subject: '有料程度', value: stats.richness, fullMark: 10 }
    ];

    return (
        <div className="data-visualization">
            <div className="stats-summary">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'hsl(340, 82%, 95%)' }}>🍭</div>
                    <div className="stat-info">
                        <div className="stat-label">甜度</div>
                        <div className="stat-value">{stats.sweetness.toFixed(1)}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'hsl(200, 82%, 95%)' }}>❄️</div>
                    <div className="stat-info">
                        <div className="stat-label">涼度</div>
                        <div className="stat-value">{stats.coolness.toFixed(1)}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'hsl(142, 71%, 95%)' }}>📚</div>
                    <div className="stat-info">
                        <div className="stat-label">有料程度</div>
                        <div className="stat-value">{stats.richness.toFixed(1)}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'hsl(280, 70%, 95%)' }}>👥</div>
                    <div className="stat-info">
                        <div className="stat-label">樣本數</div>
                        <div className="stat-value">{stats.sampleCount}</div>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-wrapper">
                    <h3 className="chart-title">長條圖分析</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                            <YAxis domain={[0, 10]} stroke="var(--color-text-secondary)" />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-wrapper">
                    <h3 className="chart-title">雷達圖分析</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="var(--color-border)" />
                            <PolarAngleAxis dataKey="subject" stroke="var(--color-text-secondary)" />
                            <PolarRadiusAxis domain={[0, 10]} stroke="var(--color-text-secondary)" />
                            <Radar
                                name="評分"
                                dataKey="value"
                                stroke="var(--color-primary)"
                                fill="var(--color-primary)"
                                fillOpacity={0.6}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default DataVisualization;
