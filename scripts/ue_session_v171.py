"""Session-only editor scheduling for the saved live portfolio. No asset edits."""
import unreal as u


def apply():
    results = {}
    for class_name, property_name in [
            ('EditorPerformanceSettings', 'bThrottleCPUWhenNotForeground'),
            ('EditorLoadingSavingSettings', 'bAutoSaveEnable')]:
        try:
            klass = getattr(u, class_name, None) or u.load_class(None, '/Script/UnrealEd.' + class_name)
            settings = u.get_default_object(klass)
            before = settings.get_editor_property(property_name)
            settings.set_editor_property(property_name, False)
            results[class_name] = {'before': before, 'after': settings.get_editor_property(property_name)}
        except Exception as error:
            # Optional editor preferences must never prevent the saved scene starting.
            results[class_name] = {'error': str(error)}
    return results
