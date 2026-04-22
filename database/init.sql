CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    legajo VARCHAR(50),
    feature VARCHAR(100),
    servicio VARCHAR(100),
    estado VARCHAR(50)
);

INSERT INTO members (nombre, apellido, legajo, feature, servicio, estado) VALUES 
('Marcelo', 'Tassi', '29680', 'Feature 01 — Coordinación', 'docker-compose, README', 'activo'),
('Matias', 'Delozano', '27978', 'Feature 02 — Frontend', 'frontend', 'activo'),
('Abel', 'Di Bella', '25619', 'Feature 03 — Backend', 'backend', 'activo'),
('Alejandro', 'Llontop', '31890', 'Feature 04 — Base de datos', 'database', 'activo'),
('Mateo', 'Lafalce', '33217', 'Feature 05 — Portainer', 'portainer', 'activo');