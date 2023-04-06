import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function createUserProcess(req: Request, res: Response) {
    try {
        const {userId, processId} = req.body

        // Validations
        if(!userId) {
            return res.status(422).json({status: 422, message: "Aluno é um campo obrigatório!"})
        }
        
        if(!processId) {
            return res.status(422).json({status: 422, message: "O processo seletivo é um campo obrigatório!"})
        }
        
        const findUser = await prisma.user.findUnique({where: {id: userId}})
        if(!findUser){
            return res.status(404).json({status: 404, message: "Aluno não encontrado"})
        }

        if(findUser.role == "coordinator") {
            return res.status(400).json({status: 400, message: "Coordenadores não podem se inscrever em processos seletivos!"})
        }
        
        const findProcess = await prisma.process.findUnique({where: {id: processId}})
        if(!findProcess){
            return res.status(404).json({status: 404, message: "Processo Seletivo não encontrado"})
        }


        const result = await prisma.userProcess.create({
            data: {
                userId: userId,
                processId: processId
            }
        })

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function updateUserProcess(req: Request, res: Response) {
    try {
        const userProcessId = req.params.id

        const currentUserProcessId: any = await prisma.userProcess.findUnique({where: {id: userProcessId}})

        const {userId, processId} = req.body

        const result = await prisma.userProcess.update({
            where: {
                id: processId
            },
            data: {
                userId: userId || currentUserProcessId.userId ,
                processId: processId || currentUserProcessId.processId,
            }
        })

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function deleteUserProcess(req: Request, res: Response) {
    try {
        
        const userProcessId = req.params.id

        const result = await prisma.userProcess.delete({where: {id: userProcessId}})
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findUserProcess(req: Request, res: Response) {
    try {
        
        const userProcessId = req.params.id

        const result = await prisma.userProcess.findUnique({where: {id: userProcessId}})
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findAllUserProcess(req: Request, res: Response) {
    try {
        
        const result = await prisma.userProcess.findMany()

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}