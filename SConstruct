"""
the big build script
"""

import cairosvg
import cairosvg.surface
import cairocffi
import io
import math
from SCons.Script import AddOption, GetOption, Builder, Copy, Environment


AddOption('--aspect-ratio',
          dest='aspect_ratio',
          type='string',
          nargs=1,
          action='store',
          metavar='WIDTH-HEIGHT',
          default='any',
          help='The aspect ratio to build for. (Currently supports "4-3", "16-9", and "any", which disables aspect ratio dependent hacks.)')

AddOption('--build-directory',
          dest='build_dir',
          action='store',
          metavar='PATH',
          default='build',
          help="The directory where built files will be put")

AddOption('--client',
          dest='client',
          action='store',
          metavar='PATH',
          default='any',
          help='The client to build for (supports "stable", "mcosu", and "any", which tries to make the skin work on both clients)')

AddOption('--ranking-panel',
          dest='ranking_panel',
          action='store',
          metavar='PATH',
          default='any',
          help='The hacky ranking panel type to build (supports "osu", "taiko" (wip), and "any", which tries to make the ranking panel work for all modes (you probably want this if you compile for more than one mode))')

AddOption('--flashing',
          dest='flashing',
          action='store_true',
          help="Enable flashing via mode-x in song selection")

AddOption('--no-1x',
          dest='no_1x',
          action='store_true',
          help="Don\'t build 1x (SD) elements")

AddOption('--no-2x',
          dest='no_2x',
          action='store_true',
          help='Don\'t build 2x (HD) elements')

AddOption('--no-std', '--no-standard',
          dest='no_standard',
          action='store_true',
          help="Don\'t build osu!standard elements")

AddOption('--no-tk', '--no-taiko',
          dest='no_taiko',
          action='store_true',
          help="Don\'t build osu!taiko elements (wip)")

AddOption('--source-directory',
          dest='source_dir',
          action='store',
          metavar='PATH',
          default='src',
          help="The directory where source files are put")


def composite(target_surface, source_surface, x=0, y=0):
    ctx = cairocffi.Context(target_surface)

    ctx.set_source_surface(source_surface, x, y)
    ctx.paint()
    return target_surface


def render1x(target, source, env):
    for (t, s) in zip(target, source):
        cairosvg.svg2png(url=str(s), write_to=str(t))


def render2x(target, source, env):
    for (t, s) in zip(target, source):
        cairosvg.svg2png(url=str(s), write_to=str(t), scale=2)


def prepend_build_directory(files):
    """
    adds the build directory to the target
    """
    return tuple(map(lambda t: '$BUILDDIR/'+str(t), files))


def prepend_source_directory(files):
    """
    adds the source directory to the source
    """
    return tuple(map(lambda s: '$SOURCEDIR/'+str(s), files))


def prepend_directories(target, source):
    """
    adds the build directory and the source directory to the target and the source
    """
    return prepend_build_directory(target), prepend_source_directory(source)


svg1x = Builder(
    action=render1x,
    suffix='.png',
    src_suffix='.svg',
    emitter=lambda target, source, env: prepend_directories(target, source))

svg2x = Builder(
    action=render2x,
    src_suffix='.svg',
    emitter=lambda target, source, env:  # scuffedness 1000000
    (prepend_directories(tuple(map(lambda t: str(t) + '@2x.png', target)), source)))


def render_default(target, source):
    """
    render both SD and HD as needed
    """
    if not GetOption('no_1x'):
        env.SVG1x(target, source)

    if not GetOption('no_2x'):
        env.SVG2x(target, source)


def render_animation(target, frames):
    """
    render an animation
    frame number will be appended to target
    pass an iterable of source, repeat pairs to frames
    the frame will be repeated repeat times
    if the source is None then will use empty image
    if frame are skipped it will copy the last skinned frame
    """
    frame = 0
    for source, repeat in frames:

        t = target + str(frame)
        if(source == None):
            env.Empty(t)
        else:
            render_default(t, source)

        for j in range(frame + 1, frame + 1 + repeat):
            copy_default(target + str(j), t)

        frame += repeat + 1


empty = Builder(
    action=Copy('$TARGET', '$SOURCE'),
    suffix='.png',
    emitter=lambda target, source, env:
    (prepend_build_directory(target), 'src/graphics/special/none.png'))


