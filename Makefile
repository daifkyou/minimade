# minimake!
# I'm probably using make wrong but it's my first time let me have some fun

SKINNAME = minimade-glow
# ASPECTRATIO = 16:9 # unused

# ranking elements

rankings = XH X SH S A B C D
ranking-basenames = $(addprefix build/ranking-,$(rankings))
images-ranking-small = $(addsuffix -small.png,$(ranking-basenames))
images-ranking-small@2x = $(addsuffix -small@2x.png,$(ranking-basenames))

# mode elements

mode-elements = osu
mode-basenames = $(addprefix build/mode-,$(mode-elements))
mode-med-basenames = $(addsuffix -med,$(mode-basenames))
mode-small-basenames = $(addsuffix -small,$(mode-basenames))
mode-med@1x = $(addsuffix .png,$(mode-med-basenames))
mode-med@2x = $(addsuffix @2x.png,$(mode-med-basenames))
mode-small@1x = $(addsuffix .png,$(mode-small-basenames))
mode-small@2x = $(addsuffix @2x.png,$(mode-small-basenames))

modes-scaled@1x = $(mode-med@1x) $(mode-small@1x)
modes-scaled@2x = $(mode-med@2x) $(mode-small@2x)

# mods

mods = autoplay cinema doubletime easy flashlight halftime hardrock hidden nightcore nofail perfect relax relax2 scorev2 spunout suddendeath target
mods-basenames = $(addprefix build/selection-mod-,$(mods))

# 1x/2x elements
# hit100-0 is the ingame frame while hit100 is for the ranking screen (empty), and the 100 is in the ranking background (same for hit50 and hit100k)
scaled-elements = cursor cursor-smoke approachcircle hitcircle hitcircleoverlay hitcircleselect lighting reversearrow sliderfollowcircle sliderb followpoint hit100-0 hit50-0 hit0 spinner-approachcircle spinner-circle spinner-metre spinner-rpm sliderscorepoint menu-button-background menu-back button-left button-middle button-right ranking-graph ranking-perfect star play-skip play-unranked play-warningarrow section-fail section-pass multi-skipped scorebar-bg scorebar-colour inputoverlay-key pause-back pause-continue pause-replay pause-retry arrow-pause selection-mode selection-mode-over selection-mods selection-mods-over selection-random selection-random-over selection-options selection-options-over selection-tab options-offset-tick ranking-winner
scaled-basenames = $(addprefix build/,$(scaled-elements)) $(ranking-basenames) $(mods-basenames) $(mode-basenames)
images@1x = $(addsuffix .png,$(scaled-basenames))
images@2x = $(addsuffix @2x.png,$(scaled-basenames))

# sd only elements

unscaled-elements = ranking-panel
images-unscaled = $(addsuffix .png,$(addprefix build/,$(unscaled-elements)))

# empty elements

none-elements = sliderendcircle sliderendcircleoverlay cursortrail hit300 hit300g hit300k score-percent score-x spinner-background spinner-spin spinner-clear ranking-title ranking-accuracy ranking-maxcombo star2 count1 count2 count3 go ready inputoverlay-background pause-overlay fail-background comboburst menu-snow scorebar-ki scorebar-kidanger scorebar-kidanger2 hit100 hit100k hit50
images-none = $(addsuffix .png,$(addprefix build/,$(none-elements)))

# fonts

default = 0 1 2 3 4 5 6 7 8 9
default-basenames = $(addprefix build/default-,$(default))
font-default@1x = $(addsuffix .png,$(default-basenames))
font-default@2x = $(addsuffix @2x.png,$(default-basenames))
default-size = 3

score = 0 1 2 3 4 5 6 7 8 9 dot comma
score-basenames = $(addprefix build/score-,$(score))
font-score@1x = $(addsuffix .png,$(score-basenames))
font-score@2x = $(addsuffix @2x.png,$(score-basenames))
score-size = 3

scoreentry = 0 1 2 3 4 5 6 7 8 9 dot comma percent x
scoreentry-basenames = $(addprefix build/scoreentry-,$(scoreentry))
font-scoreentry@1x = $(addsuffix .png,$(scoreentry-basenames))
font-scoreentry@2x = $(addsuffix @2x.png,$(scoreentry-basenames))
scoreentry-size = 1



