import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function createProcess(req: Request, res: Response) {
    try {
        const {name, description, beginDate, endDate, vacancys, scholarships, course, creatorId, status} = req.body

        // Validations
        if(!name) {
            return res.status(422).json({status: 422, message: "Nome é um campo obrigatório!"})
        }

        if(!beginDate) {
            return res.status(422).json({status: 422, message: "A data de início é um campo obrigatório!"})
        }

        if(!endDate) {
            return res.status(422).json({status: 422, message: "A data de fim é um campo obrigatório!"})
        }

        if(!vacancys) {
            return res.status(422).json({status: 422, message: "O número de vagas é um campo obrigatório!"})
        }

        if(!scholarships) {
            return res.status(422).json({status: 422, message: "O número de bolsas é um campo obrigatório!"})
        }

        const findCreator = await prisma.user.findUnique({where: {id: creatorId}})

        if(!findCreator) {
            return res.status(404).json({status: 404, message: "O criador do processo seletivo não foi encontrado!"})
        }

        if(findCreator.role == "student") {
            return res.status(400).json({status: 400, message: "Um estudante não pode criar um processo seletivo!"})
        }

        const result = await prisma.process.create({
            data: {
                name: name,
                description: description || "",
                beginDate: beginDate,
                endDate: endDate,
                vacancys: vacancys,
                scholarships: scholarships,
                course: course,
                creatorId: creatorId,
                status: status || "Aberto"
            }
        })

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function updateProcess(req: Request, res: Response) {
    try {
        const processId = req.params.id

        const currentProcess: any = await prisma.process.findUnique({where: {id: processId}})

        const {name, description, beginDate, endDate, vacancys, scholarships, course, creatorId} = req.body

        const result = await prisma.process.update({
            where: {
                id: processId
            },
            data: {
                name: name || currentProcess.name ,
                description: description || currentProcess.description,
                beginDate: beginDate || currentProcess.beginDate,
                endDate: endDate || currentProcess.endDate,
                vacancys: vacancys || currentProcess.vacancys,
                scholarships: scholarships || currentProcess.scholarships,
                course: course || currentProcess.course,
                creatorId: creatorId || currentProcess.creatorId
            }
        })

        return res.status(200).json(result)

    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function deleteProcess(req: Request, res: Response) {
    try {
        
        const processId = req.params.id

        const result = await prisma.process.delete({where: {id: processId}})
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findProcess(req: Request, res: Response) {
    try {
        
        const processId = req.params.id

        const result = await prisma.process.findUnique({
            where: {
                id: processId
            },
            include: {
                creator: true,
                userProcess: {
                    include: {
                        user: true
                    }
                }
            }
        })
        
        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findAllProcess(req: Request, res: Response) {
    try {
        
        const result = await prisma.process.findMany({
            include: {
                creator: true,
                userProcess: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

export async function findFilterProcess(req: Request, res: Response) {
    try {

        const { course, name } = req.query

        const where = {
            ...(course && { course: { contains: course as string } }),
            ...(name && { role: { contains: name as string } }),
        }
        
        const result = await prisma.process.findMany( { 
            where,
            include: {
                creator: true,
                userProcess: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return res.status(200).json(result)
        
    } catch (error: any) {
        return res.status(400).json({status:400, message: error.message})
    }
}

