"""
the big build script
"""

import cairosvg
import cairosvg.surface
import cairocffi
import io

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
    return list(map(lambda t: '$BUILDDIR/'+str(t), target)), source


def prepend_source_directory(target, source, env):
    """
    adds the source directory to the source
    """
    return target, list(map(lambda s: '$SOURCEDIR/'+str(s), source))


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
    (prepend_directories(list(map(lambda t: str(t) + '@2x.png', target)), source, env)))


def default(target, source):
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
    BUILDERS={'SVG1x': svg1x, 'SVG2x': svg2x, 'Empty': empty},
    NOQUALITY1X=GetOption('no_1x'), NOQUALITY2X=GetOption('no_2x'),
    ASPECTRATIO=GetOption('aspect_ratio'),
    FLASHING=GetOption('flashing'),
    BUILDDIR=GetOption('build_dir'), SOURCEDIR=GetOption('source_dir'))


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
default('cursor', 'graphics/interface/cursor/cursor.svg')
env.Empty('cursortrail.png')
env.Empty('star2.png')


# cursor ripple (surprisingly)
default('cursor-ripple', 'graphics/interface/cursor/ripple')


# button
default('button-left', 'graphics/interface/button/left.svg')
default('button-middle', 'graphics/interface/button/middle.svg')
default('button-right', 'graphics/interface/button/right.svg')


# offset tick
default('options-offset-tick', 'graphics/interface/offset/tick')


# song select buttons
default('menu-back', 'graphics/interface/selection/frame/back.svg')

default('selection-mode',
        'graphics/interface/selection/frame/$ASPECTRATIO/mode.svg')
default('selection-mode-over', 'graphics/interface/selection/frame/mode-over.svg')

default('selection-mods', 'graphics/interface/selection/frame/mods.svg')
default('selection-mods-over', 'graphics/interface/selection/frame/mods-over.svg')

default('selection-random', 'graphics/interface/selection/frame/random.svg')
default('selection-random-over',
        'graphics/interface/selection/frame/random-over.svg')

default('selection-options',
        'graphics/interface/selection/frame/$ASPECTRATIO/options.svg')
default('selection-options-over',
        'graphics/interface/selection/frame/options-over.svg')


# mode icon


def mode_icon(mode):
    """build mode icons"""
    # medium icon (in mode select)

    default('mode-'+mode+'-med', 'graphics/interface/modes/'+mode)

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
            """base for the hacky mode icon render script (pass string + cairocffi surfaces as arguments)"""
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
default('selection-tab', 'graphics/interface/selection/frame/tab.svg')


# song
default('menu-button-background',
        'graphics/interface/selection/song/background.svg')
default('star', 'graphics/interface/selection/song/star.svg')


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
        default('ranking-'+grade, 'graphics/interface/ranking/grades/'+grade)
        ranking_grade_small(grade)


# masking border
env.Empty('masking-border')


# scorebar (surprisingly)

ADDED_SCOREBAR = True
default('scorebar-bg', 'graphics/interface/hud/scorebar/background')
default('scorebar-colour', 'graphics/interface/hud/scorebar/colour')


# skip button
default('play-skip', 'graphics/interface/hud/skip')


# unranked icon
default('play-unranked', 'graphics/interface/hud/unranked')


# countdown
env.Empty('ready')
env.Empty('count3')
env.Empty('count2')
env.Empty('count1')
env.Empty('go')


# pass/fail
default('section-pass', 'graphics/interface/hud/pass')
default('section-fail', 'graphics/interface/hud/fail')


# warning arrow
default('play-warningarrow', 'graphics/interface/hud/warning')


# multi-skipped
env.Empty('multi-skipped')


ranking_grade('XH', 'X', 'SH', 'S', 'A', 'B', 'C', 'D')


# spinner
ADDED_SPINNER = False


def spinner():
    """
    exactly what it says on the tin
    """
    global ADDED_SPINNER
    if not ADDED_SPINNER:
        ADDED_SPINNER = True
        default('spinner-circle', 'graphics/gameplay/spinner/circle')
        default('spinner-approachcircle',
                'graphics/gameplay/spinner/approachcircle')


if not GetOption('no_standard'):
    # mode icon
    mode_icon('osu')

    # cursor smoke (surprisingly)
    default('cursor-smoke', 'graphics/gameplay/osu/cursor-smoke')

    # approach circle (surprisingly)
    default('approachcircle', 'graphics/gameplay/osu/approachcircle')

    # circle (surprisingly)
    default('hitcircle', 'graphics/gameplay/osu/circle')
    default('hitcircleoverlay', 'graphics/gameplay/osu/circleoverlay')

    # lighting (surprisingly)
    default('lighting', 'graphics/gameplay/osu/lighting')

    # slider ball
    default('sliderb', 'graphics/gameplay/osu/slider/ball')

    # slider follow circle
    default('sliderfollowcircle', 'graphics/gameplay/osu/slider/follow')

    # slider end circle (surprisingly)
    env.Empty('sliderendcircle')

    # slider reverse arrow
    default('reversearrow', 'graphics/gameplay/osu/slider/reverse')

    # spinner (surprinsingly)
    spinner()
    default('spinner-rpm', 'graphics/gameplay/osu/spinner/rpm')
    default('spinner-metre', 'graphics/gameplay/osu/spinner/metre')
    env.Empty('spinner-background')
    env.Empty('spinner-clear')
    env.Empty('spinner-spin')

    # hitbursts
    env.Empty('hit300')
    env.Empty('hit300k')
    env.Empty('hit300g')

    default('hit100', 'graphics/gameplay/osu/hitbursts/100.svg')
    if not GetOption('no_1x'):
        env.Command('$BUILDDIR/hit100k.png', '$BUILDDIR/hit100.png',
                    action=Copy('$TARGET', '$SOURCE'))

    if not GetOption('no_2x'):
        env.Command('$BUILDDIR/hit100k@2x.png',
                    '$BUILDDIR/hit100@2x.png', action=Copy('$TARGET', '$SOURCE'))

    default('hit50', 'graphics/gameplay/osu/hitbursts/50.svg')

    default('hit0', 'graphics/gameplay/osu/hitbursts/0.svg')

    # follow points (surprisingly)
    default('followpoint', 'graphics/gameplay/osu/followpoint.svg')
