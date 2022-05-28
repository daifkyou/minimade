"""
the big build script
"""

import cairosvg
import cairosvg.surface
import cairocffi
import io

from pathlib import Path

from SCons.Script import GetOption, AddOption, Environment, Builder, Copy


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

AddOption('--aspect-ratio',
          dest='aspect_ratio',
          type='string',
          nargs=1,
          action='store',
          metavar='WIDTH-HEIGHT',
          default='any',
          help='The aspect ratio to build for. (Currently supports "4-3", "16-9", and "any", which disables aspect ratio dependent hacks.)')

AddOption('--flashing',
          dest='flashing',
          action='store_true',
          help="Enable flashing via mode-x in song selection")

AddOption('--build-directory',
          dest='build_dir',
          action='store',
          metavar='PATH',
          default='build',
          help="The directory where built files will be put")

AddOption('--source-directory',
          dest='source_dir',
          action='store',
          metavar='PATH',
          default='src',
          help="The directory where source files are put")

AddOption('--client',
          dest='client',
          action='store',
          metavar='PATH',
          default='any',
          help='The client to build for (supports "stable", "mcosu", and "any", which tries to make the skin work on both clients)')

BUILDDIR = 'build'
SOURCEDIR = 'src'


def render1x(target, source, env):
    for (t, s) in zip(target, source):
        cairosvg.svg2png(url=str(s), write_to=str(t))


def render2x(target, source, env):
    for (t, s) in zip(target, source):
        cairosvg.svg2png(url=str(s), write_to=str(t), scale=2)


def prepend_build_directory(target, source, env):
    """
    adds the build directory to the target
    """
    return tuple(map(lambda t: '$BUILDDIR/'+str(t), target)), source


def prepend_source_directory(target, source, env):
    """
    adds the source directory to the source
    """
    return target, tuple(map(lambda s: '$SOURCEDIR/'+str(s), source))


def prepend_directories(target, source, env):
    """
    adds the build directory and the source directory to the target and the source
    """
    return prepend_source_directory(*prepend_build_directory(target, source, env), env)


svg1x = Builder(
    action=render1x,
    suffix='.png',
    src_suffix='.svg',
    emitter=prepend_directories)

svg2x = Builder(
    action=render2x,
    src_suffix='.svg',
    emitter=lambda target, source, env:  # scuffedness 1000000
    (prepend_directories(tuple(map(lambda t: str(t) + '@2x.png', target)), source, env)))


def render_default(target, source):
    """
    render both SD and HD as needed
    """
    if not GetOption('no_1x'):
        env.SVG1x(target, source)

    if not GetOption('no_2x'):
        env.SVG2x(target, source)


empty = Builder(
    action=Copy('$TARGET', '$SOURCE'),
    suffix='.png',
    emitter=lambda target, source, env:
    (prepend_build_directory(target, source, env)[0], 'src/graphics/special/none.png'))


env = Environment(
    NOQUALITY1X=GetOption('no_1x'), NOQUALITY2X=GetOption('no_2x'),
    ASPECTRATIO=GetOption('aspect_ratio'),
    FLASHING=GetOption('flashing'),
    BUILDDIR=GetOption('build_dir'), SOURCEDIR=GetOption('source_dir'),
    CLIENT=GetOption('client'))

env.Append(BUILDERS={'SVG1x': svg1x, 'SVG2x': svg2x, 'Empty': empty})


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
        def mode_icon_small(target, modebar_surface, icon_surface):
            """base for the hacky mode icon render (pass string + cairocffi surfaces)"""
            ctx = cairocffi.Context(modebar_surface)

            ctx.set_source_surface(icon_surface,
                                   modebar_surface.get_width() / 2 - icon_surface.get_width() / 2,
                                   modebar_surface.get_height() / 2 - icon_surface.get_height() / 2)
            ctx.paint()
            modebar_surface.write_to_png(target)

        if not GetOption('no_1x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small.png',
                        ('$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                         '$SOURCEDIR/graphics/interface/selection/frame/$ASPECTRATIO/modebar.svg'),
                        action=lambda target, source, env:
                        mode_icon_small(
                            str(target[0]),
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[1])))),
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[0]), scale=0.5)))))

        if not GetOption('no_2x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small@2x.png',
                        ('$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                         '$SOURCEDIR/graphics/interface/selection/frame/$ASPECTRATIO/modebar.svg'),
                        action=lambda target, source, env:
                        mode_icon_small(
                            str(target[0]),
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[1]), scale=2))),
                            cairocffi.ImageSurface.create_from_png(io.BytesIO(
                                cairosvg.svg2png(url=str(source[0]))))))


