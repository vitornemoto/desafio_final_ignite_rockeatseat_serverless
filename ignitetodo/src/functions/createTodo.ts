import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4, validate as uuidValidate} from "uuid"
import dayjs from "dayjs";

import {document} from "../utils/dynamodbClient"

interface ICreateTodo{
    title: string,
    deadline: string
}

export const handle: APIGatewayProxyHandler  = async (event) => {

    //Essa rota deve receber o id de um usuário pelo pathParameters (você pode criar esse id manualmente apenas para preencher o campo) e os seguintes campos no corpo da requisição: title e deadline, onde deadline é a data limite para o todo.

    //O todo deverá ser salvo com os seguintes campos no DynamoDB:

    const { id: user_id} = event.pathParameters;
    const {title, deadline} = JSON.parse(event.body) as ICreateTodo;
    
    if (!uuidValidate(user_id)){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid User Id."
            }),
            headers: {
                "Content-type": "application/json"
            }
        }
    }

    const todo = { 
                    id: uuidV4(),
                    user_id,
                    title,
                    done: false,
                    deadline: new Date(deadline)
                } 

    await document.put({
        TableName:"users_todos",
        Item: todo
    }).promise()

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo Item created",
            todoItem: todo
        })
    }
}