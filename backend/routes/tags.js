// routes/tags.js
import { Router } from 'express';
import { createTag, getTags, updateTag, deleteTag } from '../controllers/tagsController.js'; // Ensure the file extension is included

const router = Router();

// Create a new tag
router.post('/', createTag);

// Get all tags
router.get('/', getTags);

// Update a tag
router.put('/:id', updateTag);

// Delete a tag
router.delete('/:id', deleteTag);

export default router;
