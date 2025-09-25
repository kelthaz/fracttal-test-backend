--1. Consulta SQL para resolver primer caso de negocio solicitado.
WITH tareas_ultimos_30_dias AS (
    SELECT id, COUNT(*) AS tareas_count
    FROM tasks
    WHERE created_in  >= NOW() - INTERVAL '30 days'
    GROUP BY id
),
tareas_30_dias_anteriores AS (
    SELECT id, COUNT(*) AS tareas_count
    FROM tasks
    WHERE created_in >= NOW() - INTERVAL '60 days'
      AND created_in < NOW() - INTERVAL '30 days'
    GROUP BY id
)
SELECT
    COALESCE(AVG(t1.tareas_count), 0) AS promedio_ultimos_30_dias,
    COALESCE(AVG(t2.tareas_count), 0) AS promedio_30_dias_anteriores
FROM tareas_ultimos_30_dias t1
FULL OUTER JOIN tareas_30_dias_anteriores t2
    ON t1.id = t2.id;
   
--SALIDA pregunta 1
"promedio_ultimos_30_dias","promedio_30_dias_anteriores"
1.00000000000000000000,0

   
--2. ¿Cuál es la tasa de completado diaria de tareas en los últimos 90 días, agrupada por nivel de prioridad?
SELECT
    DATE(t.created_in) AS fecha,
    t.priority,
    COUNT(*) FILTER (WHERE t.complete = true) * 100.0 / NULLIF(COUNT(*), 0) AS tasa_completado
FROM tasks t
WHERE t.created_in >= NOW() - INTERVAL '90 days'
GROUP BY DATE(t.created_in), t.priority
ORDER BY fecha ASC, priority;

--SALIDA pregunta 2
"fecha","priority","tasa_completado"
2025-09-04,media,100.0000000000000000
2025-09-24,alta,100.0000000000000000
2025-09-24,baja,50.0000000000000000
2025-09-24,media,25.0000000000000000


--3. ¿Qué categorías tienen las tasas de completado más altas y más bajas, y cuál es el tiempo promedio de completado para cada categoría?
SELECT
    c.name AS categoria,
    COUNT(*) AS total_tareas,
    COUNT(*) FILTER (WHERE t.complete = true) * 100.0 / NULLIF(COUNT(*), 0) AS tasa_completado,
    AVG(EXTRACT(EPOCH FROM (t.updated_in - t.created_in)) / 3600) FILTER (WHERE t.complete = true) AS tiempo_promedio_horas
FROM categories c
LEFT JOIN tasks t ON c.id = t."categoryId"
GROUP BY c.id, c.name
ORDER BY tasa_completado DESC;

--SALIDA pregunta 3
"categoria","total_tareas","tasa_completado","tiempo_promedio_horas"
Estudio,1,100.0000000000000000,4.6185548666666667
Trabajo,4,50.0000000000000000,1.87092827305555557222
Hobbie,1,0.00000000000000000000,


--4. ¿Cuáles son las horas pico y días de la semana cuando los usuarios crean más tareas, y cuándo las completan?
SELECT
    TO_CHAR(t.created_in, 'Day') AS dia_semana,
    EXTRACT(HOUR FROM t.created_in) AS hora,
    COUNT(*) AS tareas_creadas
FROM tasks t
GROUP BY dia_semana, hora
ORDER BY tareas_creadas DESC;

-- Finalización de tareas
SELECT
    TO_CHAR(t.updated_in, 'Day') AS dia_semana,
    EXTRACT(HOUR FROM t.updated_in) AS hora,
    COUNT(*) AS tareas_completadas
FROM tasks t
WHERE t.complete = true
GROUP BY dia_semana, hora
ORDER BY tareas_completadas DESC;

--SALIDA pregunta 4
"dia_semana","hora","tareas_creadas"
Wednesday,12,5
Wednesday,21,3
Wednesday,15,2
Thursday ,12,1
Wednesday,18,1
--SALIDA pregunta 4 finalizacion tareas
Wednesday,13,2
Wednesday,15,1
Wednesday,23,1
Thursday ,0,1


--5. ¿Cuántas tareas están actualmente vencidas, agrupadas por usuario y categoría, y cuál es el promedio de días que están vencidas?
SELECT 
    u.name AS usuario,
    c.name AS categoria,
    COUNT(t.id) AS tareas_vencidas,
    ROUND(AVG(EXTRACT(DAY FROM NOW() - t.expiration_date)), 2) AS promedio_dias_vencidas
FROM tasks t
JOIN "Users" u ON u.id = t."userId"
LEFT JOIN categories c ON c.id = t."categoryId"
WHERE t.complete = false
  AND t.expiration_date IS NOT NULL
  AND t.expiration_date < NOW()
GROUP BY u.name, c.name
ORDER BY tareas_vencidas DESC;

--SALIDA pregunta 5 
-- No sale categoria ya que no tiene ID relacionado esa en especifico
"usuario","categoria","tareas_vencidas","promedio_dias_vencidas"
test,,1,2.00


-- 6. ¿Cuáles son las etiquetas más frecuentemente utilizadas, y qué etiquetas están asociadas con las tasas de completado más altas?
SELECT 
    tg.name AS etiqueta,
    COUNT(tt.task_id) AS veces_usada,
    ROUND(
        100.0 * SUM(CASE WHEN t.complete = TRUE THEN 1 ELSE 0 END) 
        / NULLIF(COUNT(tt.task_id), 0), 
        2
    ) AS tasa_completado
