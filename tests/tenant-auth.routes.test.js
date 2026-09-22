const { test } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');

test('tenant auth routes are mounted on the app', () => {
  const authMounted = app._router.stack.some((layer) => {
    return layer.regexp && typeof layer.regexp.test === 'function' && layer.regexp.test('/api/auth/register');
  });

  assert.ok(authMounted, 'Expected /api/auth router to be mounted');
});
