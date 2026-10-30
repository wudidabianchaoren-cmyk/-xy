"""Single bounded refinement from actual first-frame inspection."""
u.SystemLibrary.execute_console_command(world,'Interchange.FeatureFlags.Import.FBX 0')
mesh=imp(P/'assets/odyssey/refit-v149/meadow-v149.fbx','V149_GroundedMeadow',True)
m=fresh('V149_MeadowBlades');m.set_editor_property('two_sided',True);m.set_editor_property('shading_model',u.MaterialShadingModel.MSM_TWO_SIDED_FOLIAGE);vc=node(m,u.MaterialExpressionVertexColor);mel.connect_material_property(vc,'RGB',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(col(m,(.08,.10,.035)),'',u.MaterialProperty.MP_SUBSURFACE_COLOR);mel.connect_material_property(const(m,.94),'',u.MaterialProperty.MP_ROUGHNESS);finish(m)
meadow=next((a for a in actors.get_all_level_actors() if a.get_actor_label()=='V149 Grounded meadow'),None)
if meadow is None:meadow=place(mesh,'V149 Grounded meadow',mat=m)
else:meadow.static_mesh_component.set_material(0,m)
# Water no longer loses all chroma in shadow. Broad reflection replaces scratchy micro-normal.
m=fresh('V149_DeepSea');wp=node(m,u.MaterialExpressionWorldPosition);tm=node(m,u.MaterialExpressionTime);nt=obj(m,'/Game/Cove/V147_Sea_Normal')
nc=custom(m,'''float2 uv=P.xy/1200+float2(T*.008,T*.003);float3 a=Texture2DSample(WaterN,WaterNSampler,uv).rgb*2-1;float3 b=Texture2DSample(WaterN,WaterNSampler,P.xy/370+float2(-T*.011,T*.005)).rgb*2-1;float2 broad=float2(cos(P.x/1200+P.y/2100+T*.52)*.045,cos(P.y/890-P.x/1700+T*.39)*.035);return normalize(float3(a.xy*.10+b.xy*.035+broad,1));''',{'P':(wp,''),'T':(tm,''),'WaterN':(nt,'')});mel.connect_material_property(nc,'',u.MaterialProperty.MP_NORMAL)
cc=custom(m,'''float a=.5+.24*sin(P.x/5500+sin(P.y/7200))+.12*sin(P.y/3300);return lerp(float3(.025,.060,.066),float3(.047,.092,.091),saturate(a));''',{'P':(wp,'')});mel.connect_material_property(cc,'',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(col(m,(.009,.021,.022)),'',u.MaterialProperty.MP_EMISSIVE_COLOR);mel.connect_material_property(const(m,.38),'',u.MaterialProperty.MP_ROUGHNESS);mel.connect_material_property(const(m,.28),'',u.MaterialProperty.MP_SPECULAR);finish(m)
byName['Water foundation'].static_mesh_component.set_material(0,m)
# Real sawn timber grain, muted red/olive brown variation, continuous world projection.
boat=byName['Vessel']
for i,s in enumerate(boat.static_mesh_component.static_mesh.get_editor_property('static_materials')):
 name=str(s.material_slot_name).lower()
 if any(k in name for k in ['sawn_oak','weathered_oak','weathered_timber']):
  mm=fresh('V149_BoatTimber_'+str(i));pp=node(mm,u.MaterialExpressionWorldPosition);nn=node(mm,u.MaterialExpressionVertexNormalWS);tt=obj(mm,'/Game/Cove/V147T_T_wood_planks_diff_1k_color')
  tint=.72+(i%4)*.05
  c=custom(mm,'''float3 w=pow(abs(N),6);w/=max(w.x+w.y+w.z,.001);float3 a=Texture2DSample(W,WSampler,float2(P.y,P.z)/float2(550,160)).rgb;float3 b=Texture2DSample(W,WSampler,float2(P.x,P.z)/float2(550,160)).rgb;float3 c=Texture2DSample(W,WSampler,P.xy/float2(550,160)).rgb;return (a*w.x+b*w.y+c*w.z)*float3(.64,.52,.36);''',{'P':(pp,''),'N':(nn,''),'W':(tt,'')});mel.connect_material_property(c,'',u.MaterialProperty.MP_BASE_COLOR);mel.connect_material_property(const(mm,.72),'',u.MaterialProperty.MP_ROUGHNESS);finish(mm);boat.static_mesh_component.set_material(i,mm)
# Subtle elevated haze avoids the earlier low gray sheet through the hull.
for a in actors.get_all_level_actors():
 if isinstance(a,u.ExponentialHeightFog):
  fc=a.get_component_by_class(u.ExponentialHeightFogComponent);fc.set_fog_density(.004);fc.set_fog_height_falloff(.45);fc.set_start_distance(4500);fc.set_editor_property('volumetric_fog_extinction_scale',.3)
ed.set_level_viewport_camera_info(cam.get_actor_location(),cam.get_actor_rotation());assets.save_directory('/Game/Cove');u.EditorLoadingAndSavingUtils.save_map(world,'/Game/Cove/FullCoveV149')
report.update(stage='refinement saved',meadowClumps=2374,meadowBlades=21028,meadowTriangles=63084,oldMapPreserved=True);note()
u.AutomationLibrary.take_high_res_screenshot(2560,1440,str(V/'ue-cove-refined.png'),camera=cam)
