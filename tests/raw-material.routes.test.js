const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');

test('raw material api routers are mounted on the app', () => {
  const hasMountedRoute = (routePath) =>
    app._router.stack.some((layer) => {
      return layer.name === 'router' && layer.regexp && layer.regexp.test(routePath);
    });

  assert.ok(hasMountedRoute('/api/v1/raw-material-categories'));
  assert.ok(hasMountedRoute('/api/v1/raw-materials'));
  assert.ok(hasMountedRoute('/api/v1/vendors'));
  assert.ok(hasMountedRoute('/api/v1/material-transactions'));
});
