Mosook backend server

Backend Overview

MVSC Arch.

- model - Entity structure/schema
- controller - auth, user permissions, validate req ,serlize response
- view/routes - user/data interface
- services - core business operations, like Create, Update, FindOrCreate, etc...

database structure is only editable through schema.prisma and applied to supabase

generate prisma schema ts types

- npx prisma generate

format and fix prisma schema

- npx prisma format

migrate db command

- npx prisma migrate dev --name init

push db changes

- npx prisma db push

pnpm dlx prisma generate
pnpm dlx prisma format
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma db push
