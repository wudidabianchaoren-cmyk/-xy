"""Original video pixels fitted to the original CRT, plus a native transfer light."""
import unreal as u

SCREEN_ASPECT = .55 / .40


def prepare():
    tools = u.AssetToolsHelpers.get_asset_tools()
    mel = u.MaterialEditingLibrary
    material = u.load_asset('/Game/V173/NativeCRT_Contain')
    if not material:
        texture = u.load_asset('/Game/V163/RoomMediaTexture')
        assert texture, 'Existing native media texture is required'
        material = tools.create_asset('NativeCRT_Contain', '/Game/V173', u.Material, u.MaterialFactoryNew())
        material.set_editor_property('shading_model', u.MaterialShadingModel.MSM_UNLIT)
        coord = mel.create_material_expression(material, u.MaterialExpressionTextureCoordinate)
        fit = mel.create_material_expression(material, u.MaterialExpressionVectorParameter)
        fit.set_editor_property('parameter_name', 'VideoFit')
        fit.set_editor_property('default_value', u.LinearColor(1., SCREEN_ASPECT / (16/9), 0., 0.))
        uv = mel.create_material_expression(material, u.MaterialExpressionCustom)
        uv.set_editor_property('code', 'float2 v=(U-.5)/max(F.xy,float2(.001,.001))+.5;return float3(v.x,1.-v.y,step(0.,v.x)*step(v.x,1.)*step(0.,v.y)*step(v.y,1.));')
        uv.set_editor_property('output_type', u.CustomMaterialOutputType.CMOT_FLOAT3)
        inputs = []
        for key in ['U', 'F']:
            item = u.CustomInput(); item.set_editor_property('input_name', key); inputs.append(item)
        uv.set_editor_property('inputs', inputs)
        assert mel.connect_material_expressions(coord, '', uv, 'U')
        assert mel.connect_material_expressions(fit, '', uv, 'F')
        sample_uv = mel.create_material_expression(material, u.MaterialExpressionComponentMask)
        sample_mask = mel.create_material_expression(material, u.MaterialExpressionComponentMask)
        for key in ['r', 'g', 'b', 'a']:
            sample_uv.set_editor_property(key, key in ['r', 'g'])
            sample_mask.set_editor_property(key, key == 'b')
        for node in [sample_uv, sample_mask]:
            assert mel.connect_material_expressions(uv, '', node, '')
        sample = mel.create_material_expression(material, u.MaterialExpressionTextureSampleParameter2D)
        sample.set_editor_property('parameter_name', 'Program'); sample.texture = texture
        sample.sampler_type = u.MaterialSamplerType.SAMPLERTYPE_COLOR
        assert mel.connect_material_expressions(sample_uv, '', sample, 'UVs')
        power = mel.create_material_expression(material, u.MaterialExpressionScalarParameter)
        power.set_editor_property('parameter_name', 'Power'); power.set_editor_property('default_value', 1.)
        masked = mel.create_material_expression(material, u.MaterialExpressionMultiply)
        final = mel.create_material_expression(material, u.MaterialExpressionMultiply)
        for left, output, right, pin in [(sample, 'RGB', masked, 'A'), (sample_mask, '', masked, 'B'), (masked, '', final, 'A'), (power, '', final, 'B')]:
            assert mel.connect_material_expressions(left, output, right, pin)
        assert mel.connect_material_property(final, '', u.MaterialProperty.MP_EMISSIVE_COLOR)
        mel.recompile_material(material); u.EditorAssetLibrary.save_loaded_asset(material)
    glow = u.load_asset('/Game/V173/TransferGlow')
    if not glow:
        glow = tools.create_asset('TransferGlow', '/Game/V173', u.Material, u.MaterialFactoryNew())
        glow.set_editor_property('shading_model', u.MaterialShadingModel.MSM_UNLIT)
        color = mel.create_material_expression(glow, u.MaterialExpressionConstant3Vector)
        color.set_editor_property('constant', u.LinearColor(7., 4.8, 1.8, 1.))
        assert mel.connect_material_property(color, '', u.MaterialProperty.MP_EMISSIVE_COLOR)
        mel.recompile_material(glow); u.EditorAssetLibrary.save_loaded_asset(glow)
    return material, glow


def set_fit(state):
    width = state['texture'].get_width()
    height = state['texture'].get_height()
    if width <= 16 or height <= 16:
        return
    aspect = width / height
    x, y = min(1., aspect / SCREEN_ASPECT), min(1., SCREEN_ASPECT / aspect)
    key = (width, height)
    if state.get('fitSize') != key:
        state['mid'].set_vector_parameter_value('VideoFit', u.LinearColor(x, y, 0., 0.))
        state['fitSize'] = key

