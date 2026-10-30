"""Use one world-space sea shader on the near grid and far water; eliminate tangent/edge mismatch."""
seaMatched152=assets.load_asset('/Game/Cove/V152_LiveSeaMatched');seaMatched152.set_editor_property('tangent_space_normal',False);u.MaterialEditingLibrary.recompile_material(seaMatched152);assets.save_loaded_asset(seaMatched152)
nearSea152.static_mesh_component.set_material(0,seaMatched152);seaMID149=nearSea152.static_mesh_component.create_dynamic_material_instance(0)
foundation152.static_mesh_component.set_material(0,seaMatched152);farSeaMID152=foundation152.static_mesh_component.create_dynamic_material_instance(0)
