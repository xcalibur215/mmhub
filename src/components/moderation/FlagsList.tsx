import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Flag {
  id: number;
  target_type: string;
  target_id: number;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  notes?: string | null;
  created_by: number;
  resolved_by?: number | null;
  created_at: string;
  resolved_at?: string | null;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

const FlagsList: React.FC = () => {
  const { accessToken } = useAuth();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = async () => {
    if (!accessToken) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/moderation/flags?status=open`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error(`Failed to fetch flags (${res.status})`);
      const data: Flag[] = await res.json();
      setFlags(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally { setLoading(false); }
  };

  useEffect(() => { void fetchFlags(); }, [accessToken]);

  const resolve = async (flag: Flag, status: 'resolved'|'dismissed') => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_BASE}/moderation/flags/${flag.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`Failed to update flag (${res.status})`);
      setFlags(flags.filter(f => f.id !== flag.id));
    } catch (e: any) {
      setError(e.message || 'Update failed');
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading flags…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flagged Items</CardTitle>
        <CardDescription>Open flags raised by users</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {flags.length === 0 && <p className="text-sm text-muted-foreground">No open flags.</p>}
        {flags.map(flag => (
          <div key={flag.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <div className="font-medium">{flag.target_type} #{flag.target_id}</div>
              <div className="text-sm text-muted-foreground">Reason: {flag.reason}</div>
              <div className="text-xs text-muted-foreground">Created: {new Date(flag.created_at).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-800 capitalize">{flag.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => void resolve(flag, 'dismissed')}>Dismiss</Button>
              <Button size="sm" onClick={() => void resolve(flag, 'resolved')}>Resolve</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FlagsList;
