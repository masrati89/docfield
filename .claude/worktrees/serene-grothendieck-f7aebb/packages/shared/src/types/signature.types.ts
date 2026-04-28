import type { BaseEntity } from './common.types';

export type SignerType = 'inspector' | 'tenant';

export interface Signature extends BaseEntity {
  deliveryReportId: string;
  organizationId: string;
  signerType: SignerType;
  signerName: string;
  imageUrl: string;
  signedAt: string;
}
