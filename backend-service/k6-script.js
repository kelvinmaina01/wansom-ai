import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp up to 50 users
    { duration: '30s', target: 50 }, // Stay at 50 users for 30s
    { duration: '10s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be < 1%
  },
};

export default function () {
  // Test the health check endpoint
  const res = http.get('http://localhost:5000/health');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'service is okay': (r) => r.json().status === 'ok',
  });
  
  sleep(1);
}
