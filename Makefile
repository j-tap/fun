.PHONY: prod build merge_env generate_traefik clean

merge_env:
	chmod +x merge_env.sh
	./merge_env.sh

generate_traefik:
	bash -c "set -a && source .env && envsubst < docker-compose.traefik.template.yml > docker-compose.traefik.yml"

prod: merge_env generate_traefik build
	docker compose --env-file .env -f docker-compose.prod.yml -f docker-compose.traefik.yml up -d

build:
	git_hash=$$(git rev-parse --short HEAD) && \
	docker compose --env-file .env -f docker-compose.prod.yml -f docker-compose.traefik.yml build --build-arg COMMIT_HASH=$$git_hash

clean:
	docker compose --env-file .env -f docker-compose.prod.yml -f docker-compose.traefik.yml down || true
	rm -rf client/dist client/.output client/.vite client/.turbo
	rm -rf server/.cache server/build server/.tmp
	find server -name '*.lock' -delete
	find client -name '*.lock' -delete