copy_image = Builder(
    action=Copy('$TARGET', '$SOURCE'),
    suffix='.png',
    src_suffix='.png',
    emitter=lambda target, source, env:
    (prepend_build_directory(target), prepend_build_directory(source)))


def copy_default(target, source):
    """
    copy both SD and HD as needed
    """
    if not GetOption('no_1x'):
        env.CopyImage(target, source)

    if not GetOption('no_2x'):
        env.CopyImage(target + '@2x', source + '@2x')


env = Environment(
    NOQUALITY1X=GetOption('no_1x'), NOQUALITY2X=GetOption('no_2x'),
    ASPECTRATIO=GetOption('aspect_ratio'),
    FLASHING=GetOption('flashing'),
    BUILDDIR=GetOption('build_dir'), SOURCEDIR=GetOption('source_dir'),
    CLIENT=GetOption('client'),
    RANKINGPANEL=GetOption('ranking_panel'))

env.Append(BUILDERS={'SVG1x': svg1x, 'SVG2x': svg2x,
           'Empty': empty, 'CopyImage': copy_image})


env.Command(
    '$BUILDDIR/LICENSE',
    'LICENSE',
    Copy('$TARGET', '$SOURCE'))

env.Command(
    '$BUILDDIR/skin.ini',
    '$SOURCEDIR/meta/skin.ini',
    Copy('$TARGET', '$SOURCE'))


# menu background
# default('menu-background', 'graphics/interface/home/background.svg')
env.Command(
    '$BUILDDIR/menu-background.jpg',
    '$SOURCEDIR/graphics/interface/home/background.svg',
    action=render1x
)


# welcome
env.Empty('welcome_text.png')


# cursor
render_default('cursor', 'graphics/interface/cursor/cursor.svg')
env.Empty('cursortrail.png')
env.Empty('star2.png')


# cursor ripple (surprisingly)
render_default('cursor-ripple', 'graphics/interface/cursor/ripple')


# button
render_default('button-left', 'graphics/interface/button/left.svg')
render_default('button-middle', 'graphics/interface/button/middle.svg')
render_default('button-right', 'graphics/interface/button/right.svg')


# offset tick
render_default('options-offset-tick', 'graphics/interface/offset/tick')


# song select buttons
render_default('menu-back', 'graphics/interface/selection/frame/back.svg')

render_default('selection-mode',
               'graphics/interface/selection/frame/$ASPECTRATIO/mode.svg')
render_default('selection-mode-over',
               'graphics/interface/selection/frame/mode-over.svg')

render_default('selection-mods', 'graphics/interface/selection/frame/mods.svg')
render_default('selection-mods-over',
               'graphics/interface/selection/frame/mods-over.svg')

render_default('selection-random',
               'graphics/interface/selection/frame/random.svg')
render_default('selection-random-over',
               'graphics/interface/selection/frame/random-over.svg')

render_default('selection-options',
               'graphics/interface/selection/frame/$ASPECTRATIO/options.svg')
render_default('selection-options-over',
               'graphics/interface/selection/frame/options-over.svg')

# mode icon


def mode_icon(mode):
    """surprisingly long function to build mode icons"""
    # medium icon (in mode select)

    render_default('mode-'+mode+'-med', 'graphics/interface/modes/'+mode)

    # large icon (flashing in the middle of song select)
    if(GetOption('flashing')):
        env.SVG1x('mode-' + mode,
                  'graphics/interface/selection/frame/$ASPECTRATIO/flash.svg')
    else:
        env.Empty('mode-' + mode)

    # small icon (preview on mode button + hacky way to change top border)
    if GetOption('aspect_ratio') == 'any':
        if not GetOption('no_1x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small.png',
                        '$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                        action=lambda target, source, env:
                        cairosvg.svg2png(url=str(source[0]), write_to=str(target[0]), scale=0.5))

        if not GetOption('no_2x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small@2x.png',
                        '$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                        action=render1x)
    else:
        if not GetOption('no_1x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small.png',
                        ('$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                         '$SOURCEDIR/graphics/interface/selection/frame/$ASPECTRATIO/modebar.svg'),
                        action=lambda target, source, env:
                        composite(
                            target_surface := cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[1])))),
                            source_surface := cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[0]), scale=0.5))),
                            target_surface.get_width() / 2 - source_surface.get_width() / 2,
                            target_surface.get_height() / 2 - source_surface.get_height() / 2).write_to_png(str(target[0])))

        if not GetOption('no_2x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small@2x.png',
                        ('$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                         '$SOURCEDIR/graphics/interface/selection/frame/$ASPECTRATIO/modebar.svg'),
                        action=lambda target, source, env:
                        composite(
                            target_surface := cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[1]), scale=2))),
                            source_surface := cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[0])))),
                            target_surface.get_width() / 2 - source_surface.get_width() / 2,
                            target_surface.get_height() / 2 - source_surface.get_height() / 2).write_to_png(str(target[0])))


