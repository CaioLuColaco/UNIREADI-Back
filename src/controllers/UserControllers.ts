import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createUser(req: Request, res: Response) {
    try {
        const {name, email, password, role, course, historic} = req.body

        const verification = await prisma.user.findMany({ where: {email: email}})

        if(verification.length != 0) {
            return res.status(400).json({status: 400, message: "Usuário já cadastrado!"})
        }

        const result = await prisma.user.create({
            data: {
                name: name,
                email: email,
                course: course,
                password: password,
                role: role,
                historic: historic || ""
            }
        })

        return res.status(200).json(result)
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

        const result = await prisma.user.findUnique({where: {id: userId}})
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findAllUsers(req: Request, res: Response) {
    try {
        
        const result = await prisma.user.findMany()

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}