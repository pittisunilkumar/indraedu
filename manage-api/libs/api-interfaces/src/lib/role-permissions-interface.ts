import * as mongoose from 'mongoose';
import { SyllabusInterface, UserKeyInterface } from '@application/api-interfaces';


  export interface rolePermissionsInterface {


    module: mongoose.Types.ObjectId;
    submodules: [];
   

  }