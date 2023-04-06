import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import {AUTH_SECRET_KEY} from "../config"

export function checkToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({message: "Acesso negado!"})
    }

    try {
        const secretKey: any = AUTH_SECRET_KEY
        jwt.verify(token, secretKey)

        next()

    } catch (error) {
        return res.status(400).json({message: "Token invalido!"})
    }
}