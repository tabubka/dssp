import 'source-map-support/register'
// import { AppSyncResolverHandler } from 'aws-lambda'

// export const handler: AppSyncResolverHandler<InputType<UploadAbortInput>, UploadAbortPayload> = async (event) => {
export const handler = async (status: any) => {

  const { id  }: { id: any, } = status.arguments.input

  console.log('Status', status)
  console.log('StatusID', id)

  /*
  wss://mediarecorder.cinnamon.dev/fra/6128-rfmi-6hbw-zqu6
  wss://mediarecorder.cinnamon.dev/6128-rfmi-6hbw-zqu6
  wss://mediarecorder.cinnamon.dev/?streamkey=6128-rfmi-6hbw-zqu6
  */
  return {
    id,
  }
}