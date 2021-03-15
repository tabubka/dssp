import 'source-map-support/register'
// import { AppSyncResolverHandler } from 'aws-lambda'
// import { ulid } from 'ulid'

// export const handler: AppSyncResolverHandler<InputType<UploadAbortInput>, UploadAbortPayload> = async (event) => {
export const handler = async (status: any) => {

  const { id }: { id: string } = status.arguments

  console.log('Status', status)
  console.log('StatusID', id)

  return {
    id,
    nickname: 'Unnamed',
    about: 'status',
    startAt: new Date(),
  }
}