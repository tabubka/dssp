import { Entity } from 'dynamodb-toolbox'
import { table } from '../table'

export const UserPrefix = 'USR'
export const UserEmailPrefix = 'USREML'
export enum UserStatus {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
}
export interface IUser {
  id: string
  firstName: string
  lastName: string
  email: string
  status: keyof typeof UserStatus
  phone: string
  // Info
  // Metadata
  // Stats
}
export const User = new Entity<IUser>({
  table,
  name: 'User',
  attributes: {
    PK: { hidden: true, partitionKey: true, prefix: `${UserPrefix}#` },
    SK: { hidden: true, sortKey: true, prefix: `${UserPrefix}#`, default: (data: IUser) => data.id },
    id: ['PK', 0],
    email: ['GSI1PK', 0],
    name: { type: 'string' },
    status: { type: 'string' },
   
    // Info
    // Metadata
    // Stats
  },
})