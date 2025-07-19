import { z } from 'zod';

export type UserRole = 'viewer' | 'editor' | 'admin';

export const viewerAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.literal('viewer'),
});

export const editorAccountSchema = viewerAccountSchema.extend({
  role: z.literal('editor'),
  canEdit: z.boolean(),
});

export const adminAccountSchema = editorAccountSchema.extend({
  role: z.literal('admin'),
  billingDetails: z.object({
    plan: z.string(),
    renewalDate: z.string(),
  }),
  accountStatus: z.enum(['active', 'suspended', 'pending']),
});

export const accountSchema = z.discriminatedUnion('role', [
  viewerAccountSchema,
  editorAccountSchema,
  adminAccountSchema,
]);

export type ViewerAccount = z.infer<typeof viewerAccountSchema>;
export type EditorAccount = z.infer<typeof editorAccountSchema>;
export type AdminAccount = z.infer<typeof adminAccountSchema>;

export type Account = ViewerAccount | EditorAccount | AdminAccount;

// Helper for role-based mappings
type RoleAccountMap = {
  viewer: ViewerAccount,
  editor: EditorAccount,
  admin: AdminAccount,
};

export type AccountForRole<R extends UserRole> = RoleAccountMap[R];

export const accountSchemaForRole: {
  [K in UserRole]: z.ZodType<AccountForRole<K>>;
} = {
  viewer: viewerAccountSchema,
  editor: editorAccountSchema,
  admin: adminAccountSchema,
};
