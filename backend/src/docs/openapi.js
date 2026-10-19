// Especificación OpenAPI 3.0 de la API (se muestra con Swagger UI en /api/docs)

const ref = (name) => ({ $ref: `#/components/schemas/${name}` })
const json = (schema) => ({ 'application/json': { schema } })
const secured = [{ bearerAuth: [] }]

const error = (description) => ({ description, content: json(ref('Error')) })
const ok = (description, schema) => ({ description, content: json(schema) })

const pathParam = (name, description, type = 'integer') => ({
  name,
  in: 'path',
  required: true,
  description,
  schema: { type },
})

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Campus Virtual y Blog de Orientación Universitaria',
    version: '1.0.0',
    description:
      'API REST del campus virtual. Para probar rutas protegidas: inicia sesión en **POST /auth/login**, copia el `token`, pulsa **Authorize** y pégalo (sin escribir "Bearer").',
  },
  servers: [{ url: '/api', description: 'Servidor actual' }],
  tags: [
    { name: 'Salud' },
    { name: 'Auth', description: 'Registro e inicio de sesión' },
    { name: 'Categorías' },
    { name: 'Artículos' },
    { name: 'Comentarios' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: { message: { type: 'string', example: 'Descripción del error' } },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ana Pérez' },
          email: { type: 'string', example: 'ana@test.com' },
          role: { type: 'string', enum: ['ESTUDIANTE', 'ADMIN'] },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: { user: ref('User'), token: { type: 'string' } },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Ana Pérez' },
          email: { type: 'string', example: 'ana@test.com' },
          password: { type: 'string', minLength: 8, example: 'Clave12345' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@campus.test' },
          password: { type: 'string', example: 'Admin123!' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Carreras' },
          slug: { type: 'string', example: 'carreras' },
        },
      },
      CategoryInput: {
        type: 'object',
        required: ['name'],
        properties: { name: { type: 'string', example: 'Vida universitaria' } },
      },
      ArticleSummary: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string' },
          coverUrl: { type: 'string', nullable: true },
          published: { type: 'boolean' },
          publishedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          author: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
          category: ref('Category'),
          _count: { type: 'object', properties: { comments: { type: 'integer' } } },
        },
      },
      Article: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string' },
          content: { type: 'string' },
          coverUrl: { type: 'string', nullable: true },
          published: { type: 'boolean' },
          publishedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          author: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
          category: ref('Category'),
        },
      },
      ArticleList: {
        type: 'object',
        properties: {
          items: { type: 'array', items: ref('ArticleSummary') },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      ArticleInput: {
        type: 'object',
        required: ['title', 'excerpt', 'content', 'categoryId'],
        properties: {
          title: { type: 'string', example: 'Cinco becas que debes conocer' },
          excerpt: { type: 'string', example: 'Un repaso rápido por becas universitarias.' },
          content: { type: 'string', example: 'Contenido completo del artículo...' },
          categoryId: { type: 'integer', example: 3 },
          coverUrl: { type: 'string', nullable: true, example: 'https://ejemplo.com/portada.jpg' },
          published: { type: 'boolean', example: true },
        },
      },
      ArticleUpdate: {
        type: 'object',
        description: 'Todos los campos son opcionales: envía solo los que quieras cambiar.',
        properties: {
          title: { type: 'string' },
          excerpt: { type: 'string' },
          content: { type: 'string' },
          categoryId: { type: 'integer' },
          coverUrl: { type: 'string', nullable: true },
          published: { type: 'boolean' },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          user: { type: 'object', properties: { id: { type: 'integer' }, name: { type: 'string' } } },
        },
      },
      CommentInput: {
        type: 'object',
        required: ['content'],
        properties: { content: { type: 'string', example: '¡Muy útil, gracias!' } },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Salud'],
        summary: 'Estado del servidor y la base de datos',
        responses: {
          200: ok('Todo funciona', {
            type: 'object',
            properties: { status: { type: 'string', example: 'ok' }, database: { type: 'string', example: 'conectada' } },
          }),
        },
      },
    },

    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un estudiante',
        requestBody: { required: true, content: json(ref('RegisterInput')) },
        responses: {
          201: ok('Cuenta creada', ref('AuthResponse')),
          400: error('Datos inválidos'),
          409: error('El correo ya está registrado'),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: { required: true, content: json(ref('LoginInput')) },
        responses: {
          200: ok('Sesión iniciada', ref('AuthResponse')),
          401: error('Correo o contraseña incorrectos'),
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Perfil del usuario con sesión iniciada',
        security: secured,
        responses: {
          200: ok('Usuario actual', { type: 'object', properties: { user: ref('User') } }),
          401: error('Sin sesión o token expirado'),
        },
      },
    },

    '/categories': {
      get: {
        tags: ['Categorías'],
        summary: 'Listar categorías',
        responses: { 200: ok('Lista de categorías', { type: 'array', items: ref('Category') }) },
      },
      post: {
        tags: ['Categorías'],
        summary: 'Crear categoría (ADMIN)',
        security: secured,
        requestBody: { required: true, content: json(ref('CategoryInput')) },
        responses: {
          201: ok('Categoría creada', ref('Category')),
          401: error('Sin sesión'),
          403: error('No eres administrador'),
          409: error('La categoría ya existe'),
        },
      },
    },

    '/articles': {
      get: {
        tags: ['Artículos'],
        summary: 'Listar artículos publicados (con paginación y filtros)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 9, maximum: 50 } },
          { name: 'q', in: 'query', description: 'Busca en título y resumen', schema: { type: 'string' } },
          { name: 'category', in: 'query', description: 'Slug de la categoría', schema: { type: 'string' } },
          {
            name: 'drafts',
            in: 'query',
            description: 'Solo ADMIN: incluir borradores',
            schema: { type: 'boolean' },
          },
        ],
        responses: { 200: ok('Página de artículos', ref('ArticleList')) },
      },
      post: {
        tags: ['Artículos'],
        summary: 'Crear artículo (ADMIN)',
        security: secured,
        requestBody: { required: true, content: json(ref('ArticleInput')) },
        responses: {
          201: ok('Artículo creado', ref('Article')),
          400: error('Datos inválidos'),
          401: error('Sin sesión'),
          403: error('No eres administrador'),
        },
      },
    },
    // Nota: en la API real GET usa el slug y PUT/DELETE usan el id numérico.
    '/articles/{idOrSlug}': {
      get: {
        tags: ['Artículos'],
        summary: 'Ver un artículo por su slug',
        parameters: [
          { ...pathParam('idOrSlug', 'Slug del artículo, ej: como-elegir-tu-carrera', 'string') },
        ],
        responses: { 200: ok('Artículo', ref('Article')), 404: error('No encontrado') },
      },
      put: {
        tags: ['Artículos'],
        summary: 'Editar artículo (ADMIN)',
        security: secured,
        parameters: [{ ...pathParam('idOrSlug', 'ID numérico del artículo, ej: 1') }],
        requestBody: { required: true, content: json(ref('ArticleUpdate')) },
        responses: {
          200: ok('Artículo actualizado', ref('Article')),
          400: error('Datos inválidos'),
          401: error('Sin sesión'),
          403: error('No eres administrador'),
          404: error('No encontrado'),
        },
      },
      delete: {
        tags: ['Artículos'],
        summary: 'Eliminar artículo (ADMIN)',
        security: secured,
        parameters: [{ ...pathParam('idOrSlug', 'ID numérico del artículo, ej: 1') }],
        responses: {
          204: { description: 'Eliminado' },
          401: error('Sin sesión'),
          403: error('No eres administrador'),
          404: error('No encontrado'),
        },
      },
    },

    '/articles/{slug}/comments': {
      get: {
        tags: ['Comentarios'],
        summary: 'Listar comentarios de un artículo',
        parameters: [pathParam('slug', 'Slug del artículo', 'string')],
        responses: {
          200: ok('Comentarios', { type: 'array', items: ref('Comment') }),
          404: error('Artículo no encontrado'),
        },
      },
      post: {
        tags: ['Comentarios'],
        summary: 'Comentar un artículo (sesión iniciada)',
        security: secured,
        parameters: [pathParam('slug', 'Slug del artículo', 'string')],
        requestBody: { required: true, content: json(ref('CommentInput')) },
        responses: {
          201: ok('Comentario creado', ref('Comment')),
          400: error('Datos inválidos'),
          401: error('Sin sesión'),
          404: error('Artículo no encontrado'),
        },
      },
    },
    '/comments/{id}': {
      delete: {
        tags: ['Comentarios'],
        summary: 'Eliminar un comentario (dueño o ADMIN)',
        security: secured,
        parameters: [pathParam('id', 'ID del comentario')],
        responses: {
          204: { description: 'Eliminado' },
          401: error('Sin sesión'),
          403: error('No puedes eliminar este comentario'),
          404: error('No encontrado'),
        },
      },
    },
  },
}
