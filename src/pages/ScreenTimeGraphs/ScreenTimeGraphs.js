import styles from './ScreenTime.module.css';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ScatterChart,
    Scatter,
    BarChart,
    Bar,
    Legend
} from "recharts";

const emojis = [
    { id: 1, symbol: "😢", label: "Terrible" },
    { id: 2, symbol: "😟", label: "Bad" },
    { id: 3, symbol: "😐", label: "Okay" },
    { id: 4, symbol: "😊", label: "Good" },
    { id: 5, symbol: "😄", label: "Great" },
];

export default function ScreenTimeGraphs() {
    const { user } = useAuthContext();
    const { documents, isLoading, error } = useCollection(
        'screentime',
        ["uid", "==", user.uid],
        ["createdAt", "desc"]
    );

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {error.message}</p>;
    if (!documents || documents.length === 0) return <p>No records to display.</p>;

    const parsedDocuments = documents.map(doc => ({
        ...doc,
        amount: parseFloat(doc.amount),
    }));

    const sortedDocumentsByAmount = [...parsedDocuments].sort((a, b) => a.amount - b.amount);

    const jitteredData = sortedDocumentsByAmount.map(doc => ({
        ...doc,
        amount: doc.amount + (Math.random() - 0.5) * 0.1
    }));

    const formatYAxisTick = (value) => {
        const emoji = emojis.find((e) => e.id === value);
        return emoji ? emoji.symbol : value;
    };

    const aggregateData = (key) => {
        const map = {};
        parsedDocuments.forEach(doc => {
            const id = doc[key];
            if (!map[id]) map[id] = { total: 0, count: 0 };
            map[id].total += doc.amount;
            map[id].count++;
        });
        return Object.keys(map).map(id => {
            const emoji = emojis.find(e => e.id == id);
            return {
                [key]: emoji?.symbol,
                averageAmount: map[id].total / map[id].count
            };
        });
    };

    const moodData = aggregateData("positiveActivation");
    const sleepData = aggregateData("sleepQuality");

    const tooltipStyle = {
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        borderColor: "#ccc"
    };

    return (
        <>
            <div className={styles.chartWrapper}>
                <p className={styles.chartTitle}>Screentime vs Mood</p>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis 
                            dataKey="amount" 
                            name="Screen Time" 
                            unit="h"
                            stroke="#444"
                            type="number"
                        />
                        <YAxis 
                            dataKey="positiveActivation"
                            name="Mood"
                            domain={[1, 5]}
                            type="number"
                            tickFormatter={formatYAxisTick}
                            stroke="#444"
                        />
                        <Scatter data={jitteredData} fill="#FF6B6B" r={5} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <p className={styles.chartTitle}>Screentime vs Sleep Quality</p>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis 
                            dataKey="amount" 
                            name="Screen Time"
                            unit="h"
                            stroke="#444"
                            type="number"
                        />
                        <YAxis 
                            dataKey="sleepQuality"
                            name="Sleep Quality"
                            domain={[1, 5]}
                            type="number"
                            tickFormatter={formatYAxisTick}
                            stroke="#444"
                        />
                        <Scatter data={jitteredData} fill="#4D96FF" r={5} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <p className={styles.chartTitle}>Mood vs Avg Screentime</p>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="positiveActivation" />
                        <YAxis />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar dataKey="averageAmount" fill="#FFB74D" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <p className={styles.chartTitle}>Sleep Quality vs Avg Screentime</p>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={sleepData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="sleepQuality" />
                        <YAxis />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar dataKey="averageAmount" fill="#4FC3F7" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
