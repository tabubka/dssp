import { Entity } from 'dynamodb-toolbox'
import { table } from '../table'


export enum StatusType {
    OUT_OF_OFFICE,
    REMOTE,
    SICK,
    VACATION,
    BUSINESS_TRIP
}

export interface IStatus {
    id: string,
    userId: string,
    allDay: boolean,
    statusType: string,
    createdAt: string,
    updatedAt: string,
    startsAt: string,
    endsAt: string,
    message: string
}

export const Status = new Entity<IStatus>({
    table,
    name: 'Status',
    

    attributes: {
        PK: { hidden: true, partitionKey: true, prefix: "STATUS#"},
        SK: { hidden: true, sortKey: true, prefix: "STATUS#",  default: (data: IStatus) => data.id},
        GSI1PK: { hidden: true, partitionKey: 'GSI1', default: ()=> "STATUS"},
        GSI1SK: { hidden: true, sortKey: 'GSI1', prefix: "STATUS#", default: (data: IStatus) => data.endsAt},


        id: ['PK', 0],

        // orgId: 

        userId: { type: 'string' },
        allDay: { type: 'boolean' },
        statusType: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        // new Date().toISOString()
        startsAt: { type: 'string' },
        endsAt:  { type: 'string' },
        message: { type: 'string' },
    }
})
