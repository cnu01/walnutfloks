import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentData: any[];
    onSave: (newData: any[]) => void;
}

export const EditDataModal: React.FC<Props> = ({ isOpen, onClose, currentData, onSave }) => {
    const [step, setStep] = useState<'email' | 'confirm_overwrite' | 'edit'>('email');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Local copy for editing
    const [editData, setEditData] = useState<any[]>(currentData);

    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get', email })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Server error');
            }

            const { data } = await res.json();

            if (data) {
                setStep('confirm_overwrite');
            } else {
                setStep('edit');
            }
        } catch (err: any) {
            setError(err.message || 'Error checking for existing data');
        } finally {
            setLoading(false);
        }
    };

    const handleDataChange = (index: number, field: string, value: string) => {
        const newData = [...editData];
        newData[index] = { ...newData[index], [field]: Number(value) };
        setEditData(newData);
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'save', email, chart_data: editData })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Server error');
            }

            onSave(editData);
            onClose();
            setTimeout(() => setStep('email'), 300);
        } catch (err: any) {
            setError(err.message || 'Failed to save data via Edge Function.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dialog-overlay">
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="glass-panel-title">Edit Chart Data</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', color: 'var(--accent-red)', marginBottom: '1.5rem' }}>
                        <AlertTriangle size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                        {error}
                    </div>
                )}

                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit}>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            Please enter your email to save and retrieve your custom chart configurations securely.
                        </p>
                        <input
                            type="email"
                            className="input-glass"
                            placeholder="you@company.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{ marginBottom: '1.5rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Checking...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                )}

                {step === 'confirm_overwrite' && (
                    <div>
                        <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                            <AlertTriangle size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                            <h3>Existing Data Found</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                We found existing custom data saved for <strong>{email}</strong>. Entering new values will overwrite your previous configuration. Is it OK to proceed?
                            </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-outline" onClick={() => setStep('email')}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => setStep('edit')}>Yes, Overwrite</button>
                        </div>
                    </div>
                )}

                {step === 'edit' && (
                    <div>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Modifying data for: <strong>{email}</strong>. Update the averages and durations below.
                        </p>

                        <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                            {editData.map((row, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                                    <span style={{ fontWeight: 500 }}>{row.time}</span>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Avg Duration</label>
                                        <input type="number" className="input-glass" style={{ padding: '0.4rem 0.75rem' }} value={row.avgDuration} onChange={e => handleDataChange(i, 'avgDuration', e.target.value)} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Call Volume</label>
                                        <input type="number" className="input-glass" style={{ padding: '0.4rem 0.75rem' }} value={row.calls} onChange={e => handleDataChange(i, 'calls', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                                <Save size={16} style={{ marginRight: '6px' }} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
