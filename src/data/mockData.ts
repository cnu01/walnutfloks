export const mockChartData = {
    callVolume: [
        { day: 'Mon', inbound: 400, outbound: 240 },
        { day: 'Tue', inbound: 300, outbound: 139 },
        { day: 'Wed', inbound: 200, outbound: 980 },
        { day: 'Thu', inbound: 278, outbound: 390 },
        { day: 'Fri', inbound: 189, outbound: 480 },
        { day: 'Sat', inbound: 239, outbound: 380 },
        { day: 'Sun', inbound: 349, outbound: 430 },
    ],
    sentimentTrend: [
        { date: '10/1', positive: 40, neutral: 40, negative: 20 },
        { date: '10/2', positive: 45, neutral: 35, negative: 20 },
        { date: '10/3', positive: 50, neutral: 35, negative: 15 },
        { date: '10/4', positive: 40, neutral: 45, negative: 15 },
        { date: '10/5', positive: 60, neutral: 30, negative: 10 },
    ],
    sadPathBreakdown: [
        { name: 'User refused identity', value: 120 },
        { name: 'Caller Identification', value: 98 },
        { name: 'Incorrect caller identity', value: 86 },
        { name: 'Assistant no Spanish', value: 75 },
        { name: 'Unsupported Language', value: 65 },
        { name: 'Customer Hostility', value: 45 },
        { name: 'Verbal Aggression', value: 20 },
    ],
    latencyBreakdown: [
        { time: '0:00', stt_ms: 100, llm_ms: 400, tts_ms: 200 },
        { time: '0:30', stt_ms: 120, llm_ms: 450, tts_ms: 210 },
        { time: '1:00', stt_ms: 110, llm_ms: 380, tts_ms: 195 },
        { time: '1:30', stt_ms: 105, llm_ms: 420, tts_ms: 205 },
        { time: '2:00', stt_ms: 130, llm_ms: 500, tts_ms: 230 },
    ],
    taskCompletion: [
        { taskName: 'Book Appt', completion: 85 },
        { taskName: 'Reschedule', completion: 70 },
        { taskName: 'Cancel', completion: 90 },
        { taskName: 'Info Request', completion: 60 },
        { taskName: 'Transfer', completion: 75 },
    ]
};

// This one needs to be mutable and loaded dynamically if the user edits it
export const defaultCallDuration = [
    { time: '12am', avgDuration: 120, calls: 40 },
    { time: '2am', avgDuration: 130, calls: 25 },
    { time: '4am', avgDuration: 90, calls: 15 },
    { time: '6am', avgDuration: 150, calls: 50 },
    { time: '8am', avgDuration: 240, calls: 120 },
    { time: '10am', avgDuration: 300, calls: 180 },
    { time: '12pm', avgDuration: 280, calls: 160 },
    { time: '2pm', avgDuration: 310, calls: 190 },
    { time: '4pm', avgDuration: 290, calls: 170 },
    { time: '6pm', avgDuration: 200, calls: 110 },
    { time: '8pm', avgDuration: 160, calls: 70 },
    { time: '10pm', avgDuration: 140, calls: 45 },
];
