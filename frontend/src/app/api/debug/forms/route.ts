import { NextResponse } from "next/server";

/**
 * Form Submission Diagnostic Endpoint
 * 
 * Tests form submission setup and backend connectivity.
 * Helps diagnose why form submissions might be failing.
 * 
 * @returns {NextResponse} Diagnostic information
 */
export async function GET() {
  try {
    // Check environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;

    const environmentInfo = {
      nextPublicApiUrlSet: !!apiUrl,
      nextPublicApiKeySet: !!apiKey,
      apiUrl: apiUrl || "not set",
      nodeEnv: process.env.NODE_ENV,
    };

    // Test backend connectivity if API URL is set
    const backendTest = {
      success: false,
      reachable: false,
      statusCode: null as number | null,
      responseTime: 0,
      error: null as string | null,
    };

    if (apiUrl) {
      const startTime = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${apiUrl}/health`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);
        backendTest.responseTime = Date.now() - startTime;
        backendTest.statusCode = response.status;
        backendTest.reachable = true;
        backendTest.success = response.ok;
      } catch (error) {
        backendTest.responseTime = Date.now() - startTime;
        backendTest.error = error instanceof Error ? error.message : "Unknown error";
      }
    }

    // Check form routes
    const formRoutes = [
      "/api/v1/forms/email-subscription",
      "/api/v1/forms/sponsorship",
      "/api/v1/forms/facility-request",
      "/api/v1/forms/donation-statement",
      "/api/v1/forms/change-of-address",
    ];

    // Validate current setup
    const validationResults = {
      hasApiUrl: !!apiUrl,
      hasApiKey: !!apiKey,
      apiUrlValid: apiUrl && apiUrl.startsWith("http"),
      canReachBackend: backendTest.reachable,
      allRequirementsMet: !!apiUrl && !!apiKey && backendTest.reachable,
    };

    // Build recommendations
    const recommendations: string[] = [];

    if (!apiUrl) {
      recommendations.push("❌ NEXT_PUBLIC_API_URL not set in environment variables");
      recommendations.push("  ACTION: Set in Amplify Console → Environment Variables");
      recommendations.push("  Value should be the backend API URL (e.g., http://api.example.com or http://localhost:4000)");
    } else if (!apiUrl.startsWith("http")) {
      recommendations.push("❌ NEXT_PUBLIC_API_URL is invalid (must start with http:// or https://)");
      recommendations.push(`  Current value: ${apiUrl}`);
    } else if (!backendTest.reachable) {
      recommendations.push(
        `❌ Cannot reach backend at ${apiUrl}`
      );
      recommendations.push(
        `  Error: ${backendTest.error || "Connection timeout"}`
      );
      recommendations.push("  ACTION: Verify backend is running and accessible from frontend");
    } else if (!backendTest.success) {
      recommendations.push(`⚠️ Backend returned status ${backendTest.statusCode}`);
      recommendations.push("  Backend may be misconfigured or returning errors");
    } else {
      recommendations.push("✓ Backend connectivity OK");
    }

    if (!apiKey) {
      recommendations.push("❌ NEXT_PUBLIC_API_KEY not set in environment variables");
      recommendations.push("  ACTION: Set in Amplify Console → Environment Variables");
      recommendations.push("  Value should be the API key for public v1 endpoints");
    } else {
      recommendations.push("✓ API key is configured");
    }

    if (validationResults.allRequirementsMet) {
      recommendations.push("✓ All requirements for form submission are met");
      recommendations.push(
        "Form endpoints should work correctly. Test by submitting a form."
      );
    } else {
      recommendations.push("❌ Form submission will fail until all requirements are met");
    }

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        environment: environmentInfo,
        backend: backendTest,
        validation: validationResults,
        formRoutes,
        recommendations,
        testInstructions: {
          manualTest:
            "Submit a form at /forms/email-subscription and check browser console for errors",
          diagnosticEndpoints: [
            "/api/debug/cms - Check CMS connectivity",
            "/api/debug/content - Check CMS content filtering",
            "/api/debug/forms - This endpoint (form submission setup)",
          ],
        },
      },
      { status: validationResults.allRequirementsMet ? 200 : 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to gather diagnostic information",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
