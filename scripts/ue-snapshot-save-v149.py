assets.duplicate_asset('/Game/Cove/FullCoveV149','/Game/Cove/FullCoveV148BeforeV149')
assets.delete_asset('/Game/Cove/FullCoveV149')
result149=u.EditorLoadingAndSavingUtils.save_map(ed.get_editor_world(),'/Game/Cove/FullCoveV149')
(V/'ue-snapshot-save.json').write_text(json.dumps({'saved':result149}),encoding='utf-8')
