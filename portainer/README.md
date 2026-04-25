# Portainer — Feature 05

Panel web de monitoreo y administración de contenedores Docker para el stack TeamBoard.

## Configuración

Portainer no tiene Dockerfile propio. Su configuración está declarada en el `docker-compose.yml` de la raíz del repositorio, usando la imagen oficial `portainer/portainer-ce:latest`.

Puntos clave:

- **Imagen**: `portainer/portainer-ce:latest`
- **Puerto**: `${PORTAINER_PORT}` (por defecto `9000`, definido en `.env`)
- **Socket Docker**: monta `/var/run/docker.sock` para comunicarse con el daemon del host
- **Volumen**: `portainer_data` persiste usuarios, configuraciones y entornos entre reinicios
- **Restart policy**: `unless-stopped` para que el panel quede siempre disponible

## Acceso

1. Levantar el stack: `docker compose up -d --build`
2. Abrir en el navegador: <http://localhost:9000>
3. La primera vez, Portainer pide crear un usuario administrador (mínimo 12 caracteres).
4. Seleccionar el entorno **local Docker** ("Get Started" → environment local).

## Qué se puede monitorear

- Listado de contenedores del stack (`frontend`, `backend`, `postgres_db`, `portainer`) con estado, uso de CPU/memoria y healthcheck.
- Logs en tiempo real de cada servicio.
- Volúmenes (`db_data`, `portainer_data`) y red interna `teamboard-net`.
- Stack `is-2026-checkpoint-01` agrupado por Compose project.

## Capturas

Las capturas de evidencia se encuentran en `screenshots/` y se referencian desde el README principal.
