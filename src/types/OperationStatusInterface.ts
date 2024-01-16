import { OperationStatesEnum } from '@/types/OperationStatesEnum'

export interface OperationStatusInterface {
  inProgress: boolean
  state: OperationStatesEnum
  title: string
  message: string
}
