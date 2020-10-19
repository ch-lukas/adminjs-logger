import AdminBro from 'admin-bro';

export const bundleComponents = (): {
  RECORD_DIFFERENCE: string;
  RECORD_LINK: string;
} => {
  return {
    RECORD_DIFFERENCE: AdminBro.bundle('../../src/components/RecordDifference'),
    RECORD_LINK: AdminBro.bundle('../../src/components/RecordLink'),
  };
};
