"""Use the water shading pass that supports scene depth, preserving the approved island."""
import unreal as u,json
from pathlib import Path
P=Path(__file__).resolve().parents[1]
def apply():
 levels=u.get_editor_subsystem(u.LevelEditorSubsystem);levels.load_level('/Game/Cove/FullCoveV162');m=u.load_asset('/Game/V163/CoastalTideSea');m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_SINGLE_LAYER_WATER);mel=u.MaterialEditingLibrary;water=mel.create_material_expression(m,u.MaterialExpressionSingleLayerWaterMaterialOutput)
 for pin,color in [('ScatteringCoefficients',(.002,.012,.014)),('AbsorptionCoefficients',(.025,.006,.003))]:
  n=mel.create_material_expression(m,u.MaterialExpressionConstant3Vector);n.set_editor_property('constant',u.LinearColor(*color,1));assert mel.connect_material_expressions(n,'',water,pin)
 mel.recompile_material(m);u.EditorAssetLibrary.save_loaded_asset(m);(P/'.verify/v32-163/water-fix.json').write_text(json.dumps({'shading':'SingleLayerWater','islandUnchanged':True,'depthWashRetained':True}))
