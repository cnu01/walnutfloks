import { createClient } from '@supabase/supabase-js'
import type { Handler } from '@netlify/functions'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
        'authorization, x-client-info, apikey, content-type',
}

type RequestBody = {
    action?: 'get' | 'save'
    email?: string
    chart_data?: unknown
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
        const supabaseKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY ||
            process.env.SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase configuration')
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Server configuration error' }),
            }
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const body: RequestBody = event.body
            ? JSON.parse(event.body)
            : {}

        const { action, email, chart_data } = body

        if (!email) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Email is required' }),
            }
        }

        if (action === 'get') {
            const { data, error } = await supabase
                .from('call_duration_overrides')
                .select('*')
                .eq('email', email)
                .single()

            if (error && error.code !== 'PGRST116') {
                throw error
            }

            return {
                statusCode: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            }
        }

        if (action === 'save') {
            const { error } = await supabase
                .from('call_duration_overrides')
                .upsert(
                    { email, chart_data },
                    { onConflict: 'email' }
                )

            if (error) throw error

            return {
                statusCode: 200,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ success: true }),
            }
        }

        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Invalid action provided',
            }),
        }
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : 'Unknown error occurred'

        return {
            statusCode: 400,
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: message }),
        }
    }
}