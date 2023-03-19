import { Error } from "@prisma/client";
import prisma from "../database/connection";
import { type Prisma } from "@prisma/client";



  

export const ErrorService = {
  getErrors: async () => {
    try {
      const errors = await prisma.error.findMany();
      if (errors.length === 0) {
        return new Error("No existen errores");
      }
      return errors;
    } catch (error) {
      return new Error("No existen errores");
    }
  },
  getError: async (id: number) => {
    try {
      const error = await prisma.error.findUnique({
        where: {
          id: id,
        },
      });
      if (!error) {
        return new Error(`No existe un error con el id ${id}`);
      }
      return error;
    } catch (error) {
      return new Error(`No existe un error con el id ${id}`);
    }
  },
  createError: async (body: any) => {
    try {
      const error = await prisma.error.create({
        data: body,
      });
      return error;
    } catch (error: any) {
      console.log(error);
      return new Error(error);
    }
  },
};
