from prometheus_client import Counter, Histogram

HTTP_REQUESTS_TOTAL = Counter(
    "kiwikids_http_requests_total",
    "Total HTTP requests processed by KiwiKids API",
    ["method", "path", "status_code"],
)

HTTP_REQUEST_DURATION_SECONDS = Histogram(
    "kiwikids_http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "path"],
)
