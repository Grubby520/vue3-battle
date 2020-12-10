### internal
override null					  :=
override space					:= $(null) #
override comma					:= ,

override DOCKER_REGISTRY_ROOT	:= registry.cn-shenzhen.aliyuncs.com

ENV					      := qa
NODE_BUILD        := npm
DOCKER_REGISTRY		:=

### goals
.PHONY: pull qa alpha beta prod docker build pack push clean

show-goals:
	@echo goals: pull qa alpha beta prod docker build pack push clean

all-qa: pull qa build pack clean
all-alpha: pull alpha build pack push clean
all-beta: pull beta build pack push clean
all-prod: pull prod build pack push clean

pull:
	git checkout -q && git pull --all -q && git reset --hard HEAD

qa:
	$(eval ENV := qa)
	$(eval DOCKER_REGISTRY := erp-$(ENV))
	@echo env = $(ENV), DOCKER_REGISTRY = $(DOCKER_REGISTRY)

alpha:
	$(eval ENV := alpha)
	$(eval DOCKER_REGISTRY := $(DOCKER_REGISTRY_ROOT)/erp-$(ENV))
	@echo env = $(ENV), DOCKER_REGISTRY = $(DOCKER_REGISTRY)

beta:
	$(eval ENV := beta)
	$(eval DOCKER_REGISTRY := $(DOCKER_REGISTRY_ROOT)/erp-$(ENV))
	@echo env = $(ENV), DOCKER_REGISTRY = $(DOCKER_REGISTRY)

prod:
	$(eval ENV := prod)
	$(eval DOCKER_REGISTRY := $(DOCKER_REGISTRY_ROOT)/erp-$(ENV))
	@echo env = $(ENV), DOCKER_REGISTRY = $(DOCKER_REGISTRY)

docker:
	$(eval NODE_BUILD := docker run --rm --volume ${PWD}:${PWD} --workdir ${PWD} node:12-alpine $(NODE_BUILD))
	@echo build w/ docker

build:
	$(NODE_BUILD) install
	$(NODE_BUILD) run build

pack:
	export DOCKER_REGISTRY=$(DOCKER_REGISTRY) && \
	export COMPOSE_OPTIONS="--env DOCKER_REGISTRY=$(DOCKER_REGISTRY)" && \
	docker-compose build

push:
	export DOCKER_REGISTRY=$(DOCKER_REGISTRY) && \
	export COMPOSE_OPTIONS="--env DOCKER_REGISTRY=$(DOCKER_REGISTRY)" && \
	docker-compose push

clean:
	-docker image prune -f > /dev/null
