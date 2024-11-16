// backend/controllers/tagsController.js
import db from '../models/index.js';

const { Tag } = db;

export const createTag = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required.' });
    }

    // Check if the tag already exists
    const existingTag = await Tag.findOne({ where: { name } });
    if (existingTag) {
      return res.status(200).json({ message: 'Tag already exists.', tag: existingTag });
    }

    const newTag = await Tag.create({ name, parentId });
    res.status(201).json({ message: 'Tag created successfully.', tag: newTag });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Tag creation failed.', details: error.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags.', details: error.message });
  }
};

export async function updateTag(req, res) {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;

    // Update tag
    const tag = await Tag.update(
      { name, parentId },
      { where: { id } }
    );

    res.json({ message: 'Tag updated successfully.', tag });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Tag update failed.' });
  }
}

export async function deleteTag(req, res) {
  try {
    const { id } = req.params;

    // Delete tag
    await Tag.destroy({ where: { id } });

    res.json({ message: 'Tag deleted successfully.' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Tag deletion failed.' });
  }
}
