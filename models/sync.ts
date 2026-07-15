import sequelize,{connectToDatabase} from './connection.ts';

async function sync(){
    await connectToDatabase();
    sequelize.sync({alter: true})
}

sync();