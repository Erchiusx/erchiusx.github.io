.PHONY: parse build clean

build: parse
	@-mkdir -p .build
	@cp templates/* .build
	@cp -r parsed .build/ast
	@echo site generated

parse: $(patsubst md/%.md,parsed/%.json,$(wildcard md/**/*.md)) $(patsubst md/%.md,parsed/%.json,$(wildcard md/*.md))
	@echo detected markdown files: $^
	@echo all markdown files parsed, ast generated as json


parsed/%.json: md/%.md
	@mkdir -p $$(dirname $@)
	@touch $@
	@../igem-markdown/bindist/compiler $< > $@

clean:
	rm -rf .build
	rm -rf parsed
