const envApiUrl = (import.meta.env.VITE_API_URL || "").trim();

function normalizeBaseUrl(url) {
	return url.replace(/\/$/, "");
}

let API_URL = envApiUrl;

if (typeof window !== "undefined") {
	const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
	const envPointsToLocalhost = /localhost|127\.0\.0\.1/i.test(envApiUrl);

	// In deployed environments, never use localhost from stale env values.
	if (!isLocalHost && (!envApiUrl || envPointsToLocalhost)) {
		API_URL = window.location.origin;
	}
}

export default normalizeBaseUrl(API_URL || "");
