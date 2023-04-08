import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import {AUTH_SECRET_KEY} from "../config"

export function checkCoordinatorToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    const findUserId = req.params.id 

    if(!token) {
        return res.status(401).json({message: "Acesso negado!"})
    }

    try {
        const secretKey: any = AUTH_SECRET_KEY

        var dataUser: any
        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if(err){
                console.log(err)
            }else{
                dataUser = decoded
            }
        })
        
        if(dataUser.role == "coordinator" || dataUser.id == findUserId){
            next()
        }else{
            return res.status(400).json({status: 400, message: "Acesso não autorizado"})
        }


    } catch (error) {
        return res.status(400).json({message: "Token invalido!"})
    }
}