# sounds
silent = heartbeat seeya welcome key-delete key-movement key-press-1 key-press-2 key-press-3 key-press-4 back-button-click shutter back-button-hover click-short menuclick menu-back-hover menu-charts-hover menu-direct-hover menu-edit-hover menu-exit-hover menu-freeplay-hover menu-multiplayer-hover menu-options-hover menu-play-hover pause-hover pause-back-hover pause-continue-hover pause-retry-hover count1s count2s count3s gos readys comboburst failsound sectionpass sectionfail applause pause-loop
# basically all of the silent sounds should serve no practical purpose (imo), if you want any to be skinned open an issue and explain why they shouldnt be silent
sounds-silent = $(addsuffix .wav,$(addprefix build/,$(silent)))

audio = $(sounds-silent)

# targets

both: 1x 2x

1x: unscaled special@1x $(images@1x)
2x: unscaled special@2x $(images@2x)

special@1x: build/skin.ini build/menu-background.jpg $(images-ranking-small) build/hit100k-0.png $(modes-scaled@1x) $(font-default@1x) $(font-score@1x) $(font-scoreentry@1x) $(audio)
special@2x: build/skin.ini build/menu-background.jpg $(images-ranking-small@2x) build/hit100k-0@2x.png $(modes-scaled@2x) $(font-default@2x) $(font-score@2x) $(font-scoreentry@2x) $(audio)
unscaled: $(images-unscaled) $(images-none) $(images-ranking)

export: | build
	zip -jr $(SKINNAME).osk build

# converting

$(images@1x) $(images-unscaled) $(images-ranking): build/%.png: src/graphics/%.svg | build
	rsvg-convert $< -o $@

$(images@2x): build/%@2x.png: src/graphics/%.svg | build
	rsvg-convert -z 2 $< -o $@

# special

build:
	mkdir build

build/LICENSE: LICENSE | build
	cp $< $@

build/skin.ini: src/skin.ini | build
	cp $< $@

build/menu-background.jpg: src/graphics/menu-background.svg | build
	rsvg-convert -b black $< -o $@ # format can be png but must be named jpg lol

build/hit100k-0.png: build/hit100-0.png
	cp $< $@

build/hit100k-0@2x.png: build/hit100-0@2x.png
	cp $< $@

$(images-ranking-small): build/%-small.png: src/graphics/%.svg | build
	rsvg-convert -w 34 $< -o $@

$(images-ranking-small@2x): build/%-small@2x.png: src/graphics/%.svg | build
	rsvg-convert -w 68 $< -o $@

$(images-none): %: src/none.png | build
	cp $< $@

$(mode-med@1x): build/%-med.png: src/graphics/%.svg | build
	rsvg-convert -z 0.5 $< -o $@

$(mode-med@2x): build/%-med@2x.png: src/graphics/%.svg | build
	rsvg-convert -z 1 $< -o $@

$(mode-small@1x): build/%-small.png: src/graphics/%.svg | build
	rsvg-convert -z 0.25 $< -o $@

$(mode-small@2x): build/%-small@2x.png: src/graphics/%.svg | build
	rsvg-convert -z 0.5 $< -o $@

# font rules

$(font-default@1x): build/default-%.png: src/graphics/font/default/%.svg | build
	rsvg-convert -z $(default-size) $< -o $@

$(font-default@2x): build/default-%@2x.png: src/graphics/font/default/%.svg | build
	rsvg-convert -z $(shell expr $(default-size) \* 2) $< -o $@

$(font-score@1x): build/score-%.png: src/graphics/font/score/%.svg | build
	rsvg-convert -z $(score-size) $< -o $@

$(font-score@2x): build/score-%@2x.png: src/graphics/font/score/%.svg | build
	rsvg-convert -z $(shell expr $(score-size) \* 2) $< -o $@

$(font-scoreentry@1x): build/scoreentry-%.png: src/graphics/font/scoreentry/%.svg | build
	rsvg-convert -z $(score-size) $< -o $@

$(font-scoreentry@2x): build/scoreentry-%@2x.png: src/graphics/font/scoreentry/%.svg | build
	rsvg-convert -z $(shell expr $(scoreentry-size) \* 2) $< -o $@

# audio rules

$(sounds-silent): build/%.wav: src/silent.wav
	cp $< $@



clean:
	rm build/* || :
veryclean: clean
	rm -r build
