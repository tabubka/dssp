import { User, IUser, UserEmailPrefix, UserPrefix } from '../entities/user'
import { ulid } from 'ulid'
export const userById = async ( id: string) => {
  const result = await User.get({ id })
  if (!result || !result.Item) {
    throw new Error(`Record ${UserPrefix}#${id} not found`)
  }
  console.log('DB::userById')
  return result.Item as IUser
}
export const userByEmail = async (email: string ) => {
  const result = await User.query(`${UserEmailPrefix}#${email}`)
  if (!result || !result.Item) {
    throw new Error(`Record ${UserEmailPrefix}#${email} not found`)
  }
  console.log('DB::userByEmail')
  return result.Items as IUser[]
}
export const userCreate = async (data: Partial<IUser>) => {
  const id = data.id || ulid()
  const business: Partial<IUser> = {
    ...data,
    id,
    //Be carefull for string | number enum
    status: 'CREATED', // EventState.CREATED
  }
  const result = await User.put(business)
  console.log('DB::userCreate', result)
  return {
    business,
  }
}
export const userUpdate = async (
  id: string, 
  data: Partial<IUser>) => {
  const event: Partial<IUser> = {
    ...data,
    id,
  }
  const result = await User.update(event)
  console.log('DB::userUpdate', result)
  return {
    event,
  }
}
export const userDelete = async (id: string) => {
  const result = await User.delete({ id }, {
    returnValues: 'all_old',
  })
  console.log('DB::userDelete', result)
  // ? Return deleted record?
  return result.Attributes as IUser
}