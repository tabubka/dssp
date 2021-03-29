import 'source-map-support/register'
import { statusList } from '../../data/repos/status'

export const handler = async (event: any) => {

  const { id }: { id: string } = event.arguments

  console.log('LambdaEvent', event)
  console.log('EventID', id)

  const sts = await statusList()

  console.log('Status', sts)

  return sts
}