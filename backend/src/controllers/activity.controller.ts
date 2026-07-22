import type { Request, Response } from "express";

import { ActivityService } from "../services/activity.service.js";

export const ActivityController = {
    async create(req: Request, res: Response) {
        const activity = await ActivityService.create(req.body);

        return res.status(201).json({
            success: true,
            data: activity,
        });
    },

    async findById(req: Request, res: Response) {
        const activity = await ActivityService.findById(req.params.id as string);

        return res.status(200).json({
            success: true,
            data: activity,
        });
    },

    async findByTicketId(req: Request, res: Response) {
        const activities = await ActivityService.findByTicketId(
            req.params.ticketId as string
        );

        return res.status(200).json({
            success: true,
            data: activities,
        });
    },

    async findRecent(req: Request, res: Response) {
        const limit = req.query.limit as number | undefined;

        const activities = await ActivityService.findRecent(limit);

        return res.status(200).json({
            success: true,
            data: activities,
        });
    },

    async delete(req: Request, res: Response) {
        const result = await ActivityService.delete(req.params.id as string);

        return res.status(200).json({
            success: true,
            data: result,
        });
    },
};