import { Request, Response } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {AUTH_SECRET_KEY} from "../config"

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function createUser(req: Request, res: Response) {
    try {
        const {name, email, password, role, course, historic} = req.body

        // Validations
        if(!email) {
            return res.status(422).json({status: 422, message: "Email é um campo obrigatório!"})
        }
        
        const verification = await prisma.user.findMany({ where: {email: email}})

        if(verification.length != 0) {
            return res.status(400).json({status: 400, message: "Usuário já cadastrado!"})
        }

        if(role != "student" && role != "coordinator") {
            return res.status(400).json({status: 400, message: "Cargo inexistente!"})
        }

        if(!name) {
            return res.status(422).json({status: 422, message: "Nome é um campo obrigatório!"})
        }
        if(!password) {
            return res.status(422).json({status: 422, message: "Senha é um campo obrigatório!"})
        }
        if(!role) {
            return res.status(422).json({status: 422, message: "Cargo é um campo obrigatório!"})
        }
        if(!course) {
            return res.status(422).json({status: 422, message: "Curso é um campo obrigatório!"})
        }

        // Password Hashing
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)

        const result = await prisma.user.create({
            data: {
                name: name,
                email: email,
                course: course,
                password: passwordHash,
                role: role,
                historic: historic || ""
            }
        })

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function authenticationUser(req: Request, res: Response) {
    try {
        const {email, password} = req.body

        // Validations
        if(!email) {
            return res.status(422).json({status: 422, message: "Email é um campo obrigatório!"})
        }
        
        if(!password) {
            return res.status(422).json({status: 422, message: "Senha é um campo obrigatório!"})
        }
        
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(!user){
            return res.status(404).json({status: 404, message: "Email ou senha incorretos!"})
        }

        // Validate the Password
        var validation = false
        if(email == user.email){
            validation = bcrypt.compareSync(password, user.password)
        }

        // Return token
        if(validation == true){
            const secretKey: any = AUTH_SECRET_KEY
            try {
                const token = jwt.sign({
                    id: user.id,
                    name: user.name,
                    role: user.role
                },
                secretKey
                )

                return res.status(200).json({message: "Usuário autenticado com sucesso!", token: token, user: user})

            } catch (error) {
                console.log(error)
            }

        }else{
            return res.status(422).json({status: 422, message: "Senha invalida!"})
        }
            
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const userId = req.params.id

        const currentUser: any = await prisma.user.findUnique({where: {id: userId}})

        const {name, email, password, role, course, historic} = req.body

        const result = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: name || currentUser.name ,
                email: email || currentUser.email,
                password: password || currentUser.password,
                role: role || currentUser.role,
                course: course || currentUser.course,
                historic: historic || currentUser.historic
            }
        })

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        
        const userId = req.params.id

        const result = await prisma.user.delete({where: {id: userId}})
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findUser(req: Request, res: Response) {
    try {
        
        const userId = req.params.id

        const result = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                createdProcess: {
                    include: {
                        userProcess: true
                    }
                },
                userProcess: {
                    include: {
                        process: true
                    }
                }
            }
        })
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findAllUsers(req: Request, res: Response) {
    try {
        
        const result = await prisma.user.findMany({
            include: {
                createdProcess: true,
                userProcess: {
                    include: {
                        process: true
                    }
                }
            }
        })

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findFilterUsers(req: Request, res: Response) {
    try {

        const { course, role } = req.query

        const where = {
            ...(course && { course: { contains: course as string } }),
            ...(role && { role: { contains: role as string } }),
        }
        
        const result = await prisma.user.findMany( { 
            where, 
            include: {
                createdProcess: true,
                userProcess: {
                    include: {
                        process: true
                    }
                }
            }
        } )

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function decodeTokenUser(req: Request, res: Response) {
    try {

        const { token } = req.body

        var dataUser: any = {}

        try {
            const secretKey: any = AUTH_SECRET_KEY
    
            jwt.verify(token, secretKey, (err: any, decoded: any) => {
                if(err){
                    console.log(err)
                }else{
                    dataUser = decoded
                }
            })
    
        } catch (error) {
            return res.status(400).json({message: "Token invalido!"})
        }
        
        const result = await prisma.user.findUnique({
            where: {
                id: dataUser.id
            },
            include: {
                createdProcess: true,
                userProcess: {
                    include: {
                        process: true
                    }
                }
            }
        })

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

