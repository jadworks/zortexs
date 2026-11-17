# Security Specification — Le Comptoir Doré

## 1. Data Invariants
1. **Identity Integrity**: Every `Order` and `OrderItem` document must carry `ownerId == request.auth.uid` on creation, and `ownerId` is immutable on update.
2. **Email Verification Gate**: All authenticated read/write operations on orders and preferences require `request.auth.token.email_verified == true`.
3. **PII Isolation**: Customer orders contain PII (`customerName`, `customerPhone`). Only the order owner (`resource.data.ownerId == request.auth.uid`) or a verified admin (`isAdmin()`) may read or list an order.
4. **Tiered Stage Transitions & Terminal Locking**:
   - Customers start orders at `stage == 'received'` and may not self-promote their order to `ready` or `picked_up`, nor alter `paymentStatus` from `pending_pickup` to `paid` after creation.
   - Only verified admins (`isAdmin()`) can advance `stage`, update `estimatedMinutesRemaining` / `estimatedReadyLabel`, or mark `paymentStatus == 'paid'` at pickup.
   - Once `stage == 'picked_up'`, non-admin updates are strictly blocked (terminal state locking).
5. **Relational Master Gate**: Subcollection `/orders/{orderId}/items/{itemId}` checks the parent `/orders/{orderId}` via `get()` / `getAfter()` so items cannot be orphaned or injected into another user's order.
6. **Temporal Integrity & Strict Schema Keys**: `createdAt` and `updatedAt` must equal `request.time`, all strings enforce `.size()` limits matching `firebase-blueprint.json`, and all writes use `keys().hasAll(...)` + `keys().hasOnly(...)` on create and `affectedKeys().hasOnly(...)` on update.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Identity Spoofing on Create**: User A tries to create `/orders/ord1` with `ownerId: "user_B"`. -> `PERMISSION_DENIED`.
2. **Unverified Email Write**: User with `email_verified: false` attempts to create `/orders/ord1`. -> `PERMISSION_DENIED`.
3. **Ghost / Shadow Field Injection**: User creates `/orders/ord1` with an extra field `isVipDiscount: true`. -> `PERMISSION_DENIED`.
4. **Stage Shortcutting on Create**: Customer creates `/orders/ord1` directly with `stage: "ready"` instead of `"received"`. -> `PERMISSION_DENIED`.
5. **Customer Stage Tampering on Update**: Customer updates `/orders/ord1` trying to set `stage: "ready"`. -> `PERMISSION_DENIED`.
6. **Customer Payment Tampering on Update**: Customer updates `/orders/ord1` trying to flip `paymentStatus` from `"pending_pickup"` to `"paid"`. -> `PERMISSION_DENIED`.
7. **Terminal State Mutation**: Non-admin attempts any update after `stage == "picked_up"`. -> `PERMISSION_DENIED`.
8. **PII Cross-User Read**: User B attempts `get(/orders/ord_owned_by_A)`. -> `PERMISSION_DENIED`.
9. **Blanket List Query**: User A attempts `list(/orders)` without filtering by `ownerId == request.auth.uid`. -> `PERMISSION_DENIED`.
10. **ID Poisoning**: User attempts to create `/orders/invalid$id!with*spaces` or a 300-character document ID. -> `PERMISSION_DENIED`.
11. **Value Poisoning / Resource Exhaustion**: User sends a 2,000-character `customerName` or negative `totalCents: -500`. -> `PERMISSION_DENIED`.
12. **Orphaned / Cross-Owner Subcollection Write**: User B attempts to create `/orders/ord_owned_by_A/items/item1`. -> `PERMISSION_DENIED`.
