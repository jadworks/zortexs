import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesContent = fs.readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8');

test('firestore.rules includes default-deny catch-all safety net', () => {
  assert.match(rulesContent, /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/);
});

test('firestore.rules enforces email_verified == true and strict ID validation', () => {
  assert.match(rulesContent, /request\.auth\.token\.email_verified == true/);
  assert.match(rulesContent, /id\.matches\('\^\[a-zA-Z0-9_\\\\-\]\+\$'\)/);
});

test('firestore.rules isolates order PII and enforces blueprint keys without client-delegated list queries', () => {
  assert.match(rulesContent, /allow list: if isSignedIn\(\) && \(resource\.data\.ownerId == request\.auth\.uid \|\| isBootstrappedAdmin\(\)\)/);
  assert.match(rulesContent, /function isValidOrder\(data\)/);
  assert.match(rulesContent, /data\.keys\(\)\.hasAll\(/);
  assert.match(rulesContent, /data\.keys\(\)\.hasOnly\(/);
  assert.match(rulesContent, /existing\(\)\.stage != 'picked_up'/);
});

test('firestore.rules enforces atomic subcollection creation with existsAfter and getAfter', () => {
  assert.match(rulesContent, /existsAfter\(\/databases\/\$\(database\)\/documents\/orders\/\$\(orderId\)\)/);
  assert.match(rulesContent, /getAfter\(\/databases\/\$\(database\)\/documents\/orders\/\$\(orderId\)\)\.data\.ownerId == request\.auth\.uid/);
});
