import { Request, Response, Router } from "express";
import { Tspec } from "tspec";
export const router = Router();

interface Book {
  /** Field description defined by JSDoc */
  id: number;
  title: string;
  description?: string;
}

const getBookById = (req: Request<{ id: string }>, res: Response<Book>) => {
  res.json({
    id: +req.params.id,
    title: "Book Title",
    description: "Book Description",
  });
};

export type BookApiSpec = Tspec.DefineApiSpec<{
  tags: ["Book"];
  paths: {
    "/books/{id}": {
      get: {
        summary: "Get book by idasdf";
        handler: typeof getBookById;
      };
    };
  };
}>;

router.get("/:id", getBookById);
