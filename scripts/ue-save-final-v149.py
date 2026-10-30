"""Finish the saved world and stop production changes before live preview."""
# Native SaveCurrentLevel is required after SaveAs changes the current UWorld.
for aa in actors.get_all_level_actors():
 if isinstance(aa,u.DirectionalLight):aa.light_component.set_light_color(u.LinearColor(1,.87,.67,1))
 if aa.get_actor_label()=='V149 Grounded meadow':
  sm=u.get_editor_subsystem(u.StaticMeshEditorSubsystem);ns=sm.get_nanite_settings(aa.static_mesh_component.static_mesh);ns.enabled=False;sm.set_nanite_settings(aa.static_mesh_component.static_mesh,ns,True)
source=(P/'scripts/ue-refine-v149.py').read_text(encoding='utf-8');water=source[source.index("m=fresh('V149_DeepSea')"):source.index('# Real sawn timber')];water=water.replace('tm=node(m,u.MaterialExpressionTime)',"tm=node(m,u.MaterialExpressionScalarParameter);tm.set_editor_property('parameter_name','SeaClock')");exec(water,globals())
assets.save_directory('/Game/Cove');saved=u.get_editor_subsystem(u.LevelEditorSubsystem).save_current_level();savedDirty=u.EditorLoadingAndSavingUtils.save_dirty_packages(True,True)
(V/'ue-final-native-save.json').write_text(json.dumps({'saveCurrentLevel':saved,'saveDirtyPackages':savedDirty,'world':ed.get_editor_world().get_path_name(),'actors':len(actors.get_all_level_actors()),'map':'/Game/Cove/FullCoveV149'}),encoding='utf-8')