FROM task_tags tt
JOIN tasks t ON tt.task_id = t.id
JOIN tags tg ON tt.tag_id = tg.id
GROUP BY tg.name
ORDER BY veces_usada DESC, tasa_completado DESC;

--SALIDA pregunta 6 
"etiqueta","veces_usada","tasa_completado"
t1,1,100.00


--7. ¿Cuántos usuarios han creado al menos una tarea en cada una de las últimas 4 semanas, y cuál es la tasa de retención semana a semana?
WITH semanas AS (
    SELECT DISTINCT DATE_TRUNC('week', created_in) AS semana
    FROM tasks
    WHERE created_in >= NOW() - INTERVAL '90 days'
),
usuarios_por_semana AS (
    SELECT 
        DATE_TRUNC('week', t.created_in) AS semana,
        ARRAY_AGG(DISTINCT u.name) AS lista_usuarios,
        COUNT(DISTINCT u.id) AS usuarios_activos
    FROM tasks t
    JOIN "Users" u ON u.id = t."userId"
    WHERE t.created_in >= NOW() - INTERVAL '90 days'
    GROUP BY DATE_TRUNC('week', t.created_in)
    ORDER BY semana
),
retencion AS (
    SELECT 
        s1.semana AS semana_base,
        s2.semana AS semana_comparada,
        COUNT(DISTINCT u) AS usuarios_ret,
        s1.usuarios_activos AS total_base,
        ROUND(100.0 * COUNT(DISTINCT u) / NULLIF(s1.usuarios_activos,0), 2) AS tasa_retencion
    FROM usuarios_por_semana s1
    JOIN usuarios_por_semana s2
        ON s2.semana > s1.semana
    CROSS JOIN UNNEST(s1.lista_usuarios) AS u
    WHERE u = ANY(s2.lista_usuarios)
    GROUP BY s1.semana, s2.semana, s1.usuarios_activos
    ORDER BY s1.semana, s2.semana
)
SELECT * FROM retencion;

--SALIDA pregunta 7 
"semana_base","semana_comparada","usuarios_ret","total_base","tasa_retencion"
2025-09-01 00:00:00.000,2025-09-22 00:00:00.000,1,1,100.00


--8. ¿Cuál es la distribución de tareas a través de los niveles de prioridad para usuarios activos (usuarios que han iniciado sesión en los últimos 7 días)?
WITH usuarios_activos AS (
    SELECT DISTINCT "userId"
    FROM tasks
    WHERE created_in >= NOW() - INTERVAL '7 days'
)
SELECT 
    u.name AS usuario,
    t.priority,
    COUNT(*) AS cantidad_tareas
FROM tasks t
JOIN usuarios_activos ua ON ua."userId" = t."userId"
JOIN "Users" u ON u.id = t."userId"
GROUP BY u.name, t.priority
ORDER BY u.name, t.priority;

--SALIDA pregunta 8
"usuario","priority","cantidad_tareas"
TEST2,media,1
test,alta,1
test,baja,1
test,media,1
test2,baja,1
test2,media,5
val,media,2


--9. ¿Cómo varía la creación y completado de tareas por mes en el último año, y hay algún patrón estacional?
SELECT
    DATE_TRUNC('month', created_in) AS mes,
    COUNT(*) FILTER (WHERE complete = FALSE) AS tareas_creadas_pendientes,
    COUNT(*) FILTER (WHERE complete = TRUE)  AS tareas_completadas,
    COUNT(*) AS total_tareas
FROM tasks
WHERE created_in >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_in)
ORDER BY mes;

--SALIDA pregunta 9 
"mes","tareas_creadas_pendientes","tareas_completadas","total_tareas"
2025-09-01 00:00:00.000,7,5,12


--10. ¿Qué usuarios están en el 10% superior por tasa de completado de tareas, y cuál es el número promedio de tareas que manejan simultáneamente?
WITH user_task_stats AS (
    SELECT
        u.id AS user_id,
        u.name,
        COUNT(t.id) AS total_tareas,
        COUNT(t.id) FILTER (WHERE t.complete = true) AS tareas_completadas,
        AVG(CASE WHEN t.complete = false THEN 1 ELSE 0 END) AS tareas_activas_promedio,
        (COUNT(t.id) FILTER (WHERE t.complete = true)::decimal / NULLIF(COUNT(t.id),0)) AS tasa_completado
    FROM "Users" u
    LEFT JOIN tasks t ON t."userId"  = u.id
    GROUP BY u.id, u.name
),
top_10_percent AS (
    SELECT *
    FROM user_task_stats
    WHERE tasa_completado >= (
        SELECT PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY tasa_completado)
        FROM user_task_stats
    )
)
SELECT
    user_id,
    name,
    total_tareas,
    tareas_completadas,
    tasa_completado,
    tareas_activas_promedio
FROM top_10_percent
ORDER BY tasa_completado DESC;

--SALIDA pregunta 10 
"user_id","name","total_tareas","tareas_completadas","tasa_completado","tareas_activas_promedio"
a043d8f4-677f-4573-8c89-d592b00f8744,val,2,2,1.00000000000000000000,0.00000000000000000000