# song select tab
render_default('selection-tab', 'graphics/interface/selection/frame/tab.svg')


# song
render_default('menu-button-background',
               'graphics/interface/selection/song/background.svg')
render_default('star', 'graphics/interface/selection/song/star.svg')


# ranking letters
def ranking_grade_small(grade):
    """render small grade letters as needed"""
    target = '$BUILDDIR/ranking-' + grade + '-small'
    source = '$SOURCEDIR/graphics/interface/ranking/grades/' + grade + '.svg'

    if not GetOption('no_1x'):
        env.Command(target + '.png', source, action=lambda target, source, env: cairosvg.svg2png(
            url=str(source[0]), output_width=34, write_to=str(target[0])))

    if not GetOption('no_2x'):
        env.Command(target + '@2x.png', source, action=lambda target, source, env: cairosvg.svg2png(
            url=str(source[0]), output_width=68, write_to=str(target[0])))


def ranking_grade(*grades):
    """render grade letters as needed"""
    for grade in grades:
        render_default('ranking-'+grade,
                       'graphics/interface/ranking/grades/'+grade)
        ranking_grade_small(grade)


ranking_grade('XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D')


# mods
def render_mods(*mods):
    render_default(
        list(map(lambda mod: 'selection-mod-'+mod, mods)),
        list(map(lambda mod: 'graphics/interface/mods/'+mod, mods)))


render_mods('easy', 'nofail', 'halftime',
            'hardrock', 'suddendeath', 'perfect', 'doubletime', 'nightcore', 'hidden', 'flashlight',
            'relax', 'relax2', 'target', 'spunout', 'autoplay', 'cinema', 'scorev2')

if GetOption('client') in ('mcosu', 'any'):
    render_mods('nightmare', 'touchdevice')


# ranking panel and stuff
if GetOption('ranking_panel') == 'any':
    render_default('ranking-panel',
                   'graphics/interface/ranking/panels/$ASPECTRATIO/panel')
else:
    if not GetOption('no_1x'):
        env.Command('$BUILDDIR/ranking-panel.png', ['$SOURCEDIR/graphics/interface/ranking/panels/$ASPECTRATIO/panel.svg',
                    '$SOURCEDIR/graphics/interface/ranking/panels/numbers/'+GetOption('ranking_panel')+'.svg'], lambda target, source, env:
                        composite(
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[0])))),
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[1]))))).write_to_png(str(target[0])))
    if not GetOption('no_2x'):
        env.Command('$BUILDDIR/ranking-panel@2x.png', ['$SOURCEDIR/graphics/interface/ranking/panels/$ASPECTRATIO/panel.svg',
                    '$SOURCEDIR/graphics/interface/ranking/panels/numbers/'+GetOption('ranking_panel')+'.svg'], lambda target, source, env:
                        composite(
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[0]), scale=2))),
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[1]), scale=2)))).write_to_png(str(target[0])))
render_default('ranking-graph', 'graphics/interface/ranking/panels/graph')
render_default('pause-replay', 'graphics/interface/ranking/panels/replay')
render_default('ranking-winner', 'graphics/interface/ranking/status/winner')
render_default('ranking-perfect', 'graphics/interface/ranking/status/fc')

env.Empty('ranking-title')
env.Empty('ranking-maxcombo')
env.Empty('ranking-accuracy')


# fonts
CHAR_REPLACE = {  # special characters in filenames and their corresponding characters
    'comma': ',',
    'dot': '.',
    'percent': '%'
}


GLYPH_WIDTH_OFFSET = {
    ',': 0.1
}


OVERLAP = -6  # we draw overlap into the skin instead of using skin.ini because for some reason ranking screen doesnt respect it


