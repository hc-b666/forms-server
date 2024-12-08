import { RequestHandler } from 'express';
import pool from '../models/postgresDb';
import { getTagsQuery } from '../models/queries/tagQuery';

export const getTags: RequestHandler = async (req, res) => {
  try {
    const tags = await pool.query(getTagsQuery);

    res.status(200).json(tags.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};
