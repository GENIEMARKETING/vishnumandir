/**
 * Debug API endpoint for CMS connectivity testing
 * 
 * This endpoint tests Strapi CMS connectivity from the deployed frontend server.
 * It can be accessed at /api/debug/cms and returns diagnostic information.
 * 
 * **Note:** This endpoint is intended for development/debugging only.
 * In production, consider protecting this endpoint with authentication.
 */

import { NextResponse } from 'next/server';

interface DiagnosticResult {
  endpoint: string;
  status: 'success' | 'error' | 'no-content';
  httpCode?: number;
  itemCount?: number;
  totalCount?: number;
  error?: string;
  timestamp: string;
  responseTimeMs?: number;
}

interface EnvironmentInfo {
  cms_api_url_set: boolean;
  cms_api_token_set: boolean;
  cms_api_url: string;
}

/**
 * Test a CMS endpoint and return diagnostic information
 */
async function testCmsEndpoint(
  endpoint: string,
  cmsApiUrl: string,
  cmsApiToken: string
): Promise<DiagnosticResult> {
  const startTime = Date.now();

  try {
    const url = new URL(`${cmsApiUrl}/${endpoint}`);
    url.searchParams.append('populate', '*');
    url.searchParams.append('pagination[limit]', '1');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (cmsApiToken) {
      headers['Authorization'] = `Bearer ${cmsApiToken}`;
    }

    // Use AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url.toString(), {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTimeMs = Date.now() - startTime;
    const timestamp = new Date(startTime).toISOString();

    const data = await response.json();

    if (!response.ok) {
      return {
        endpoint,
        status: 'error',
        httpCode: response.status,
        error: data?.error?.message || `HTTP ${response.status}`,
        timestamp,
        responseTimeMs,
      };
    }

    // Check if data structure is correct
    if (!Array.isArray(data?.data)) {
      return {
        endpoint,
        status: 'error',
        httpCode: response.status,
        error: 'Invalid response structure: data is not an array',
        timestamp,
        responseTimeMs,
      };
    }

    const itemCount = data.data.length;
    const totalCount = data?.meta?.pagination?.total || 0;

    if (itemCount === 0 && totalCount === 0) {
      return {
        endpoint,
        status: 'no-content',
        httpCode: response.status,
        itemCount: 0,
        totalCount: 0,
        timestamp,
        responseTimeMs,
      };
    }

    return {
      endpoint,
      status: 'success',
      httpCode: response.status,
      itemCount,
      totalCount,
      timestamp,
      responseTimeMs,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const responseTimeMs = Date.now() - startTime;
    const timestamp = new Date(startTime).toISOString();

    return {
      endpoint,
      status: 'error',
      error: errorMessage,
      timestamp,
      responseTimeMs,
    };
  }
}

/**
 * GET /api/debug/cms
 * Returns CMS connectivity diagnostics
 */
export async function GET() {
  // Check environment variables
  const cmsApiUrl =
    process.env.CMS_API_URL || 'https://cms.vishnumandirtampa.com/api';
  const cmsApiToken = process.env.CMS_API_TOKEN || '';

  const environmentInfo: EnvironmentInfo = {
    cms_api_url_set: !!process.env.CMS_API_URL,
    cms_api_token_set: !!process.env.CMS_API_TOKEN,
    cms_api_url: cmsApiUrl,
  };

  // Test all content type endpoints
  const contentTypes = [
    'events',
    'announcements',
    'newsletters',
    'priests',
    'puja-services',
    'board-members',
    'pages',
  ];

  const diagnosticResults: DiagnosticResult[] = await Promise.all(
    contentTypes.map((contentType) =>
      testCmsEndpoint(contentType, cmsApiUrl, cmsApiToken)
    )
  );

  // Calculate summary
  const summary = {
    total_tests: diagnosticResults.length,
    successful: diagnosticResults.filter((r) => r.status === 'success').length,
    no_content: diagnosticResults.filter((r) => r.status === 'no-content')
      .length,
    errors: diagnosticResults.filter((r) => r.status === 'error').length,
  };

  // Build recommendations
  const recommendations: string[] = [];
  
  // Calculate average response time
  const avgResponseTime = diagnosticResults.reduce((sum, r) => sum + (r.responseTimeMs || 0), 0) / diagnosticResults.length;

  if (summary.errors > 0) {
    const errorResults = diagnosticResults.filter((r) => r.status === 'error');
    const hasAuthErrors = errorResults.some((r) => r.httpCode === 401 || r.httpCode === 403);
    const hasTimeoutErrors = errorResults.some((r) => r.error?.includes('AbortError'));
    
    if (hasAuthErrors) {
      recommendations.push('⚠️ Authentication errors detected (HTTP 401/403)');
      recommendations.push('ACTION: Update CMS_API_TOKEN in Amplify environment variables');
      recommendations.push('Or verify token has Full access permissions in Strapi: Settings → API Tokens → Edit token');
    }
    
    if (hasTimeoutErrors) {
      recommendations.push('⚠️ API timeout detected - CMS server may be unreachable or slow');
      recommendations.push('ACTION: Verify CMS_API_URL is correct and accessible');
      recommendations.push('Check network connectivity and Strapi server status');
    }
    
    if (!hasAuthErrors && !hasTimeoutErrors) {
      recommendations.push('API connectivity issues detected. Verify CMS_API_TOKEN and CMS_API_URL environment variables.');
    }
  }

  if (summary.no_content > 0) {
    recommendations.push(
      'Some content types have no published items. Create test content in Strapi Admin Panel.'
    );
    recommendations.push('Ensure content is PUBLISHED (not just saved as draft).');
  }

  if (summary.successful > 0 && summary.errors === 0) {
    recommendations.push('✓ All API endpoints accessible. Frontend should work correctly.');
    recommendations.push(`Average response time: ${avgResponseTime.toFixed(0)}ms`);
  }

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      environment: environmentInfo,
      summary,
      results: diagnosticResults,
      recommendations,
      frontend_pages: {
        event: [
          '/ (home - featured events)',
          '/calendar/current-events',
          '/education/events (filtered by category)',
        ],
        announcement: ['/ (home)'],
        puja_service: ['/religious/puja-services'],
        priest: ['/religious/priests'],
        newsletter: ['/calendar/newsletter'],
        page: ['Dynamic pages (not currently used)'],
      },
    },
    {
      status: summary.errors > 0 ? 500 : 200,
    }
  );
}
