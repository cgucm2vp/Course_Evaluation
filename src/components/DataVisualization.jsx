import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './DataVisualization.css';

function DataVisualization({ stats }) {
    // 準備長條圖數據，包含獨立樣本數
    const barData = [
        {
            name: '甜度',
            value: stats.sweetness,
            count: stats.sweetnessCount,
            fill: 'var(--color-primary)'
        },
        {
            name: '涼度',
            value: stats.coolness,
            count: stats.coolnessCount,
            fill: 'var(--color-secondary)'
        },
        {
            name: '有料程度',
            value: stats.richness,
            count: stats.richnessCount,
            fill: 'var(--color-accent)'
        }
    ];

    return (
        <div className="data-visualization">
            <div className="stats-summary">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-primary-light)' }}>🍭</div>
                    <div className="stat-info">
                        <div className="stat-label">甜度 ({stats.sweetnessCount}人)</div>
                        <div className="stat-value">{stats.sweetness.toFixed(1)} <small>/ 5</small></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-bg-secondary)' }}>❄️</div>
                    <div className="stat-info">
                        <div className="stat-label">涼度 ({stats.coolnessCount}人)</div>
                        <div className="stat-value">{stats.coolness.toFixed(1)} <small>/ 5</small></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-primary-light)', filter: 'hue-rotate(120deg)' }}>📚</div>
                    <div className="stat-info">
                        <div className="stat-label">有料程度 ({stats.richnessCount}人)</div>
                        <div className="stat-value">{stats.richness.toFixed(1)} <small>/ 5</small></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'var(--color-bg-secondary)' }}>👥</div>
                    <div className="stat-info">
                        <div className="stat-label">總評鑑數</div>
                        <div className="stat-value">{stats.sampleCount}</div>
                    </div>
                </div>
            </div>

            <div className="charts-container single-chart">
                <div className="chart-wrapper">
                    <h3 className="chart-title">維度分析 (滿分 5 分)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="var(--color-text-secondary)"
                                tick={{ fontSize: 14 }}
                            />
                            <YAxis
                                domain={[0, 5]}
                                stroke="var(--color-text-secondary)"
                                ticks={[0, 1, 2, 3, 4, 5]}
                            />
                            <Tooltip
                                formatter={(value, name, props) => [`${value.toFixed(1)} 分 (${props.payload.count} 人評價)`, name]}
                                contentStyle={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                barSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="chart-hint">※ 滑鼠移至長條上方可查看各維度獨立樣本數</p>
                </div>
            </div>
        </div>
    );
}

export default DataVisualization;
