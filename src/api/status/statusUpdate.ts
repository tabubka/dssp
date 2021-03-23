import 'source-map-support/register'
// import { AppSyncResolverHandler } from 'aws-lambda'
import { statusById, statusUpdate } from '../../data/repos/status'

// export const handler: AppSyncResolverHandler<InputType<UploadAbortInput>, UploadAbortPayload> = async (event) => {
  export const handler = async (event: any) => {

    const { id, status: updateStatusInput }: { id: string, status: any } = event.arguments
  
    console.log('LambdaEvent', event)
    console.log('EventID', id)
  
    const evt = await statusById(id)
  
    console.log('Event', evt)
  
  
    const update = await statusUpdate(id, updateStatusInput)
  
    return {
      id,
      event: update.status,
    }
  }