import { Status, IStatus } from '../entities/status'
import { ulid } from 'ulid'

export const statusById = async (id: string) => {
    const result = await Status.get({ id })
    if (!result || !result.Item) {
      throw new Error(`Status not found`)
    }
    console.log('DB::statusById')
    return result.Item as IStatus
  }


export const statusList = async () => {

  const result = await Status.query(
    'STATUS', // partition key
    {
      limit: 50, // limit to 50 items
      beginsWith: 'STATUS', // select items where sort key begins with value
      reverse: true, // return items in descending order (newest first)
      capacity: 'indexes', // return the total capacity consumed by the indexes
      index: 'GSI1' // query the GSI1 secondary index
    }
  )
  if (!result) {
    throw new Error(`Statuses not found`)
  }
  console.log('DB::statusList', result)
  return result.Items
}

export const statusCreate = async (data: Partial<IStatus>) => {

    //Change to UUID V4
    const id = ulid()
  
    const status: Partial<IStatus> = {
      ...data,
      id,
      //Be carefull for string | number enum
      // statusType: 'VACATION', // EventState.CREATED
    }
  
    const result = await Status.put(status)
  
    console.log('DB::statusCreate', result)
  
    return {
      status
    }
 }

export const statusUpdate = async (
    id: string, 
    data: Partial<IStatus>) => {
    //data: Pick<IEvent, 'nickname' | 'about' | 'startAt' | 'settings'>) => {
  
    const status: Partial<IStatus> = {
      ...data,
      id,
    }

  
    const result = await Status.update(status)
  
    console.log('DB::statusUpdate', result)
  
    return {
      status
    }
  }

  