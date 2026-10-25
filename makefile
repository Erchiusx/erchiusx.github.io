SHELL := /bin/bash
PARSER ?= ../igem-markdown/bindist/compiler

.PHONY: build parse clean

build: parse
	@cp templates/* .build/
	@cp -R static/. .build/
	@echo site generated

parse:
	@set -euo pipefail; \
	  rm -rf .build/ast; \
	  mkdir -p .build/ast; \
	  find md -type f -name '*.md' -print0 | while IFS= read -r -d '' source; do \
	    target=".build/ast/$${source#md/}"; \
	    target="$${target%.md}.json"; \
	    mkdir -p "$$(dirname "$$target")"; \
	    "$(PARSER)" "$$source" > "$$target"; \
	    python3 -m json.tool "$$target" > /dev/null; \
	    echo "parsed $$source"; \
	  done

clean:
	rm -rf .build
