import { Account, UserRole, accountSchemaForRole, AccountForRole } from '../types/account';

const accounts: Account[] = [
  {
    id: '1',
    name: 'Alice Viewer',
    email: 'alice@example.com',
    role: 'viewer',
  },
  {
    id: '2',
    name: 'Bob Editor',
    email: 'bob@example.com',
    role: 'editor',
    canEdit: true,
  },
  {
    id: '3',
    name: 'Charlie Admin',
    email: 'charlie@example.com',
    role: 'admin',
    canEdit: true,
    billingDetails: { plan: 'enterprise', renewalDate: '2024-10-01' },
    accountStatus: 'active',
  },
];

export class DataService {
  // Fetch account by ID, projecting only permitted fields for the requesterRole
  static getAccountById<R extends UserRole>(
    accountId: string,
    requesterRole: R
  ): AccountForRole<R> | null {
    const found = accounts.find((a) => a.id === accountId);
    if (!found) return null;
    // Validate and project using runtime schema, ensuring only permitted fields surface
    const schema = accountSchemaForRole[requesterRole];
    const safe = schema.safeParse(found);
    if (safe.success) {
      return safe.data;
    }
    // Fallback: map fields for lower role if found object contains more fields
    if (requesterRole === 'viewer') {
      const { id, name, email } = found;
      return { id, name, email, role: 'viewer' } as AccountForRole<R>;
    }
    if (requesterRole === 'editor') {
      const { id, name, email, canEdit } = found as any;
      return { id, name, email, canEdit: !!canEdit, role: 'editor' } as AccountForRole<R>;
    }
    return null;
  }

  // Update account, only allowing permitted fields for the role
  static updateAccountById<R extends UserRole>(
    accountId: string,
    payload: Partial<AccountForRole<R>>,
    requesterRole: R
  ): AccountForRole<R> | null {
    const idx = accounts.findIndex((a) => a.id === accountId);
    if (idx === -1) return null;
    // Project current object down to allowed fields only
    const schema = accountSchemaForRole[requesterRole].partial();
    const validated = schema.safeParse(payload);
    if (!validated.success) return null;
    // Type-safe and runtime-safe merge
    const merged = {
      ...this.getAccountById(accountId, requesterRole),
      ...validated.data,
    };
    // Write only allowed fields back
    accounts[idx] = { ...accounts[idx], ...merged };
    // Return updated, projected version (so admin-only fields never leak to lower roles)
    return this.getAccountById(accountId, requesterRole);
  }
}
