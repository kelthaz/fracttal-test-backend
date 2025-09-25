--Usuarios
SELECT id, email, "name", "password", created_in FROM public."Users";
INSERT INTO public."Users" (id, email, "name", "password", created_in) VALUES(uuid_generate_v4(), '', '', '', now());
UPDATE public."Users" SET id=uuid_generate_v4(), "name"='', "password"='', created_in=now() WHERE email='';
DELETE FROM public."Users" WHERE email='';

--Categorias
SELECT id, "name", "userId" FROM public.categories;
INSERT INTO public.categories (id, "name", "userId") VALUES(uuid_generate_v4(), '', ?);
UPDATE public.categories SET "name"='', "userId"=? WHERE id=uuid_generate_v4();
DELETE FROM public.categories WHERE id=uuid_generate_v4();

--Etiquetas(tags)
SELECT id, "name", "userId" FROM public.tags;
SELECT task_id, tag_id FROM public.task_tags;
INSERT INTO public.tags (id, "name", "userId") VALUES(uuid_generate_v4(), '', ?);
INSERT INTO public.task_tags (task_id, tag_id) VALUES(?, ?);
UPDATE public.tags SET id=uuid_generate_v4(), "userId"=? WHERE "name"='';
UPDATE public.task_tags SET  WHERE task_id=? AND tag_id=?;
DELETE FROM public.tags WHERE "name"='';
DELETE FROM public.task_tags WHERE task_id=? AND tag_id=?;

--Tareas
SELECT id, title, description, complete, expiration_date, priority, created_in, updated_in, "userId", "categoryId" FROM public.tasks;
INSERT INTO public.tasks (id, title, description, complete, expiration_date, priority, created_in, updated_in, "userId", "categoryId") VALUES(uuid_generate_v4(), '', '', false, '', 'media'::character varying, now(), now(), ?, ?);
UPDATE public.tasks SET title='', description='', complete=false, expiration_date='', priority='media'::character varying, created_in=now(), updated_in=now(), "userId"=?, "categoryId"=? WHERE id=uuid_generate_v4();
DELETE FROM public.tasks WHERE id=uuid_generate_v4();












