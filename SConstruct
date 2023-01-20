import subprocess
import cairo
import io
import math
from SCons.Script import AddOption, GetOption, Builder, Copy, Delete, Environment


AddOption('--compiler',
          dest='compiler',
          action='store',
          metavar='PATH',
          default='/usr/bin/rsvg-convert',
          help="The path to the compiler, probably should be the path to rsvg-convert. Defaults to /usr/bin/rsvg-convert so needs to be set on Windows.")

AddOption('--client',
          dest='client',
          action='store',
          metavar='PATH',
          default='any',
          help='The client to build for (supports "stable", "mcosu", and "any" (default) which tries to make the skin work on both clients)')

AddOption('--aspect-ratio',
          dest='aspect_ratio',
          type='string',
          nargs=1,
          action='store',
          metavar='WIDTH-HEIGHT',
          default='any',
          help='The aspect ratio to build for (currently supports "4-3", "16-9", and "any" (default) which disables aspect ratio dependent hacks)')

AddOption('--ranking-panel',
          dest='ranking_panel',
          action='store',
          metavar='MODE',
          default='any',
          help='The hacky ranking panel type to build (supports "osu", "taiko", and "any" (default) which tries to make the ranking panel work for all modes; choose your main mode if you don\'t mind the ranking panel being wrong for other modes or if you don\'t play other modes.)')

AddOption('--flashing',
          dest='flashing',
          action='store_true',
          help="Enable flashing via mode-x in song selection")


AddOption('--units',
          dest='units',
          action='store_true',
          help="Enable units in fonts (combo x, accuracy % (percent sign))")

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

AddOption('--build-directory',
          dest='build_dir',
          action='store',
          metavar='PATH',
          default='build/main',
          help='The skin\'s directory (basically unzipped .osk). Defaults to "build/main"')

AddOption('--source-directory',
          dest='source_dir',
          action='store',
          metavar='PATH',
          default='src',
          help='The directory where source files are put. Defaults to "src".')


def composite(target_surface, source_surface, x=0, y=0):
    ctx = cairo.Context(target_surface)

    ctx.set_source_surface(source_surface, x, y)
    ctx.paint()
    return target_surface


def compiler(source, target=None, zoom=None, xZoom=None, yZoom=None, width=None, height=None, left=None, top=None, keep_aspect_ratio=True):
    args = [GetOption("compiler")]
    if(keep_aspect_ratio):
        args.append("-a")

    if(target != None):
        args.extend(["-o", str(target)])

    if(width != None):
        args.extend(["-w", str(width)])
    if(height != None):
        args.extend(["-h", str(height)])
    if(top != None):
        args.extend(["--top", str(top)])
    if(left != None):
        args.extend(["--left", str(left)])

    if(zoom != None):
        args.extend(["-z", str(zoom)])
    if(xZoom != None):
        args.extend(["-x", str(xZoom)])
    if(yZoom != None):
        args.extend(["-y", str(yZoom)])

    args.append(str(source))

    completed = subprocess.run(args, capture_output=True)
    if(target == None):
        return io.BytesIO(completed.stdout)


def render1x(target, source, env):
    for (t, s) in zip(target, source):
        compiler(s, t)


def render2x(target, source, env):
    for (t, s) in zip(target, source):
        compiler(s, t, zoom=2)


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
    suffix=".png",
    emitter=lambda target, source, env:
    (prepend_build_directory(target), '$SOURCEDIR/graphics/special/none.png'))

delete = Builder(
    action=[
        Delete('$TARGET')
    ],
    suffix='.png',
    emitter=lambda target, source, env:
    (prepend_build_directory(target), ''))

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
    RANKINGPANEL=GetOption('ranking_panel'))

env.Append(BUILDERS={'SVG1x': svg1x, 'SVG2x': svg2x,
           'Empty': empty, 'Delete': delete, 'CopyImage': copy_image})


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
env.Empty('welcome_text')


# cursor
render_default('cursor', 'graphics/interface/cursor/cursor')
env.Empty('cursortrail')
env.Empty('star2')


# cursor ripple (surprisingly)
render_default('cursor-ripple', 'graphics/interface/cursor/ripple')


# button
render_default('button-left', 'graphics/interface/button/left')
render_default('button-middle', 'graphics/interface/button/middle')
render_default('button-right', 'graphics/interface/button/right')