def font(font_name, glyphs, scale=20, alignx='left', aligny='top'):
    """render font"""
    glyphs = map(lambda g: (str(g), (CHAR_REPLACE[glyph] if (
        glyph := str(g)) in CHAR_REPLACE else glyph)), glyphs)

    def get_render_font_glyph(glyph, scale, width_override=None):
        # cairo text actually sucks im just going to commit this shit i give up
        def render_font_glyph(target, source, env):
            surface = cairocffi.ImageSurface(
                cairocffi.FORMAT_ARGB32, 16 * scale, 16 * scale)
            ctx = cairocffi.Context(surface)
            ctx.scale(scale)

            ctx.set_source_rgba(1, 1, 1)
            ctx.select_font_face('osifont')
            ctx.set_font_size(1)
            ascent, descent, _, _, _ = ctx.font_extents()
            text_x_bearing, _, text_width, _, _, _ = ctx.text_extents(
                glyph)

            if alignx == 'left':
                if width_override != None:
                    width = width_override
                else:
                    x = 0
                    width = text_x_advance
            elif alignx == 'middle':
                x = -text_x_bearing - OVERLAP / scale / 2
                width = text_width

            width -= OVERLAP / scale

            if(glyph in GLYPH_WIDTH_OFFSET):
                width += GLYPH_WIDTH_OFFSET[glyph]

            height = ascent + 2 * descent
            y = ascent + descent

            ctx.move_to(x, y)

            ctx.show_text(glyph)

            cropped_surface = cairocffi.ImageSurface(
                cairocffi.FORMAT_ARGB32, math.ceil(width * scale), math.ceil(height * scale))

            ctx = cairocffi.Context(cropped_surface)

            # debugging (i feel the need to leave this in here. that's how bad it gets)
            # ctx.set_source_rgba(1, 0, 0)
            # ctx.paint()

            ctx.set_source_surface(surface)
            ctx.paint()

            cropped_surface.write_to_png(str(target[0]))

        return render_font_glyph

    for glyph_name, glyph in glyphs:
        width_override = 0.4 if glyph in [str(n) for n in range(10)] else None

        if not GetOption('no_1x'):
            env.Command(
                '$BUILDDIR/' + font_name + '-' + glyph_name + '.png',
                [],
                action=get_render_font_glyph(glyph, scale, width_override))

        if not GetOption('no_2x'):
            env.Command(
                '$BUILDDIR/' + font_name + '-' + glyph_name + '@2x.png',
                [],
                action=get_render_font_glyph(glyph, scale * 2, width_override))


font('default', range(10), 35, 'middle')
font('score', [*range(10), 'comma', 'dot'], 40, 'middle')
env.Empty('score-x')
env.Empty('score-percent')
font('scoreentry', [*range(10), 'comma', 'dot',
     'percent', 'x'], 15, 'middle')

# masking border
env.Empty('masking-border')


# scorebar (surprisingly)
ADDED_SCOREBAR = True
render_default('scorebar-bg', 'graphics/interface/hud/scorebar/background')
render_default('scorebar-colour', 'graphics/interface/hud/scorebar/colour')


# skip button
render_default('play-skip', 'graphics/interface/hud/skip')


# unranked icon
render_default('play-unranked', 'graphics/interface/hud/unranked')


# countdown
env.Empty('ready')
env.Empty('count3')
env.Empty('count2')
env.Empty('count1')
env.Empty('go')

# input overlay
env.Empty('inputoverlay-background')
render_default('inputoverlay-key', 'graphics/interface/hud/inputoverlay/key')


# pause screen
render_default('pause-continue', 'graphics/interface/pause/continue')
render_default('pause-retry', 'graphics/interface/pause/retry')
render_default('pause-back', 'graphics/interface/pause/back')
render_default('arrow-pause', 'graphics/interface/pause/focus')

# pass/fail
render_default('section-pass', 'graphics/interface/hud/pass')
render_default('section-fail', 'graphics/interface/hud/fail')


# warning arrow
render_default('arrow-warning', 'graphics/interface/hud/warning')


# multi-skipped
env.Empty('multi-skipped')


# spinner
ADDED_SPINNER = False


def spinner():
    """
    exactly what it says on the tin
    """
    global ADDED_SPINNER
    if not ADDED_SPINNER:
        ADDED_SPINNER = True
        render_default('spinner-circle', 'graphics/gameplay/spinner/circle')
        render_default('spinner-approachcircle',
                       'graphics/gameplay/spinner/approachcircle')


