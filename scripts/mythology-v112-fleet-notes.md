# V112 原生船队构建脚本

`mythology-v112-fleet.py` 仅负责原生几何制作，不连接 MCP、不渲染，不更改岛、海水、巨人、天空或相机。由主流程在独立可见 Blender 中实际执行。

```python
exec((ROOT/'scripts/mythology-v112-fleet.py').read_text(encoding='utf8'))
result = build_fleet(ROOT, OUT)
```

场景根为 `V112_SHIP_0` 至 `V112_SHIP_3`，局部 X 船长、Y 船宽、Z 高度。中心对应旧网页船根的 Z-up 变换：(-7,-3)、(42,24)、(-32,10)、(-10,35)。主旗舰28×6.9米，护航23×5.5米，单桅快船16×3.8米，补给船21×7.2米；材质、帆型、船体比例及装载不同。

旧物只隐藏，保留在原工程。精确范围 `native84_36..252`、`native104_` 及 `V104 bronze plank fasteners`；`native84_0..35` 含岛、巨人和大陆，绝不能整段隐藏。

主要原生操作为船壳曲面板逐条建立、Solidify厚度、Bevel磨边、随外形弯曲的肋框、贴合船壳的前后甲板、内部划桨通道、桅杆与张力索、固定四角的鼓帆及放射褶皱、缝边和分幅接缝。帆是建模的静态受风形体，不宣称真实动力学求解。舷缘不是悬空铜杆篱笆。

木材/麻布分别复用 `assets/odyssey/pbr-v103/weathered_brown_planks` 和 `rough_linen` 的实际照片 BaseColor、Normal 和 Roughness；UV已经存在。船员使用 `.verify/v32-104/web-instances.json` 中原本完整人体经骨骼摆出的真实坐姿几何，包含脸、手指、发型、眼、皮肤原UV、衣褶、腰带和鞋，重新按实际尺寸布置。站立人物从旧完整英雄人形和衣物提取，规范为1.88米。不是从球和圆柱临时拼接的人。

默认完全跳过批合：`V112_BATCH_FLEET=False`。全部逐板对象、修改器与人物在 `V112_FLEET` 保持可编辑、可直接原生渲染，帆独立保留 `role=sail`。每艘完成保存 `03-fleet-stage-1..4-editable.blend`，四船与站立人物全齐后先保存 `03-four-vessels-editable-before-batch.blend`，再返回结果。用于后续导出的对象为 `result['objects']`，须启用 `export_extras=True`。

此前逐角RNA批合阶段异常退出，未完成的03不能声称已经保存或渲染。当前默认路径不执行该昂贵步骤；网页需要的合并应在确认原生画面并安全存档后，通过专门导出流程实现，不应重新启用旧批合选项。

脚本不声称作者采用了相同插件，也不把制作脚本存在当作已经执行或渲染成功。实际执行结果应看 `fleet-build-audit.json`、MCP日志和真实渲染。