# offset tick
render_default('options-offset-tick', 'graphics/interface/offset/tick')


# song select buttons
render_default('menu-back', 'graphics/interface/selection/frame/back')

render_default('selection-mode',
               'graphics/interface/selection/frame/$ASPECTRATIO/mode')
render_default('selection-mode-over',
               'graphics/interface/selection/frame/mode-over')

render_default('selection-mods', 'graphics/interface/selection/frame/mods')
render_default('selection-mods-over',
               'graphics/interface/selection/frame/mods-over')

render_default('selection-random',
               'graphics/interface/selection/frame/random')
render_default('selection-random-over',
               'graphics/interface/selection/frame/random-over')

render_default('selection-options',
               'graphics/interface/selection/frame/$ASPECTRATIO/options')
render_default('selection-options-over',
               'graphics/interface/selection/frame/options-over')

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
                        action=lambda target, source, env: compiler(source[0], target[0], zoom=0.5))

        if not GetOption('no_2x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small@2x.png',
                        '$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                        action=render1x)
    else:
        if not GetOption('no_1x'):
            def action(target, source, env):
                composite(
                    (target_surface := cairo.ImageSurface.create_from_png(
                        compiler(source[1]))),
                    (source_surface := cairo.ImageSurface.create_from_png(
                        compiler(source[0], zoom=0.5))),
                    target_surface.get_width() / 2 - source_surface.get_width() / 2,
                    target_surface.get_height() / 2 - source_surface.get_height() / 2).write_to_png(str(target[0]))

            env.Command('$BUILDDIR/mode-'+mode+'-small.png',
                        ('$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                         '$SOURCEDIR/graphics/interface/selection/frame/$ASPECTRATIO/modebar.svg'),
                        action=action)

        if not GetOption('no_2x'):
            env.Command('$BUILDDIR/mode-'+mode+'-small@2x.png',
                        ('$SOURCEDIR/graphics/interface/modes/'+mode+'.svg',
                         '$SOURCEDIR/graphics/interface/selection/frame/$ASPECTRATIO/modebar.svg'),
                        action=lambda target, source, env:
                        composite(
                            (target_surface := cairo.ImageSurface.create_from_png(
                                compiler(source[1], zoom=2))),
                            (source_surface := cairo.ImageSurface.create_from_png(
                                compiler(source[0]))),
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
        env.Command(target + '.png', source, action=lambda target, source, env: compiler(
            source[0], target[0], width=38))

    if not GetOption('no_2x'):
        env.Command(target + '@2x.png', source, action=lambda target, source, env: compiler(
            source[0], str(target[0]), width=68))


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
                            cairo.ImageSurface.create_from_png(
                                compiler(source[0])),
                            cairo.ImageSurface.create_from_png(
                                compiler(source[1]))).write_to_png(str(target[0])))
    if not GetOption('no_2x'):
        env.Command('$BUILDDIR/ranking-panel@2x.png', ['$SOURCEDIR/graphics/interface/ranking/panels/$ASPECTRATIO/panel.svg',
                    '$SOURCEDIR/graphics/interface/ranking/panels/numbers/'+GetOption('ranking_panel')+'.svg'], lambda target, source, env:
                        composite(
                            cairo.ImageSurface.create_from_png(
                                compiler(source[0], zoom=2)),
                            cairo.ImageSurface.create_from_png(
                                compiler(source[1], zoom=2))).write_to_png(str(target[0])))
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


def default_get_dimensions(font_extents, text_extents, glyph):
    ascent, descent, font_height, max_x_advance, max_y_advance = font_extents

    return (
        -text_extents.x_bearing / 2,
        ascent
        + descent / 2,  # center vertically, the only reason the descents aren't cropped out entirely is because of commas lol. have fun if you're using any other font
        text_extents.x_advance  # questionable
        + (GLYPH_WIDTH_OFFSET[glyph] if glyph in GLYPH_WIDTH_OFFSET else 0),
        ascent + descent
    )


FONT_OPTIONS = cairo.FontOptions()
FONT_OPTIONS.set_antialias(cairo.Antialias.GRAY)

def font(font_name, glyphs, scale=20, get_dimensions=default_get_dimensions, font_face='osifont', rgba=(1, 1, 1, 1)):
    """render font glyphs"""
    glyphs = map(lambda g: (str(g), (CHAR_REPLACE[glyph] if (
        glyph := str(g)) in CHAR_REPLACE else glyph)), glyphs)

    def get_render_font_glyph(glyph, scale):
        # cairo text actually sucks im just going to commit this shit i give up
        def render_font_glyph(target, source, env):
            surface = cairo.ImageSurface(
                cairo.FORMAT_ARGB32, 16 * scale, 16 * scale)
            ctx = cairo.Context(surface)
            ctx.scale(scale, scale)

            ctx.set_font_options(FONT_OPTIONS)

            ctx.set_source_rgba(1, 1, 1)
            ctx.select_font_face(font_face)
            ctx.set_font_size(1)
            x, y, width, height = get_dimensions(
                ctx.font_extents(), ctx.text_extents(glyph), glyph)

            ctx.move_to(x, y)
            ctx.set_source_rgba(*rgba)
            ctx.show_text(glyph)

            cropped_surface = cairo.ImageSurface(
                cairo.FORMAT_ARGB32, width := math.ceil(width * scale), height := math.ceil(height * scale))

            ctx = cairo.Context(cropped_surface)

            # debugging, pretty useful
            # ctx.set_source_rgba(1, 0, 0, 0.5)
            # ctx.paint()

            ctx.set_source_surface(surface)
            ctx.paint()

            cropped_surface.write_to_png(str(target[0]))

        return render_font_glyph

    for glyph_name, glyph in glyphs:
        if not GetOption('no_1x'):
            env.Command(
                '$BUILDDIR/' + font_name + '-' + glyph_name + '.png',
                [],
                action=get_render_font_glyph(glyph, scale))

        if not GetOption('no_2x'):
            env.Command(
                '$BUILDDIR/' + font_name + '-' + glyph_name + '@2x.png',
                [],
                action=get_render_font_glyph(glyph, scale * 2))


font('default', range(10), 40)
font('score', [*range(10), 'comma', 'dot'], 45)
font('scoreentry', [*range(10), 'comma', 'dot'], 14)
if GetOption("units"):
    font('score', ['x', 'percent'], 45, rgba=(0.5, 0.5, 0.5, 0.8))
    font('scoreentry', ['x', 'percent'], 14, rgba=(0.5, 0.5, 0.5, 0.8))
else:
    env.Empty('score-x')
    env.Delete('score-x@2x') # too lazy to fix
    env.Empty('score-percent')
    env.Delete('score-percent@2x')
    env.Empty('scoreentry-x')
    env.Delete('scoreentry-x@2x')
    env.Empty('scoreentry-percent')
    env.Delete('scoreentry-percent@2x')

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


if not GetOption('no_standard'):  # standard-only elements
    # mode icon
    mode_icon('osu')

    # cursor smoke (surprisingly)
    # render_default('cursor-smoke', 'graphics/gameplay/osu/cursor-smoke')

    # approach circle
    approachcircle()

    # hit lighting
    lighting()

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
    render_default('sliderendcircle', 'graphics/gameplay/osu/slider/end')

    # slider reverse arrow
    render_default('reversearrow', 'graphics/gameplay/osu/slider/reverse')

    # spinner (surprinsingly)
    spinner()
    env.Empty('spinner-rpm')
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

    render_default('hit100-0', 'graphics/gameplay/osu/hitbursts/100')
    copy_default('hit100k-0', 'hit100-0')
    render_default('hit50-0', 'graphics/gameplay/osu/hitbursts/50')
    render_default('hit0-0', 'graphics/gameplay/osu/hitbursts/0')

    # follow points (surprisingly)
    # render_default('followpoint', 'graphics/gameplay/osu/followpoint.svg') # non-animated followpoints if you are a masochist

    render_animation('followpoint-', (  # thanks to stephen clark's video on followpoints (https://youtu.be/OVGzCPsLH7c?t=247)
        (None, 0),
        ('graphics/gameplay/osu/followpoint', 1),
        (None, 0)
    ))

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

    # lighting
    lighting()

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
    env.Empty('taiko-hit100')
    env.Empty('taiko-hit100k')
    env.Empty('taiko-hit0')

    render_default('taiko-hit100-0',
                   'graphics/gameplay/taiko/hitbursts/100')
    copy_default('taiko-hit100k-0', 'taiko-hit100-0')
    render_default('taiko-hit0-0', 'graphics/gameplay/taiko/hitbursts/0')

# editor circle select
render_default('hitcircleselect', 'graphics/interface/editor/select.svg')
