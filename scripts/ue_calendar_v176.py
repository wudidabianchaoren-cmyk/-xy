"""Correct the original paper UV vertically; preserve its real room lighting."""
import unreal as u


def material(texture):
    path = '/Game/V176/PrintedCalendarUpright'
    result = u.load_asset(path)
    if result:
        return result
    source = u.load_asset('/Game/V170/PrintedCalendar')
    assert source, 'Original printed calendar material is required'
    result = u.EditorAssetLibrary.duplicate_asset(source.get_path_name(), path)
    mel = u.MaterialEditingLibrary
    coord = mel.create_material_expression(result, u.MaterialExpressionTextureCoordinate)
    uv = mel.create_material_expression(result, u.MaterialExpressionCustom)
    uv.set_editor_property('code', 'return float2(U.x,1.-U.y);')
    uv.set_editor_property('output_type', u.CustomMaterialOutputType.CMOT_FLOAT2)
    pin = u.CustomInput()
    pin.set_editor_property('input_name', 'U')
    uv.set_editor_property('inputs', [pin])
    assert mel.connect_material_expressions(coord, '', uv, 'U')
    samples = [item for item in u.ObjectIterator(u.MaterialExpressionTextureSampleParameter2D) if item.get_outer() == result]
    assert len(samples) == 1, 'Expected one original date texture'
    samples[0].texture = texture
    assert mel.connect_material_expressions(uv, '', samples[0], 'UVs')
    mel.recompile_material(result)
    u.EditorAssetLibrary.save_loaded_asset(result)
    return result


def apply(cache):
    texture = u.load_asset('/Game/V170/CalendarDate')
    assert texture, 'Original calendar date is required'
    printed = material(texture)
    matches = []
    for actor in cache.values():
        if isinstance(actor, u.StaticMeshActor) and actor.static_mesh_component.static_mesh and actor.static_mesh_component.static_mesh.get_name() == 'Live_clean_white_calendar_page___Asia_Shanghai':
            mid = actor.static_mesh_component.create_dynamic_material_instance(0, printed)
            mid.set_texture_parameter_value('PrintedDate', texture)
            matches.append(actor.get_actor_label())
    assert len(matches) == 1, 'Expected exactly one original paper calendar'
    return {'actors': matches, 'material': printed.get_path_name(), 'uv': 'u, 1-v', 'emissive': False}