# song select tab
render_default('selection-tab', 'graphics/interface/selection/frame/tab.svg')


# song
render_default('menu-button-background',
               'graphics/interface/selection/song/background.svg')
render_default('star', 'graphics/interface/selection/song/star.svg')


# ranking letters
def ranking_grade_small(grade):
    """render small grade letters as needed"""
    target = '$BUILDDIR/ranking-'+grade+'-small'
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
render_default('ranking-panel', 'graphics/interface/ranking/panels/panel')
render_default('ranking-graph', 'graphics/interface/ranking/panels/graph')
render_default('pause-replay', 'graphics/interface/ranking/panels/replay')
render_default('ranking-winner', 'graphics/interface/ranking/status/winner')
render_default('ranking-perfect', 'graphics/interface/ranking/status/fc')

env.Empty('ranking-title')
env.Empty('ranking-maxcombo')
env.Empty('ranking-accuracy')


# fonts


def font(name, scale=1):
    """render font"""
    def font_glyph_1x(target, source, env):
        for t, s in zip(target, source):
            cairosvg.svg2png(url=str(s), scale=scale, write_to=str(t))

    def font_glyph_2x(target, source, env):
        for t, s in zip(target, source):
            cairosvg.svg2png(url=str(s), scale=scale * 2, write_to=str(t))

    sources = Glob(GetOption('source_dir') +
                   '/graphics/interface/fonts/' + name + '/*', strings=True)

    if not GetOption('no_1x'):
        env.Command(tuple(map(
            lambda s: '$BUILDDIR/' + name + '-' + Path(s).stem + '.png', sources)), sources,
            action=font_glyph_1x)

    if not GetOption('no_2x'):
        env.Command(tuple(map(
            lambda s: '$BUILDDIR/' + name + '-' + Path(s).stem + '@2x.png', sources)), sources,
            action=font_glyph_2x)


font('default', 3)
font('score', 3.5)
env.Empty('score-x')
env.Empty('score-percent')
font('scoreentry')

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


if not GetOption('no_standard'):
    # mode icon
    mode_icon('osu')

    # cursor smoke (surprisingly)
    render_default('cursor-smoke', 'graphics/gameplay/osu/cursor-smoke')

    # approach circle (surprisingly)
    render_default('approachcircle', 'graphics/gameplay/osu/approachcircle')

    # circle (surprisingly)
    render_default('hitcircle', 'graphics/gameplay/osu/circle')
    render_default('hitcircleoverlay', 'graphics/gameplay/osu/circleoverlay')

    # lighting (surprisingly)
    render_default('lighting', 'graphics/gameplay/osu/lighting')

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

    env.Empty('hit100')
    env.Empty('hit100k')
    env.Empty('hit50')
    env.Empty('hit0')

    render_default('hit100-0', 'graphics/gameplay/osu/hitbursts/100.svg')
    if not GetOption('no_1x'):
        env.Command('$BUILDDIR/hit100k-0.png', '$BUILDDIR/hit100-0.png',
                    action=Copy('$TARGET', '$SOURCE'))

    if not GetOption('no_2x'):
        env.Command('$BUILDDIR/hit100k-0@2x.png',
                    '$BUILDDIR/hit100-0@2x.png', action=Copy('$TARGET', '$SOURCE'))

    render_default('hit50-0', 'graphics/gameplay/osu/hitbursts/50.svg')

    render_default('hit0-0', 'graphics/gameplay/osu/hitbursts/0.svg')

    # follow points (surprisingly)
    render_default('followpoint', 'graphics/gameplay/osu/followpoint.svg')


# editor circle select
render_default('hitcircleselect', 'graphics/interface/editor/select.svg')
