import cairosvg
import os


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


BUILDDIR = 'build'
SRCDIR = 'src'


def render1x(target, source, env):
    if(not GetOption('no_1x')):
        for s in source:
            render = cairosvg.svg2png(url=str(s))
            for t in target:
                file = open(str(t), 'wb')
                file.write(render)
                file.close()


def render2x(target, source, env):
    if(not GetOption('no_2x')):
        for s in source:
            render = cairosvg.svg2png(url=str(s), scale=2)
            for t in target:
                file = open(str(t), 'wb')
                file.write(render)
                file.close()


def prependBuildDirectory(target, source, env):
    return list(map(lambda t: os.path.join(BUILDDIR, str(t)), target)), source


def prependSourceDirectory(target, source, env):
    return target, list(map(lambda s: os.path.join(SRCDIR, str(s)), source))


def prependDirectories(target, source, env):
    return prependSourceDirectory(*prependBuildDirectory(target, source, env), env)


svg1x = Builder(
    action=render1x,
    suffix='.png',
    src_suffix='.svg',
    emitter=prependDirectories)
svg2x = Builder(
    action=render2x,
    suffix='@2x.png',
    src_suffix='.svg',
    emitter=prependDirectories)

empty = Builder(
    action=Copy(),
    suffix='.png',
    emitter=lambda target, source, env: (prependBuildDirectory(target, source, env)[0], 'src/graphics/special/none.png'))


env = Environment(
    BUILDERS={'SVG1x': svg1x, 'SVG2x': svg2x, 'Empty': empty},
    NOQUALITY1X=GetOption('no_1x'), NOQUALITY2X=GetOption('no_2x'))


def default(target, source):
    env.SVG1x(target, source)
    env.SVG2x(target, source)


env.Command(
    os.path.join(BUILDDIR, 'LICENSE'),
    'LICENSE',
    Copy('$TARGET', '$SOURCE'))

env.Command(
    os.path.join(BUILDDIR, 'skin.ini'),
    os.path.join(SRCDIR, 'meta/skin.ini'),
    Copy('$TARGET', '$SOURCE'))

if not GetOption('no_standard'):
    default('hitcircle', 'graphics/gameplay/osu/circle')

    default('followpoint', 'graphics/gameplay/osu/followpoint.svg')
    env.Empty(['hit300', 'hit300k', 'hit300g'])

    default(['hit100', 'hit100k'],
            'graphics/gameplay/osu/hitbursts/100.svg')
    default('hit50', 'graphics/gameplay/osu/hitbursts/50.svg')
    default('hit0', 'graphics/gameplay/osu/hitbursts/0.svg')
