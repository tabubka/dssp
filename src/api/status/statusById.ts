import 'source-map-support/register'
import { statusById } from '../../data/repos/status'
//import { AppSyncResolverHandler } from 'aws-lambda'
// import { ulid } from 'ulid'
export const handler = async (event: any) => {

  const { id }: { id: string } = event.arguments

  console.log('LambdaEvent', event)
  console.log('EventID', id)

  const sts = await statusById(id)

  console.log('Status', sts)

  return sts
}