# approach circle
ADDED_APPROACHCIRCLE = False


def approachcircle():
    global ADDED_APPROACHCIRCLE
    if not ADDED_APPROACHCIRCLE:
        ADDED_APPROACHCIRCLE = True
        render_default('approachcircle', 'graphics/gameplay/approachcircle')


# lighting
ADDED_LIGHTING = False


def lighting():
    global ADDED_LIGHTING
    if not ADDED_LIGHTING:
        ADDED_LIGHTING = True
        render_default('lighting', 'graphics/gameplay/lighting')


# hitburst dimensions for any ranking panel
HITBURST_WIDTH = 134
HITBURST_HEIGHT = 59

if not GetOption('no_standard'):  # standard-only elements
    # mode icon
    mode_icon('osu')

    # cursor smoke (surprisingly)
    # render_default('cursor-smoke', 'graphics/gameplay/osu/cursor-smoke')

    # approach circle
    approachcircle()

    # circle (surprisingly)
    render_default('hitcircle', 'graphics/gameplay/osu/circle')
    render_default('hitcircleoverlay', 'graphics/gameplay/osu/circleoverlay')

    # slider ball
    render_default('sliderb', 'graphics/gameplay/osu/slider/ball')

    # slider tick
    render_default('sliderscorepoint', 'graphics/gameplay/osu/slider/tick')

    # slider follow circle
    render_default('sliderfollowcircle', 'graphics/gameplay/osu/slider/follow')

    # slider end circle (surprisingly)
    env.Empty('sliderendcircle')

    # slider reverse arrow
    render_default('reversearrow', 'graphics/gameplay/osu/slider/reverse')

    # spinner (surprinsingly)
    spinner()
    render_default('spinner-rpm', 'graphics/gameplay/osu/spinner/rpm')
    render_default('spinner-metre', 'graphics/gameplay/osu/spinner/metre')
    env.Empty('spinner-background')
    env.Empty('spinner-clear')
    env.Empty('spinner-spin')

    # hitbursts
    env.Empty('hit300')
    env.Empty('hit300k')
    env.Empty('hit300g')

    if GetOption('ranking_panel') == 'any':
        if not GetOption('no_1x'):
            def paddedhitburst1x(target, source, env):
                composite(cairocffi.ImageSurface(cairocffi.FORMAT_ARGB32, HITBURST_WIDTH, HITBURST_HEIGHT),
                          hitburst_surface := cairocffi.ImageSurface.create_from_png(io.BytesIO(
                              cairosvg.svg2png(url=str(source[0])))), (HITBURST_WIDTH - hitburst_surface.get_width()) / 2, HITBURST_HEIGHT / 2).write_to_png(str(target[0]))

            env.Command('$BUILDDIR/hit100.png',
                        '$SOURCEDIR/graphics/gameplay/osu/hitbursts/100.svg', paddedhitburst1x)
            env.Command('$BUILDDIR/hit50.png',
                        '$SOURCEDIR/graphics/gameplay/osu/hitbursts/50.svg', paddedhitburst1x)
            env.Command('$BUILDDIR/hit0.png',
                        '$SOURCEDIR/graphics/gameplay/osu/hitbursts/0.svg', paddedhitburst1x)

        if not GetOption('no_2x'):
            def paddedhitburst2x(target, source, env):
                composite(cairocffi.ImageSurface(cairocffi.FORMAT_ARGB32, HITBURST_WIDTH * 2, HITBURST_HEIGHT * 2),
                          hitburst_surface := cairocffi.ImageSurface.create_from_png(io.BytesIO(
                              cairosvg.svg2png(url=str(source[0]), scale=2))), HITBURST_WIDTH - hitburst_surface.get_width() / 2, HITBURST_HEIGHT).write_to_png(str(target[0]))

            env.Command('$BUILDDIR/hit100@2x.png',
                        '$SOURCEDIR/graphics/gameplay/osu/hitbursts/100.svg', paddedhitburst2x)
            env.Command('$BUILDDIR/hit50@2x.png',
                        '$SOURCEDIR/graphics/gameplay/osu/hitbursts/50.svg', paddedhitburst2x)
            env.Command('$BUILDDIR/hit0@2x.png',
                        '$SOURCEDIR/graphics/gameplay/osu/hitbursts/0.svg', paddedhitburst2x)

        copy_default('hit100k', 'hit100')
    else:
        render_default('hit100-0', 'graphics/gameplay/osu/hitbursts/100')
        render_default('hit50-0', 'graphics/gameplay/osu/hitbursts/50')
        render_default('hit0-0', 'graphics/gameplay/osu/hitbursts/0')

        copy_default('hit100k-0', 'hit100-0')

        env.Empty('hit100')
        # i dont wanna deal with this rn but we could save a little space by deleting @2x instead of writing an empty image
        env.Empty('hit100@2x')
        env.Empty('hit100k')
        env.Empty('hit100k@2x')
        env.Empty('hit50')
        env.Empty('hit50@2x')
        env.Empty('hit0')
        env.Empty('hit0@2x')

    # follow points (surprisingly)
    # render_default('followpoint', 'graphics/gameplay/osu/followpoint.svg') # non-animated followpoints if you are a masochist

    render_animation('followpoint-', (  # thanks to stephen clark's video on followpoints (https://youtu.be/OVGzCPsLH7c?t=247)
        (None, 0),
        ('graphics/gameplay/osu/followpoint', 1),
        (None, 0)
    ))

