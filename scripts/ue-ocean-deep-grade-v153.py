"""One color/reflection convergence pass on the new ocean material only."""
seaMaterial153=assets.load_asset('/Game/Cove/V153_ContinuousDeepSea');mel153=u.MaterialEditingLibrary
base153=mel153.create_material_expression(seaMaterial153,u.MaterialExpressionConstant3Vector);base153.constant=u.LinearColor(.004,.016,.019,1);mel153.connect_material_property(base153,'',u.MaterialProperty.MP_BASE_COLOR)
for val,prop in [(.62,u.MaterialProperty.MP_ROUGHNESS),(.03,u.MaterialProperty.MP_SPECULAR)]:
 k=mel153.create_material_expression(seaMaterial153,u.MaterialExpressionConstant);k.r=val;mel153.connect_material_property(k,'',prop)
em153=mel153.create_material_expression(seaMaterial153,u.MaterialExpressionConstant3Vector);em153.constant=u.LinearColor(.001,.003,.004,1);mel153.connect_material_property(em153,'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel153.recompile_material(seaMaterial153);assets.save_loaded_asset(seaMaterial153)
sea153.static_mesh_component.set_material(0,seaMaterial153);seaMID149=sea153.static_mesh_component.create_dynamic_material_instance(0)
u.AutomationLibrary.take_high_res_screenshot(1920,1080,str(V153/'deep-grade.png'),camera=cam)
