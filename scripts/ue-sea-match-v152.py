"""Final bounded correction: retain the approved sea shader, add only geometric waves."""
matchedPath152='/Game/Cove/V152_LiveSeaMatched'
seaMatched152=assets.load_asset(matchedPath152) if assets.does_asset_exist(matchedPath152) else assets.duplicate_asset('/Game/Cove/V149_DeepSea',matchedPath152)
wpMatch152=n152(seaMatched152,u.MaterialExpressionWorldPosition);clockMatch152=n152(seaMatched152,u.MaterialExpressionScalarParameter);clockMatch152.set_editor_property('parameter_name','SeaClock')
wpoMatch152=custom152(seaMatched152,waveCode152,{'P':(wpMatch152,''),'T':(clockMatch152,'')});mel152.connect_material_property(wpoMatch152,'',u.MaterialProperty.MP_WORLD_POSITION_OFFSET)
mel152.recompile_material(seaMatched152);assets.save_loaded_asset(seaMatched152);nearSea152.static_mesh_component.set_material(0,seaMatched152);seaMID149=nearSea152.static_mesh_component.create_dynamic_material_instance(0)
(V152/'ue-sea-match.json').write_text(json.dumps({'material':matchedPath152,'approvedBaseMaterial':'/Game/Cove/V149_DeepSea','baseColorNormalReflectionCopied':True,'newContribution':'two geometric sine waves only','originalAssetOverwritten':False}),encoding='utf-8')
