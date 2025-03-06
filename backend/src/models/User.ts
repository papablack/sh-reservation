import { TrackType, InverseRelation, RWSModel, RWSCollection } from '@rws-framework/db';

import {IUser} from './interfaces/IUser';
import 'reflect-metadata';

import ApiKey from './ApiKey';
import {IApiKey} from './interfaces/IApiKey';
import { RWSResource } from '@rws-framework/server';

@RWSResource('sh.user')
@RWSCollection('user', {
    relations: {
        apiKeys: true
    },
    ignored_keys: [ 'passwd' ]
})
class User extends RWSModel<User> implements IUser {
    @TrackType(String)
    username: string;

    @TrackType(String)
    passwd: string;

    @TrackType(Boolean)
    active: boolean;

    @TrackType(Date, { required: true })
    created_at: Date;
  
    @TrackType(Date)
    updated_at: Date;

    @InverseRelation(() => ApiKey, () => User)
    apiKeys: IApiKey[];

    constructor(data?: IUser) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }      
    }    
}

export default User;