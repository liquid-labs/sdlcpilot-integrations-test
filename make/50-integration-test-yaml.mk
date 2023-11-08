CATALYST_SDLC_YAML:=catalyst-sdlc-integration-test.yaml
CATALYST_SDLC_YAML_BUILT:=.github/workflows/$(CATALYST_SDLC_YAML)

$(CATALYST_SDLC_YAML_BUILT): src/$(CATALYST_SDLC_YAML)
	mkdir -p $(dir $@)
	cp $< $@

BUILD_TARGETS+=$(CATALYST_SDLC_YAML_BUILT)
