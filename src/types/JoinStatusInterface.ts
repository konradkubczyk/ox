import { JoinState } from '@/types/JoinStatesEnum'

export interface JoinStatusInterface {
  inProgress: boolean
  state: JoinState
  title: string
  message: string
}
