import { createClient } from '@supabase/supabase-js'
import type { Handler } from '@netlify/functions'

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://walnut-floks.netlify.app',
    'Access-Control-Allow-Headers':
        'authorization, x-client-info, apikey, content-type',
}

type ChartRow = {
    time: string
    avgDuration: number
    calls: number
}

type RequestBody = {
    action?: 'get' | 'save'
    email?: string
    chart_data?: unknown
}

// Validates that chart_data is an array of the expected shape
function validateChartData(data: unknown): data is ChartRow[] {
    if (!Array.isArray(data)) return false
    if (data.length === 0) return false
    if (data.length > 100) return false // cap rows
    return data.every(
        (row) =>
            row !== null &&
            typeof row === 'object' &&
            typeof (row as ChartRow).time === 'string' &&
            (row as ChartRow).time.length <= 50 &&
            typeof (row as ChartRow).avgDuration === 'number' &&
            Number.isFinite((row as ChartRow).avgDuration) &&
            (row as ChartRow).avgDuration >= 0 &&
            (row as ChartRow).avgDuration <= 100000 &&
            typeof (row as ChartRow).calls === 'number' &&
            Number.isFinite((row as ChartRow).calls) &&
            (row as ChartRow).calls >= 0 &&
            (row as ChartRow).calls <= 1000000
    )
}

// Validates email format (basic)
function validateEmail(email: string): boolean {
    return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(email)
}

export const handler: Handler = async (event) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: 'ok',
        }
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.error('[api] Missing Supabase configuration. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.')
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Server configuration error' }),
            }
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false },
        })

        let body: RequestBody = {}
        try {
            body = event.body ? JSON.parse(event.body) : {}
        } catch {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Invalid JSON body' }),
            }
        }

        const { action, email, chart_data } = body

        // Validate email
        if (!email || typeof email !== 'string' || !validateEmail(email)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'A valid email is required' }),
            }
        }

        if (action === 'get') {
            const { data, error } = await supabase
                .from('call_duration_overrides')
                .select('*')
                .eq('email', email)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('[api] get error:', error)
                return {
                    statusCode: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Failed to retrieve data' }),
                }
            }

            return {
                statusCode: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({ data }),
            }
        }

        if (action === 'save') {
            // Validate chart_data shape before storing
            if (!validateChartData(chart_data)) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        error: 'Invalid chart_data: must be a non-empty array of { time: string, avgDuration: number, calls: number }',
                    }),
                }
            }

            const { error } = await supabase
                .from('call_duration_overrides')
                .upsert({ email, chart_data }, { onConflict: 'email' })

            if (error) {
                console.error('[api] save error:', error)
                return {
                    statusCode: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Failed to save data' }),
                }
            }

            return {
                statusCode: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({ success: true }),
            }
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Invalid action. Use "get" or "save".' }),
        }
    } catch (err: unknown) {
        // Never leak internal error messages to the client
        console.error('[api] Unhandled error:', err)
        return {
            statusCode: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal server error' }),
        }
    }
}