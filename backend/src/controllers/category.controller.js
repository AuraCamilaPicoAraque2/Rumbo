import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { slugify } from '../utils/slugify.js'
import { str } from '../utils/validators.js'

// GET /api/categories
export const listCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: { where: { published: true } } } } },
  })
  res.json(categories)
})

// POST /api/categories  (ADMIN)
export const createCategory = asyncHandler(async (req, res) => {
  const name = str(req.body.name, 'name', { min: 2, max: 60 })
  const category = await prisma.category.create({ data: { name, slug: slugify(name) } })
  res.status(201).json(category)
})
