.PHONY: parse build clean

build:
	-mkdir .build
	cp templates/* .build
	cp -r parsed .build/ast

parsed/%.json: md/%.md
	/Volumes/erchiufs/Development/igem-markdown/dist-newstyle/build/aarch64-osx/ghc-9.12.2/igem-markdown-1.0.0.0/x/compiler/build/compiler/compiler $< > $@

clean:
	rm -rf .build
