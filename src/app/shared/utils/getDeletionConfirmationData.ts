import { TuiConfirmData } from '@taiga-ui/kit';

export function getDeletionConfirmationData(itemToDelete: string) {
  return {
    content: `Do you really want to delete this ${itemToDelete}?`,
    yes: 'Delete',
    no: 'Cancel',
    appearance: 'accent',
  } as TuiConfirmData;
}
