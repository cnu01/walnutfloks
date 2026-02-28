import { useState } from 'react';
import { EditDataModal } from './components/EditDataModal';
import { CallDurationChart } from './components/charts/CallDurationChart';
import { CallVolumeChart } from './components/charts/CallVolumeChart';
import { SentimentTrendChart } from './components/charts/SentimentTrendChart';
import { SadPathBreakdownChart } from './components/charts/SadPathBreakdownChart';
import { LatencyBreakdownChart } from './components/charts/LatencyBreakdownChart';
import { TaskCompletionChart } from './components/charts/TaskCompletionChart';
import { mockChartData, defaultCallDuration } from './data/mockData';


function App() {
  const [callDurationData, setCallDurationData] = useState(defaultCallDuration);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <main className="container" style={{ padding: '2rem 2rem 4rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
            Analytics <span className="text-gradient">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Comprehensive observability for your voice AI agents.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Main Editable Chart spans full width usually, or top area */}
          <CallDurationChart
            data={callDurationData}
            onEditClick={() => setIsEditModalOpen(true)}
          />

          <CallVolumeChart data={mockChartData.callVolume} />
          <SentimentTrendChart data={mockChartData.sentimentTrend} />
          <LatencyBreakdownChart data={mockChartData.latencyBreakdown} />
          <SadPathBreakdownChart data={mockChartData.sadPathBreakdown} />
          <TaskCompletionChart data={mockChartData.taskCompletion} />
        </div>
      </main>

      <EditDataModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentData={callDurationData}
        onSave={(newData) => setCallDurationData(newData)}
      />
    </>
  );
}

export default App;