# TAIKO_HITBURST_PAD_BOTTOM =

if not GetOption('no_taiko'):
    # mode icon
    mode_icon('taiko')

    # slider thing
    env.Empty('taiko-slider')
    env.Empty('taiko-slider-fail')

    # pippidon (sorry pippidon)
    env.Empty('pippidonidle')
    env.Empty('pippidonkiai')
    env.Empty('pippidonfail')
    env.Empty('pippidonclear')

    # bar left drum thing
    render_default('taiko-bar-left',
                   'graphics/gameplay/taiko/bar/drum/background')
    render_default('taiko-drum-inner',
                   'graphics/gameplay/taiko/bar/drum/inner')
    render_default('taiko-drum-outer',
                   'graphics/gameplay/taiko/bar/drum/outer')

    # bar
    render_default('taiko-bar-right', 'graphics/gameplay/taiko/bar/bar.svg')
    render_default('taiko-bar-right-glow',
                   'graphics/gameplay/taiko/bar/glow.svg')

    # approach circle
    approachcircle()
    env.Empty('taiko-glow')

    # circle (surprisingly)
    render_default('taikohitcircle', 'graphics/gameplay/taiko/circle')
    render_default('taikohitcircleoverlay',
                   'graphics/gameplay/taiko/circleoverlay')

    copy_default('taikobigcircle', 'taikohitcircle')
    render_default('taikobigcircleoverlay',
                   'graphics/gameplay/taiko/bigcircleoverlay')

    # roll
    render_default('taiko-roll-middle',
                   'graphics/gameplay/taiko/roll/middle')
    render_default('taiko-roll-end',
                   'graphics/gameplay/taiko/roll/end')

    # spinner warning
    render_default('spinner-warning', 'graphics/gameplay/taiko/spinner')

    # hitbursts
    env.Empty('taiko-hit300')
    env.Empty('taiko-hit300k')
    env.Empty('taiko-hit300g')

    if GetOption('ranking_panel') == 'any':
        render_default('taiko-hit100',
                       'graphics/gameplay/taiko/hitbursts/100')
        render_default('taiko-hit0', 'graphics/gameplay/taiko/hitbursts/0')

        copy_default('taiko-hit100k', 'taiko-hit100')
    else:
        render_default('taiko-hit100-0',
                       'graphics/gameplay/taiko/hitbursts/100')
        render_default('taiko-hit0-0', 'graphics/gameplay/taiko/hitbursts/0')

        copy_default('taiko-hit100k-0', 'taiko-hit100-0')

        env.Empty('taiko-hit100')
        # i dont wanna deal with this rn but we could save a little space by deleting @2x instead of writing an empty image
        env.Empty('taiko-hit100@2x')
        env.Empty('taiko-hit100k')
        env.Empty('taiko-hit100k@2x')
        env.Empty('taiko-hit50')
        env.Empty('taiko-hit50@2x')
        env.Empty('taiko-hit0')
        env.Empty('taiko-hit0@2x')

# editor circle select
render_default('hitcircleselect', 'graphics/interface/editor/select.svg')
