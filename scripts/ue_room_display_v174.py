"""Preserve source-video pixels and mark their animation correctly for TSR."""
import unreal as u


def prepare(cache, state):
    material = u.load_asset('/Game/V174/NativeCRT_Clear')
    if material is None:
        material = u.EditorAssetLibrary.duplicate_asset('/Game/V173/NativeCRT_Contain', '/Game/V174/NativeCRT_Clear')
    assert material, 'Original fitted CRT material is required'
    material.set_editor_property('has_pixel_animation', True)
    u.MaterialEditingLibrary.recompile_material(material)
    u.EditorAssetLibrary.save_loaded_asset(material)
    screen = next(actor for actor in cache.values() if isinstance(actor, u.StaticMeshActor)
                  and actor.static_mesh_component.static_mesh
                  and actor.static_mesh_component.static_mesh.get_name() == 'CRT_live_screen')
    state['mid'] = screen.static_mesh_component.create_dynamic_material_instance(0, material)
    state['mid'].set_texture_parameter_value('Program', state['texture'])
    state.update(clearConfigured=True, containConfigured=True, fitSize=None, on=None)
    for key in ('texture', 'standby_texture'):
        texture = state[key]
        texture.set_editor_property('enable_gen_mips', True)
        texture.update_resource()
    return {'material': material.get_path_name(), 'hasPixelAnimation': True,
            'sourceResolutionPreserved': True, 'minificationMips': True}
