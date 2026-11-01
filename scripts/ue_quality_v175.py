"""Keep full source resolution and stable native temporal shading."""
import unreal as u

COMMANDS = ('ShowFlag.AntiAliasing 1', 'ShowFlag.TemporalAA 1',
            'r.AntiAliasingMethod 4', 'r.ScreenPercentage 100',
            'r.OneFrameThreadLag 1', 'r.VSync 0')


def apply():
    world = u.get_editor_subsystem(u.UnrealEditorSubsystem).get_editor_world()
    for command in COMMANDS:
        u.SystemLibrary.execute_console_command(world, command)
    return {command.split()[0]: u.SystemLibrary.get_console_variable_string_value(command.split()[0]) for command in COMMANDS}
