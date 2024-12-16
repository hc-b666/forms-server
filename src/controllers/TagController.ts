import { RequestHandler } from 'express';
import pool from '../models/postgresDb';
import { getTagsSql, searchTagsQuery } from '../models/queries/tagQuery';

export const getTags: RequestHandler = async (req, res) => {
  try {
    const tags = await pool.query(getTagsSql);

    res.status(200).json(tags.rows);
  } catch (err) {
    console.log(`Error in getTags: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

export const searchTags: RequestHandler = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Invalid query' });
      return;
    }

    const tags = await searchTagsQuery(query);

    res.status(200).json(tags);
  } catch (err) {
    console.log(`Error in searchTags: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};
