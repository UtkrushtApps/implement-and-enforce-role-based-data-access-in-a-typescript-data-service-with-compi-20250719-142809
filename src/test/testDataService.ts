import { DataService } from '../services/dataService';
import { UserRole } from '../types/account';

function testAccountAccess() {
  const accountIds = ['1', '2', '3'];
  const roles: UserRole[] = ['viewer', 'editor', 'admin'];

  roles.forEach((role) => {
    accountIds.forEach((id) => {
      const acc = DataService.getAccountById(id, role);
      console.log(`[Role=${role}] Fetched account ${id}:`, acc);
      // Type assertion test:
      if (acc) {
        if (role === 'viewer') {
          // @ts-expect-error: Viewer should never see canEdit or billingDetails
          acc.canEdit;
          // @ts-expect-error: Viewer should never see admin-only fields
          acc.billingDetails;
        }
        if (role === 'editor') {
          // Should have canEdit
          // @ts-expect-error: Editor should never see admin-only fields
          acc.billingDetails;
        }
        if (role === 'admin') {
          // Should have all fields
          if (!('billingDetails' in acc)) {
            throw new Error('Admin cannot see billingDetails!');
          }
        }
      }
    });
  });

  // Try to update as editor and verify admin fields not leaked
  const updated = DataService.updateAccountById('3', { canEdit: false }, 'editor');
  console.log('Update as editor (should not return billingDetails):', updated);
  // @ts-expect-error
  updated.billingDetails;
}

testAccountAccess();
