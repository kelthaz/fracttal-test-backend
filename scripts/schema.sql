-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';
-- public."Users" definition

-- Drop table

-- DROP TABLE public."Users";

CREATE TABLE public."Users" (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	email varchar NOT NULL,
	"name" varchar NOT NULL,
	"password" varchar NOT NULL,
	created_in timestamp NOT NULL DEFAULT now(),
	CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY (id),
	CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE (email)
);

-- Permissions

ALTER TABLE public."Users" OWNER TO d3v404;
GRANT ALL ON TABLE public."Users" TO d3v404;


-- public.categories definition

-- Drop table

-- DROP TABLE public.categories;

CREATE TABLE public.categories (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" varchar NOT NULL,
	"userId" uuid NULL,
	CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id),
	CONSTRAINT "FK_13e8b2a21988bec6fdcbb1fa741" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.categories OWNER TO d3v404;
GRANT ALL ON TABLE public.categories TO d3v404;


-- public.tags definition

-- Drop table

-- DROP TABLE public.tags;

CREATE TABLE public.tags (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" varchar NOT NULL,
	"userId" uuid NULL,
	CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY (id),
	CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE (name),
	CONSTRAINT "FK_92e67dc508c705dd66c94615576" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE CASCADE
);

-- Permissions

ALTER TABLE public.tags OWNER TO d3v404;
GRANT ALL ON TABLE public.tags TO d3v404;


-- public.tasks definition

-- Drop table

-- DROP TABLE public.tasks;

CREATE TABLE public.tasks (
	id uuid NOT NULL DEFAULT uuid_generate_v4(),
	title varchar NOT NULL,
	description varchar NULL,
	complete bool NOT NULL DEFAULT false,
	expiration_date timestamp NULL,
	priority varchar NOT NULL DEFAULT 'media'::character varying,
	created_in timestamp NOT NULL DEFAULT now(),
	updated_in timestamp NOT NULL DEFAULT now(),
	"userId" uuid NULL,
	"categoryId" uuid NULL,
	CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY (id),
	CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE CASCADE,
	CONSTRAINT "FK_8ae9301033f772a42330e917a7d" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE SET NULL
);

-- Permissions

ALTER TABLE public.tasks OWNER TO d3v404;
GRANT ALL ON TABLE public.tasks TO d3v404;


-- public.task_tags definition

-- Drop table

-- DROP TABLE public.task_tags;

CREATE TABLE public.task_tags (
	task_id uuid NOT NULL,
	tag_id uuid NOT NULL,
	CONSTRAINT "PK_a7354e3c3f630636f6e4a29694a" PRIMARY KEY (task_id, tag_id),
	CONSTRAINT "FK_70515bc464901781ac60b82a1ea" FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "FK_f883135d033e1541f6a81972e7d" FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);
CREATE INDEX "IDX_70515bc464901781ac60b82a1e" ON public.task_tags USING btree (task_id);
CREATE INDEX "IDX_f883135d033e1541f6a81972e7" ON public.task_tags USING btree (tag_id);

-- Permissions

ALTER TABLE public.task_tags OWNER TO d3v404;
GRANT ALL ON TABLE public.task_tags TO d3v404;



CREATE OR REPLACE FUNCTION public.uuid_generate_v1()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v1() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_generate_v1() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v1mc$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v1mc() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_generate_v1mc() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_generate_v3(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v3$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v3(uuid, text) OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_generate_v3(uuid, text) TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_generate_v4()
 RETURNS uuid
 LANGUAGE c
 PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v4$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v4() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_generate_v4() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_generate_v5(namespace uuid, name text)
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_generate_v5$function$
;

-- Permissions

ALTER FUNCTION public.uuid_generate_v5(uuid, text) OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_generate_v5(uuid, text) TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_nil()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_nil$function$
;

-- Permissions

ALTER FUNCTION public.uuid_nil() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_nil() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_ns_dns()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_dns$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_dns() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_ns_dns() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_ns_oid()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_oid$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_oid() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_ns_oid() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_ns_url()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_url$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_url() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_ns_url() TO d3v404;

CREATE OR REPLACE FUNCTION public.uuid_ns_x500()
 RETURNS uuid
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/uuid-ossp', $function$uuid_ns_x500$function$
;

-- Permissions

ALTER FUNCTION public.uuid_ns_x500() OWNER TO d3v404;
GRANT ALL ON FUNCTION public.uuid_ns_x500() TO d3v404;


-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT USAGE ON SCHEMA public TO public;
