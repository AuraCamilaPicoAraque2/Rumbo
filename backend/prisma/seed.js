import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import {
  institutions, careers, financing, admissionSteps, importantDates,
  resources, wellbeing, faqs, extraArticles, extraQuestions,
} from './seed-data.js'

const prisma = new PrismaClient()

async function main() {
  // ---------- Usuario administrador ----------
  const passwordHash = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campus.test' },
    update: {},
    create: { name: 'Administrador', email: 'admin@campus.test', passwordHash, role: 'ADMIN' },
  })

  // ---------- Categorías del blog ----------
  const categorias = [
    { name: 'Carreras', slug: 'carreras' },
    { name: 'Universidades', slug: 'universidades' },
    { name: 'Becas y financiación', slug: 'becas' },
    { name: 'Consejos de estudio', slug: 'consejos-de-estudio' },
    { name: 'Formación técnica y tecnológica', slug: 'formacion-tecnica' },
  ]
  for (const c of categorias) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }
  const catBySlug = Object.fromEntries((await prisma.category.findMany()).map((c) => [c.slug, c.id]))

  // ---------- Artículos ----------
  await prisma.article.upsert({
    where: { slug: 'como-elegir-tu-carrera' },
    update: {},
    create: {
      title: 'Cómo elegir tu carrera universitaria',
      slug: 'como-elegir-tu-carrera',
      excerpt: 'Pasos prácticos para decidir con más claridad qué estudiar.',
      content:
        'Elegir carrera no es adivinar el futuro. Empieza por conocer tus intereses, tus habilidades y el mercado laboral. Luego compara programas y universidades, y habla con profesionales del área.',
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: catBySlug['carreras'],
    },
  })
  for (const a of extraArticles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        title: a.title, slug: a.slug, excerpt: a.excerpt, content: a.content,
        published: true, publishedAt: new Date(), authorId: admin.id, categoryId: catBySlug[a.category],
      },
    })
  }

  // ---------- Quitar datos de ejemplo del paso 1 ----------
  await prisma.university.deleteMany({ where: { name: { startsWith: 'Universidad Ejemplo' } } })
  await prisma.financing.deleteMany({ where: { name: { contains: '(ejemplo)' } } })

  // ---------- Instituciones ----------
  const uniId = {}
  for (const [key, u] of Object.entries(institutions)) {
    const saved = await prisma.university.upsert({ where: { name: u.name }, update: {}, create: u })
    uniId[key] = saved.id
  }

  // ---------- Carreras y oferta ----------
  for (const c of careers) {
    const data = {
      name: c.name, slug: c.slug, area: c.area, description: c.description, outlook: c.outlook,
      durationYears: c.years, durationLabel: c.label, riasecCode: c.riasec, level: c.level || 'PROFESIONAL',
    }
    const career = await prisma.career.upsert({ where: { slug: c.slug }, update: {}, create: data })
    for (const key of c.unis.split(',')) {
      await prisma.careerUniversity.upsert({
        where: { careerId_universityId: { careerId: career.id, universityId: uniId[key] } },
        update: {},
        create: {
          careerId: career.id,
          universityId: uniId[key],
          modality: 'PRESENCIAL',
          offerStatus: c.status || 'VIGENTE',
        },
      })
    }
  }

  // ---------- Contenido informativo (solo si las tablas están vacías) ----------
  if ((await prisma.financing.count()) === 0) await prisma.financing.createMany({ data: financing })
  if ((await prisma.admissionStep.count()) === 0) await prisma.admissionStep.createMany({ data: admissionSteps })
  if ((await prisma.importantDate.count()) === 0) await prisma.importantDate.createMany({ data: importantDates })
  if ((await prisma.resource.count()) === 0) await prisma.resource.createMany({ data: resources })
  if ((await prisma.wellbeingService.count()) === 0) await prisma.wellbeingService.createMany({ data: wellbeing })
  if ((await prisma.faq.count()) === 0) await prisma.faq.createMany({ data: faqs })

  // ---------- Test vocacional RIASEC: 2 preguntas por dimensión ----------
  if ((await prisma.question.count()) === 0) {
    await prisma.question.createMany({
      data: [
        { dimension: 'REALISTA', text: 'Me gusta armar, reparar o construir cosas con mis manos.' },
        { dimension: 'REALISTA', text: 'Prefiero trabajar al aire libre o con herramientas y máquinas.' },
        { dimension: 'INVESTIGADOR', text: 'Disfruto resolver problemas complejos y entender cómo funcionan las cosas.' },
        { dimension: 'INVESTIGADOR', text: 'Me atrae investigar, analizar datos o hacer experimentos.' },
        { dimension: 'ARTISTICO', text: 'Me gusta crear: dibujar, escribir, diseñar o componer.' },
        { dimension: 'ARTISTICO', text: 'Valoro la originalidad y expresar ideas de forma creativa.' },
        { dimension: 'SOCIAL', text: 'Me gusta ayudar, enseñar o acompañar a otras personas.' },
        { dimension: 'SOCIAL', text: 'Trabajar en equipo y escuchar a los demás me resulta natural.' },
        { dimension: 'EMPRENDEDOR', text: 'Me veo liderando proyectos o iniciando mi propio negocio.' },
        { dimension: 'EMPRENDEDOR', text: 'Disfruto persuadir y convencer a otros de mis ideas.' },
        { dimension: 'CONVENCIONAL', text: 'Me siento cómodo/a organizando información, datos y procesos.' },
        { dimension: 'CONVENCIONAL', text: 'Prefiero tareas con pasos claros y resultados precisos.' },
      ],
    })
  }

  // Preguntas adicionales (se crean solo si no existen)
  for (const q of extraQuestions) {
    const exists = await prisma.question.findFirst({ where: { text: q.text } })
    if (!exists) await prisma.question.create({ data: q })
  }

  // ---------- Mini campus ----------
  if ((await prisma.module.count()) === 0) {
    await prisma.module.create({
      data: {
        title: 'Autoconocimiento',
        description: 'Descubre tus intereses y fortalezas antes de elegir.',
        order: 1,
        lessons: {
          create: [
            { title: '¿Qué me apasiona?', order: 1, content: 'Ejercicio guiado para identificar tus intereses.' },
            { title: 'Mis fortalezas', order: 2, content: 'Reconoce tus habilidades y cómo se conectan con una carrera.' },
          ],
        },
      },
    })
  }

  console.log('✅ Seed completado')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
