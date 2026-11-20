# AROHA Firestore Security Specification

## 1. Data Invariants

1. **Farmer Ownership**: Every `FarmerProfile`, `Cattle`, and `Booking` document is strictly owned by `request.auth.uid`, matching both the `{farmerId}` path segment and `ownerUid` document field.
2. **Master Gate Relational Sync**: A `Cattle` or `Booking` document cannot be created unless the parent `/farmers/{farmerId}` profile exists (`exists(...)`), and a `Booking` cannot be created unless the referenced `/farmers/{farmerId}/cattle/{cattleId}` animal exists.
3. **Strict Schema & Key Whitelisting**: All documents enforce `hasAll(...)` and `hasOnly(...)` on creation and explicit `affectedKeys().hasOnly(...)` action allowlists on update, blocking shadow fields.
4. **PII Isolation**: Phone numbers, village/district details, and farmer names are readable (`get` and `list`) only by the verified owner (`isOwner(farmerId)`).
5. **Terminal State Locking**: Once a `Booking` transitions from `'Scheduled'` to `'Completed'` or `'Cancelled'`, no further updates are permitted.
6. **Temporal & Immutability Integrity**: `createdAt` and `updatedAt` must match `request.time` on creation; `ownerUid`, `createdAt`, and `referenceCode` are immutable after creation.

## 2. The "Dirty Dozen" Attack Payloads (All Must Return `PERMISSION_DENIED`)

1. **Unauthenticated Booking Create**: `request.auth == null` writing to `/farmers/user1/bookings/b1`.
2. **Unverified Email Write**: `request.auth.token.email_verified == false` attempting to create a booking.
3. **Cross-Tenant Identity Spoofing**: Authenticated `user2` creating `/farmers/user1/bookings/b1` with `ownerUid: "user2"`.
4. **UID Mismatch Inside Own Path**: Authenticated `user1` creating `/farmers/user1/cattle/c1` with `ownerUid: "user2"`.
5. **Shadow Field Injection**: Creating a booking with an extra field `{ isFree: true }` or `{ isAdmin: true }`.
6. **Orphaned Booking (Missing Cattle)**: Creating a booking referencing a non-existent `cattleId: "nonexistent"`.
7. **State Shortcutting on Create**: Creating a booking directly with `status: "Completed"`.
8. **Mutating Terminal Booking**: Updating a booking whose `existing().status == "Completed"` back to `"Scheduled"`.
9. **Spoofed Timestamp**: Creating a cattle profile with client-forged `createdAt` not equal to `request.time`.
10. **Immutable Field Tampering**: Updating a booking's `referenceCode` or `ownerUid`.
11. **Oversized ID Poisoning**: Creating a document at `/farmers/user1/bookings/<150-char-id>` or invalid characters (`$bad!`).
12. **Cross-User PII List/Read**: Authenticated `user2` calling `get` or `list` on `/farmers/user1/bookings`.
