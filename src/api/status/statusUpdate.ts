import 'source-map-support/register'
// import { AppSyncResolverHandler } from 'aws-lambda'
import { ulid } from 'ulid'

// export const handler: AppSyncResolverHandler<InputType<UploadAbortInput>, UploadAbortPayload> = async (event) => {
export const handler = async (status: any) => {

  const { id }: { id: any } = status.arguments.input

  console.log('Status', status)
  console.log('StatusID', id)
  console.log('Status', status)

  return {
    id,
    event: {
      id: ulid(),
      createdAt: new Date()
    },
  }
}