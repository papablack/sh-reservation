import 'reflect-metadata';
import User from './User';
import {IApiKey} from './interfaces/IApiKey';
import { TrackType, Relation, RWSModel, RWSCollection } from '@rws-framework/db';
import { RWSResource } from '@rws-framework/server';

@RWSResource('sh.api_key')
@RWSCollection('api_key', {
    relations: {
        user: true
    }
})
class ApiKey extends RWSModel<ApiKey> implements IApiKey {
    @Relation(() => User, { required: true, cascade: { onDelete: 'Cascade', onUpdate: 'Cascade' } })
    user: User;

    @TrackType(Object)
    keyval: string;

    @TrackType(Date, { required: true })
    created_at: Date;
  
    @TrackType(Date)
    updated_at: Date;

    constructor(data?: IApiKey) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }    

        this.updated_at = new Date();
    }    
}

export default ApiKey;