import 'source-map-support/register'
// import { AppSyncResolverHandler } from 'aws-lambda'

// export const handler: AppSyncResolverHandler<InputType<UploadAbortInput>, UploadAbortPayload> = async (event) => {
export const handler = async (event: any) => {

  const { id }: { id: any } = event.arguments

  console.log('Event', event)
  console.log('StatusID', id)

  return {
    id,
    success: true,
  }
}