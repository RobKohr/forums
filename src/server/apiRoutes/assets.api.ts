import { Request, Response, Router } from "express";
import { Tspec } from "tspec";
export const router = Router();
const basePath = '/api/assets';
const tag = 'Assets'

interface Asset {
    id: string,
    data: any,
}

const asset = async (req: Request, res: Response) => {
    return res.json({ test: true, params: req.params });
}
export type AssetsApiSpec = Tspec.DefineApiSpec<{
    tags: ["Assets"];
    paths: {
        "/api/assets/{id}": {
            get: {
                summary: 'Get asset by id',
                path: { id: string },
                responses: {
                    200: Asset,
                },
            },
        };
    };
}>;
router.get('/:id', asset)