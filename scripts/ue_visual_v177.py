"""Scoped visual inspection and refinements of original resident actors."""
from pathlib import Path
import json
import unreal as u
import ue_worlds_v165 as worlds

OUT = Path(__file__).resolve().parents[1] / '.verify/v32-177'
window_mid = None
window_actor = None
window_lights = []


def cottage(night):
    global window_mid, window_actor, window_lights
    if window_mid is None:
        editor=u.get_editor_subsystem(u.EditorActorSubsystem)
        mel=u.MaterialEditingLibrary
        path='/Game/V177/CottageWindowRecess'
        material=u.load_asset(path)
        if material is None:
            material=u.AssetToolsHelpers.get_asset_tools().create_asset('CottageWindowRecess','/Game/V177',u.Material,u.MaterialFactoryNew())
            material.set_editor_property('shading_model',u.MaterialShadingModel.MSM_UNLIT)
            color=mel.create_material_expression(material,u.MaterialExpressionConstant3Vector)
            color.constant=u.LinearColor(1.,.24,.035,1.)
            strength=mel.create_material_expression(material,u.MaterialExpressionScalarParameter)
            strength.set_editor_property('parameter_name','NightGlow');strength.set_editor_property('default_value',0.)
            multiply=mel.create_material_expression(material,u.MaterialExpressionMultiply)
            mel.connect_material_expressions(color,'',multiply,'A');mel.connect_material_expressions(strength,'',multiply,'B')
            adaptation=mel.create_material_expression(material,u.MaterialExpressionEyeAdaptation)
            stable=mel.create_material_expression(material,u.MaterialExpressionDivide)
            mel.connect_material_expressions(multiply,'',stable,'A');mel.connect_material_expressions(adaptation,'',stable,'B')
            mel.connect_material_property(stable,'',u.MaterialProperty.MP_EMISSIVE_COLOR)
            mel.recompile_material(material);u.EditorAssetLibrary.save_loaded_asset(material)
        mids=[];lights=[]
        for side in (-1,1):
            label='V177 original shutter interior '+str(side)
            a=next((a for a in editor.get_all_level_actors() if a.get_actor_label()==label),None)
            if a is None:
                a=editor.spawn_actor_from_class(u.StaticMeshActor,u.Vector(400+side*222,-4610,1939.8784));a.set_actor_label(label)
                c=a.static_mesh_component;c.set_mobility(u.ComponentMobility.MOVABLE)
                c.set_static_mesh(u.load_asset('/Engine/BasicShapes/Cube'));c.set_collision_enabled(u.CollisionEnabled.NO_COLLISION)
                a.set_actor_scale3d(u.Vector(.018,1.23,1.10));c.set_editor_property('cast_shadow',False)
            mids.append(a.static_mesh_component.create_dynamic_material_instance(0,material))
            label='V177 cottage window warmth '+str(side)
            light=next((a for a in editor.get_all_level_actors() if a.get_actor_label()==label),None)
            if light is None:
                light=editor.spawn_actor_from_class(u.PointLight,u.Vector(400+side*242,-4610,1940));light.set_actor_label(label)
                c=light.light_component;c.set_mobility(u.ComponentMobility.MOVABLE)
                c.set_light_color(u.LinearColor(1.,.25,.035,1.));c.set_attenuation_radius(170.)
                c.set_editor_property('cast_shadows',False);c.set_editor_property('source_radius',16.)
                c.set_editor_property('intensity_units',u.LightUnits.CANDELAS)
            lights.append(light.light_component)
        window_mid=mids;window_lights=lights
        (OUT/'cottage-applied.json').write_text(json.dumps({'actors':['V177 original shutter interior -1','V177 original shutter interior 1'],'positionSource':'original V161 +/-2.30m shutter boards, window center 1.7m','nightGlow':1.15,'pointCandelas':12.,'dayGlow':0,'originalGeometryUnchanged':True}),encoding='utf-8')
    for mid in window_mid:mid.set_scalar_parameter_value('NightGlow',float(night)*1.15)
    for light in window_lights:light.set_intensity(float(night)*12.)


def inspect_scene():
    import ue_room_props_v167 as props
    result = {'room': [], 'myth': [], 'bindings': {}}
    for scene in ('room', 'myth'):
        for a in worlds.actors(scene):
            mesh = a.static_mesh_component.static_mesh if isinstance(a, u.StaticMeshActor) else None
            name = mesh.get_name() if mesh else ''
            if scene == 'room' and (a.get_actor_label() in sum([v for k,v in props.BINDINGS.items() if k.startswith('book')], []) or 'calendar' in name.lower()) or scene == 'myth' and (isinstance(a,u.Light) or (a.get_actor_label().startswith('V161 historical stone house') or any(k in name.lower() for k in ('window','cottage','house','roof')))):
                p=a.get_actor_location(); origin,extent=a.get_actor_bounds(False)
                entry={'actor':a.get_actor_label(),'mesh':name,'location':[p.x,p.y,p.z], 'center':[origin.x,origin.y,origin.z], 'extent':[extent.x,extent.y,extent.z]}
                if mesh:
                    entry['materials']=[m.get_path_name() if m else None for m in a.static_mesh_component.get_materials()]
                    entry['slots']=[str(s.material_slot_name) for s in mesh.get_editor_property('static_materials')]
                    entry['parents']=[str(m.get_editor_property('parent')) if isinstance(m,u.MaterialInstanceDynamic) else None for m in a.static_mesh_component.get_materials()]
                if isinstance(a,u.Light):entry.update(intensity=a.light_component.intensity,visible=a.light_component.is_visible())
                result[scene].append(entry)
    for key in ('book0','book1','book2'):
        result['bindings'][key]=[{'actor':a.get_actor_label(),'original':str(props.originals.get(a))} for a in props.groups.get(key,[])]
    (OUT/'scene-inspect.json').write_text(json.dumps(result,indent=2),encoding='utf-8')


def apply():
    import ue_calendar_v176, importlib
    importlib.reload(ue_calendar_v176)
    room={a.get_actor_label():a for a in worlds.actors('room')}
    result=ue_calendar_v176.apply(room)
    (OUT/'calendar-applied.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    inspect_scene()
